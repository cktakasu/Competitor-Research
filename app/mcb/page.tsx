"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { getBestProductsByRow } from "../../src/services/comparisonService";
import {
  getManufacturers,
  getProductById,
  getProductsByManufacturer,
  getProductsBySegment,
  getSegmentsByManufacturer
} from "../../src/services/dataService";
import { MAX_COMPARE_PRODUCTS, useMcbStore } from "../../src/stores/mcbStore";
import { COMPARISON_ROWS, type Manufacturer, type ManufacturerId, type McbProduct } from "../../src/types/mcb";

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

function Sidebar() {
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
}

function ManufacturerLogo({ manufacturer }: { manufacturer: Manufacturer }) {
  const [errored, setErrored] = useState(false);

  if (errored) {
    return <span className="text-sm font-bold tracking-wide text-text-main">{manufacturer.name}</span>;
  }

  return (
    <img
      src={manufacturer.logoUrl}
      alt={manufacturer.name}
      className="max-h-8 w-auto object-contain"
      onError={() => setErrored(true)}
    />
  );
}

function ManufacturerCard({
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
      className={cx(
        "text-left relative rounded-2xl border p-4 md:p-5 bg-white transition-all",
        selected ? "border-accent ring-2 ring-accent/10 shadow-lg" : "border-scandi-warm-grey shadow-sm",
        disabled && "opacity-60 grayscale cursor-not-allowed"
      )}
    >
      <div className="flex justify-between items-start gap-3 mb-4">
        {selected ? (
          <span className="px-2.5 py-1 rounded-full bg-accent text-white text-[10px] font-bold uppercase tracking-widest">
            Currently Selected
          </span>
        ) : (
          <span className="px-2.5 py-1 rounded-full bg-scandi-wood text-text-muted text-[10px] font-bold uppercase tracking-widest">
            {manufacturer.statusLabel}
          </span>
        )}
      </div>

      <div className="h-10 flex items-center mb-2">
        <ManufacturerLogo manufacturer={manufacturer} />
      </div>
      <p className="text-sm font-bold text-text-main">{manufacturer.name}</p>
    </button>
  );
}

function ProductCard({
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
        {isSelected ? "Added" : isFull ? "Compare Full" : "+ Compare"}
      </button>
    </article>
  );
}

