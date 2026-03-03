export function parseIdsFromQuery(value: string | null): string[] {
    if (!value) {
        return [];
    }

    const safeDecode = (raw: string) => {
        try {
            return decodeURIComponent(raw);
        } catch {
            return raw;
        }
    };

    return value
        .split(",")
        .map((id) => safeDecode(id).trim())
        .filter(Boolean);
}
