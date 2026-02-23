export const cx = (...values: Array<string | false | null | undefined>) => values.filter(Boolean).join(" ");

export const MARKET_LABEL_BY_SEGMENT_ID: Record<string, string> = {
  residential: "Residential",
  "commercial-building": "Commercial / Building",
  industrial: "Industrial",
  "oem-machine-building": "OEM / Machine Building",
  "pv-renewables": "PV / Renewables"
};

export const splitSummaryBadgeTag = (tag: string): string[] =>
  /^Curve\s+/i.test(tag.trim())
    ? [tag.trim().replace(/\s*,\s*/g, ", ")]
    : tag
        .split(",")
        .flatMap((part) => part.split("+"))
        .flatMap((part) => {
          const trimmed = part.trim();
          if (!trimmed) {
            return [];
          }
          if (trimmed.includes(" / ") && /^(UL|IEC|EN|CSA|CCC)/.test(trimmed)) {
            return trimmed.split(" / ").map((item) => item.trim()).filter(Boolean);
          }
          return [trimmed];
        });

const badgeOrderRank = (tag: string): number => {
  if (/(IEC|EN|UL|CSA|CCC|Standard)/i.test(tag)) {
    return 0;
  }
  if (/(^|[^0-9])\d+(\.\d+)?-\d+(\.\d+)?A\b|Rated Current|Current/i.test(tag)) {
    return 1;
  }
  if (/(kA|Breaking|Icu|Icn)/i.test(tag)) {
    return 2;
  }
  if (/Curve/i.test(tag)) {
    return 3;
  }
  return 4;
};

const standardOrderRank = (tag: string): number => {
  if (/^IEC\b/i.test(tag)) {
    return 0;
  }
  if (/^EN\b/i.test(tag)) {
    return 1;
  }
  if (/^UL\b/i.test(tag)) {
    return 2;
  }
  if (/^CSA\b/i.test(tag)) {
    return 3;
  }
  if (/^CCC\b/i.test(tag)) {
    return 4;
  }
  if (/Standard/i.test(tag)) {
    return 5;
  }
  return 9;
};

export const compareTagLabel = (a: string, b: string): number => {
  const rankDiff = badgeOrderRank(a) - badgeOrderRank(b);
  if (rankDiff !== 0) {
    return rankDiff;
  }
  if (badgeOrderRank(a) === 0) {
    const standardRankDiff = standardOrderRank(a) - standardOrderRank(b);
    if (standardRankDiff !== 0) {
      return standardRankDiff;
    }
  }
  return a.localeCompare(b);
};

export const sortBadgeTags = (tags: string[]): string[] => [...tags].sort(compareTagLabel);

export const normalizeTagKey = (tag: string): string =>
  tag
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/\s*-\s*/g, "-")
    .trim();

export const dedupeTags = (tags: string[]): string[] => {
  const uniqueByKey = Array.from(
    new Map(tags.map((tag) => [normalizeTagKey(tag), tag.trim()])).values()
  ).filter(Boolean);

  return uniqueByKey.filter((candidate) => {
    const candidateKey = normalizeTagKey(candidate);
    return !uniqueByKey.some((other) => {
      if (other === candidate) {
        return false;
      }
      const otherKey = normalizeTagKey(other);
      return otherKey.includes(candidateKey) && otherKey.length > candidateKey.length;
    });
  });
};

export const formatTagLabel = (tag: string): string => tag.trim();

export const formatBreakingCapacityValue = (value: string): string => value.replace(/\s*;\s*/g, "\n");

export const formatStandardsValue = (value: string): string => {
  const normalized = value.replace(/\s*;\s*/g, ", ").replace(/\s+/g, " ").trim();
  const parts = normalized
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);

  if (parts.length <= 1) {
    return normalized;
  }
  if (parts.length === 2) {
    return `${parts[0]}\n${parts[1]}`;
  }

  const midpoint = Math.ceil(parts.length / 2);
  return `${parts.slice(0, midpoint).join(", ")}\n${parts.slice(midpoint).join(", ")}`;
};
