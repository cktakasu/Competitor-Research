import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import McbPage from "./page";
import { useMcbStore } from "../../src/stores/mcbStore";
import type { Manufacturer, ManufacturerId, McbProduct, McbSegment } from "../../src/types/mcb";

const { pushMock, mockManufacturers, mockProductsById, mockSegmentsByManufacturer } = vi.hoisted(() => ({
  pushMock: vi.fn(),
  mockManufacturers: [
    {
      id: "schneider-electric",
      name: "Schneider Electric",
      logoUrl: "/logos/schneider-electric.svg",
      enabled: true,
      statusLabel: "Available"
    },
    {
      id: "ls-electric",
      name: "LS Electric",
      logoUrl: "/logos/ls-electric.png",
      enabled: true,
      statusLabel: "Available"
    }
  ] as Manufacturer[],
  mockProductsById: {
    "schneider-product": {
      id: "schneider-product",
      manufacturerId: "schneider-electric",
      segmentId: "residential",
      series: "Resi9",
      comparison: {
        capacityClass: "Standard",
        ratedCurrentIn: "6-63A",
        breakingCapacity: "6kA",
        tripCurveCharacteristics: "B, C",
        numberOfPoles: "1P",
        ratedVoltageUe: "230V",
        ratedInsulationVoltageUi: "500V",
        standardsApprovals: "IEC 60898-1",
        widthPerPole: "18mm",
        serviceBreakingCapacityIcs: "100% Icn"
      },
      specifications: [{ label: "Standards", value: "IEC 60898-1" }]
    },
    "ls-product": {
      id: "ls-product",
      manufacturerId: "ls-electric",
      segmentId: "residential",
      series: "BKN",
      comparison: {
        capacityClass: "Standard",
        ratedCurrentIn: "6-63A",
        breakingCapacity: "6kA",
        tripCurveCharacteristics: "B, C",
        numberOfPoles: "1P",
        ratedVoltageUe: "230V",
        ratedInsulationVoltageUi: "500V",
        standardsApprovals: "IEC 60898-1",
        widthPerPole: "18mm",
        serviceBreakingCapacityIcs: "100% Icn"
      },
      specifications: [{ label: "Standards", value: "IEC 60898-1" }]
    }
  } as Record<string, McbProduct>,
  mockSegmentsByManufacturer: {
    "schneider-electric": [
      {
        id: "residential",
        manufacturerId: "schneider-electric",
        name: "Residential",
        icon: "home",
        productIds: ["schneider-product"],
        rationaleTags: []
      }
    ],
    abb: [],
    siemens: [],
    eaton: [],
    "ls-electric": [
      {
        id: "residential",
        manufacturerId: "ls-electric",
        name: "Residential",
        icon: "home",
        productIds: ["ls-product"],
        rationaleTags: []
      }
    ]
  } as Record<ManufacturerId, McbSegment[]>
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: pushMock })
}));

vi.mock("next/link", () => ({
  default: ({ children, href }: { children: ReactNode; href: string }) => <a href={href}>{children}</a>
}));

vi.mock("../../src/services/dataService", () => ({
  getManufacturers: () => mockManufacturers,
  getProductById: (productId: string) => mockProductsById[productId],
  getProductsBySegment: (manufacturerId: ManufacturerId, segmentId: string) =>
    Object.values(mockProductsById).filter(
      (product) => product.manufacturerId === manufacturerId && product.segmentId === segmentId
    ),
  getSegmentsByManufacturer: (manufacturerId: ManufacturerId) => mockSegmentsByManufacturer[manufacturerId] ?? []
}));

vi.mock("../../src/services/marketViewService", () => ({
  buildMarketSections: (manufacturerId: ManufacturerId) =>
    (mockSegmentsByManufacturer[manufacturerId] ?? []).map((segment) => ({
      segmentId: segment.id,
      marketName: segment.name,
      summaryTags: [],
      defaultFocus: null,
      rows: segment.productIds.map((productId) => ({
        productId,
        series: mockProductsById[productId].series,
        standards: mockProductsById[productId].comparison.standardsApprovals,
        breakingCapacity: mockProductsById[productId].comparison.breakingCapacity,
        ratedCurrent: mockProductsById[productId].comparison.ratedCurrentIn,
        compactTags: [],
        evidenceItems: []
      }))
    }))
}));

vi.mock("../../src/components/mcb/Sidebar", () => ({
  Sidebar: () => null
}));

vi.mock("../../src/components/mcb/PageFooter", () => ({
  PageFooter: () => null
}));

describe("McbPage behavior", () => {
  beforeEach(() => {
    pushMock.mockReset();
    useMcbStore.setState({
      selectedManufacturerId: "schneider-electric",
      expandedSegmentIds: [],
      comparedProductIds: []
    });
  });

  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  test("increments selected count and routes to spec page", async () => {
    render(<McbPage />);

    expect(screen.getByRole("button", { name: /仕様を比較/i }).textContent).toContain("(0)");

    fireEvent.click(screen.getAllByRole("button", { name: "選択" })[0]);

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /仕様を比較/i }).textContent).toContain("(1)");
    });

    fireEvent.click(screen.getByRole("button", { name: /仕様を比較/i }));

    expect(pushMock).toHaveBeenCalledWith("/mcb/spec?ids=schneider-product");
  });
});
