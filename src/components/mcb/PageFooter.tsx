"use client";

const FOOTER_LINKS = ["Privacy Policy", "Terms of Service"] as const;
const FOOTER_LINK_CLASS =
  "text-text-muted hover:text-text-main text-xs font-bold uppercase tracking-widest transition-colors";

export function PageFooter({ year }: { year: number }) {
  return (
    <footer className="mt-auto py-8 md:py-10 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 border-t border-scandi-warm-grey">
      <p className="text-text-muted text-xs font-medium uppercase tracking-widest">
        © {year} LV Breaker Intelligence Systems.
      </p>
      <div className="flex gap-10">
        {FOOTER_LINKS.map((label) => (
          <button type="button" key={label} className={FOOTER_LINK_CLASS} aria-label={label}>
            {label}
          </button>
        ))}
      </div>
    </footer>
  );
}
