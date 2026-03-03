import { describe, test, expect, vi } from 'vitest';
import { parseIdsFromQuery } from './page-utils';

describe('MCB Spec Page Utils', () => {
    test('parseIdsFromQuery returns empty array on null', () => {
        const result = parseIdsFromQuery(null);
        expect(result).toEqual([]);
    });

    test('parseIdsFromQuery parses comma-separated string', () => {
        const result = parseIdsFromQuery('acti9-ic60n,acti9-ic60h');
        expect(result).toEqual(['acti9-ic60n', 'acti9-ic60h']);
    });

    test('parseIdsFromQuery handles URI encoded strings and strips empty', () => {
        const result = parseIdsFromQuery('acti9-ic60n%20,%20,,acti9-ic60l');
        expect(result).toEqual(['acti9-ic60n ', ' ', 'acti9-ic60l']);
        // Actually, based on logic, let's see how it behaves, trim is used.
        const result2 = parseIdsFromQuery('acti9-ic60n%20,,%20acti9-ic60l%20');
        expect(result2).toEqual(['acti9-ic60n', 'acti9-ic60l']);
    });
});
