import { COMPARISON_ROWS, type ComparisonRowKey, type McbProduct } from "../types/mcb";

type RankMode = "higher" | "lower";

type RankRule = {
  mode: RankMode;
  score: (value: string) => number | null;
};

const RANK_RULES: Partial<Record<ComparisonRowKey, RankRule>> = {
  breakingCapacity: {
    mode: "higher",
    score: (value) => {
      const matches = Array.from(value.matchAll(/(\d+(?:\.\d+)?)\s*kA/gi)).map((match) =>
        Number.parseFloat(match[1])
      );
      if (!matches.length) {
        return null;
      }

      return Math.max(...matches);
    }
  },
  widthPerPole: {
    mode: "lower",
    score: (value) => {
      const match = value.match(/(\d+(?:\.\d+)?)\s*mm/i);
      if (!match) {
        return null;
      }

      return Number.parseFloat(match[1]);
    }
  },
  ratedCurrentIn: {
    mode: "higher",
    score: (value) => {
      const match = value.match(/(\d+(?:\.\d+)?)\s*-\s*(\d+(?:\.\d+)?)\s*A/i);
      if (!match) {
        return null;
      }

      const min = Number.parseFloat(match[1]);
      const max = Number.parseFloat(match[2]);
      return max - min;
    }
  },
  tripCurveCharacteristics: {
    mode: "higher",
    score: (value) => {
      const tokens = Array.from(value.matchAll(/\b(B|C|D|K|Z)\b/gi)).map((match) => match[1].toUpperCase());
      const uniqueCount = new Set(tokens).size;
      return uniqueCount ? uniqueCount : null;
    }
  },
  standardsApprovals: {
    mode: "higher",
    score: (value) => {
      const tokens = value
        .split(/[,+/]/)
        .map((token) => token.trim())
        .filter(Boolean)
        .map((token) => token.toUpperCase());
      const uniqueCount = new Set(tokens).size;
      return uniqueCount ? uniqueCount : null;
    }
  }
};

export function getBestProductsByRow(comparedProducts: McbProduct[]): Record<ComparisonRowKey, Set<string>> {
  const initial = COMPARISON_ROWS.reduce(
    (accumulator, row) => ({ ...accumulator, [row.key]: new Set<string>() }),
    {} as Record<ComparisonRowKey, Set<string>>
  );

  for (const row of COMPARISON_ROWS) {
    const rule = RANK_RULES[row.key];
    if (!rule) {
      continue;
    }

    const scored = comparedProducts
      .map((product) => ({
        id: product.id,
        score: rule.score(product.comparison[row.key])
      }))
      .filter((item): item is { id: string; score: number } => item.score !== null && Number.isFinite(item.score));

    if (!scored.length) {
      continue;
    }

    const bestScore =
      rule.mode === "higher"
        ? Math.max(...scored.map((item) => item.score))
        : Math.min(...scored.map((item) => item.score));

    for (const item of scored) {
      if (item.score === bestScore) {
        initial[row.key].add(item.id);
      }
    }
  }

  return initial;
}
