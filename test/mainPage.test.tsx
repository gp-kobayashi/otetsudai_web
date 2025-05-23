import { describe, expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import Home from "../app/page";

describe(Home, () => {
  test("初期レンダリングが行われる", () => {
    render(<Home />);
    expect(screen.getByText("お手伝いをしましょう")).toBeInTheDocument();
  });
});
