"use client";

import { memo } from "react";
import { cx } from "./utils";

function getToneClass(tone?: "info" | "caution") {
  if (tone === "caution") {
    return "border-accent/30 bg-red-50";
  }

  return "border-scandi-warm-grey bg-white";
}

export const ManufacturerNoticePanel = memo(function ManufacturerNoticePanel({
  body,
  title,
  tone
}: {
  body: string[];
  title: string;
  tone?: "info" | "caution";
}) {
  return (
    <section className={cx("rounded-xl border p-4", getToneClass(tone))}>
      <p className="text-xs font-bold uppercase tracking-widest text-text-muted">{title}</p>
      <div className="mt-2 space-y-2">
        {body.map((paragraph) => (
          <p key={paragraph} className="text-xs text-text-muted leading-snug">
            {paragraph}
          </p>
        ))}
      </div>
    </section>
  );
});
