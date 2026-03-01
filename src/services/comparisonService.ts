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
      const rangeMatch = value.match(/(\d+(?:\.\d+)?)\s*-\s*(\d+(?:\.\d+)?)\s*A/i);
      if (rangeMatch) {
        return Number.parseFloat(rangeMatch[2]);
      }

      const singleMatch = value.match(/(\d+(?:\.\d+)?)\s*A/i);
      if (!singleMatch) {
        return null;
      }

      return Number.parseFloat(singleMatch[1]);
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
        .split(/[,+/;|]/)
        .map((token) => token.trim())
        .filter(Boolean)
        .map((token) => token.toUpperCase());
      const uniqueCount = new Set(tokens).size;
      return uniqueCount ? uniqueCount : null;
    }
  }
};

export type ComparisonEntry = {
  id: string; // unique ID for the column (variantId or productId)
  comparison: McbProduct["comparison"];
};

export function getBestProductsByRow(comparedProducts: McbProduct[]): Record<ComparisonRowKey, Set<string>> {
  const initial = {} as Record<ComparisonRowKey, Set<string>>;
  for (const row of COMPARISON_ROWS) {
    initial[row.key] = new Set<string>();
  }

  // Flatten products and variants into entries
  const entries: ComparisonEntry[] = [];
  for (const product of comparedProducts) {
    if (product.variants?.length) {
      for (const variant of product.variants) {
        entries.push({
          id: variant.variantId,
          comparison: variant.comparison,
        });
      }
    } else {
      entries.push({
        id: product.id,
        comparison: product.comparison,
      });
    }
  }

  for (const row of COMPARISON_ROWS) {
    const rule = RANK_RULES[row.key];
    if (!rule) {
      continue;
    }

    const scored: Array<{ id: string; score: number }> = [];
    for (const entry of entries) {
      const rawValue = entry.comparison[row.key];
      if (!rawValue) {
        continue;
      }
      const score = rule.score(rawValue);
      if (score !== null && Number.isFinite(score)) {
        scored.push({ id: entry.id, score });
      }
    }

    if (scored.length === 0) {
      continue;
    }

    let bestScore = scored[0].score;
    for (let i = 1; i < scored.length; i += 1) {
      const current = scored[i].score;
      if (rule.mode === "higher" ? current > bestScore : current < bestScore) {
        bestScore = current;
      }
    }

    for (const item of scored) {
      if (item.score === bestScore) {
        initial[row.key].add(item.id);
      }
    }
  }

  return initial;
}
