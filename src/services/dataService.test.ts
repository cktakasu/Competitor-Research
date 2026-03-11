import { describe, test, expect } from 'vitest';
import { getManufacturers, getSegmentsByManufacturer, getProductById } from './dataService';

describe('dataService', () => {
    test('getManufacturers returns an array of manufacturers', () => {
        const manufacturers = getManufacturers();
        expect(manufacturers.length).toBeGreaterThan(0);
        expect(manufacturers.find((m) => m.id === 'schneider-electric')).toBeDefined();
    });

    test('getSegmentsByManufacturer returns segments for valid manufacturer', () => {
        const segments = getSegmentsByManufacturer('schneider-electric');
        expect(segments.length).toBeGreaterThan(0);
        expect(segments.some((s) => s.id === 'residential')).toBe(true);
    });

    test('getProductById retrieves a valid product', () => {
        const product = getProductById('acti9-ic60n');
        expect(product).toBeDefined();
        expect(product?.series).toBe('Acti9 iC60N');
    });

    test('getProductById returns undefined for unknown id', () => {
        const product = getProductById('unknown');
        expect(product).toBeUndefined();
    });
});
