"use client";

import Link from "next/link";
import { memo } from "react";
import { cx } from "./utils";

type NavItem = {
  title: string;
  icon: string;
  active?: boolean;
};

const NAV_ITEMS: readonly NavItem[] = [
  { title: "Dashboard", icon: "dashboard" },
  { title: "Product Selection", icon: "category", active: true },
  { title: "Status Monitor", icon: "monitoring" },
  { title: "Analytics", icon: "analytics" }
] as const;

function CircuitBreakerIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="w-6 h-6"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      role="img"
      aria-label="Circuit breaker icon"
    >
      <rect x="6" y="3" width="12" height="18" rx="2" />
      <line x1="9" y1="3" x2="9" y2="1.5" />
      <line x1="15" y1="3" x2="15" y2="1.5" />
      <line x1="9" y1="22.5" x2="9" y2="21" />
      <line x1="15" y1="22.5" x2="15" y2="21" />
      <rect x="9.5" y="7.5" width="5" height="7" rx="1" />
      <line x1="12" y1="10.5" x2="12" y2="14.5" />
      <line x1="10.5" y1="17" x2="13.5" y2="17" />
    </svg>
  );
}

export const Sidebar = memo(function Sidebar() {
  return (
    <aside className="w-full md:w-16 h-16 md:h-auto flex md:flex-col items-center bg-white border-b md:border-b-0 md:border-r border-scandi-warm-grey py-0 md:py-8 px-4 md:px-0 z-20 shadow-sm flex-shrink-0">
      <Link href="/" className="mr-4 md:mr-0 md:mb-10">
        <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-primary text-scandi-wood">
          <CircuitBreakerIcon />
        </div>
      </Link>

      <nav className="flex-1 flex flex-row md:flex-col gap-3 md:gap-6 w-auto md:w-full px-0 md:px-2 items-center justify-center">
        {NAV_ITEMS.map((item) => (
          <button
            type="button"
            key={item.title}
            className={cx(
              "h-10 w-10 mx-auto flex items-center justify-center rounded-lg transition-all",
              item.active
                ? "bg-scandi-wood text-primary relative group"
                : "text-text-muted hover:bg-scandi-wood hover:text-text-main"
            )}
            title={item.title}
            aria-label={item.title}
          >
            <span className={cx("material-symbols-outlined", item.active && "icon-filled")}>{item.icon}</span>
          </button>
        ))}
      </nav>

      <div className="ml-4 md:ml-0 md:mt-auto flex flex-row md:flex-col gap-3 md:gap-6 w-auto md:w-full px-0 md:px-2 items-center">
        <button
          type="button"
          className="h-10 w-10 mx-auto flex items-center justify-center rounded-lg text-text-muted hover:bg-scandi-wood hover:text-text-main transition-all"
          title="Settings"
          aria-label="Settings"
        >
          <span className="material-symbols-outlined">settings</span>
        </button>
        <div className="h-8 w-8 mx-auto rounded-full bg-scandi-warm-grey flex items-center justify-center text-[10px] font-bold text-text-main ring-2 ring-white shadow-sm cursor-pointer hidden sm:flex">
          JD
        </div>
      </div>
    </aside>
  );
});
