import { describe, expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import InsertUserNameApp from "@/components/profiles/username/app";

const mockProps = {
  user_id: "user_123",
};

describe("InsertUserNameApp Component", () => {
  test("コンポーネントが正しくレンダリングされる", () => {
    render(<InsertUserNameApp {...mockProps} />);
    expect(screen.getByLabelText("User Name:")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Submit" })).toBeInTheDocument();
  });
});
