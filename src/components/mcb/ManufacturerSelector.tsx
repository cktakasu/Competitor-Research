"use client";

import { memo, useState } from "react";
import type { Manufacturer } from "../../types/mcb";
import { cx } from "./utils";

const ManufacturerLogo = memo(function ManufacturerLogo({ manufacturer }: { manufacturer: Manufacturer }) {
  const [errored, setErrored] = useState(false);
  const logoScaleClass = manufacturer.id === "abb" ? "scale-75" : manufacturer.id === "eaton" ? "scale-75" : "scale-100";

  if (errored) {
    return <span className="text-sm font-bold tracking-wide text-text-main">{manufacturer.name}</span>;
  }

  return (
    <img
      src={manufacturer.logoUrl}
      alt={manufacturer.name}
      className={cx(
        "h-6 md:h-7 w-auto max-w-[108px] md:max-w-[122px] lg:max-w-[132px] object-contain origin-center",
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
  selected,
  onSelect
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
        "relative h-9 md:h-10 px-1 transition-all duration-200 flex items-center justify-center bg-transparent border-0 rounded-none shadow-none appearance-none focus:outline-none focus:ring-0",
        selected ? "opacity-100" : "opacity-70 hover:opacity-95",
        disabled && "opacity-45 cursor-not-allowed grayscale"
      )}
    >
      <div className="h-7 flex items-center justify-center">
        <ManufacturerLogo manufacturer={manufacturer} />
      </div>
      {disabled ? (
        <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 inline-flex items-center rounded-full border border-scandi-warm-grey bg-white px-1.5 py-0.5 text-[9px] font-bold leading-none tracking-wide text-text-muted whitespace-nowrap">
          準備中
        </span>
      ) : null}
    </button>
  );
});

export const ManufacturerSelector = memo(function ManufacturerSelector({
  manufacturers,
  selectedManufacturerId,
  onSelect
}: {
  manufacturers: Manufacturer[];
  selectedManufacturerId: Manufacturer["id"];
  onSelect: (manufacturer: Manufacturer) => void;
}) {
  return (
    <div className="flex items-center justify-center gap-1.5 md:gap-2 w-full">
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
