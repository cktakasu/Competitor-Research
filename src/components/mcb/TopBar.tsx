"use client";

import type { ReactNode } from "react";
import type { Manufacturer } from "../../types/mcb";
import { ManufacturerSelector } from "./ManufacturerSelector";

export function TopBar({
  actions,
  manufacturers,
  onSelectManufacturer,
  selectedManufacturerId,
  title
}: {
  actions: ReactNode;
  manufacturers: Manufacturer[];
  onSelectManufacturer: (manufacturer: Manufacturer) => void;
  selectedManufacturerId: Manufacturer["id"];
  title: string;
}) {
  return (
    <section className="sticky top-0 z-20 -mx-1 px-1 py-2 md:py-2.5 bg-scandi-light/95 backdrop-blur supports-[backdrop-filter]:bg-scandi-light/80 border-b border-scandi-warm-grey/70">
      <div className="flex flex-wrap items-center justify-between gap-y-3 gap-x-2 md:grid md:grid-cols-[auto_minmax(0,1fr)_auto] md:gap-4">
        <span className="order-1 inline-flex items-center rounded-full bg-white border border-scandi-warm-grey px-3 py-1.5 text-sm font-bold tracking-wide text-text-main uppercase whitespace-nowrap">
          {title}
        </span>

        <div className="order-3 md:order-2 w-full md:w-auto min-w-0 overflow-x-auto pb-1 md:pb-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <div className="min-w-max md:min-w-0">
            <ManufacturerSelector
              manufacturers={manufacturers}
              selectedManufacturerId={selectedManufacturerId}
              onSelect={onSelectManufacturer}
            />
          </div>
        </div>

        <div className="order-2 md:order-3 flex items-center gap-2 shrink-0">{actions}</div>
      </div>
    </section>
  );
}
