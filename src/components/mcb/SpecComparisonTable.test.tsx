import { describe, test, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SpecComparisonTable } from './SpecComparisonTable';

describe('SpecComparisonTable', () => {
    const mockManufacturerNameById = { 'schneider-electric': 'Schneider Electric' };
    const mockOnOpenAdd = vi.fn();
    const mockOnRemove = vi.fn();
    const mockProducts = [
        {
            id: 'acti9',
            manufacturerId: 'schneider-electric' as const,
            segmentId: 'commercial',
            series: 'Acti9',
            comparison: {
                capacityClass: 'High',
                ratedCurrentIn: '6-63A',
                breakingCapacity: '10kA',
                tripCurveCharacteristics: 'B, C',
                numberOfPoles: '2P',
                ratedVoltageUe: '230V',
                ratedInsulationVoltageUi: '500V',
                standardsApprovals: 'IEC 60898-1',
                widthPerPole: '18mm',
                serviceBreakingCapacityIcs: '100% Icn'
            },
            specifications: []
        }
    ];

    test('renders comparison rows correctly', () => {
        render(
            <SpecComparisonTable
                comparedProducts={mockProducts}
                manufacturerNameById={mockManufacturerNameById}
                onOpenAdd={mockOnOpenAdd}
                onRemove={mockOnRemove}
            />
        );
        expect(screen.getByText('Capacity Class')).toBeDefined();
        expect(screen.getByText('Acti9')).toBeDefined();
    });

    test('calls onOpenAdd when add button is clicked', () => {
        render(
            <SpecComparisonTable
                comparedProducts={mockProducts}
                manufacturerNameById={mockManufacturerNameById}
                onOpenAdd={mockOnOpenAdd}
                onRemove={mockOnRemove}
            />
        );
        const addButton = screen.getByText('Add Product');
        addButton.click();
        expect(mockOnOpenAdd).toHaveBeenCalled();
    });

    test('calls onRemove when remove button is clicked', () => {
        render(
            <SpecComparisonTable
                comparedProducts={mockProducts}
                manufacturerNameById={mockManufacturerNameById}
                onOpenAdd={mockOnOpenAdd}
                onRemove={mockOnRemove}
            />
        );
        const removeButton = screen.getByText('Remove');
        removeButton.click();
        expect(mockOnRemove).toHaveBeenCalledWith('acti9');
    });
});
