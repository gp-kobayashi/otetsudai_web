import { describe, expect, test, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import CommentApp from "@/components/recruitment/comment/CommentApp";

const mockProps = {
  id: 1,
  userId: "user12345",
  username: "testuser",
  avatarUrl: "https://example.com/avatar.png",
};
const mockPropsuserNull = {
  id: 1,
  userId: null,
  username: null,
  avatarUrl: null,
};

describe("CommentApp Component", () => {
  test("コメントアプリが正しくレンダリングされる", async () => {
    render(<CommentApp {...mockProps} />);
    await waitFor(() => {
      expect(screen.getByText("コメントを投稿:")).toBeInTheDocument();
      expect(screen.getByRole("textbox")).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "投稿" })).toBeInTheDocument();
    });
  });

  test("投稿ボタンをクリックするとコメントが追加される", async () => {
    render(<CommentApp {...mockProps} />);
    window.alert = vi.fn();
    const textarea = await screen.findByRole("textbox");
    const button = screen.getByRole("button", { name: "投稿" });
    fireEvent.change(textarea, { target: { value: "テストコメント" } });
    fireEvent.click(button);
    expect(await screen.findByText("テストコメント")).toBeInTheDocument();
  });
  test("ユーザーが未ログインの場合、テキストエリアと投稿ボタンが表示されない", async () => {
    render(<CommentApp {...mockPropsuserNull} />);
    await waitFor(() => {
      expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
      expect(
        screen.queryByRole("button", { name: "投稿" }),
      ).not.toBeInTheDocument();
    });
  });
  test("未ログインの場合にログインとユーザーネーム登録のリンクが表示される", async () => {
    render(<CommentApp {...mockPropsuserNull} />);
    await waitFor(() => {
      const loginLink = screen.getByText("ログイン").closest("a");
      const registerLink = screen.getByText("ユーザーネーム").closest("a");
      expect(loginLink).toHaveAttribute("href", "/login");
      expect(registerLink).toHaveAttribute("href", "/insertUserName");
    });
  });
});
