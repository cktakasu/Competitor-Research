import { describe, test, expect, beforeEach, vi } from 'vitest';
import { useMcbStore, MAX_COMPARE_PRODUCTS } from './mcbStore';

vi.mock('../services/dataService', () => ({
    getManufacturers: () => [{ id: 'schneider-electric', enabled: true }]
}));

describe('mcbStore', () => {
    beforeEach(() => {
        useMcbStore.setState({
            selectedManufacturerId: 'schneider-electric',
            expandedSegmentIds: [],
            comparedProductIds: []
        });
    });

    test('addComparedProduct adds a product if not exists and below max', () => {
        useMcbStore.getState().addComparedProduct('prod1');
        expect(useMcbStore.getState().comparedProductIds).toEqual(['prod1']);
    });

    test('addComparedProduct does not add duplicates', () => {
        useMcbStore.getState().addComparedProduct('prod1');
        useMcbStore.getState().addComparedProduct('prod1');
        expect(useMcbStore.getState().comparedProductIds).toEqual(['prod1']);
    });

    test('setComparedProducts cleans up and limits to MAX_COMPARE_PRODUCTS', () => {
        useMcbStore.getState().setComparedProducts(['prod1 ', '', ' prod2', 'prod1', 'prod3', 'prod4', 'prod5', 'prod6']);
        const state = useMcbStore.getState();
        expect(state.comparedProductIds).toEqual(['prod1', 'prod2', 'prod3', 'prod4', 'prod5']);
        expect(state.comparedProductIds.length).toBe(MAX_COMPARE_PRODUCTS);
    });
});
