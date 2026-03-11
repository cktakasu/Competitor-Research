"use client";

import { cx } from "./utils";

const BUTTON_SIZE_CLASS = {
  card: "mt-5 w-full rounded-xl py-2.5 text-sm",
  compact: "inline-flex items-center justify-center rounded-md px-2.5 py-1.5 text-[11px] shrink-0"
} as const;

export function SelectionButton({
  compact,
  disabled,
  onClick,
  selected
}: {
  compact?: boolean;
  disabled?: boolean;
  onClick: () => void;
  selected: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cx(
        "font-bold border transition-colors",
        compact ? BUTTON_SIZE_CLASS.compact : BUTTON_SIZE_CLASS.card,
        disabled
          ? "bg-scandi-warm-grey/40 text-text-muted border-scandi-warm-grey cursor-not-allowed"
          : selected
            ? "bg-text-muted text-white border-text-muted shadow-inner hover:bg-text-muted/90"
            : "bg-accent text-white border-accent hover:bg-red-600"
      )}
    >
      {selected ? "Selected" : "Select"}
    </button>
  );
}
