"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { buildMarketSections } from "../../../src/services/marketViewService";
import {
  getManufacturers,
  getProductById,
  getProductsByManufacturer,
  getProductsBySegment,
  getSegmentsByManufacturer
} from "../../../src/services/dataService";
import { MAX_COMPARE_PRODUCTS, useMcbStore } from "../../../src/stores/mcbStore";
import type { Manufacturer, ManufacturerId, McbProduct } from "../../../src/types/mcb";
import { Sidebar } from "../../../src/components/mcb/Sidebar";
import { TopBar } from "../../../src/components/mcb/TopBar";
import { SpecComparisonTable } from "../../../src/components/mcb/SpecComparisonTable";
import { RationalePanel } from "../../../src/components/mcb/RationalePanel";
import { useShallow } from "zustand/react/shallow";

const manufacturers = getManufacturers();
const MANUFACTURER_NAME_BY_ID = manufacturers.reduce(
  (accumulator, manufacturer) => {
    accumulator[manufacturer.id] = manufacturer.name;
    return accumulator;
  },
  {} as Record<ManufacturerId, string>
);

function parseIdsFromQuery(value: string | null): string[] {
  if (!value) {
    return [];
  }

  const safeDecode = (raw: string) => {
    try {
      return decodeURIComponent(raw);
    } catch {
      return raw;
    }
  };

  return value
    .split(",")
    .map((id) => safeDecode(id).trim())
    .filter(Boolean);
}

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
    () => parseIdsFromQuery(idsQueryValue).filter((productId) => Boolean(getProductById(productId))),
    [idsQueryValue]
  );

  const comparedProducts = useMemo(
    () =>
      comparedProductIds
        .map((productId) => getProductById(productId))
        .filter((product): product is McbProduct => Boolean(product)),
    [comparedProductIds]
  );
  const normalizedComparedProductIds = useMemo(
    () => comparedProducts.map((product) => product.id).slice(0, MAX_COMPARE_PRODUCTS),
    [comparedProducts]
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

  const handleSelectManufacturer = useCallback(
    (manufacturer: Manufacturer) => {
      if (manufacturer.enabled) {
        selectManufacturer(manufacturer.id);
      }
    },
    [selectManufacturer]
  );

  const handleOpenAdd = useCallback(() => setIsAddModalOpen(true), []);
  const handleToggleAdd = useCallback(() => setIsAddModalOpen((open) => !open), []);

  const handleAddFromModal = useCallback(() => {
    if (!addProductId) {
      return;
    }
    addComparedProduct(addProductId);
    setAddProductId("");
  }, [addComparedProduct, addProductId]);

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

    if (normalizedComparedProductIds.length) {
      return;
    }

    const firstProduct = getProductsByManufacturer(selectedManufacturerId)[0];
    if (firstProduct) {
      setComparedProducts([firstProduct.id]);
    }
  }, [
    idsQueryValue,
    normalizedComparedProductIds.length,
    selectedIdsFromQuery,
    selectedManufacturerId,
    setComparedProducts
  ]);

  useEffect(() => {
    if (
      comparedProductIds.length !== normalizedComparedProductIds.length ||
      comparedProductIds.some((productId, index) => productId !== normalizedComparedProductIds[index])
    ) {
      setComparedProducts(normalizedComparedProductIds);
    }
  }, [comparedProductIds, normalizedComparedProductIds, setComparedProducts]);

  useEffect(() => {
    if (!comparedProducts.length) {
      return;
    }
    const primaryManufacturerId = comparedProducts[0].manufacturerId;
    if (selectedManufacturerId !== primaryManufacturerId) {
      selectManufacturer(primaryManufacturerId);
    }
  }, [comparedProducts, selectManufacturer, selectedManufacturerId]);

  useEffect(() => {
    if (isAddModalOpen) {
      setAddManufacturerId(selectedManufacturerId);
      setAddProductId("");
    }
  }, [isAddModalOpen, selectedManufacturerId]);

  useEffect(() => {
    setAddProductId("");
  }, [addManufacturerId]);

  return (
    <>
      <Sidebar />
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <div className="flex-1 overflow-y-auto px-4 md:px-8 pb-6 md:pb-10 relative z-10">
          <div className="max-w-[1800px] mx-auto h-full flex flex-col gap-3">
            <TopBar
              title="mcb specifications"
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
                    Add Product
                  </button>
                  <Link
                    href="/mcb"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-scandi-wood border border-scandi-warm-grey text-xs font-bold text-text-main whitespace-nowrap"
                  >
                    <span className="material-symbols-outlined text-base">arrow_back</span>
                    Back
                  </Link>
                </>
              }
            />

            {isAddModalOpen ? (
              <section className="rounded-2xl border border-scandi-warm-grey bg-scandi-light/70 p-4">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-text-muted">Manufacturer</label>
                    <select
                      value={addManufacturerId}
                      onChange={(event) => setAddManufacturerId(event.target.value as ManufacturerId)}
                      className="mt-1 w-full rounded-xl border border-scandi-warm-grey bg-white px-3 py-2 text-sm font-semibold text-text-main"
                    >
                      {manufacturers.map((manufacturer) => (
                        <option key={`add-maker-${manufacturer.id}`} value={manufacturer.id} disabled={!manufacturer.enabled}>
                          {manufacturer.enabled ? manufacturer.name : `${manufacturer.name} (Coming Soon)`}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-text-muted">Series</label>
                    <select
                      value={addProductId}
                      onChange={(event) => setAddProductId(event.target.value)}
                      className="mt-1 w-full rounded-xl border border-scandi-warm-grey bg-white px-3 py-2 text-sm font-semibold text-text-main"
                      disabled={!addProducts.length}
                    >
                      <option value="">Select a product</option>
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
                      Add to Compare
                    </button>
                  </div>
                </div>
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
              <section className="rounded-3xl border border-dashed border-scandi-warm-grey bg-white p-8 text-center">
                <p className="text-sm font-bold text-text-muted uppercase tracking-widest mb-4">No Products Added</p>
                <button
                  type="button"
                  onClick={handleOpenAdd}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-accent text-white text-sm font-bold border border-accent hover:bg-red-600"
                >
                  <span className="material-symbols-outlined text-base">add</span>
                  Add Product
                </button>
              </section>
            )}

            {selectedManufacturer.enabled && selectedManufacturer.id === "schneider-electric" ? (
              <RationalePanel sections={marketSections} selectedProductIds={normalizedComparedProductIds} />
            ) : (
              <section className="rounded-xl border border-scandi-warm-grey bg-white p-4">
                <p className="text-xs text-text-muted">Rationale details are currently available for Schneider Electric view.</p>
              </section>
            )}

            {selectedManufacturer.enabled && selectedManufacturer.id !== "schneider-electric" ? (
              <section className="rounded-xl border border-scandi-warm-grey bg-white p-4">
                <p className="text-xs font-bold uppercase tracking-wider text-text-muted mb-2">Series by Segment</p>
                <div className="space-y-2">
                  {segments.map((segment) => (
                    <div key={segment.id} className="rounded-lg border border-scandi-warm-grey p-3 bg-scandi-light/40">
                      <p className="text-sm font-bold text-text-main">{segment.name}</p>
                      <p className="text-xs text-text-muted mt-1">{(segmentProductsById[segment.id] ?? []).map((p) => p.series).join(", ")}</p>
                    </div>
                  ))}
                </div>
              </section>
            ) : null}

            <footer className="mt-auto py-8 md:py-10 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 border-t border-scandi-warm-grey">
              <p className="text-text-muted text-xs font-medium uppercase tracking-widest">
                © 2026 LV Breaker Intelligence Systems.
              </p>
              <div className="flex gap-10">
                <button
                  type="button"
                  className="text-text-muted hover:text-text-main text-xs font-bold uppercase tracking-widest transition-colors"
                >
                  Privacy Policy
                </button>
                <button
                  type="button"
                  className="text-text-muted hover:text-text-main text-xs font-bold uppercase tracking-widest transition-colors"
                >
                  Terms of Service
                </button>
              </div>
            </footer>
          </div>
        </div>
      </main>
    </>
  );
}

export default function McbSpecPage() {
  return (
    <Suspense
      fallback={
        <>
          <Sidebar />
          <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
            <div className="flex-1 overflow-y-auto px-4 md:px-8 pb-6 md:pb-10 relative z-10">
              <div className="max-w-[1800px] mx-auto h-full flex items-center justify-center">
                <p className="text-sm font-bold uppercase tracking-widest text-text-muted">Loading specifications...</p>
              </div>
            </div>
          </main>
        </>
      }
    >
      <McbSpecPageContent />
    </Suspense>
  );
}
