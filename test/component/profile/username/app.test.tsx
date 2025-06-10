import { describe, expect, test, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import InsertUserNameApp from "@/components/profiles/username/app";
import userEvent from "@testing-library/user-event";

describe("InsertUserNameApp Component", () => {
  test("コンポーネントが正しくレンダリングされる", () => {
    render(<InsertUserNameApp user_id="test_user_id" />);
    expect(screen.getByLabelText("User Name:")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Submit" })).toBeInTheDocument();
  });
  test("初期状態ではsubmitボタンが無効", () => {
    render(<InsertUserNameApp user_id="test_user_id" />);
    const button = screen.getByRole("button", { name: "Submit" });
    expect(button).toBeDisabled();
  });
  test("有効なユーザー名を入力するとsubmitボタンが有効になる", async () => {
    render(<InsertUserNameApp user_id="test_user_id" />);

    const input = screen.getByLabelText("User Name:");
    const button = screen.getByRole("button", { name: "Submit" });
    expect(button).toBeDisabled();

    await userEvent.type(input, "testuser");

    await waitFor(() => {
      expect(button).toBeEnabled();
    });
  });
  test("3文字未満のユーザー名を入力するとsubmitボタンが無効のまま", async () => {
    render(<InsertUserNameApp user_id="test_user_id" />);

    const input = screen.getByLabelText("User Name:");
    const button = screen.getByRole("button", { name: "Submit" });
    expect(button).toBeDisabled();

    await userEvent.type(input, "ab");

    await waitFor(() => {
      expect(button).toBeDisabled();
    });
  });
  test("20文字を超えるユーザー名を入力するとsubmitボタンが無効のまま", async () => {
    render(<InsertUserNameApp user_id="test_user_id" />);

    const input = screen.getByLabelText("User Name:");
    const button = screen.getByRole("button", { name: "Submit" });
    expect(button).toBeDisabled();

    await userEvent.type(input, "a".repeat(21));

    await waitFor(() => {
      expect(button).toBeDisabled();
    });
  });
  test("英数字以外の文字を含むユーザー名を入力するとsubmitボタンが無効のまま", async () => {
    render(<InsertUserNameApp user_id="test_user_id" />);

    const input = screen.getByLabelText("User Name:");
    const button = screen.getByRole("button", { name: "Submit" });
    expect(button).toBeDisabled();

    await userEvent.type(input, "テストuser");

    await waitFor(() => {
      expect(button).toBeDisabled();
    });
  });
  test("3文字ちょうどの有効なユーザー名を入力するとsubmitボタンが有効になる", async () => {
    render(<InsertUserNameApp user_id="test_user_id" />);

    const input = screen.getByLabelText("User Name:");
    const button = screen.getByRole("button", { name: "Submit" });
    expect(button).toBeDisabled();

    await userEvent.type(input, "abc");

    await waitFor(() => {
      expect(button).toBeEnabled();
    });
  });
  test("20文字ちょうどの有効なユーザー名を入力するとsubmitボタンが有効になる", async () => {
    render(<InsertUserNameApp user_id="test_user_id" />);

    const input = screen.getByLabelText("User Name:");
    const button = screen.getByRole("button", { name: "Submit" });
    expect(button).toBeDisabled();

    await userEvent.type(input, "a".repeat(20));

    await waitFor(() => {
      expect(button).toBeEnabled();
    });
  });
  test("３文字未満入力時にエラーメッセージが表示される", async () => {
    render(<InsertUserNameApp user_id="test_user_id" />);

    const input = screen.getByLabelText("User Name:");
    await userEvent.type(input, "ab");

    const errorMessage = screen.getByText(
      "ユーザー名は3文字以上で入力してください",
    );
    expect(errorMessage).toBeInTheDocument();
  });
  test("20文字を超える入力時にエラーメッセージが表示される", async () => {
    render(<InsertUserNameApp user_id="test_user_id" />);

    const input = screen.getByLabelText("User Name:");
    await userEvent.type(input, "a".repeat(21));
    const errorMessage = screen.getByText(
      "ユーザー名は20文字以内で入力してください",
    );
    expect(errorMessage).toBeInTheDocument();
  });
  test("英数字以外の文字を含む入力時にエラーメッセージが表示される", async () => {
    render(<InsertUserNameApp user_id="test_user_id" />);

    const input = screen.getByLabelText("User Name:");
    await userEvent.type(input, "テストuser");
    const errorMessage = screen.getByText("ユーザー名は英数字のみ使用できます");
    expect(errorMessage).toBeInTheDocument();
  });
});
