import { describe, expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import Navigation from "@/components/navigation/navigation";

describe("Navigation Component", () => {
  test("コンポーネントが正しくレンダリングされる", () => {
    render(<Navigation />);
    expect(
      screen.getByRole("heading", { name: "otetsudai" }),
    ).toBeInTheDocument();
    expect(screen.getByText("募集する")).toBeInTheDocument();
    expect(screen.getByText("help")).toBeInTheDocument();
    expect(screen.getByText("ログイン")).toBeInTheDocument();
  });
});
