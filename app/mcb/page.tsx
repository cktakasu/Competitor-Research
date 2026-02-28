"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { memo, useCallback, useEffect, useMemo } from "react";
import { buildMarketSections, type MarketSection } from "../../src/services/marketViewService";
import {
  getManufacturers,
  getProductById,
  getProductsBySegment,
  getSegmentsByManufacturer
} from "../../src/services/dataService";
import { MAX_COMPARE_PRODUCTS, useMcbStore } from "../../src/stores/mcbStore";
import type { Manufacturer, McbProduct } from "../../src/types/mcb";
import { Sidebar } from "../../src/components/mcb/Sidebar";
import { TopBar } from "../../src/components/mcb/TopBar";
import {
  compareTagLabel,
  dedupeTags,
  formatBreakingCapacityValue,
  formatStandardsValue,
  formatTagLabel,
  MARKET_LABEL_BY_SEGMENT_ID,
  normalizeTagKey,
  sortBadgeTags,
  splitSummaryBadgeTag
} from "../../src/components/mcb/utils";
import { useShallow } from "zustand/react/shallow";

const manufacturers = getManufacturers();

const ProductCard = memo(function ProductCard({
  isFull,
  isSelected,
  onToggle,
  product
}: {
  isFull: boolean;
  isSelected: boolean;
  onToggle: () => void;
  product: McbProduct;
}) {
  const disabled = !isSelected && isFull;

  return (
    <article
      className={[
        "rounded-2xl border p-4 md:p-5 shadow-sm flex flex-col transition-all duration-200",
        disabled
          ? "border-scandi-warm-grey/50 bg-white/60"
          : isSelected
            ? "border-text-muted border-2 bg-scandi-wood/50 hover:bg-scandi-wood active:bg-scandi-wood/80"
            : "border-scandi-warm-grey bg-white hover:border-text-muted hover:bg-scandi-wood hover:shadow-md active:border-text-muted active:bg-scandi-wood/80"
      ].join(" ")}
    >
      <h4 className="text-lg font-bold text-text-main tracking-tight">{product.series}</h4>

      <dl className="mt-4 space-y-3 flex-1">
        {product.specifications.slice(0, 8).map((spec) => (
          <div key={`${product.id}-${spec.label}`}>
            <dt className="text-[11px] uppercase tracking-wider text-text-muted font-bold">{spec.label}</dt>
            <dd className="text-sm font-semibold text-text-main mt-0.5">{spec.value}</dd>
          </div>
        ))}
      </dl>

      <button
        type="button"
        onClick={onToggle}
        disabled={disabled}
        className={[
          "mt-5 w-full rounded-xl py-2.5 text-sm font-bold border transition-colors",
          disabled
            ? "bg-scandi-warm-grey/40 text-text-muted border-scandi-warm-grey cursor-not-allowed"
            : isSelected
              ? "bg-text-muted text-white border-text-muted shadow-inner hover:bg-text-muted/90"
              : "bg-accent text-white border-accent hover:bg-red-600"
        ].join(" ")}
      >
        {isSelected ? "Selected" : "Select"}
      </button>
    </article>
  );
});

