"use client";

import { memo, useMemo } from "react";
import { getBestProductsByRow } from "../../services/comparisonService";
import { COMPARISON_ROWS, type ManufacturerId, type McbProduct } from "../../types/mcb";
import { cx, formatBreakingCapacityValue, formatStandardsValue } from "./utils";

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
        <table className="w-full min-w-[920px] border-collapse">
          <thead>
            <tr>
              <th className="text-left text-xs uppercase tracking-widest text-text-muted font-bold py-3 px-3 border-b border-scandi-warm-grey w-[260px]">
                Comparison Item
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
                {comparedProducts.map((product) => {
                  const value = product.comparison[row.key] || "N/A";
                  const isBest = bestProductsByRow[row.key].has(product.id);

                  return (
                    <td key={`${row.key}-${product.id}`} className="py-3 px-3 border-b border-scandi-warm-grey/80">
                      <div className="flex items-start gap-1.5">
                        {isBest ? <span className="text-green-600 leading-none">★</span> : null}
                        <span
                          className={cx(
                            "text-sm font-medium text-text-main",
                            (row.key === "breakingCapacity" || row.key === "standardsApprovals") && "whitespace-pre-line"
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
