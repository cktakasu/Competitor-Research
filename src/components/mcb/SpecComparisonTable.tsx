"use client";

import { memo, useMemo, useState } from "react";
import { getBestProductsByRow } from "../../services/comparisonService";
import { COMPARISON_ROWS, type ComparisonRowKey, type ManufacturerId, type McbProduct } from "../../types/mcb";
import {
  cx,
  formatBreakingCapacityValue,
  formatCapacityClassValue,
  formatPolesValue,
  formatRatedCurrentValue,
  formatStandardsValue
} from "./utils";

type ComparisonColumn = {
  comparison: McbProduct["comparison"];
  kind: "summary" | "variant";
  manufacturerId: ManufacturerId;
  key: string;
  productId: string;
  series: string;
  summaryLabel: string;
  variantId?: string;
  variantLabel?: string;
};

type ComparisonGroup = {
  columns: ComparisonColumn[];
  manufacturerId: ManufacturerId;
  productId: string;
  series: string;
};

const MULTILINE_ROW_KEYS = new Set<ComparisonRowKey>([
  "capacityClass",
  "breakingCapacity",
  "ratedCurrentIn",
  "numberOfPoles",
  "standardsApprovals",
  "electricalEndurance"
]);

const VALUE_FORMATTER_BY_ROW_KEY: Partial<Record<ComparisonRowKey, (value: string) => string>> = {
  capacityClass: formatCapacityClassValue,
  breakingCapacity: formatBreakingCapacityValue,
  ratedCurrentIn: formatRatedCurrentValue,
  numberOfPoles: formatPolesValue,
  standardsApprovals: formatStandardsValue
};

function buildColumnGroups(products: McbProduct[]): ComparisonGroup[] {
  return products.map((product) => {
    const columns: ComparisonColumn[] = [
      {
        comparison: product.comparison,
        kind: "summary",
        key: `${product.id}-summary`,
        manufacturerId: product.manufacturerId,
        productId: product.id,
        series: product.series,
        summaryLabel: "Family Summary"
      }
    ];

    if (product.variants?.length) {
      columns.push(
        ...product.variants.map((variant) => ({
          comparison: variant.comparison,
          kind: "variant" as const,
          key: variant.variantId,
          manufacturerId: product.manufacturerId,
          productId: product.id,
          series: product.series,
          summaryLabel: "Variant Detail",
          variantId: variant.variantId,
          variantLabel: variant.variantLabel
        }))
      );
    }

    return {
      columns,
      manufacturerId: product.manufacturerId,
      productId: product.id,
      series: product.series
    };
  });
}

function formatComparisonValue(rowKey: ComparisonRowKey, value: string) {
  return VALUE_FORMATTER_BY_ROW_KEY[rowKey]?.(value) ?? value;
}

function renderRowLabel(row: (typeof COMPARISON_ROWS)[number]) {
  if (row.key !== "breakingCapacity") {
    return row.label;
  }

  return (
    <>
      <span>Breaking Capacity</span>
      <br />
      <span className="text-xs text-text-muted font-semibold">(Icu / Icn)</span>
    </>
  );
}

