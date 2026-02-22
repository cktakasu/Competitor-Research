"use client";

import Link from "next/link";
import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { getBestProductsByRow } from "../../src/services/comparisonService";
import { buildMarketSections, type MarketSection } from "../../src/services/marketViewService";
import {
  getManufacturers,
  getProductById,
  getProductsByManufacturer,
  getProductsBySegment,
  getSegmentsByManufacturer
} from "../../src/services/dataService";
import { MAX_COMPARE_PRODUCTS, useMcbStore } from "../../src/stores/mcbStore";
import { COMPARISON_ROWS, type Manufacturer, type ManufacturerId, type McbProduct } from "../../src/types/mcb";
import { useShallow } from "zustand/react/shallow";

type NavItem = {
  title: string;
  icon: string;
  active?: boolean;
};

const NAV_ITEMS: readonly NavItem[] = [
  { title: "Dashboard", icon: "dashboard" },
  { title: "Product Selection", icon: "category", active: true },
  { title: "Status Monitor", icon: "monitoring" },
  { title: "Analytics", icon: "analytics" }
] as const;

const cx = (...values: Array<string | false | null | undefined>) => values.filter(Boolean).join(" ");

const manufacturers = getManufacturers();
const MANUFACTURER_NAME_BY_ID = manufacturers.reduce(
  (accumulator, manufacturer) => {
    accumulator[manufacturer.id] = manufacturer.name;
    return accumulator;
  },
  {} as Record<ManufacturerId, string>
);

type MarketFocus = {
  segmentId: string;
  productId: string;
  tagId: string;
};

type MarketFocusContext = {
  marketName: string;
  series: string;
  tagValue: string;
  reasonJa: string;
  entries: Array<{ label: string; value: string; noteJa?: string }>;
};

function CircuitBreakerIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="w-6 h-6"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      role="img"
      aria-label="Circuit breaker icon"
    >
      <rect x="6" y="3" width="12" height="18" rx="2" />
      <line x1="9" y1="3" x2="9" y2="1.5" />
      <line x1="15" y1="3" x2="15" y2="1.5" />
      <line x1="9" y1="22.5" x2="9" y2="21" />
      <line x1="15" y1="22.5" x2="15" y2="21" />
      <rect x="9.5" y="7.5" width="5" height="7" rx="1" />
      <line x1="12" y1="10.5" x2="12" y2="14.5" />
      <line x1="10.5" y1="17" x2="13.5" y2="17" />
    </svg>
  );
}

const Sidebar = memo(function Sidebar() {
  return (
    <aside className="w-full md:w-16 h-16 md:h-auto flex md:flex-col items-center bg-white border-b md:border-b-0 md:border-r border-scandi-warm-grey py-0 md:py-8 px-4 md:px-0 z-20 shadow-sm flex-shrink-0">
      <Link href="/" className="mr-4 md:mr-0 md:mb-10">
        <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-primary text-scandi-wood">
          <CircuitBreakerIcon />
        </div>
      </Link>

      <nav className="flex-1 flex flex-row md:flex-col gap-3 md:gap-6 w-auto md:w-full px-0 md:px-2 items-center justify-center">
        {NAV_ITEMS.map((item) => (
          <button
            type="button"
            key={item.title}
            className={cx(
              "h-10 w-10 mx-auto flex items-center justify-center rounded-lg transition-all",
              item.active
                ? "bg-scandi-wood text-primary relative group"
                : "text-text-muted hover:bg-scandi-wood hover:text-text-main"
            )}
            title={item.title}
            aria-label={item.title}
          >
            <span className={cx("material-symbols-outlined", item.active && "icon-filled")}>{item.icon}</span>
          </button>
        ))}
      </nav>

      <div className="ml-4 md:ml-0 md:mt-auto flex flex-row md:flex-col gap-3 md:gap-6 w-auto md:w-full px-0 md:px-2 items-center">
        <button
          type="button"
          className="h-10 w-10 mx-auto flex items-center justify-center rounded-lg text-text-muted hover:bg-scandi-wood hover:text-text-main transition-all"
          title="Settings"
          aria-label="Settings"
        >
          <span className="material-symbols-outlined">settings</span>
        </button>
        <div className="h-8 w-8 mx-auto rounded-full bg-scandi-warm-grey flex items-center justify-center text-[10px] font-bold text-text-main ring-2 ring-white shadow-sm cursor-pointer hidden sm:flex">
          JD
        </div>
      </div>
    </aside>
  );
});

