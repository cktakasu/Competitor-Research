import { afterEach, describe, expect, test, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { SpecComparisonTable } from "./SpecComparisonTable";

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe("SpecComparisonTable", () => {
  const mockManufacturerNameById = { "schneider-electric": "Schneider Electric" };
  const mockOnOpenAdd = vi.fn();
  const mockOnRemove = vi.fn();
  const mockProducts = [
    {
      id: "acti9",
      manufacturerId: "schneider-electric" as const,
      segmentId: "commercial",
      series: "Acti9",
      comparison: {
        capacityClass: "High",
        ratedCurrentIn: "6-63A",
        breakingCapacity: "10kA",
        tripCurveCharacteristics: "B, C",
        numberOfPoles: "2P",
        ratedVoltageUe: "230V",
        ratedInsulationVoltageUi: "500V",
        standardsApprovals: "IEC 60898-1",
        widthPerPole: "18mm",
        serviceBreakingCapacityIcs: "100% Icn"
      },
      specifications: []
    }
  ];

  test("renders comparison rows correctly", () => {
    render(
      <SpecComparisonTable
        comparedProducts={mockProducts}
        manufacturerNameById={mockManufacturerNameById}
        onOpenAdd={mockOnOpenAdd}
        onRemove={mockOnRemove}
      />
    );

    expect(screen.getByText("Capacity Class")).toBeDefined();
    expect(screen.getAllByText("Acti9").length).toBeGreaterThan(0);
  });

  test("calls onOpenAdd when add button is clicked", () => {
    render(
      <SpecComparisonTable
        comparedProducts={mockProducts}
        manufacturerNameById={mockManufacturerNameById}
        onOpenAdd={mockOnOpenAdd}
        onRemove={mockOnRemove}
      />
    );

    screen.getByText("Add Product").click();
    expect(mockOnOpenAdd).toHaveBeenCalled();
  });

  test("calls onRemove when remove button is clicked", () => {
    render(
      <SpecComparisonTable
        comparedProducts={mockProducts}
        manufacturerNameById={mockManufacturerNameById}
        onOpenAdd={mockOnOpenAdd}
        onRemove={mockOnRemove}
      />
    );

    screen.getByText("Remove").click();
    expect(mockOnRemove).toHaveBeenCalledWith("acti9");
  });

  test("renders variant labels as separate comparison columns", () => {
    render(
      <SpecComparisonTable
        comparedProducts={[
          {
            ...mockProducts[0],
            variants: [
              {
                variantId: "acti9-6ka",
                variantLabel: "Acti9 6kA family",
                comparison: mockProducts[0].comparison
              },
              {
                variantId: "acti9-10ka",
                variantLabel: "Acti9 10kA family",
                comparison: {
                  ...mockProducts[0].comparison,
                  breakingCapacity: "10kA"
                }
              }
            ]
          }
        ]}
        manufacturerNameById={mockManufacturerNameById}
        onOpenAdd={mockOnOpenAdd}
        onRemove={mockOnRemove}
      />
    );

    expect(screen.getAllByText("Family Summary").length).toBeGreaterThan(0);
    expect(screen.queryByText("Acti9 6kA family")).toBeNull();
    expect(screen.queryByText("Acti9 10kA family")).toBeNull();

    fireEvent.click(screen.getByRole("button", { name: /Show Variant Detail \(2\)/i }));

    expect(screen.getAllByText("Variant Detail").length).toBeGreaterThan(0);
    expect(screen.getByText("Acti9 6kA family")).toBeDefined();
    expect(screen.getByText("Acti9 10kA family")).toBeDefined();
  });
});
