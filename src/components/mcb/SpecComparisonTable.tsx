"use client";

import { memo, useMemo } from "react";
import { getBestProductsByRow } from "../../services/comparisonService";
import { COMPARISON_ROWS, type ManufacturerId, type McbProduct, type ProductVariant } from "../../types/mcb";
import { cx, formatBreakingCapacityValue, formatStandardsValue } from "./utils";

type ComparisonColumn = {
  productId: string;
  variantId?: string;
  manufacturerId: ManufacturerId;
  series: string;
  variantLabel?: string;
  comparison: McbProduct["comparison"];
};

function buildColumns(products: McbProduct[]): ComparisonColumn[] {
  const columns: ComparisonColumn[] = [];
  for (const product of products) {
    if (product.variants?.length) {
      for (const variant of product.variants) {
        columns.push({
          productId: product.id,
          variantId: variant.variantId,
          manufacturerId: product.manufacturerId,
          series: product.series,
          variantLabel: variant.variantLabel,
          comparison: variant.comparison,
        });
      }
    } else {
      columns.push({
        productId: product.id,
        manufacturerId: product.manufacturerId,
        series: product.series,
        comparison: product.comparison,
      });
    }
  }
  return columns;
}

export const SpecComparisonTable = memo(function SpecComparisonTable({
  comparedProducts,
  manufacturerNameById,
  onOpenAdd,
  onRemove
}: {
  comparedProducts: McbProduct[];
  manufacturerNameById: Record<ManufacturerId, string>;
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

      <div className="overflow-x-auto">
        <table className="w-max border-collapse">
          <thead>
            <tr>
              <th className="text-left text-xs uppercase tracking-widest text-text-muted font-bold py-3 px-3 border-b border-scandi-warm-grey w-[160px]">
                Comparison Item
              </th>
              {columns.map((col, colIndex) => (
                <th
                  key={`head-${col.productId}-${col.variantLabel ?? colIndex}`}
                  className="text-left align-top py-3 px-3 border-b border-scandi-warm-grey w-[140px]"
                >
                  <p className="text-[11px] uppercase tracking-wider text-text-muted font-bold">
                    {manufacturerNameById[col.manufacturerId]}
                  </p>
                  <p className="text-sm font-bold text-text-main mt-1">{col.series}</p>
                  {col.variantLabel ? (
                    <p className="text-xs font-semibold text-text-muted mt-0.5">{col.variantLabel}</p>
                  ) : null}
                  <button
                    type="button"
                    onClick={() => onRemove(col.productId)}
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
                  {row.key === "breakingCapacity" ? (
                    <>
                      <span>Breaking Capacity</span>
                      <br />
                      <span className="text-xs text-text-muted font-semibold">(Icu / Icn)</span>
                    </>
                  ) : (
                    row.label
                  )}
                </th>
                {columns.map((col, colIndex) => {
                  const value = col.comparison[row.key] || "N/A";
                  const columnId = col.variantLabel ? `${col.productId}-${col.variantLabel}` : col.productId; // Note: variants in data use actual variantIds, but buildColumns needs a stable key. Actually let's use variantId if available.

                  // Wait, I should update buildColumns to include a stable ID.
                  // Let's just use a better key logic.
                  const isBest = bestProductsByRow[row.key].has(col.variantId || col.productId);

                  return (
                    <td key={`${row.key}-${col.productId}-${col.variantLabel ?? colIndex}`} className="py-3 px-3 border-b border-scandi-warm-grey/80">
                      <div className="flex items-start gap-1.5">
                        {isBest ? <span className="text-green-600 leading-none">★</span> : null}
                        <span
                          className={cx(
                            "text-sm font-medium text-text-main",
                            (row.key === "breakingCapacity" || row.key === "standardsApprovals" || row.key === "electricalEndurance") && "whitespace-pre-line"
                          )}
                        >
                          {row.key === "breakingCapacity"
                            ? formatBreakingCapacityValue(value)
                            : row.key === "standardsApprovals"
                              ? formatStandardsValue(value)
                              : value}
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
