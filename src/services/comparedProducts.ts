export const MAX_COMPARE_PRODUCTS = 5;

export function normalizeComparedProductIds(
  productIds: Iterable<string>,
  isValid: (id: string) => boolean = () => true,
  limit = MAX_COMPARE_PRODUCTS
): string[] {
  const normalized: string[] = [];
  const seen = new Set<string>();

  for (const rawId of productIds) {
    const id = rawId.trim();
    if (!id || seen.has(id) || !isValid(id)) {
      continue;
    }

    seen.add(id);
    normalized.push(id);
    if (normalized.length === limit) {
      break;
    }
  }

  return normalized;
}

export function comparedProductIdsMatch(left: string[], right: string[]): boolean {
  return left.length === right.length && left.every((id, index) => id === right[index]);
}
