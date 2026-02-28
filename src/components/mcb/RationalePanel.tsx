"use client";

import { memo, useMemo, useState } from "react";
import type { MarketSection } from "../../services/marketViewService";
import { MARKET_LABEL_BY_SEGMENT_ID } from "./utils";

type RationaleEntry = {
  marketLabel: string;
  marketName: string;
  reasonJa: string;
  series: string;
  tagValue: string;
};

export const RationalePanel = memo(function RationalePanel({
  sections,
  selectedProductIds
}: {
  sections: MarketSection[];
  selectedProductIds: string[];
}) {
  const [open, setOpen] = useState(false);
  const entries = useMemo<RationaleEntry[]>(() => {
    const selectedSet = new Set(selectedProductIds);
    const output: RationaleEntry[] = [];

    for (const section of sections) {
      for (const row of section.rows) {
        if (!selectedSet.has(row.productId)) {
          continue;
        }
        for (const item of row.evidenceItems) {
          output.push({
            marketLabel: MARKET_LABEL_BY_SEGMENT_ID[section.segmentId] ?? section.segmentId,
            marketName: section.marketName,
            reasonJa: item.reasonJa,
            series: row.series,
            tagValue: item.tagValue
          });
        }
      }
    }

    return output;
  }, [sections, selectedProductIds]);

  return (
    <section className="rounded-xl border border-scandi-warm-grey bg-white">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="w-full px-4 py-3 flex items-center justify-between text-left"
      >
        <span className="text-xs font-bold tracking-widest uppercase text-text-muted">Rationale Details</span>
        <span className="material-symbols-outlined text-base text-text-muted">{open ? "expand_less" : "expand_more"}</span>
      </button>
      {open ? (
        <div className="px-4 pb-4 border-t border-scandi-warm-grey space-y-3">
          {entries.length ? (
            entries.map((entry, index) => (
              <article key={`${entry.series}-${entry.tagValue}-${index}`} className="pt-3">
                <p className="text-[10px] uppercase tracking-[0.16em] text-text-muted font-bold">{entry.marketLabel}</p>
                <p className="mt-1 text-xs font-semibold text-text-main">
                  {entry.marketName} / {entry.series}
                </p>
                <p className="mt-1 inline-flex items-center rounded-full border border-scandi-warm-grey px-2 py-0.5 text-[10px] font-bold text-text-main">
                  {entry.tagValue}
                </p>
                <p className="mt-1 text-xs text-text-muted leading-snug">{entry.reasonJa}</p>
              </article>
            ))
          ) : (
            <p className="pt-3 text-xs text-text-muted">No rationale details for the selected products.</p>
          )}
        </div>
      ) : null}
    </section>
  );
});