const ManufacturerLogo = memo(function ManufacturerLogo({ manufacturer }: { manufacturer: Manufacturer }) {
  const [errored, setErrored] = useState(false);

  if (errored) {
    return <span className="text-sm font-bold tracking-wide text-text-main">{manufacturer.name}</span>;
  }

  return (
    <img
      src={manufacturer.logoUrl}
      alt={manufacturer.name}
      className="max-h-8 w-auto object-contain"
      loading="lazy"
      decoding="async"
      onError={() => setErrored(true)}
    />
  );
});

const ManufacturerCard = memo(function ManufacturerCard({
  manufacturer,
  selected,
  onSelect
}: {
  manufacturer: Manufacturer;
  onSelect: () => void;
  selected: boolean;
}) {
  const disabled = !manufacturer.enabled;

  return (
    <button
      type="button"
      onClick={onSelect}
      disabled={disabled}
      title={manufacturer.name}
      aria-label={manufacturer.name}
      className={cx(
        "relative h-12 min-w-[108px] px-2 bg-transparent transition-all flex items-center justify-center shrink-0",
        selected ? "opacity-100" : "opacity-70 hover:opacity-100",
        disabled && "opacity-55 cursor-not-allowed"
      )}
    >
      {selected ? <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 h-0.5 w-8 rounded-full bg-accent" /> : null}
      <div className="h-9 flex items-center">
        <ManufacturerLogo manufacturer={manufacturer} />
      </div>
    </button>
  );
});

const ProductCard = memo(function ProductCard({
  isFull,
  isSelected,
  onAdd,
  product
}: {
  isFull: boolean;
  isSelected: boolean;
  onAdd: () => void;
  product: McbProduct;
}) {
  const disabled = isSelected || isFull;

  return (
    <article className="rounded-2xl border border-scandi-warm-grey bg-white p-4 md:p-5 shadow-sm flex flex-col">
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
        onClick={onAdd}
        disabled={disabled}
        className={cx(
          "mt-5 w-full rounded-xl py-2.5 text-sm font-bold border transition-colors",
          disabled
            ? "bg-scandi-warm-grey/40 text-text-muted border-scandi-warm-grey cursor-not-allowed"
            : "bg-accent text-white border-accent hover:bg-red-600"
        )}
      >
        {isSelected ? "追加済み" : isFull ? "上限" : "追加"}
      </button>
    </article>
  );
});

const MarketSectionBoard = memo(function MarketSectionBoard({
  activeFocus,
  comparedProductIdSet,
  isCompareFull,
  onAddProduct,
  onFocus,
  section
}: {
  activeFocus: MarketFocus | null;
  comparedProductIdSet: Set<string>;
  isCompareFull: boolean;
  onAddProduct: (productId: string) => void;
  onFocus: (focus: MarketFocus) => void;
  section: MarketSection;
}) {
  const visibleSummaryTags = section.summaryTags.slice(0, 4);
  const hiddenSummaryCount = Math.max(0, section.summaryTags.length - visibleSummaryTags.length);

  return (
    <article className="rounded-2xl border border-scandi-warm-grey bg-white overflow-hidden">
      <div className="px-3 md:px-4 py-2.5 border-b border-scandi-warm-grey bg-scandi-light/40 flex items-center justify-between gap-3">
        <h3 className="text-sm md:text-base font-bold text-text-main whitespace-nowrap">{section.marketName}</h3>
        <div className="flex flex-wrap justify-end gap-1">
          {visibleSummaryTags.map((tag) => (
            <span
              key={`${section.segmentId}-${tag}`}
              className="inline-flex items-center rounded-full border border-scandi-warm-grey bg-white px-2 py-0.5 text-[10px] font-bold text-text-main"
            >
              {tag}
            </span>
          ))}
          {hiddenSummaryCount > 0 ? (
            <span className="inline-flex items-center rounded-full border border-scandi-warm-grey bg-white px-2 py-0.5 text-[10px] font-bold text-text-muted">
              +{hiddenSummaryCount}
            </span>
          ) : null}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[980px] border-collapse">
          <thead>
            <tr>
              <th className="text-left text-[11px] font-bold tracking-widest uppercase text-text-muted py-2 px-2.5 border-b border-scandi-warm-grey bg-white">
                機種
              </th>
              <th className="text-left text-[11px] font-bold tracking-widest uppercase text-text-muted py-2 px-2.5 border-b border-scandi-warm-grey bg-white">
                規格
              </th>
              <th className="text-left text-[11px] font-bold tracking-widest uppercase text-text-muted py-2 px-2.5 border-b border-scandi-warm-grey bg-white">
                遮断容量
              </th>
              <th className="text-left text-[11px] font-bold tracking-widest uppercase text-text-muted py-2 px-2.5 border-b border-scandi-warm-grey bg-white">
                定格電流
              </th>
              <th className="text-left text-[11px] font-bold tracking-widest uppercase text-text-muted py-2 px-2.5 border-b border-scandi-warm-grey bg-white">
                ターゲット根拠
              </th>
            </tr>
          </thead>
          <tbody>
            {section.rows.map((row) => {
              const isSelected = comparedProductIdSet.has(row.productId);
              const disabled = isSelected || isCompareFull;
              const defaultTag = row.compactTags.find((tag) => tag.hasEvidence);
              const visibleTags = row.compactTags.slice(0, 4);
              const hiddenCount = Math.max(0, row.compactTags.length - visibleTags.length);
              const rowIsActive = activeFocus?.segmentId === section.segmentId && activeFocus?.productId === row.productId;

              return (
                <tr
                  key={`${section.segmentId}-${row.productId}`}
                  className={cx(
                    "align-top cursor-pointer transition-colors",
                    rowIsActive ? "bg-scandi-light/30" : "hover:bg-scandi-light/20"
                  )}
                  onClick={() => {
                    if (defaultTag) {
                      onFocus({ segmentId: section.segmentId, productId: row.productId, tagId: defaultTag.tagId });
                    }
                  }}
                >
                  <td className="py-2 px-2.5 border-b border-scandi-warm-grey/80 w-[210px]">
                    <p className="text-sm font-bold text-text-main leading-tight">{row.series}</p>
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        onAddProduct(row.productId);
                      }}
                      disabled={disabled}
                      className={cx(
                        "mt-1.5 inline-flex items-center justify-center rounded-md px-2 py-1 text-[11px] font-bold border",
                        disabled
                          ? "bg-scandi-warm-grey/40 text-text-muted border-scandi-warm-grey cursor-not-allowed"
                          : "bg-accent text-white border-accent hover:bg-red-600"
                      )}
                    >
                      {isSelected ? "追加済み" : isCompareFull ? "上限" : "比較に追加"}
                    </button>
                  </td>
                  <td className="py-2 px-2.5 border-b border-scandi-warm-grey/80 text-xs font-semibold text-text-main leading-snug w-[200px]">
                    {row.standards}
                  </td>
                  <td className="py-2 px-2.5 border-b border-scandi-warm-grey/80 text-xs font-semibold text-text-main leading-snug w-[220px]">
                    {row.breakingCapacity}
                  </td>
                  <td className="py-2 px-2.5 border-b border-scandi-warm-grey/80 text-xs font-semibold text-text-main leading-snug w-[110px]">
                    {row.ratedCurrent}
                  </td>
                  <td className="py-2 px-2.5 border-b border-scandi-warm-grey/80">
                    {row.compactTags.length ? (
                      <div className="flex items-center flex-wrap gap-1 max-w-[280px]">
                        {visibleTags.map((tag) => {
                          const active =
                            activeFocus?.segmentId === section.segmentId &&
                            activeFocus?.productId === row.productId &&
                            activeFocus?.tagId === tag.tagId;

                          return (
                            <button
                              key={`${row.productId}-${tag.tagId}`}
                              type="button"
                              disabled={!tag.hasEvidence}
                              onClick={(event) => {
                                event.stopPropagation();
                                if (!tag.hasEvidence) {
                                  return;
                                }
                                onFocus({ segmentId: section.segmentId, productId: row.productId, tagId: tag.tagId });
                              }}
                              className={cx(
                                "inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-bold transition-colors",
                                !tag.hasEvidence && "opacity-35 cursor-not-allowed",
                                active
                                  ? "border-accent bg-accent text-white"
                                  : "border-scandi-warm-grey bg-white text-text-main hover:border-text-main"
                              )}
                              title={tag.tagValue}
                            >
                              {tag.tagValue}
                            </button>
                          );
                        })}
                        {hiddenCount > 0 ? (
                          <span className="inline-flex items-center rounded-full border border-scandi-warm-grey bg-white px-2 py-0.5 text-[10px] font-bold text-text-muted">
                            +{hiddenCount}
                          </span>
                        ) : null}
                      </div>
                    ) : (
                      <p className="text-[11px] font-semibold text-text-muted">根拠データ整備中</p>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </article>
  );
});

const RightDetailPanel = memo(function RightDetailPanel({
  focusContext
}: {
  focusContext: MarketFocusContext | null;
}) {
  return (
    <article className="rounded-2xl border border-scandi-warm-grey bg-white p-4 md:p-5 shadow-sm">
      <p className="text-[11px] font-bold tracking-widest uppercase text-text-muted">根拠詳細</p>
      {focusContext ? (
        <>
          <h3 className="mt-2 text-lg font-bold text-text-main leading-tight">{focusContext.marketName}</h3>
          <p className="text-xs font-semibold text-text-main mt-1">{focusContext.series}</p>
          <div className="mt-2 inline-flex items-center rounded-full border border-scandi-warm-grey bg-scandi-light px-2.5 py-1 text-[11px] font-bold text-text-main">
            {focusContext.tagValue}
          </div>
          <p className="mt-2 text-xs leading-snug text-text-muted">{focusContext.reasonJa}</p>
          <div className="mt-3 space-y-1.5">
            {focusContext.entries.map((entry, index) => (
              <p key={`${entry.label}-${index}`} className="text-xs text-text-main leading-snug">
                <span className="font-bold">{entry.label}:</span> {entry.value}
                {entry.noteJa ? <span className="text-text-muted"> ({entry.noteJa})</span> : null}
              </p>
            ))}
          </div>
        </>
      ) : (
        <p className="mt-2 text-xs text-text-muted">機種行または根拠チップを選択してください。</p>
      )}
    </article>
  );
});

const Layer3Comparison = memo(function Layer3Comparison({
  comparedProducts,
  onOpenAdd,
  onRemove
}: {
  comparedProducts: McbProduct[];
  onOpenAdd: () => void;
  onRemove: (productId: string) => void;
}) {
  const bestProductsByRow = useMemo(() => getBestProductsByRow(comparedProducts), [comparedProducts]);

  return (
    <section className="mt-6 rounded-3xl border border-scandi-warm-grey bg-white shadow-scandi p-5 md:p-6">
      <div className="flex flex-wrap items-center justify-end gap-3 mb-4">
        <button
          type="button"
          onClick={onOpenAdd}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-accent text-white text-xs font-bold border border-accent hover:bg-red-600"
        >
          <span className="material-symbols-outlined text-sm">add</span>
          製品を追加
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[920px] border-collapse">
          <thead>
            <tr>
              <th className="text-left text-xs uppercase tracking-widest text-text-muted font-bold py-3 px-3 border-b border-scandi-warm-grey w-[260px]">
                比較項目
              </th>
              {comparedProducts.map((product) => (
                <th
                  key={`head-${product.id}`}
                  className="text-left align-top py-3 px-3 border-b border-scandi-warm-grey min-w-[220px]"
                >
                  <p className="text-[11px] uppercase tracking-wider text-text-muted font-bold">
                    {MANUFACTURER_NAME_BY_ID[product.manufacturerId]}
                  </p>
                  <p className="text-sm font-bold text-text-main mt-1">{product.series}</p>
                  <button
                    type="button"
                    onClick={() => onRemove(product.id)}
                    className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-text-muted hover:text-text-main"
                  >
                    <span className="material-symbols-outlined text-base">close</span>
                    削除
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {COMPARISON_ROWS.map((row) => (
              <tr key={row.key}>
                <th className="text-left text-sm font-bold text-text-main py-3 px-3 border-b border-scandi-warm-grey/80 bg-scandi-light/50">
                  {row.label}
                </th>
                {comparedProducts.map((product) => {
                  const value = product.comparison[row.key] || "N/A";
                  const isBest = bestProductsByRow[row.key].has(product.id);

                  return (
                    <td key={`${row.key}-${product.id}`} className="py-3 px-3 border-b border-scandi-warm-grey/80">
                      <div className="flex items-start gap-1.5">
                        {isBest ? <span className="text-green-600 leading-none">★</span> : null}
                        <span className="text-sm font-medium text-text-main">{value}</span>
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
});

export default function McbPage() {
  const {
    addComparedProduct,
    comparedProductIds,
    expandedSegmentIds,
    removeComparedProduct,
    selectManufacturer,
    selectedManufacturerId,
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
      setExpandedSegments: state.setExpandedSegments,
      toggleSegment: state.toggleSegment
    }))
  );

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isComparisonOpen, setIsComparisonOpen] = useState(false);
  const [isMobileDetailOpen, setIsMobileDetailOpen] = useState(false);
  const [activeFocus, setActiveFocus] = useState<MarketFocus | null>(null);
  const [addManufacturerId, setAddManufacturerId] = useState<ManufacturerId>(selectedManufacturerId);
  const [addProductId, setAddProductId] = useState("");

  const selectedManufacturer = useMemo(
    () => manufacturers.find((manufacturer) => manufacturer.id === selectedManufacturerId) ?? manufacturers[0],
    [selectedManufacturerId]
  );

  const segments = useMemo(
    () => getSegmentsByManufacturer(selectedManufacturerId),
    [selectedManufacturerId]
  );

  const comparedProducts = useMemo(
    () =>
      comparedProductIds
        .map((productId) => getProductById(productId))
        .filter((product): product is McbProduct => Boolean(product)),
    [comparedProductIds]
  );
  const comparedProductIdSet = useMemo(() => new Set(comparedProductIds), [comparedProductIds]);

  const isCompareFull = comparedProductIds.length >= MAX_COMPARE_PRODUCTS;
  const isSchneiderMarketView = selectedManufacturerId === "schneider-electric";

  const addProducts = useMemo(() => getProductsByManufacturer(addManufacturerId), [addManufacturerId]);
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

  const canSubmitAdd = useMemo(
    () => Boolean(addProductId) && !isCompareFull && !comparedProductIdSet.has(addProductId) && addProducts.length > 0,
    [addProductId, isCompareFull, comparedProductIdSet, addProducts.length]
  );
  const activeFocusContext = useMemo<MarketFocusContext | null>(() => {
    if (!activeFocus) {
      return null;
    }

    const section = marketSections.find((candidate) => candidate.segmentId === activeFocus.segmentId);
    if (!section) {
      return null;
    }

    const row = section.rows.find((candidate) => candidate.productId === activeFocus.productId);
    if (!row) {
      return null;
    }

    const group = row.evidenceItems.find((candidate) => candidate.tagId === activeFocus.tagId);
    if (!group) {
      return null;
    }

    return {
      marketName: section.marketName,
      series: row.series,
      tagValue: group.tagValue,
      reasonJa: group.reasonJa,
      entries: group.entries
    };
  }, [activeFocus, marketSections]);

  const handleOpenAdd = useCallback(() => setIsAddModalOpen(true), []);
  const handleToggleAdd = useCallback(() => setIsAddModalOpen((open) => !open), []);
  const handleToggleComparison = useCallback(() => setIsComparisonOpen((open) => !open), []);
  const handleFocus = useCallback((focus: MarketFocus) => {
    setActiveFocus(focus);
    setIsMobileDetailOpen(true);
  }, []);
  const handleAddFromModal = useCallback(() => {
    if (!addProductId) {
      return;
    }
    addComparedProduct(addProductId);
    setAddProductId("");
  }, [addComparedProduct, addProductId]);
  const handleSelectManufacturer = useCallback(
    (manufacturer: Manufacturer) => {
      if (manufacturer.enabled) {
        selectManufacturer(manufacturer.id);
      }
    },
    [selectManufacturer]
  );

  useEffect(() => {
    if (segments.length) {
      setExpandedSegments([segments[0].id]);
    } else {
      setExpandedSegments([]);
    }
  }, [segments, setExpandedSegments]);

  useEffect(() => {
    if (isAddModalOpen) {
      setAddManufacturerId(selectedManufacturerId);
      setAddProductId("");
    }
  }, [isAddModalOpen, selectedManufacturerId]);

  useEffect(() => {
    setAddProductId("");
  }, [addManufacturerId]);

  useEffect(() => {
    setIsMobileDetailOpen(false);
  }, [selectedManufacturerId]);

  useEffect(() => {
    if (!isSchneiderMarketView || !marketSections.length) {
      if (activeFocus) {
        setActiveFocus(null);
      }
      return;
    }

    const isCurrentValid = Boolean(
      activeFocus &&
        marketSections.some((section) =>
          section.rows.some(
            (row) =>
              row.productId === activeFocus.productId &&
              section.segmentId === activeFocus.segmentId &&
              row.evidenceItems.some((group) => group.tagId === activeFocus.tagId)
          )
        )
    );

    if (isCurrentValid) {
      return;
    }

    for (const section of marketSections) {
      if (section.defaultFocus) {
        setActiveFocus({
          segmentId: section.segmentId,
          productId: section.defaultFocus.productId,
          tagId: section.defaultFocus.tagId
        });
        return;
      }
    }

    setActiveFocus(null);
  }, [activeFocus, isSchneiderMarketView, marketSections]);

  return (
    <>
      <Sidebar />
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <header className="px-4 md:px-8 py-4 md:py-5 relative z-10 flex items-center justify-between gap-3">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-white border border-scandi-warm-grey px-3 py-1 text-xs font-bold tracking-wider text-text-main uppercase">
              <span className="material-symbols-outlined text-sm text-accent">insights</span>
              MCB Product Intelligence
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-scandi-wood border border-scandi-warm-grey text-xs font-bold text-text-main"
            >
              <span className="material-symbols-outlined text-base">arrow_back</span>
              カテゴリに戻る
            </Link>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto px-4 md:px-8 pb-6 md:pb-10 relative z-10">
          <div className="max-w-[1800px] mx-auto h-full flex flex-col gap-6">
            <section className="py-1">
              <div className="overflow-x-auto">
                <div className="flex items-center gap-2 min-w-max">
                  {manufacturers.map((manufacturer) => (
                    <ManufacturerCard
                      key={manufacturer.id}
                      manufacturer={manufacturer}
                      selected={manufacturer.id === selectedManufacturerId}
                      onSelect={() => handleSelectManufacturer(manufacturer)}
                    />
                  ))}
                </div>
              </div>
            </section>

            <section className="rounded-3xl border border-scandi-warm-grey bg-white shadow-scandi p-5 md:p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-text-main tracking-tight flex items-center gap-2">
                    <span className="material-symbols-outlined text-2xl text-accent">category</span>
                    製品
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={handleToggleAdd}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-accent text-white text-sm font-bold border border-accent hover:bg-red-600"
                >
                  <span className="material-symbols-outlined text-base">add</span>
                  製品を追加
                </button>
              </div>

              {isAddModalOpen ? (
                <div className="mb-5 p-4 rounded-2xl border border-scandi-warm-grey bg-scandi-light/70">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-text-muted">メーカー</label>
                      <select
                        value={addManufacturerId}
                        onChange={(event) => setAddManufacturerId(event.target.value as ManufacturerId)}
                        className="mt-1 w-full rounded-xl border border-scandi-warm-grey bg-white px-3 py-2 text-sm font-semibold text-text-main"
                      >
                        {manufacturers.map((manufacturer) => (
                          <option key={`add-maker-${manufacturer.id}`} value={manufacturer.id} disabled={!manufacturer.enabled}>
                            {manufacturer.enabled ? manufacturer.name : `${manufacturer.name} (準備中)`}
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
                        className={cx(
                          "w-full rounded-xl py-2.5 text-sm font-bold border",
                          canSubmitAdd
                            ? "bg-accent text-white border-accent hover:bg-red-600"
                            : "bg-scandi-warm-grey/50 text-text-muted border-scandi-warm-grey cursor-not-allowed"
                        )}
                        disabled={!canSubmitAdd}
                        onClick={handleAddFromModal}
                      >
                        比較に追加
                      </button>
                    </div>
                  </div>
                </div>
              ) : null}

              {selectedManufacturer.enabled ? (
                isSchneiderMarketView ? (
                  marketSections.length ? (
                    <div className="space-y-3">
                      <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_340px] gap-4">
                        <div className="space-y-3 min-w-0">
                          {marketSections.map((section) => (
                            <MarketSectionBoard
                              key={section.segmentId}
                              section={section}
                              activeFocus={activeFocus}
                              comparedProductIdSet={comparedProductIdSet}
                              isCompareFull={isCompareFull}
                              onAddProduct={addComparedProduct}
                              onFocus={handleFocus}
                            />
                          ))}
                        </div>
                        <aside className="hidden xl:block">
                          <div className="sticky top-3">
                            <RightDetailPanel focusContext={activeFocusContext} />
                          </div>
                        </aside>
                      </div>

                      <div className="xl:hidden rounded-xl border border-scandi-warm-grey bg-white">
                        <button
                          type="button"
                          onClick={() => setIsMobileDetailOpen((open) => !open)}
                          className="w-full px-3 py-2 flex items-center justify-between text-left"
                        >
                          <span className="text-xs font-bold tracking-widest uppercase text-text-muted">根拠詳細</span>
                          <span className="material-symbols-outlined text-base text-text-muted">
                            {isMobileDetailOpen ? "expand_less" : "expand_more"}
                          </span>
                        </button>
                        {isMobileDetailOpen ? (
                          <div className="p-3 border-t border-scandi-warm-grey">
                            <RightDetailPanel focusContext={activeFocusContext} />
                          </div>
                        ) : null}
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-2xl border border-dashed border-scandi-warm-grey bg-white p-8 text-center">
                      <p className="text-sm font-bold text-text-muted uppercase tracking-widest">データ準備中</p>
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
                            className="w-full text-left p-4 md:p-5 flex items-start justify-between gap-3"
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
                              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-2 mb-4">
                                {segment.rationaleTags.map((tag) => (
                                  <div key={`${segment.id}-${tag.value}`} className="rounded-xl border border-scandi-warm-grey bg-white p-3">
                                    <p className="text-sm font-bold text-text-main">{tag.value}</p>
                                  </div>
                                ))}
                              </div>

                              <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
                                {segmentProducts.map((product) => (
                                  <ProductCard
                                    key={product.id}
                                    product={product}
                                    isSelected={comparedProductIdSet.has(product.id)}
                                    isFull={isCompareFull}
                                    onAdd={() => addComparedProduct(product.id)}
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
                    <p className="text-sm font-bold text-text-muted uppercase tracking-widest">データ準備中</p>
                  </div>
                )
              ) : (
                <div className="rounded-2xl border border-dashed border-scandi-warm-grey bg-white p-8 text-center">
                  <p className="text-sm font-bold text-text-muted uppercase tracking-widest">データ準備中</p>
                </div>
              )}
            </section>

            <section>
              <div className="mb-3 rounded-xl border border-scandi-warm-grey bg-white">
                <button
                  type="button"
                  onClick={handleToggleComparison}
                  className="w-full px-4 py-3 flex items-center justify-between text-left"
                >
                  <h2 className="text-lg md:text-xl font-bold text-text-main tracking-tight flex items-center gap-2">
                    <span className="material-symbols-outlined text-xl text-accent">table_chart</span>
                    比較テーブル ({comparedProducts.length}/{MAX_COMPARE_PRODUCTS})
                  </h2>
                  <span className="material-symbols-outlined text-text-muted">
                    {isComparisonOpen ? "expand_less" : "expand_more"}
                  </span>
                </button>
              </div>
              {isComparisonOpen ? (
                comparedProducts.length ? (
                  <Layer3Comparison
                    comparedProducts={comparedProducts}
                    onOpenAdd={handleOpenAdd}
                    onRemove={removeComparedProduct}
                  />
                ) : (
                  <div className="rounded-3xl border border-dashed border-scandi-warm-grey bg-white p-8 text-center">
                    <p className="text-sm font-bold text-text-muted uppercase tracking-widest mb-4">比較対象なし</p>
                    <button
                      type="button"
                      onClick={handleOpenAdd}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-accent text-white text-sm font-bold border border-accent hover:bg-red-600"
                    >
                      <span className="material-symbols-outlined text-base">add</span>
                      製品を追加
                    </button>
                  </div>
                )
              ) : null}
            </section>

            <footer className="mt-auto py-8 md:py-10 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 border-t border-scandi-warm-grey">
              <p className="text-text-muted text-xs font-medium uppercase tracking-widest">
                © 2024 LV Breaker Intelligence Systems.
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
