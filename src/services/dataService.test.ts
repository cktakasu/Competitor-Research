import { describe, test, expect } from 'vitest';
import { getManufacturers, getProductsByManufacturer, getSegmentsByManufacturer, getProductById } from './dataService';

describe('dataService', () => {
    test('getManufacturers returns an array of manufacturers', () => {
        const manufacturers = getManufacturers();
        expect(manufacturers.length).toBeGreaterThan(0);
        expect(manufacturers.find((m) => m.id === 'schneider-electric')).toBeDefined();
        expect(manufacturers.find((m) => m.id === 'abb' && m.enabled)).toBeDefined();
        expect(manufacturers.find((m) => m.id === 'eaton' && m.enabled)).toBeDefined();
    });

    test('getSegmentsByManufacturer returns segments for valid manufacturer', () => {
        const segments = getSegmentsByManufacturer('schneider-electric');
        expect(segments.length).toBeGreaterThan(0);
        expect(segments.some((s) => s.id === 'residential')).toBe(true);
    });

    test('getSegmentsByManufacturer returns ABB market segments', () => {
        const segments = getSegmentsByManufacturer('abb');
        expect(segments.length).toBeGreaterThan(0);
        expect(segments.some((s) => s.id === 'commercial-building')).toBe(true);
    });

    test('getSegmentsByManufacturer returns Eaton market segments without PV', () => {
        const segments = getSegmentsByManufacturer('eaton');
        expect(segments).toHaveLength(5);
        expect(segments.some((s) => s.id === 'industrial')).toBe(true);
        expect(segments.some((s) => s.id === 'pv-renewables')).toBe(false);
    });

    test('getProductsByManufacturer returns ABB and Eaton products while Siemens stays empty', () => {
        expect(getProductsByManufacturer('abb').length).toBeGreaterThan(0);
        expect(getProductsByManufacturer('eaton').length).toBeGreaterThan(0);
        expect(getProductsByManufacturer('siemens')).toEqual([]);
    });

    test('getProductById retrieves a valid product', () => {
        const product = getProductById('acti9-ic60n');
        expect(product).toBeDefined();
        expect(product?.series).toBe('Acti9 iC60N');
    });

    test('getProductById retrieves an ABB product', () => {
        const product = getProductById('abb-s300-p');
        expect(product).toBeDefined();
        expect(product?.series).toBe('S300 P');
    });

    test('getProductById retrieves an Eaton product', () => {
        const product = getProductById('eaton-faz');
        expect(product).toBeDefined();
        expect(product?.series).toBe('FAZ');
    });

    test('getProductById exposes structured notes for ABB family summaries', () => {
        const product = getProductById('abb-s800');
        expect(product?.notes?.length).toBeGreaterThan(0);
        expect(product?.notes?.[0].title).toBe('Family summary coverage');
    });

    test('getProductById returns undefined for unknown id', () => {
        const product = getProductById('unknown');
        expect(product).toBeUndefined();
    });
});
