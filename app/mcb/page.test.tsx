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
});
