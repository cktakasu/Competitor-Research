"use client";

import type { ReactNode } from "react";
import { cx } from "./utils";

const EMPTY_STATE_CLASS =
  "rounded-2xl border border-dashed border-scandi-warm-grey bg-white p-8 text-center";
const EMPTY_STATE_MESSAGE_CLASS = "text-sm font-bold text-text-muted uppercase tracking-widest";

export function EmptyState({
  children,
  className,
  message,
  messageClassName = EMPTY_STATE_MESSAGE_CLASS
}: {
  children?: ReactNode;
  className?: string;
  message: string;
  messageClassName?: string;
}) {
  return (
    <section className={cx(EMPTY_STATE_CLASS, className)}>
      <p className={messageClassName}>{message}</p>
      {children}
    </section>
  );
}
