import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import McbSpecPage from "./page";
import { useMcbStore } from "../../../src/stores/mcbStore";

const searchParamsMock = {
  get: vi.fn()
};

vi.mock("next/navigation", () => ({
  useSearchParams: () => searchParamsMock
}));

describe("McbSpecPage Eaton UI", () => {
  beforeEach(() => {
    searchParamsMock.get.mockReturnValue("eaton-plht,eaton-faz");
    useMcbStore.setState({
      selectedManufacturerId: "eaton",
      expandedSegmentIds: [],
      comparedProductIds: ["eaton-plht", "eaton-faz"]
    });
  });

  afterEach(() => {
    cleanup();
    searchParamsMock.get.mockReset();
  });

  test("renders Eaton summary, variant detail, rationale panel, and notes", async () => {
    render(<McbSpecPage />);

    expect(screen.getByText("Coverage Note")).toBeDefined();
    expect(screen.getByText(/not for PV string protection/i)).toBeDefined();
    expect((await screen.findAllByText("Family Summary")).length).toBeGreaterThanOrEqual(2);
    expect(screen.getAllByText("EATON").length).toBeGreaterThan(0);

    fireEvent.click(screen.getByRole("button", { name: /Show Variant Detail \(4\)/i }));

    expect(screen.getAllByText("Variant Detail").length).toBeGreaterThan(0);
    expect(screen.getByText("PLHT-V high-inrush line")).toBeDefined();
    expect(screen.getByText("FAZ K/S/Z industrial line")).toBeDefined();

    fireEvent.click(screen.getByRole("button", { name: /Rationale Details/i }));

    expect(screen.getAllByText("IEC/EN 60947-2").length).toBeGreaterThan(0);
    expect(screen.getAllByText("10-15kA").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Ics 7.5kA").length).toBeGreaterThan(0);

    fireEvent.click(screen.getByRole("button", { name: /Product Notes/i }));

    expect(screen.getByText("Variant split required")).toBeDefined();
    expect(screen.getByText("Do not merge standard families")).toBeDefined();
  }, 10000);
});
