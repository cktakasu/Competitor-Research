import type { CSSProperties } from "react";
import Link from "next/link";
import { PageFooter } from "../src/components/mcb/PageFooter";
import { Sidebar } from "../src/components/mcb/Sidebar";

const APPLICATION_TOOLTIP =
  "Application tags are indicative. Final product selection must consider system voltage, rated current, breaking capacity, and the applicable standard (IEC 60947-2 for ACB/MCCB, IEC 60898-1 for MCB).";

const TAG_CHIP_CLASS =
  "px-3 py-1.5 rounded-lg bg-scandi-wood text-text-main text-xs font-bold border border-scandi-warm-grey";
const BASE_CARD_CLASS = "group relative bg-white rounded-3xl p-8 flex flex-col overflow-hidden";
const LOCKED_CARD_CLASS = "shadow-scandi border border-scandi-warm-grey/50";
const SELECTED_CARD_CLASS = "shadow-2xl border-4 border-accent ring-4 ring-accent/5";

type ApplicationHeadingWeight = "bold" | "black";
type CardVariant = "locked" | "selected";

type Specifications = {
  breakingCapacity: string;
  curveCharacteristics?: string;
  ratedCurrent: string;
};

type BreakerCardData = {
  backgroundImage: string;
  backgroundPosition: string;
  code: string;
  fullName: string;
  headingWeight: ApplicationHeadingWeight;
  icon: string;
  id: string;
  offsetClass?: string;
  specifications: Specifications;
  tags: readonly string[];
  variant: CardVariant;
};

const ACB_APPLICATION_TAGS = [
  "Building",
  "Industrial",
  "Infrastructure",
  "Data Center",
  "Energy & Renewables",
  "Transportation",
  "Oil & Gas",
  "Mining",
  "Healthcare",
  "Government"
] as const;

const COMMON_APPLICATION_TAGS = [...ACB_APPLICATION_TAGS, "Telecom / ICT", "OEM / Machine Building"] as const;

const cx = (...values: Array<string | false | null | undefined>) => values.filter(Boolean).join(" ");

const createPhotoLayerStyle = (imageUrl: string, position: string): CSSProperties => ({
  backgroundImage: `url('${imageUrl}')`,
  backgroundPosition: position,
  backgroundRepeat: "no-repeat",
  backgroundSize: "330% auto",
  opacity: 0.08
});

const createTextureLayerStyle = (imageUrl: string, position: string): CSSProperties => ({
  backgroundImage: "repeating-radial-gradient(circle, rgba(45,42,38,0.30) 0 0.5px, transparent 0.5px 2.4px)",
  backgroundSize: "4.8px 4.8px",
  maskImage: `url('${imageUrl}')`,
  maskPosition: position,
  maskRepeat: "no-repeat",
  maskSize: "330% auto",
  mixBlendMode: "multiply",
  opacity: 0.48,
  WebkitMaskImage: `url('${imageUrl}')`,
  WebkitMaskPosition: position,
  WebkitMaskRepeat: "no-repeat",
  WebkitMaskSize: "330% auto"
});

const BREAKER_CARDS: readonly BreakerCardData[] = [
  {
    id: "acb",
    code: "ACB",
    fullName: "Air Circuit Breaker",
    variant: "locked",
    icon: "lock",
    offsetClass: "xl:-ml-4",
    headingWeight: "bold",
    backgroundImage:
      "https://us.mitsubishielectric.com/fa/en/-/media/images/webredesign/products/lvd/lvcb/items/acb/img/air-circuit-breaker-main-banner.ashx?h=496&hash=E34D31108240B951A190629259F8D415&la=en&w=880",
    backgroundPosition: "center",
    specifications: {
      ratedCurrent: "630-6300A",
      breakingCapacity: "up to 150kA"
    },
    tags: ACB_APPLICATION_TAGS
  },
  {
    id: "mccb",
    code: "MCCB",
    fullName: "Molded Case Circuit Breaker",
    variant: "locked",
    icon: "hourglass_empty",
    headingWeight: "bold",
    backgroundImage:
      "https://us.mitsubishielectric.com/fa/en/-/media/images/webredesign/products/lvd/lvcb/items/mccb/img/molded-case-cb-main-banner.ashx?h=496&hash=968BF4BB4B8C8A3AC661E124672A79F0&la=en&w=880",
    backgroundPosition: "center",
    specifications: {
      ratedCurrent: "16-3200A",
      breakingCapacity: "up to 200kA"
    },
    tags: COMMON_APPLICATION_TAGS
  },
  {
    id: "mcb",
    code: "MCB",
    fullName: "Miniature Circuit Breaker",
    variant: "selected",
    icon: "bolt",
    offsetClass: "xl:-mr-4",
    headingWeight: "black",
    backgroundImage: "https://www.mitsubishielectric.com/fa/products/lvd/lvcb/items/mcb/img/img_mv-1.png",
    backgroundPosition: "48% center",
    specifications: {
      ratedCurrent: "0.5-125A",
      breakingCapacity: "6-15kA",
      curveCharacteristics: "Type B, C, D, K, Z"
    },
    tags: COMMON_APPLICATION_TAGS
  }
];

