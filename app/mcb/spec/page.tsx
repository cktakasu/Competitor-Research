"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { type ChangeEvent, Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import { EmptyState } from "../../../src/components/mcb/EmptyState";
import { PageFooter } from "../../../src/components/mcb/PageFooter";
import { RationalePanel } from "../../../src/components/mcb/RationalePanel";
import { Sidebar } from "../../../src/components/mcb/Sidebar";
import { SpecComparisonTable } from "../../../src/components/mcb/SpecComparisonTable";
import { TopBar } from "../../../src/components/mcb/TopBar";
import {
  MAX_COMPARE_PRODUCTS,
  comparedProductIdsMatch,
  normalizeComparedProductIds
} from "../../../src/services/comparedProducts";
import {
  getManufacturers,
  getProductById,
  getProductsByManufacturer,
  getProductsBySegment,
  getSegmentsByManufacturer
} from "../../../src/services/dataService";
import { buildMarketSections } from "../../../src/services/marketViewService";
import { useMcbStore } from "../../../src/stores/mcbStore";
import type { Manufacturer, ManufacturerId, McbProduct } from "../../../src/types/mcb";
import { parseIdsFromQuery } from "./page-utils";

const manufacturers = getManufacturers();
const MANUFACTURER_NAME_BY_ID = manufacturers.reduce(
  (accumulator, manufacturer) => {
    accumulator[manufacturer.id] = manufacturer.name;
    return accumulator;
  },
  {} as Record<ManufacturerId, string>
);

