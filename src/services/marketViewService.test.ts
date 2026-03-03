import { describe, test, expect, vi } from 'vitest';
import { buildMarketSections } from './marketViewService';
import * as dataService from './dataService';
import type { McbProduct, McbSegment } from '../types/mcb';

vi.mock('./dataService', () => ({
    getSegmentsByManufacturer: vi.fn(),
    getProductsBySegment: vi.fn(),
}));

describe('marketViewService', () => {
    test('buildMarketSections returns empty array if no segments', () => {
        vi.mocked(dataService.getSegmentsByManufacturer).mockReturnValue([]);
        const result = buildMarketSections('schneider-electric');
        expect(result).toEqual([]);
    });

    test('buildMarketSections returns mapped data correctly', () => {
        const mockSegments: McbSegment[] = [
            {
                id: 'residential',
                manufacturerId: 'schneider-electric',
                name: 'Residential',
                icon: 'home',
                productIds: ['resi9'],
                rationaleTags: [
                    {
                        id: 'tag1',
                        value: 'Value1',
                        reasonJa: 'Reason1',
                        evidenceRefs: [
                            { source: 'comparison', key: 'capacityClass' }
                        ]
                    }
                ]
            }
        ];

        const mockProducts: McbProduct[] = [
            {
                id: 'resi9',
                manufacturerId: 'schneider-electric',
                segmentId: 'residential',
                series: 'Resi9',
                comparison: {
                    capacityClass: 'Standard',
                    ratedCurrentIn: '6-40A',
                    breakingCapacity: '6kA',
                    tripCurveCharacteristics: 'B, C',
                    numberOfPoles: '1P',
                    ratedVoltageUe: '230V',
                    ratedInsulationVoltageUi: '500V',
                    standardsApprovals: 'IEC 60898-1',
                    widthPerPole: '18mm',
                    serviceBreakingCapacityIcs: '100% Icn'
                },
                specifications: []
            }
        ];

        vi.mocked(dataService.getSegmentsByManufacturer).mockReturnValue(mockSegments);
        vi.mocked(dataService.getProductsBySegment).mockReturnValue(mockProducts);

        const result = buildMarketSections('schneider-electric');
        expect(result).toHaveLength(1);
        expect(result[0].segmentId).toBe('residential');
        expect(result[0].marketName).toBe('住宅市場');
        expect(result[0].rows).toHaveLength(1);
        expect(result[0].rows[0].productId).toBe('resi9');
        expect(result[0].rows[0].evidenceItems).toBeDefined();
        expect(result[0].rows[0].evidenceItems[0].tagId).toBe('tag1');
        expect(result[0].defaultFocus).toEqual({ productId: 'resi9', tagId: 'tag1' });
    });

    test('buildMarketSections handles missing evidence gracefully', () => {
        const mockSegments: McbSegment[] = [
            {
                id: 'residential',
                manufacturerId: 'schneider-electric',
                name: 'Residential',
                icon: 'home',
                productIds: ['resi9'],
                rationaleTags: [
                    {
                        id: 'tag1',
                        value: 'Value1',
                        reasonJa: 'Reason1',
                        evidenceRefs: [
                            { source: 'comparison', key: 'capacityClass' }
                        ]
                    }
                ]
            }
        ];

        const mockProducts: McbProduct[] = [
            {
                id: 'resi9',
                manufacturerId: 'schneider-electric',
                segmentId: 'residential',
                series: 'Resi9',
                comparison: {
                    capacityClass: 'N/A', // Trigger N/A fallback
                    ratedCurrentIn: '6-40A',
                    breakingCapacity: '6kA',
                    tripCurveCharacteristics: 'B, C',
                    numberOfPoles: '1P',
                    ratedVoltageUe: '230V',
                    ratedInsulationVoltageUi: '500V',
                    standardsApprovals: 'IEC 60898-1',
                    widthPerPole: '18mm',
                    serviceBreakingCapacityIcs: '100% Icn'
                },
                specifications: []
            }
        ];

        vi.mocked(dataService.getSegmentsByManufacturer).mockReturnValue(mockSegments);
        vi.mocked(dataService.getProductsBySegment).mockReturnValue(mockProducts);

        const result = buildMarketSections('schneider-electric');
        expect(result[0].rows[0].evidenceItems).toHaveLength(0);
        expect(result[0].defaultFocus).toBeNull();
    });
});