function Layer3Comparison({
  comparedProducts,
  onOpenAdd,
  onRemove
}: {
  comparedProducts: McbProduct[];
  onOpenAdd: () => void;
  onRemove: (productId: string) => void;
}) {
  const bestProductsByRow = useMemo(() => getBestProductsByRow(comparedProducts), [comparedProducts]);
  const manufacturerNameById = useMemo(
    () =>
      manufacturers.reduce(
        (accumulator, manufacturer) => ({ ...accumulator, [manufacturer.id]: manufacturer.name }),
        {} as Record<ManufacturerId, string>
      ),
    []
  );

  return (
    <section className="mt-6 rounded-3xl border border-scandi-warm-grey bg-white shadow-scandi p-5 md:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <p className="text-xs uppercase tracking-widest text-text-muted font-bold">Best value marked with ★</p>
        <button
          type="button"
          onClick={onOpenAdd}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-accent text-white text-xs font-bold border border-accent hover:bg-red-600"
        >
          <span className="material-symbols-outlined text-sm">add</span>
          + Add Product
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[920px] border-collapse">
          <thead>
            <tr>
              <th className="text-left text-xs uppercase tracking-widest text-text-muted font-bold py-3 px-3 border-b border-scandi-warm-grey w-[260px]">
                Specification
              </th>
              {comparedProducts.map((product) => (
                <th
                  key={`head-${product.id}`}
                  className="text-left align-top py-3 px-3 border-b border-scandi-warm-grey min-w-[220px]"
                >
                  <p className="text-[11px] uppercase tracking-wider text-text-muted font-bold">
                    {manufacturerNameById[product.manufacturerId]}
                  </p>
                  <p className="text-sm font-bold text-text-main mt-1">{product.series}</p>
                  <button
                    type="button"
                    onClick={() => onRemove(product.id)}
                    className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-text-muted hover:text-text-main"
                  >
                    <span className="material-symbols-outlined text-base">close</span>
                    Remove
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
}

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
  } = useMcbStore();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
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

  const isCompareFull = comparedProductIds.length >= MAX_COMPARE_PRODUCTS;

  const addProducts = useMemo(() => getProductsByManufacturer(addManufacturerId), [addManufacturerId]);

  const canSubmitAdd =
    Boolean(addProductId) && !isCompareFull && !comparedProductIds.includes(addProductId) && addProducts.length > 0;

  useEffect(() => {
    if (segments.length) {
      setExpandedSegments([segments[0].id]);
    }
  }, [segments, selectedManufacturerId, setExpandedSegments]);

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
        <header className="px-4 md:px-8 py-6 md:py-8 relative z-10 flex flex-col lg:flex-row lg:justify-between lg:items-end gap-4">
          <div>
            <p className="text-xs font-bold text-text-muted uppercase tracking-[0.2em] mb-2">System Configuration</p>
            <h1 className="text-3xl md:text-4xl font-bold text-text-main tracking-tight">MCB Product Intelligence</h1>
            <p className="text-sm text-text-muted mt-2">
              Layer 1: Manufacturer Selection / Layer 2: Segment Lineup / Layer 3: Product Comparison
            </p>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <span className="flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-scandi-warm-grey shadow-sm text-xs font-semibold text-text-main">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
              </span>
              System Online
            </span>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-scandi-wood border border-scandi-warm-grey text-xs font-bold text-text-main"
            >
              <span className="material-symbols-outlined text-base">arrow_back</span>
              Back to Category
            </Link>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto px-4 md:px-8 pb-6 md:pb-10 relative z-10">
          <div className="max-w-[1800px] mx-auto h-full flex flex-col gap-6">
            <section className="rounded-3xl border border-scandi-warm-grey bg-white shadow-scandi p-5 md:p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl md:text-2xl font-bold text-text-main tracking-tight">Layer 1: Manufacturer</h2>
                <p className="text-xs uppercase tracking-wider text-text-muted font-bold">Phase 1: Schneider Active</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-3 md:gap-4">
                {manufacturers.map((manufacturer) => (
                  <ManufacturerCard
                    key={manufacturer.id}
                    manufacturer={manufacturer}
                    selected={manufacturer.id === selectedManufacturerId}
                    onSelect={() => {
                      if (manufacturer.enabled) {
                        selectManufacturer(manufacturer.id);
                      }
                    }}
                  />
                ))}
              </div>
            </section>

            <section className="rounded-3xl border border-scandi-warm-grey bg-white shadow-scandi p-5 md:p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-text-main tracking-tight">Layer 2: Segment Lineup</h2>
                  <p className="text-sm text-text-muted mt-1">{selectedManufacturer.name} MCB products by market segment</p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen((open) => !open)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-accent text-white text-sm font-bold border border-accent hover:bg-red-600"
                >
                  <span className="material-symbols-outlined text-base">add</span>
                  + Add Product
                </button>
              </div>

              {isAddModalOpen ? (
                <div className="mb-5 p-4 rounded-2xl border border-scandi-warm-grey bg-scandi-light/70">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-text-muted mb-3">Add Product to Comparison</h3>
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
                        className={cx(
                          "w-full rounded-xl py-2.5 text-sm font-bold border",
                          canSubmitAdd
                            ? "bg-accent text-white border-accent hover:bg-red-600"
                            : "bg-scandi-warm-grey/50 text-text-muted border-scandi-warm-grey cursor-not-allowed"
                        )}
                        disabled={!canSubmitAdd}
                        onClick={() => {
                          addComparedProduct(addProductId);
                          setAddProductId("");
                        }}
                      >
                        Add to Compare
                      </button>
                    </div>
                  </div>
                </div>
              ) : null}

              {selectedManufacturer.enabled && segments.length ? (
                <div className="space-y-4">
                  {segments.map((segment) => {
                    const segmentProducts = getProductsBySegment(selectedManufacturerId, segment.id);
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
                          <span className="material-symbols-outlined text-text-muted">{opened ? "expand_less" : "expand_more"}</span>
                        </button>

                        {opened ? (
                          <div className="px-4 md:px-5 pb-5">
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-2 mb-4">
                              {segment.rationaleTags.map((tag) => (
                                <div key={`${segment.id}-${tag.value}`} className="rounded-xl border border-scandi-warm-grey bg-white p-3">
                                  <p className="text-sm font-bold text-text-main">{tag.value}</p>
                                  <p className="text-xs text-text-muted mt-0.5">{tag.reason}</p>
                                </div>
                              ))}
                            </div>

                            <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
                              {segmentProducts.map((product) => (
                                <ProductCard
                                  key={product.id}
                                  product={product}
                                  isSelected={comparedProductIds.includes(product.id)}
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
                  <p className="text-sm font-bold text-text-muted uppercase tracking-widest mb-2">Coming Soon</p>
                  <p className="text-base font-semibold text-text-main">
                    Layer 2 data is not available yet for {selectedManufacturer.name}.
                  </p>
                </div>
              )}
            </section>

            {comparedProducts.length ? (
              <section>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-xl md:text-2xl font-bold text-text-main tracking-tight">
                    Layer 3: Product Comparison ({comparedProducts.length}/{MAX_COMPARE_PRODUCTS})
                  </h2>
                </div>
                <Layer3Comparison
                  comparedProducts={comparedProducts}
                  onOpenAdd={() => setIsAddModalOpen(true)}
                  onRemove={removeComparedProduct}
                />
              </section>
            ) : null}

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
