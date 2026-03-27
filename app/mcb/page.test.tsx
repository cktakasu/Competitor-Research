import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import McbPage from "./page";
import { useMcbStore } from "../../src/stores/mcbStore";

const pushMock = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: pushMock
  })
}));

describe("McbPage ABB flow", () => {
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
  });

  test("shows ABB market sections and navigates to ABB specs after selection", () => {
    render(<McbPage />);

    fireEvent.click(screen.getByLabelText("ABB"));

    expect(screen.getByText("S200")).toBeDefined();
    expect(screen.getByText("SN201")).toBeDefined();

    fireEvent.click(screen.getAllByText("Select")[0]);
    fireEvent.click(screen.getByRole("button", { name: /View Specs \(1\)/ }));

    expect(pushMock).toHaveBeenCalledWith("/mcb/spec?ids=abb-s200");
  }, 10000);

  test("shows Eaton market sections after selection", () => {
    render(<McbPage />);

    fireEvent.click(screen.getByLabelText("EATON"));

    expect(screen.getByText("Coverage Note")).toBeDefined();
    expect(screen.getByText(/PV \/ renewables MCB line/i)).toBeDefined();
    expect(screen.queryByText("PV / Renewables")).toBeNull();
    expect(screen.getByText("PL6")).toBeDefined();
    expect(screen.getByText("PLHT")).toBeDefined();
    expect(screen.getByText("FAZ")).toBeDefined();
    expect(screen.getAllByText("IEC/EN 60898-1").length).toBeGreaterThan(0);
    expect(screen.getAllByText("10-15kA").length).toBeGreaterThan(0);
  }, 10000);
});