const MarketSectionBoard = memo(function MarketSectionBoard({
  comparedProductIdSet,
  isCompareFull,
  onToggleProduct,
  section
}: {
  comparedProductIdSet: Set<string>;
  isCompareFull: boolean;
  onToggleProduct: (productId: string) => void;
  section: MarketSection;
}) {
  const summaryBadgeTags = sortBadgeTags(dedupeTags(section.summaryTags.flatMap(splitSummaryBadgeTag)));
  const marketLabel = MARKET_LABEL_BY_SEGMENT_ID[section.segmentId] ?? section.segmentId;

  return (
    <article className="market-section-shell rounded-2xl overflow-hidden">
      <div className="market-section-header px-3 md:px-4 py-2.5 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[10px] uppercase tracking-[0.16em] text-text-muted font-bold">{marketLabel}</p>
          <h3 className="text-sm md:text-base font-bold text-text-main whitespace-nowrap">{section.marketName}</h3>
        </div>
        <div className="flex flex-wrap justify-end gap-1">
          {summaryBadgeTags.map((tag) => (
            <span
              key={`${section.segmentId}-${tag}`}
              className="market-summary-chip inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold"
            >
              {formatTagLabel(tag)}
            </span>
          ))}
        </div>
      </div>

      <div className="p-3 md:p-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {section.rows.map((row) => {
            const isSelected = comparedProductIdSet.has(row.productId);
            const disabled = !isSelected && isCompareFull;
            const orderedCompactTags = dedupeTags(row.compactTags.map((tag) => tag.tagValue))
              .map((tagValue) => row.compactTags.find((tag) => normalizeTagKey(tag.tagValue) === normalizeTagKey(tagValue)))
              .filter((tag): tag is NonNullable<typeof tag> => Boolean(tag))
              .sort((a, b) => compareTagLabel(a.tagValue, b.tagValue));

            return (
              <article
                key={`${section.segmentId}-${row.productId}`}
                className={[
                  "rounded-xl border p-3 md:p-4 transition-all duration-200",
                  disabled
                    ? "border-scandi-warm-grey/30 bg-white/60"
                    : isSelected
                      ? "border-text-muted border-2 bg-scandi-wood/50 hover:bg-scandi-wood active:bg-scandi-wood/80"
                      : "border-scandi-warm-grey/30 bg-white hover:border-text-muted hover:bg-scandi-wood hover:shadow-md active:border-text-muted active:bg-scandi-wood/80"
                ].join(" ")}
              >
                <div className="flex items-start justify-between gap-3">
                  <h4 className="text-2xl md:text-[28px] leading-none font-black tracking-tight text-text-main">{row.series}</h4>
                  <button
                    type="button"
                    onClick={() => onToggleProduct(row.productId)}
                    disabled={disabled}
                    className={[
                      "inline-flex items-center justify-center rounded-md px-2.5 py-1.5 text-[11px] font-bold border shrink-0",
                      disabled
                        ? "bg-scandi-warm-grey/40 text-text-muted border-scandi-warm-grey cursor-not-allowed"
                        : isSelected
                          ? "bg-text-muted text-white border-text-muted shadow-inner hover:bg-text-muted/90"
                          : "bg-accent text-white border-accent hover:bg-red-600"
                    ].join(" ")}
                  >
                    {isSelected ? "Selected" : "Select"}
                  </button>
                </div>

                <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <div>
                    <p className="text-[10px] font-bold tracking-widest uppercase text-text-muted">Standards</p>
                    <p className="mt-0.5 text-xs font-semibold text-text-main leading-snug whitespace-pre-line">
                      {formatStandardsValue(row.standards)}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold tracking-widest uppercase text-text-muted">Breaking Capacity</p>
                    <p className="mt-0.5 text-xs font-semibold text-text-main leading-snug whitespace-pre-line">
                      {formatBreakingCapacityValue(row.breakingCapacity)}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold tracking-widest uppercase text-text-muted">Rated Current</p>
                    <p className="mt-0.5 text-xs font-semibold text-text-main leading-snug">{row.ratedCurrent}</p>
                  </div>
                </div>

                <div className="mt-3">
                  {orderedCompactTags.length ? (
                    <div className="flex items-center flex-wrap gap-1">
                      {orderedCompactTags.map((tag) => (
                        <span
                          key={`${row.productId}-${tag.tagId}`}
                          className="inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-bold border-scandi-warm-grey bg-white text-text-main"
                          title={formatTagLabel(tag.tagValue)}
                        >
                          {formatTagLabel(tag.tagValue)}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[11px] font-semibold text-text-muted">Rationale data in preparation</p>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </article>
  );
});

export default function McbPage() {
  const router = useRouter();
  const {
    addComparedProduct,
    comparedProductIds,
    expandedSegmentIds,
    removeComparedProduct,
    selectManufacturer,
    selectedManufacturerId,
    setComparedProducts,
    setExpandedSegments,
    toggleSegment
  } = useMcbStore(
    useShallow((state) => ({
      addComparedProduct: state.addComparedProduct,
      comparedProductIds: state.comparedProductIds,
      expandedSegmentIds: state.expandedSegmentIds,
      removeComparedProduct: state.removeComparedProduct,
      selectManufacturer: state.selectManufacturer,
      selectedManufacturerId: state.selectedManufacturerId,
      setComparedProducts: state.setComparedProducts,
      setExpandedSegments: state.setExpandedSegments,
      toggleSegment: state.toggleSegment
    }))
  );

  const selectedManufacturer = useMemo(
    () => manufacturers.find((manufacturer) => manufacturer.id === selectedManufacturerId) ?? manufacturers[0],
    [selectedManufacturerId]
  );

  const segments = useMemo(() => getSegmentsByManufacturer(selectedManufacturerId), [selectedManufacturerId]);
  const normalizedComparedProductIds = useMemo(() => {
    const seen = new Set<string>();
    return comparedProductIds
      .filter((productId) => {
        if (seen.has(productId)) {
          return false;
        }
        seen.add(productId);
        return Boolean(getProductById(productId));
      })
      .slice(0, MAX_COMPARE_PRODUCTS);
  }, [comparedProductIds]);
  const comparedProductIdSet = useMemo(() => new Set(normalizedComparedProductIds), [normalizedComparedProductIds]);
  const isCompareFull = normalizedComparedProductIds.length >= MAX_COMPARE_PRODUCTS;
  const isSchneiderMarketView = selectedManufacturerId === "schneider-electric";

  const marketSections = useMemo(
    () => (isSchneiderMarketView ? buildMarketSections(selectedManufacturerId) : []),
    [isSchneiderMarketView, selectedManufacturerId]
  );

  const segmentProductsById = useMemo(
    () =>
      segments.reduce<Record<string, McbProduct[]>>((accumulator, segment) => {
        accumulator[segment.id] = getProductsBySegment(selectedManufacturerId, segment.id);
        return accumulator;
      }, {}),
    [segments, selectedManufacturerId]
  );

  const handleSelectManufacturer = useCallback(
    (manufacturer: Manufacturer) => {
      if (manufacturer.enabled) {
        selectManufacturer(manufacturer.id);
      }
    },
    [selectManufacturer]
  );

  const handleToggleProduct = useCallback(
    (productId: string) => {
      if (comparedProductIdSet.has(productId)) {
        removeComparedProduct(productId);
        return;
      }
      addComparedProduct(productId);
    },
    [addComparedProduct, comparedProductIdSet, removeComparedProduct]
  );

  const handleGoToSpecs = useCallback(() => {
    if (!normalizedComparedProductIds.length) {
      return;
    }
    router.push(`/mcb/spec?ids=${encodeURIComponent(normalizedComparedProductIds.join(","))}`);
  }, [normalizedComparedProductIds, router]);

  useEffect(() => {
    if (
      comparedProductIds.length !== normalizedComparedProductIds.length ||
      comparedProductIds.some((productId, index) => productId !== normalizedComparedProductIds[index])
    ) {
      setComparedProducts(normalizedComparedProductIds);
    }
  }, [comparedProductIds, normalizedComparedProductIds, setComparedProducts]);

  useEffect(() => {
    if (segments.length) {
      setExpandedSegments([segments[0].id]);
    } else {
      setExpandedSegments([]);
    }
  }, [segments, setExpandedSegments]);

  return (
    <>
      <Sidebar />
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <div className="flex-1 overflow-y-auto px-4 md:px-8 pb-6 md:pb-10 relative z-10">
          <div className="max-w-[1800px] mx-auto h-full flex flex-col gap-2">
            <TopBar
              title="mcb product lineup"
              manufacturers={manufacturers}
              selectedManufacturerId={selectedManufacturerId}
              onSelectManufacturer={handleSelectManufacturer}
              actions={
                <>
                  <button
                    type="button"
                    onClick={handleGoToSpecs}
                    disabled={!normalizedComparedProductIds.length}
                    className={[
                      "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border whitespace-nowrap",
                      normalizedComparedProductIds.length
                        ? "bg-accent text-white border-accent hover:bg-red-600"
                        : "bg-scandi-warm-grey/40 text-text-muted border-scandi-warm-grey cursor-not-allowed"
                    ].join(" ")}
                  >
                    <span className="material-symbols-outlined text-base">visibility</span>
                    仕様確認 ({normalizedComparedProductIds.length})
                  </button>
                  <Link
                    href="/"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-scandi-wood border border-scandi-warm-grey text-xs font-bold text-text-main whitespace-nowrap"
                  >
                    <span className="material-symbols-outlined text-base">arrow_back</span>
                    Back
                  </Link>
                </>
              }
            />

            <section className="rounded-3xl border border-scandi-warm-grey/60 bg-white shadow-scandi p-4 md:p-5">
              {selectedManufacturer.enabled ? (
                isSchneiderMarketView ? (
                  marketSections.length ? (
                    <div className="space-y-3 min-w-0">
                      {marketSections.map((section) => (
                        <MarketSectionBoard
                          key={section.segmentId}
                          section={section}
                          comparedProductIdSet={comparedProductIdSet}
                          isCompareFull={isCompareFull}
                          onToggleProduct={handleToggleProduct}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-2xl border border-dashed border-scandi-warm-grey bg-white p-8 text-center">
                      <p className="text-sm font-bold text-text-muted uppercase tracking-widest">Data in Preparation</p>
                    </div>
                  )
                ) : segments.length ? (
                  <div className="space-y-4">
                    {segments.map((segment) => {
                      const segmentProducts = segmentProductsById[segment.id] ?? [];
                      const opened = expandedSegmentIds.includes(segment.id);

                      return (
                        <article key={segment.id} className="rounded-2xl border border-scandi-warm-grey bg-scandi-light/40">
                          <button
                            type="button"
                            onClick={() => toggleSegment(segment.id)}
                            className="w-full text-left p-4 md:p-5 flex items-start justify-between gap-3 transition-colors duration-200 hover:bg-white/70"
                          >
                            <div>
                              <p className="text-base md:text-lg font-bold text-text-main flex items-center gap-2">
                                <span className="material-symbols-outlined text-xl">{segment.icon}</span>
                                {segment.name}
                              </p>
                              <p className="text-sm text-text-muted mt-1">{segmentProducts.map((product) => product.series).join(", ")}</p>
                            </div>
                            <span className="material-symbols-outlined text-text-muted">
                              {opened ? "expand_less" : "expand_more"}
                            </span>
                          </button>

                          {opened ? (
                            <div className="px-4 md:px-5 pb-5">
                              <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
                                {segmentProducts.map((product) => (
                                  <ProductCard
                                    key={product.id}
                                    product={product}
                                    isSelected={comparedProductIdSet.has(product.id)}
                                    isFull={isCompareFull}
                                    onToggle={() => handleToggleProduct(product.id)}
                                  />
                                ))}
                              </div>
                            </div>
                          ) : null}
                        </article>
                      );
                    })}
                  </div>
                ) : (
                  <div className="rounded-2xl border border-dashed border-scandi-warm-grey bg-white p-8 text-center">
                    <p className="text-sm font-bold text-text-muted uppercase tracking-widest">Data in Preparation</p>
                  </div>
                )
              ) : (
                <div className="rounded-2xl border border-dashed border-scandi-warm-grey bg-white p-8 text-center">
                  <p className="text-sm font-bold text-text-muted uppercase tracking-widest">Data in Preparation</p>
                </div>
              )}
            </section>

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
