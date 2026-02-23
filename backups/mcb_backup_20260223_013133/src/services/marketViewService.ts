import { getProductsBySegment, getSegmentsByManufacturer } from "./dataService";
import { COMPARISON_ROWS, type ManufacturerId, type McbProduct, type McbSegment, type RationaleEvidenceRef, type RationaleTag } from "../types/mcb";

export type MarketEvidenceEntry = {
  label: string;
  value: string;
  noteJa?: string;
};

export type MarketEvidenceGroup = {
  tagId: string;
  tagValue: string;
  reasonJa: string;
  entries: MarketEvidenceEntry[];
};

export type MarketCompactTag = {
  tagId: string;
  tagValue: string;
  hasEvidence: boolean;
};

export type MarketRow = {
  productId: string;
  series: string;
  standards: string;
  breakingCapacity: string;
  ratedCurrent: string;
  compactTags: MarketCompactTag[];
  evidenceItems: MarketEvidenceGroup[];
};

export type MarketSection = {
  segmentId: string;
  marketName: string;
  summaryTags: string[];
  defaultFocus: { productId: string; tagId: string } | null;
  rows: MarketRow[];
};

const COMPARISON_LABEL_BY_KEY = COMPARISON_ROWS.reduce(
  (accumulator, row) => {
    accumulator[row.key] = row.label;
    return accumulator;
  },
  {} as Record<(typeof COMPARISON_ROWS)[number]["key"], string>
);

const MARKET_NAME_JA_BY_SEGMENT_ID: Record<string, string> = {
  residential: "住宅市場",
  "commercial-building": "商業・ビル市場",
  industrial: "産業市場",
  "oem-machine-building": "OEM・機械市場",
  "pv-renewables": "再エネ・PV市場"
};

function resolveComparisonEvidence(product: McbProduct, reference: RationaleEvidenceRef): MarketEvidenceEntry | null {
  if (!reference.key) {
    return null;
  }

  const label = COMPARISON_LABEL_BY_KEY[reference.key];
  const value = product.comparison[reference.key];

  if (!label || !value || value === "N/A") {
    return null;
  }

  return {
    label,
    value,
    noteJa: reference.noteJa
  };
}

function resolveSpecificationEvidence(product: McbProduct, reference: RationaleEvidenceRef): MarketEvidenceEntry | null {
  if (!reference.label) {
    return null;
  }

  const specification = product.specifications.find((item) => item.label === reference.label);

  if (!specification || !specification.value || specification.value === "N/A") {
    return null;
  }

  return {
    label: specification.label,
    value: specification.value,
    noteJa: reference.noteJa
  };
}

function resolveEvidenceEntry(product: McbProduct, reference: RationaleEvidenceRef): MarketEvidenceEntry | null {
  if (reference.source === "comparison") {
    return resolveComparisonEvidence(product, reference);
  }

  return resolveSpecificationEvidence(product, reference);
}

function dedupeEvidenceEntries(entries: MarketEvidenceEntry[]): MarketEvidenceEntry[] {
  const keySet = new Set<string>();

  return entries.filter((entry) => {
    const key = `${entry.label}::${entry.value}::${entry.noteJa ?? ""}`;
    if (keySet.has(key)) {
      return false;
    }
    keySet.add(key);
    return true;
  });
}

function resolveEvidenceGroup(product: McbProduct, tag: RationaleTag): MarketEvidenceGroup | null {
  const entries = dedupeEvidenceEntries(
    tag.evidenceRefs
      .map((reference) => resolveEvidenceEntry(product, reference))
      .filter((entry): entry is MarketEvidenceEntry => Boolean(entry))
  );

  if (!entries.length) {
    return null;
  }

  return {
    tagId: tag.id,
    tagValue: tag.value,
    reasonJa: tag.reasonJa,
    entries
  };
}

function toMarketName(segment: McbSegment): string {
  return MARKET_NAME_JA_BY_SEGMENT_ID[segment.id] ?? `${segment.name}市場`;
}

function buildMarketRows(manufacturerId: ManufacturerId, segment: McbSegment): MarketRow[] {
  const products = getProductsBySegment(manufacturerId, segment.id);

  return products.map((product) => {
    const evidenceItems = segment.rationaleTags
      .map((tag) => resolveEvidenceGroup(product, tag))
      .filter((group): group is MarketEvidenceGroup => Boolean(group));

    const evidenceTagIds = new Set(evidenceItems.map((item) => item.tagId));

    return {
      productId: product.id,
      series: product.series,
      standards: product.comparison.standardsApprovals || "N/A",
      breakingCapacity: product.comparison.breakingCapacity || "N/A",
      ratedCurrent: product.comparison.ratedCurrentIn || "N/A",
      compactTags: segment.rationaleTags.map((tag) => ({
        tagId: tag.id,
        tagValue: tag.value,
        hasEvidence: evidenceTagIds.has(tag.id)
      })),
      evidenceItems
    };
  });
}

function getDefaultFocus(rows: MarketRow[]): { productId: string; tagId: string } | null {
  for (const row of rows) {
    const candidate = row.compactTags.find((tag) => tag.hasEvidence);
    if (candidate) {
      return { productId: row.productId, tagId: candidate.tagId };
    }
  }

  return null;
}

export function buildMarketSections(manufacturerId: ManufacturerId): MarketSection[] {
  const segments = getSegmentsByManufacturer(manufacturerId);

  return segments.map((segment) => {
    const rows = buildMarketRows(manufacturerId, segment);

    return {
      segmentId: segment.id,
      marketName: toMarketName(segment),
      summaryTags: segment.rationaleTags.map((tag) => tag.value),
      defaultFocus: getDefaultFocus(rows),
      rows
    };
  });
}