function McbSpecPageContent() {
  const searchParams = useSearchParams();
  const {
    addComparedProduct,
    comparedProductIds,
    removeComparedProduct,
    selectManufacturer,
    selectedManufacturerId,
    setComparedProducts
  } = useMcbStore(
    useShallow((state) => ({
      addComparedProduct: state.addComparedProduct,
      comparedProductIds: state.comparedProductIds,
      removeComparedProduct: state.removeComparedProduct,
      selectManufacturer: state.selectManufacturer,
      selectedManufacturerId: state.selectedManufacturerId,
      setComparedProducts: state.setComparedProducts
    }))
  );

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addManufacturerId, setAddManufacturerId] = useState<ManufacturerId>(selectedManufacturerId);
  const [addProductId, setAddProductId] = useState("");
  const lastAppliedIdsQueryRef = useRef<string | null>(null);

  const idsQueryValue = searchParams?.get("ids") ?? "";
  const selectedIdsFromQuery = useMemo(
    () =>
      normalizeComparedProductIds(parseIdsFromQuery(idsQueryValue), (productId) => Boolean(getProductById(productId))),
    [idsQueryValue]
  );
  const normalizedComparedProductIds = useMemo(
    () => normalizeComparedProductIds(comparedProductIds, (productId) => Boolean(getProductById(productId))),
    [comparedProductIds]
  );
  const comparedProducts = useMemo(
    () =>
      normalizedComparedProductIds
        .map((productId) => getProductById(productId))
        .filter((product): product is McbProduct => Boolean(product)),
    [normalizedComparedProductIds]
  );
  const addProducts = useMemo(() => getProductsByManufacturer(addManufacturerId), [addManufacturerId]);
  const canSubmitAdd = useMemo(
    () =>
      Boolean(addProductId) &&
      normalizedComparedProductIds.length < MAX_COMPARE_PRODUCTS &&
      !normalizedComparedProductIds.includes(addProductId) &&
      addProducts.length > 0,
    [addProductId, addProducts.length, normalizedComparedProductIds]
  );
  const selectedManufacturer = useMemo(
    () => manufacturers.find((manufacturer) => manufacturer.id === selectedManufacturerId) ?? manufacturers[0],
    [selectedManufacturerId]
  );
  const segments = useMemo(() => getSegmentsByManufacturer(selectedManufacturerId), [selectedManufacturerId]);
  const segmentProductsById = useMemo(
    () =>
      segments.reduce<Record<string, McbProduct[]>>((accumulator, segment) => {
        accumulator[segment.id] = getProductsBySegment(selectedManufacturerId, segment.id);
        return accumulator;
      }, {}),
    [segments, selectedManufacturerId]
  );
  const marketSections = useMemo(() => buildMarketSections(selectedManufacturerId), [selectedManufacturerId]);
  const selectedProductsInCurrentView = useMemo(
    () => comparedProducts.filter((product) => product.manufacturerId === selectedManufacturerId),
    [comparedProducts, selectedManufacturerId]
  );
  const supportsRationaleView = selectedManufacturer.enabled && selectedManufacturer.id === "schneider-electric";
  const hasSegmentsInCurrentView = segments.length > 0;
  const isCompareFull = normalizedComparedProductIds.length >= MAX_COMPARE_PRODUCTS;

  const resetAddDraft = useCallback(() => {
    setAddManufacturerId(selectedManufacturerId);
    setAddProductId("");
  }, [selectedManufacturerId]);

  const handleSelectManufacturer = useCallback(
    (manufacturer: Manufacturer) => {
      if (manufacturer.enabled) {
        selectManufacturer(manufacturer.id);
      }
    },
    [selectManufacturer]
  );

  const handleOpenAdd = useCallback(() => {
    resetAddDraft();
    setIsAddModalOpen(true);
  }, [resetAddDraft]);

  const handleToggleAdd = useCallback(() => {
    if (!isAddModalOpen) {
      resetAddDraft();
    }

    setIsAddModalOpen((open) => !open);
  }, [isAddModalOpen, resetAddDraft]);

  const handleCloseAdd = useCallback(() => {
    setIsAddModalOpen(false);
    resetAddDraft();
  }, [resetAddDraft]);

  const handleAddFromModal = useCallback(() => {
    if (!addProductId) {
      return;
    }

    addComparedProduct(addProductId);
    setIsAddModalOpen(false);
    resetAddDraft();
  }, [addComparedProduct, addProductId, resetAddDraft]);

  const handleAddManufacturerChange = useCallback((event: ChangeEvent<HTMLSelectElement>) => {
    setAddManufacturerId(event.target.value as ManufacturerId);
    setAddProductId("");
  }, []);

  useEffect(() => {
    if (idsQueryValue) {
      if (!selectedIdsFromQuery.length) {
        if (!normalizedComparedProductIds.length) {
          const firstProduct = getProductsByManufacturer(selectedManufacturerId)[0];
          if (firstProduct) {
            setComparedProducts([firstProduct.id]);
          }
        }
        return;
      }

      if (lastAppliedIdsQueryRef.current !== idsQueryValue) {
        setComparedProducts(selectedIdsFromQuery);
        lastAppliedIdsQueryRef.current = idsQueryValue;
      }
      return;
    }

    if (lastAppliedIdsQueryRef.current !== null) {
      lastAppliedIdsQueryRef.current = null;
    }

    if (!normalizedComparedProductIds.length) {
      const firstProduct = getProductsByManufacturer(selectedManufacturerId)[0];
      if (firstProduct) {
        setComparedProducts([firstProduct.id]);
      }
    }
  }, [
    idsQueryValue,
    normalizedComparedProductIds.length,
    selectedIdsFromQuery,
    selectedManufacturerId,
    setComparedProducts
  ]);

  useEffect(() => {
    if (!comparedProductIdsMatch(comparedProductIds, normalizedComparedProductIds)) {
      setComparedProducts(normalizedComparedProductIds);
    }
  }, [comparedProductIds, normalizedComparedProductIds, setComparedProducts]);

  return (
    <>
      <Sidebar />
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <div className="flex-1 overflow-y-auto px-4 md:px-8 pb-6 md:pb-10 relative z-10">
          <div className="w-full max-w-[1600px] mx-auto h-full flex flex-col gap-3">
            <TopBar
              title="MCB 仕様比較"
              manufacturers={manufacturers}
              selectedManufacturerId={selectedManufacturerId}
              onSelectManufacturer={handleSelectManufacturer}
              actions={
                <>
                  <button
                    type="button"
                    onClick={handleToggleAdd}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-accent text-white text-xs font-bold border border-accent hover:bg-red-600 whitespace-nowrap"
                  >
                    <span className="material-symbols-outlined text-base">add</span>
                    製品を追加
                  </button>
                  <Link
                    href="/mcb"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-scandi-wood border border-scandi-warm-grey text-xs font-bold text-text-main whitespace-nowrap"
                  >
                    <span className="material-symbols-outlined text-base">arrow_back</span>
                    戻る
                  </Link>
                </>
              }
            />

            {isAddModalOpen ? (
              <section className="rounded-2xl border border-scandi-warm-grey bg-scandi-light/70 p-4">
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-text-muted">製品を追加</p>
                    <p className="mt-1 text-xs text-text-muted">
                      1画面で最大 {MAX_COMPARE_PRODUCTS} 製品まで比較できます。
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleCloseAdd}
                    className="inline-flex items-center gap-1.5 rounded-full border border-scandi-warm-grey bg-white px-3 py-1.5 text-xs font-bold text-text-main"
                  >
                    <span className="material-symbols-outlined text-base">close</span>
                    キャンセル
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-text-muted">
                      メーカー
                    </label>
                    <select
                      value={addManufacturerId}
                      onChange={handleAddManufacturerChange}
                      className="mt-1 w-full rounded-xl border border-scandi-warm-grey bg-white px-3 py-2 text-sm font-semibold text-text-main"
                    >
                      {manufacturers.map((manufacturer) => (
                        <option
                          key={`add-maker-${manufacturer.id}`}
                          value={manufacturer.id}
                          disabled={!manufacturer.enabled}
                        >
                          {manufacturer.enabled
                            ? manufacturer.name
                            : `${manufacturer.name} (${manufacturer.statusLabel})`}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-text-muted">シリーズ</label>
                    <select
                      value={addProductId}
                      onChange={(event) => setAddProductId(event.target.value)}
                      className="mt-1 w-full rounded-xl border border-scandi-warm-grey bg-white px-3 py-2 text-sm font-semibold text-text-main"
                      disabled={!addProducts.length}
                    >
                      <option value="">製品を選択</option>
                      {addProducts.map((product) => (
                        <option key={`add-series-${product.id}`} value={product.id}>
                          {product.series}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-end">
                    <button
                      type="button"
                      className={[
                        "w-full rounded-xl py-2.5 text-sm font-bold border",
                        canSubmitAdd
                          ? "bg-accent text-white border-accent hover:bg-red-600"
                          : "bg-scandi-warm-grey/50 text-text-muted border-scandi-warm-grey cursor-not-allowed"
                      ].join(" ")}
                      disabled={!canSubmitAdd}
                      onClick={handleAddFromModal}
                    >
                      比較に追加
                    </button>
                  </div>
                </div>
                {isCompareFull ? (
                  <p className="mt-3 text-xs text-text-muted">
                    比較上限に達しています。追加する前に既存の製品を削除してください。
                  </p>
                ) : null}
              </section>
            ) : null}

            {comparedProducts.length ? (
              <SpecComparisonTable
                comparedProducts={comparedProducts}
                manufacturerNameById={MANUFACTURER_NAME_BY_ID}
                onOpenAdd={handleOpenAdd}
                onRemove={removeComparedProduct}
              />
            ) : (
              <EmptyState message="比較対象がありません" className="rounded-3xl">
                <button
                  type="button"
                  onClick={handleOpenAdd}
                  className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-accent text-white text-sm font-bold border border-accent hover:bg-red-600"
                >
                  <span className="material-symbols-outlined text-base">add</span>
                  製品を追加
                </button>
              </EmptyState>
            )}

            {supportsRationaleView ? (
              <RationalePanel sections={marketSections} selectedProductIds={normalizedComparedProductIds} />
            ) : (
              <section className="rounded-xl border border-scandi-warm-grey bg-white p-4">
                <p className="text-xs font-bold uppercase tracking-wider text-text-muted mb-2">
                  選定根拠の表示
                </p>
                <p className="text-xs text-text-muted">
                  選定根拠は現在 Schneider Electric ビューでのみ表示されます。
                </p>
                <p className="mt-2 text-xs text-text-muted">現在の表示: {selectedManufacturer.name}</p>
                {!selectedProductsInCurrentView.length ? (
                  <p className="mt-1 text-xs text-text-muted">
                    現在の表示対象メーカーの製品は、比較セットに含まれていません。
                  </p>
                ) : null}
              </section>
            )}

            {selectedManufacturer.enabled && selectedManufacturer.id !== "schneider-electric" ? (
              <section className="rounded-xl border border-scandi-warm-grey bg-white p-4">
                <p className="text-xs font-bold uppercase tracking-wider text-text-muted mb-2">セグメント別シリーズ</p>
                {hasSegmentsInCurrentView ? (
                  <div className="space-y-2">
                    {segments.map((segment) => (
                      <div
                        key={segment.id}
                        className="rounded-lg border border-scandi-warm-grey p-3 bg-scandi-light/40"
                      >
                        <p className="text-sm font-bold text-text-main">{segment.name}</p>
                        <p className="text-xs text-text-muted mt-1">
                          {(segmentProductsById[segment.id] ?? []).map((product) => product.series).join(", ")}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-text-muted">現在の表示対象ではセグメント情報がありません。</p>
                )}
              </section>
            ) : null}

            <PageFooter year={2026} />
          </div>
        </div>
      </main>
    </>
  );
}

function McbSpecPageFallback() {
  return (
    <>
      <Sidebar />
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <div className="flex-1 overflow-y-auto px-4 md:px-8 pb-6 md:pb-10 relative z-10">
          <div className="w-fit mx-auto h-full flex items-center justify-center">
            <p className="text-sm font-bold uppercase tracking-widest text-text-muted">
              仕様情報を読み込み中...
            </p>
          </div>
        </div>
      </main>
    </>
  );
}

export default function McbSpecPage() {
  return (
    <Suspense fallback={<McbSpecPageFallback />}>
      <McbSpecPageContent />
    </Suspense>
  );
}
