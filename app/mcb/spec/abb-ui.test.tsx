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

describe("McbSpecPage ABB UI", () => {
  beforeEach(() => {
    searchParamsMock.get.mockReturnValue("abb-s200,abb-s300-p");
    useMcbStore.setState({
      selectedManufacturerId: "abb",
      expandedSegmentIds: [],
      comparedProductIds: ["abb-s200", "abb-s300-p"]
    });
  });

  afterEach(() => {
    cleanup();
    searchParamsMock.get.mockReset();
  });

  test("renders ABB family summary, variant detail, and rationale panel content", async () => {
    render(<McbSpecPage />);

    expect((await screen.findAllByText("Family Summary")).length).toBeGreaterThanOrEqual(2);
    fireEvent.click(screen.getByRole("button", { name: /Show Variant Detail \(2\)/i }));

    expect(screen.getAllByText("Variant Detail").length).toBeGreaterThan(0);
    expect(screen.getByText("S200 IEC/EN 60898-1 line")).toBeDefined();
    expect(screen.getAllByText("S300 P").length).toBeGreaterThan(0);

    fireEvent.click(screen.getByRole("button", { name: /Rationale Details/i }));

    expect(screen.getAllByText("IEC/EN 60898-1").length).toBeGreaterThan(0);
    expect(screen.getByText("25kA Icu")).toBeDefined();

    fireEvent.click(screen.getByRole("button", { name: /Product Notes/i }));

    expect(screen.getAllByText("Family summary coverage").length).toBeGreaterThan(0);
  }, 10000);

  test("adds an ABB product from the add modal", async () => {
    render(<McbSpecPage />);

    fireEvent.click(screen.getAllByRole("button", { name: /Add Product/i })[0]);

    const [manufacturerSelect, seriesSelect] = screen.getAllByRole("combobox");

    fireEvent.change(manufacturerSelect, { target: { value: "abb" } });
    fireEvent.change(seriesSelect, { target: { value: "abb-s800" } });
    fireEvent.click(screen.getByRole("button", { name: /Add to Compare/i }));

    expect((await screen.findAllByText("S800")).length).toBeGreaterThan(0);
  }, 10000);
});