function ApplicationSection({
  tags,
  headingWeight
}: {
  headingWeight: ApplicationHeadingWeight;
  tags: readonly string[];
}) {
  const headingClass =
    headingWeight === "black"
      ? "text-xs font-black text-text-muted uppercase tracking-widest"
      : "text-xs font-bold text-text-muted uppercase tracking-widest";

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <h4 className={headingClass}>Application</h4>
        <span
          className="material-symbols-outlined text-base text-text-muted cursor-help"
          title={APPLICATION_TOOLTIP}
        >
          info
        </span>
      </div>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span key={tag} className={TAG_CHIP_CLASS}>
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}

function SpecificationsSection({ specifications }: { specifications: Specifications }) {
  return (
    <div className="bg-scandi-light/80 rounded-2xl p-5 border border-scandi-warm-grey">
      <h4 className="text-xs font-bold text-text-muted uppercase tracking-widest mb-4">Key Specifications</h4>
      <div className="grid grid-cols-2 gap-5">
        <div>
          <p className="text-[11px] text-text-muted font-bold uppercase mb-1">Rated Current</p>
          <p className="text-lg font-bold text-text-main font-mono">{specifications.ratedCurrent}</p>
        </div>
        <div>
          <p className="text-[11px] text-text-muted font-bold uppercase mb-1">Breaking Capacity</p>
          <p className="text-lg font-bold text-text-main font-mono whitespace-nowrap">
            {specifications.breakingCapacity}
          </p>
        </div>
        {specifications.curveCharacteristics ? (
          <div className="col-span-2 pt-1">
            <p className="text-[11px] text-text-muted font-bold uppercase mb-1">Curve Characteristics</p>
            <p className="text-sm font-bold text-text-main font-mono">{specifications.curveCharacteristics}</p>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function BreakerCard({ card }: { card: BreakerCardData }) {
  const selected = card.variant === "selected";
  const photoClassName = cx("absolute inset-0 grayscale", selected && "mix-blend-multiply");
  const pillClass = selected
    ? "px-3 py-1 rounded-full bg-accent text-white text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5"
    : "px-3 py-1 rounded-full bg-scandi-warm-grey text-text-muted text-[10px] font-bold uppercase tracking-widest";
  const iconClass = cx(
    "material-symbols-outlined",
    selected ? "text-accent icon-filled" : "text-scandi-warm-grey"
  );
  const buttonClass = selected
    ? "w-full py-5 rounded-2xl bg-accent hover:bg-red-600 text-white text-base font-black shadow-xl shadow-accent/20 transition-all flex items-center justify-center gap-3"
    : "w-full py-4 rounded-2xl bg-scandi-warm-grey/50 text-text-muted text-sm font-bold border border-dashed border-scandi-warm-grey";

  return (
    <div
      className={cx(
        BASE_CARD_CLASS,
        selected ? SELECTED_CARD_CLASS : LOCKED_CARD_CLASS,
        card.offsetClass
      )}
    >
      <div className={photoClassName} style={createPhotoLayerStyle(card.backgroundImage, card.backgroundPosition)} />
      <div
        className="absolute inset-0 pointer-events-none"
        style={createTextureLayerStyle(card.backgroundImage, card.backgroundPosition)}
      />

      <div className="relative z-10 flex justify-between items-start mb-4">
        <span className={pillClass}>
          {selected ? <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" /> : null}
          {selected ? "Currently Selected" : "Will Be Updated"}
        </span>
        <span className={iconClass}>{card.icon}</span>
      </div>

      <div className="relative z-10">
        <h3 className="text-4xl md:text-6xl font-black text-text-main mb-1 tracking-tighter">{card.code}</h3>
        <p className={selected ? "text-lg text-text-main font-bold" : "text-lg text-text-muted font-medium"}>
          {card.fullName}
        </p>
      </div>

      <div className="relative z-10 mt-8 space-y-7 flex-1">
        <SpecificationsSection specifications={card.specifications} />
        <ApplicationSection tags={card.tags} headingWeight={card.headingWeight} />
      </div>

      <div className={selected ? "relative z-10 mt-auto pt-4" : "relative z-10 mt-auto"}>
        {selected ? (
          <Link href="/mcb" className={buttonClass} aria-label="Proceed to MCB configuration">
            Proceed to Configuration
            <span className="material-symbols-outlined text-xl font-bold">arrow_forward</span>
          </Link>
        ) : (
          <button className={buttonClass} disabled>
            Coming Soon
          </button>
        )}
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <>
      <Sidebar />
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <header className="px-4 md:px-8 py-6 md:py-8 relative z-10 flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
          <div>
            <p className="text-xs font-bold text-text-muted uppercase tracking-[0.2em] mb-2">
              System Configuration
            </p>
            <h1 className="text-3xl md:text-4xl font-bold text-text-main tracking-tight">
              Select Breaker Category
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-scandi-warm-grey shadow-sm text-xs font-semibold text-text-main">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
              </span>
              System Online
            </span>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto px-4 md:px-8 pb-6 md:pb-10 relative z-10">
          <div className="max-w-[1800px] mx-auto h-full flex flex-col">
            <div className="grid grid-cols-3 gap-4 h-full min-h-[700px]">
              {BREAKER_CARDS.map((card) => (
                <BreakerCard key={card.id} card={card} />
              ))}
            </div>

            <PageFooter year={2024} />
          </div>
        </div>
      </main>
    </>
  );
}
