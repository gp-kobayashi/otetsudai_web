import { describe, expect, test, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import RecruitmentForm from "@/components/recruitment/create/form";

const mockProps = {
  user_id: "user12345",
};

describe("RecruitmentForm Component", () => {
  test("フォームが正しくレンダリングされる", () => {
    render(<RecruitmentForm {...mockProps} />);
    expect(screen.getByLabelText("タイトル:")).toBeInTheDocument();
    expect(screen.getByLabelText("内容:")).toBeInTheDocument();
    expect(screen.getByLabelText("カテゴリー:")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "募集する" }),
    ).toBeInTheDocument();
  });

  test("初期状態でタイトル、内容、カテゴリーが空である", () => {
    render(<RecruitmentForm {...mockProps} />);
    expect(screen.getByLabelText("タイトル:")).toHaveValue("");
    expect(screen.getByLabelText("内容:")).toHaveValue("");
    expect(screen.getByLabelText("カテゴリー:")).toHaveValue("Video");
  });
  test("タイトルと内容が入力されていない場合、アラートが表示される", () => {
    render(<RecruitmentForm {...mockProps} />);
    window.alert = vi.fn();
    const submitButton = screen.getByRole("button", { name: "募集する" });
    submitButton.click();
    expect(window.alert).toHaveBeenCalledWith("タイトルと内容は必須です");
  });
});
