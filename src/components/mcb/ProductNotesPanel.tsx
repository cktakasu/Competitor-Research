"use client";

import { memo, useMemo, useState } from "react";
import type { McbProduct, ProductNote } from "../../types/mcb";

type ProductNoteEntry = ProductNote & {
  productId: string;
  series: string;
};

function getToneClass(tone: ProductNote["tone"]) {
  switch (tone) {
    case "coverage":
      return "border-scandi-warm-grey bg-scandi-light/60";
    case "caution":
      return "border-accent/30 bg-red-50";
    default:
      return "border-scandi-warm-grey bg-white";
  }
}

export const ProductNotesPanel = memo(function ProductNotesPanel({
  products
}: {
  products: McbProduct[];
}) {
  const [open, setOpen] = useState(false);
  const entries = useMemo<ProductNoteEntry[]>(
    () =>
      products.flatMap((product) =>
        (product.notes ?? []).map((note) => ({
          ...note,
          productId: product.id,
          series: product.series
        }))
      ),
    [products]
  );

  if (!entries.length) {
    return null;
  }

  return (
    <section className="rounded-xl border border-scandi-warm-grey bg-white">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="w-full px-4 py-3 flex items-center justify-between text-left"
      >
        <span className="text-xs font-bold tracking-widest uppercase text-text-muted">Product Notes</span>
        <span className="material-symbols-outlined text-base text-text-muted">{open ? "expand_less" : "expand_more"}</span>
      </button>
      {open ? (
        <div className="px-4 pb-4 border-t border-scandi-warm-grey space-y-3">
          {entries.map((entry, index) => (
            <article
              key={`${entry.productId}-${entry.title}-${index}`}
              className={`rounded-xl border p-3 ${getToneClass(entry.tone)}`}
            >
              <p className="text-[10px] uppercase tracking-[0.16em] text-text-muted font-bold">{entry.series}</p>
              <p className="mt-1 text-sm font-bold text-text-main">{entry.title}</p>
              <p className="mt-1 text-xs text-text-muted leading-snug">{entry.body}</p>
            </article>
          ))}
        </div>
      ) : null}
    </section>
  );
});
