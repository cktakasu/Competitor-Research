"use client";

import { memo, useState } from "react";
import type { Manufacturer } from "../../types/mcb";
import { cx } from "./utils";

const LOGO_SCALE_CLASS_BY_ID: Partial<Record<Manufacturer["id"], string>> = {
  abb: "scale-75",
  eaton: "scale-75",
  "schneider-electric": "scale-[0.85]",
  "ls-electric": "scale-[0.8]"
};

const ManufacturerLogo = memo(function ManufacturerLogo({ manufacturer }: { manufacturer: Manufacturer }) {
  const [errored, setErrored] = useState(false);
  const logoScaleClass = LOGO_SCALE_CLASS_BY_ID[manufacturer.id] ?? "scale-100";

  if (errored) {
    return <span className="text-sm font-bold tracking-wide text-text-main">{manufacturer.name}</span>;
  }

  return (
    <img
      src={manufacturer.logoUrl}
      alt={manufacturer.name}
      className={cx(
        "h-6 md:h-7 w-auto max-w-[100px] md:max-w-[110px] lg:max-w-[120px] object-contain origin-center",
        logoScaleClass
      )}
      loading="lazy"
      decoding="async"
      onError={() => setErrored(true)}
    />
  );
});

export const ManufacturerCard = memo(function ManufacturerCard({
  manufacturer,
  onSelect,
  selected
}: {
  manufacturer: Manufacturer;
  onSelect: () => void;
  selected: boolean;
}) {
  const disabled = !manufacturer.enabled;

  return (
    <button
      type="button"
      onClick={onSelect}
      disabled={disabled}
      title={manufacturer.name}
      aria-label={manufacturer.name}
      className={cx(
        "relative min-h-[3.25rem] md:min-h-[3.5rem] px-0.5 pb-3 transition-all duration-200 flex items-start justify-center bg-transparent border-0 rounded-none shadow-none appearance-none focus:outline-none focus:ring-0 shrink-0",
        selected ? "opacity-100" : "opacity-70 hover:opacity-95",
        disabled && "opacity-45 cursor-not-allowed grayscale"
      )}
    >
      <div className="h-7 md:h-8 flex items-center justify-center min-w-[56px]">
        <ManufacturerLogo manufacturer={manufacturer} />
      </div>
      {disabled ? (
        <span className="absolute bottom-0 left-1/2 -translate-x-1/2 inline-flex items-center rounded-full border border-scandi-warm-grey bg-white px-1.5 py-0.5 text-[9px] font-bold leading-none tracking-wide text-text-muted whitespace-nowrap">
          {manufacturer.statusLabel}
        </span>
      ) : null}
    </button>
  );
});

export const ManufacturerSelector = memo(function ManufacturerSelector({
  manufacturers,
  onSelect,
  selectedManufacturerId
}: {
  manufacturers: Manufacturer[];
  onSelect: (manufacturer: Manufacturer) => void;
  selectedManufacturerId: Manufacturer["id"];
}) {
  return (
    <div className="flex items-start justify-start gap-1.5 md:gap-2 w-full min-h-[3.5rem]">
      {manufacturers.map((manufacturer) => (
        <ManufacturerCard
          key={manufacturer.id}
          manufacturer={manufacturer}
          selected={manufacturer.id === selectedManufacturerId}
          onSelect={() => onSelect(manufacturer)}
        />
      ))}
    </div>
  );
});
