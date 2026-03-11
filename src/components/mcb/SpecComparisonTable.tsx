"use client";

import { memo, useMemo } from "react";
import { getBestProductsByRow } from "../../services/comparisonService";
import { COMPARISON_ROWS, type ComparisonRowKey, type ManufacturerId, type McbProduct } from "../../types/mcb";
import { cx, formatBreakingCapacityValue, formatStandardsValue } from "./utils";

type ComparisonColumn = {
  comparison: McbProduct["comparison"];
  manufacturerId: ManufacturerId;
  productId: string;
  series: string;
  variantId?: string;
  variantLabel?: string;
};

const MULTILINE_ROW_KEYS = new Set<ComparisonRowKey>([
  "breakingCapacity",
  "standardsApprovals",
  "electricalEndurance"
]);

const VALUE_FORMATTER_BY_ROW_KEY: Partial<Record<ComparisonRowKey, (value: string) => string>> = {
  breakingCapacity: formatBreakingCapacityValue,
  standardsApprovals: formatStandardsValue
};

function buildColumns(products: McbProduct[]): ComparisonColumn[] {
  return products.flatMap((product) =>
    product.variants?.length
      ? product.variants.map((variant) => ({
          comparison: variant.comparison,
          manufacturerId: product.manufacturerId,
          productId: product.id,
          series: product.series,
          variantId: variant.variantId,
          variantLabel: variant.variantLabel
        }))
      : [
          {
            comparison: product.comparison,
            manufacturerId: product.manufacturerId,
            productId: product.id,
            series: product.series
          }
        ]
  );
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
  const columns = useMemo(() => buildColumns(comparedProducts), [comparedProducts]);
  const bestProductsByRow = useMemo(() => getBestProductsByRow(comparedProducts), [comparedProducts]);

  return (
    <section className="rounded-3xl border border-scandi-warm-grey bg-white shadow-scandi p-5 md:p-6">
      <div className="flex flex-wrap items-center justify-end gap-3 mb-4">
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
              <th className="sticky left-0 z-20 bg-white text-left text-xs uppercase tracking-widest text-text-muted font-bold py-3 px-3 border-b border-scandi-warm-grey w-[160px] shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
                Comparison Item
              </th>
              {columns.map((column, index) => (
                <th
                  key={`head-${column.productId}-${column.variantLabel ?? index}`}
                  className="text-left align-top py-3 px-3 border-b border-scandi-warm-grey w-[140px]"
                >
                  <p className="text-[11px] uppercase tracking-wider text-text-muted font-bold">
                    {manufacturerNameById[column.manufacturerId]}
                  </p>
                  <p className="text-sm font-bold text-text-main mt-1">{column.series}</p>
                  {column.variantLabel ? (
                    <p className="text-xs font-semibold text-text-muted mt-0.5">{column.variantLabel}</p>
                  ) : null}
                  <button
                    type="button"
                    onClick={() => onRemove(column.productId)}
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
                      key={`${row.key}-${column.productId}-${column.variantLabel ?? index}`}
                      className="py-3 px-3 border-b border-scandi-warm-grey/80"
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
