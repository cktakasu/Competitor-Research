import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import McbSpecPage from "./page";
import { useMcbStore } from "../../../src/stores/mcbStore";
import type { Manufacturer, ManufacturerId, McbProduct, McbSegment } from "../../../src/types/mcb";

const {
  searchParamsValue,
  mockManufacturers,
  mockProductsById,
  mockSegmentsByManufacturer
}: {
  searchParamsValue: { current: string };
  mockManufacturers: Manufacturer[];
  mockProductsById: Record<string, McbProduct>;
  mockSegmentsByManufacturer: Record<ManufacturerId, McbSegment[]>;
} = vi.hoisted(() => ({
  searchParamsValue: { current: "ids=schneider-product" },
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
  ],
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
      specifications: []
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
      specifications: []
    },
    "schneider-product-2": {
      id: "schneider-product-2",
      manufacturerId: "schneider-electric",
      segmentId: "residential",
      series: "Easy9",
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
      specifications: []
    },
    "ls-product-2": {
      id: "ls-product-2",
      manufacturerId: "ls-electric",
      segmentId: "residential",
      series: "BK63N",
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
      specifications: []
    },
    "schneider-product-3": {
      id: "schneider-product-3",
      manufacturerId: "schneider-electric",
      segmentId: "residential",
      series: "Domae",
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
      specifications: []
    }
  },
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
  }
}));

vi.mock("next/navigation", () => ({
  useSearchParams: () => new URLSearchParams(searchParamsValue.current)
}));

vi.mock("next/link", () => ({
  default: ({ children, href }: { children: ReactNode; href: string }) => <a href={href}>{children}</a>
}));

vi.mock("../../../src/services/dataService", () => ({
  getManufacturers: () => mockManufacturers,
  getProductById: (productId: string) => mockProductsById[productId],
  getProductsByManufacturer: (manufacturerId: ManufacturerId) =>
    Object.values(mockProductsById).filter((product) => product.manufacturerId === manufacturerId),
  getProductsBySegment: (manufacturerId: ManufacturerId, segmentId: string) =>
    Object.values(mockProductsById).filter(
      (product) => product.manufacturerId === manufacturerId && product.segmentId === segmentId
    ),
  getSegmentsByManufacturer: (manufacturerId: ManufacturerId) => mockSegmentsByManufacturer[manufacturerId] ?? []
}));

vi.mock("../../../src/services/marketViewService", () => ({
  buildMarketSections: () => []
}));

vi.mock("../../../src/components/mcb/Sidebar", () => ({
  Sidebar: () => null
}));

vi.mock("../../../src/components/mcb/PageFooter", () => ({
  PageFooter: () => null
}));

vi.mock("../../../src/components/mcb/EmptyState", () => ({
  EmptyState: ({ message, children }: { message: string; children?: ReactNode }) => (
    <div>
      <span>{message}</span>
      {children}
    </div>
  )
}));

vi.mock("../../../src/components/mcb/RationalePanel", () => ({
  RationalePanel: () => <div>RationalePanel</div>
}));

vi.mock("../../../src/components/mcb/SpecComparisonTable", () => ({
  SpecComparisonTable: ({ comparedProducts }: { comparedProducts: McbProduct[] }) => (
    <div>{comparedProducts.map((product) => product.series).join(", ")}</div>
  )
}));

vi.mock("../../../src/components/mcb/TopBar", () => ({
  TopBar: ({
    actions,
    manufacturers,
    onSelectManufacturer,
    selectedManufacturerId,
    title
  }: {
    actions: ReactNode;
    manufacturers: Manufacturer[];
    onSelectManufacturer: (manufacturer: Manufacturer) => void;
    selectedManufacturerId: ManufacturerId;
    title: string;
  }) => (
    <div>
      <div>{title}</div>
      <div data-testid="selected-manufacturer">{selectedManufacturerId}</div>
      {manufacturers.map((manufacturer) => (
        <button
          key={manufacturer.id}
          type="button"
          onClick={() => onSelectManufacturer(manufacturer)}
        >
          {manufacturer.name}
        </button>
      ))}
      {actions}
    </div>
  )
}));

describe("McbSpecPage behavior", () => {
  beforeEach(() => {
    searchParamsValue.current = "ids=schneider-product";
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

  test("keeps user-selected manufacturer even when compared products belong to another manufacturer", async () => {
    render(<McbSpecPage />);

    await waitFor(() => {
      expect(screen.getByTestId("selected-manufacturer").textContent).toBe("schneider-electric");
    });

    fireEvent.click(screen.getByRole("button", { name: "LS Electric" }));

    await waitFor(() => {
      expect(screen.getByTestId("selected-manufacturer").textContent).toBe("ls-electric");
    });

    expect(screen.getByText("選定根拠は現在 Schneider Electric ビューでのみ表示されます。")).toBeDefined();
    expect(screen.getByText("現在の表示: LS Electric")).toBeDefined();
  });

  test("closes add modal after a product is added", async () => {
    render(<McbSpecPage />);

    await waitFor(() => {
      expect(screen.getByText("Resi9")).toBeDefined();
    });

    fireEvent.click(screen.getAllByRole("button", { name: /製品を追加/ })[0]);

    const selects = screen.getAllByRole("combobox");
    fireEvent.change(selects[0], { target: { value: "ls-electric" } });
    fireEvent.change(selects[1], { target: { value: "ls-product" } });
    fireEvent.click(screen.getByRole("button", { name: "比較に追加" }));

    await waitFor(() => {
      expect(screen.queryByRole("button", { name: "比較に追加" })).toBeNull();
    });

    expect(screen.getByText("Resi9, BKN")).toBeDefined();
  });

  test("closes add modal when cancel is pressed", async () => {
    render(<McbSpecPage />);

    fireEvent.click(screen.getAllByRole("button", { name: /製品を追加/ })[0]);
    expect(screen.getByRole("button", { name: /キャンセル/ })).toBeDefined();

    fireEvent.click(screen.getByRole("button", { name: /キャンセル/ }));

    await waitFor(() => {
      expect(screen.queryByRole("button", { name: /キャンセル/ })).toBeNull();
    });
  });

  test("shows compare limit guidance when the comparison set is full", async () => {
    searchParamsValue.current = "";
    useMcbStore.setState({
      selectedManufacturerId: "schneider-electric",
      expandedSegmentIds: [],
      comparedProductIds: ["schneider-product", "ls-product", "schneider-product-2", "ls-product-2", "schneider-product-3"]
    });

    render(<McbSpecPage />);

    fireEvent.click(screen.getAllByRole("button", { name: /製品を追加/ })[0]);

    expect(
      screen.getByText("比較上限に達しています。追加する前に既存の製品を削除してください。")
    ).toBeDefined();
    expect(screen.getByRole("button", { name: "比較に追加" }).hasAttribute("disabled")).toBe(true);
  });
});
