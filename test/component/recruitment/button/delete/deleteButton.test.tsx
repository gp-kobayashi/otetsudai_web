import { describe, expect, test, vi } from "vitest";
import { render, screen } from "@testing-library/react";

import DeleteButton from "@/components/recruitment/recruitmentBtn/delete/deleteButton";
import userEvent from "@testing-library/user-event";

describe("DeleteButton Component", () => {
  test("削除ボタンが正しくレンダリングされる", () => {
    render(<DeleteButton id={1} />);
    expect(screen.getByRole("button", { name: "削除" })).toBeInTheDocument();
  });

  test("削除ボタンがクリックされたときに確認ダイアログが表示される", async () => {
    const user = userEvent.setup();
    window.confirm = vi.fn(() => true);
    render(<DeleteButton id={1} />);
    const deleteButton = screen.getByRole("button", { name: "削除" });

    await user.click(deleteButton);
    expect(window.confirm).toHaveBeenCalledWith("本当に削除しますか？");
  });
});