export const SpecComparisonTable = memo(function SpecComparisonTable({
  comparedProducts,
  manufacturerNameById,
  onOpenAdd,
  onRemove
}: {
  comparedProducts: McbProduct[];
  manufacturerNameById: Partial<Record<ManufacturerId, string>>;
  onOpenAdd: () => void;
  onRemove: (productId: string) => void;
}) {
  const [showVariantDetails, setShowVariantDetails] = useState(false);
  const columnGroups = useMemo(() => buildColumnGroups(comparedProducts), [comparedProducts]);
  const bestProductsByRow = useMemo(() => getBestProductsByRow(comparedProducts), [comparedProducts]);
  const hasVariantDetails = useMemo(
    () => columnGroups.some((group) => group.columns.some((column) => column.kind === "variant")),
    [columnGroups]
  );
  const hiddenVariantCount = useMemo(
    () =>
      columnGroups.reduce(
        (count, group) => count + group.columns.filter((column) => column.kind === "variant").length,
        0
      ),
    [columnGroups]
  );
  const visibleColumnGroups = useMemo(
    () =>
      columnGroups.map((group) => ({
        ...group,
        columns: showVariantDetails ? group.columns : group.columns.filter((column) => column.kind === "summary")
      })),
    [columnGroups, showVariantDetails]
  );
  const columns = useMemo(() => visibleColumnGroups.flatMap((group) => group.columns), [visibleColumnGroups]);

  return (
    <section className="rounded-3xl border border-scandi-warm-grey bg-white shadow-scandi p-5 md:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex flex-wrap items-center gap-2">
          {hasVariantDetails ? (
            <>
              <span className="inline-flex items-center rounded-full border border-scandi-warm-grey bg-scandi-light px-2.5 py-1 text-[11px] font-bold text-text-main">
                Family Summary
              </span>
              {showVariantDetails ? (
                <span className="inline-flex items-center rounded-full border border-scandi-warm-grey/80 bg-white px-2.5 py-1 text-[11px] font-bold text-text-muted">
                  Variant Detail
                </span>
              ) : null}
              <button
                type="button"
                onClick={() => setShowVariantDetails((value) => !value)}
                className="inline-flex items-center rounded-full border border-scandi-warm-grey bg-white px-3 py-1 text-[11px] font-bold text-text-main hover:bg-scandi-light"
              >
                {showVariantDetails ? "Hide Variant Detail" : `Show Variant Detail (${hiddenVariantCount})`}
              </button>
            </>
          ) : null}
        </div>
        <button
          type="button"
          onClick={onOpenAdd}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-accent text-white text-xs font-bold border border-accent hover:bg-red-600"
        >
          <span className="material-symbols-outlined text-sm">add</span>
          Add Product
        </button>
      </div>

      <div className="overflow-x-auto w-full">
        <table className="w-max border-separate border-spacing-0">
          <thead>
            <tr>
              <th
                rowSpan={2}
                className="sticky left-0 z-20 bg-white text-left text-xs uppercase tracking-widest text-text-muted font-bold py-3 px-3 border-b border-scandi-warm-grey w-[160px] shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]"
              >
                Comparison Item
              </th>
              {visibleColumnGroups.map((group, index) => (
                <th
                  key={`group-${group.productId}`}
                  colSpan={group.columns.length}
                  className={cx(
                    "text-left align-top py-3 px-3 border-b border-scandi-warm-grey bg-white min-w-[170px]",
                    index > 0 && "border-l border-scandi-warm-grey/80"
                  )}
                >
                  <p className="text-[11px] uppercase tracking-wider text-text-muted font-bold">
                    {manufacturerNameById[group.manufacturerId]}
                  </p>
                  <div className="mt-1 flex items-center gap-2">
                    <p className="text-sm font-bold text-text-main">{group.series}</p>
                    {showVariantDetails && group.columns.length > 1 ? (
                      <span className="inline-flex items-center rounded-full bg-scandi-light px-2 py-0.5 text-[10px] font-bold text-text-muted">
                        {group.columns.length} columns
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-1 text-[11px] text-text-muted">
                    {showVariantDetails && group.columns.length > 1
                      ? "Family summary first, then variant detail."
                      : "Family summary."}
                  </p>
                  <button
                    type="button"
                    onClick={() => onRemove(group.productId)}
                    className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-text-muted hover:text-text-main"
                  >
                    <span className="material-symbols-outlined text-base">close</span>
                    Remove
                  </button>
                </th>
              ))}
            </tr>
            <tr>
              {columns.map((column, index) => (
                <th
                  key={`column-${column.key}-${index}`}
                  className={cx(
                    "text-left align-top py-2.5 px-3 border-b border-scandi-warm-grey w-[170px]",
                    column.kind === "summary" ? "bg-scandi-light/50" : "bg-white"
                  )}
                >
                  <span
                    className={cx(
                      "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide",
                      column.kind === "summary"
                        ? "bg-scandi-wood text-text-main"
                        : "border border-scandi-warm-grey bg-white text-text-muted"
                    )}
                  >
                    {column.summaryLabel}
                  </span>
                  <p className="mt-1.5 text-xs font-semibold text-text-main">
                    {column.variantLabel ?? column.series}
                  </p>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {COMPARISON_ROWS.map((row) => (
              <tr key={row.key} className="group">
                <th className="sticky left-0 z-10 text-left text-sm font-bold text-text-main py-3 px-3 border-b border-scandi-warm-grey/80 bg-scandi-light shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
                  {renderRowLabel(row)}
                </th>
                {columns.map((column, index) => {
                  const value = column.comparison[row.key] || "N/A";
                  const columnId = column.variantId ?? column.productId;
                  const isBest = bestProductsByRow[row.key].has(columnId);

                  return (
                    <td
                      key={`${row.key}-${column.key}-${index}`}
                      className={cx(
                        "py-3 px-3 border-b border-scandi-warm-grey/80",
                        column.kind === "summary" && "bg-scandi-light/20"
                      )}
                    >
                      <div className="flex items-start gap-1.5">
                        {isBest ? <span className="text-green-600 leading-none">*</span> : null}
                        <span
                          className={cx(
                            "text-sm font-medium text-text-main",
                            MULTILINE_ROW_KEYS.has(row.key) && "whitespace-pre-line"
                          )}
                        >
                          {formatComparisonValue(row.key, value)}
                        </span>
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
