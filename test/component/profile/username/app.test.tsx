import { describe, expect, test, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import InsertUserNameApp from "@/components/profiles/username/app";
import userEvent from "@testing-library/user-event";

// router.push()の呼び出しを検証するためのモック関数
const mockPush = vi.fn();
// Next.jsのuseRouterをモック化してrouterの動作を制御
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

// insertUsername関数をモック化してデータベースアクセスを無効化
vi.mock("@/lib/supabase_function/profile", () => ({
  insertUsername: vi.fn(),
}));

// モック関数のインスタンスを保持する変数
let mockInsertUsername: ReturnType<typeof vi.fn>;

// 各テスト前にモック呼び出し履歴をクリア
beforeEach(() => {
  vi.clearAllMocks();
});

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

  test("空文字を入力するとsubmitボタンが無効になり、エラーメッセージが表示される", async () => {
    render(<InsertUserNameApp user_id="test_user_id" />);

    const input = screen.getByLabelText("User Name:");
    const button = screen.getByRole("button", { name: "Submit" });
    expect(button).toBeDisabled();

    await userEvent.type(input, "abc");
    await userEvent.clear(input);

    await waitFor(() => {
      expect(button).toBeDisabled();
      expect(
        screen.getByText("ユーザー名は3文字以上で入力してください"),
      ).toBeInTheDocument();
    });
  });

  test("spaceのみの入力時にsubmitボタンが無効になる", async () => {
    render(<InsertUserNameApp user_id="test_user_id" />);

    const input = screen.getByLabelText("User Name:");
    const button = screen.getByRole("button", { name: "Submit" });
    expect(button).toBeDisabled();

    await userEvent.type(input, "   ");

    await waitFor(() => {
      expect(button).toBeDisabled();
    });
  });

  test("有効なユーザー名でフォーム送信が成功する", async () => {
    // insertUsername関数のモックを初期化
    const { insertUsername } = await import("@/lib/supabase_function/profile");
    mockInsertUsername = vi.mocked(insertUsername);

    // insertUsername関数が成功レスポンスを返すように設定
    mockInsertUsername.mockResolvedValue({ data: null, error: null });

    // ユーザーイベント操作用のセットアップ
    const user = userEvent.setup();
    render(<InsertUserNameApp user_id="test_user_id" />);
    const input = screen.getByLabelText("User Name:");
    const button = screen.getByRole("button", { name: "Submit" });
    await user.type(input, "validuser");
    await user.click(button);

    await waitFor(() => {
      expect(mockInsertUsername).toHaveBeenCalledWith(
        "test_user_id",
        "validuser",
      );
      expect(mockPush).toHaveBeenCalledWith("/account");
    });
  });
});

test("重複ユーザー名エラー時にアラートが表示される", async () => {
  // insertUsername関数のモックを初期化
  const { insertUsername } = await import("@/lib/supabase_function/profile");
  mockInsertUsername = vi.mocked(insertUsername);

  // window.alertを監視用の偽物に置換
  const alertSpy = vi.spyOn(window, "alert").mockImplementation(() => {});

  // insertUsername関数がエラーレスポンスを返すように設定
  mockInsertUsername.mockResolvedValue({
    data: null,
    error: { message: "duplicate key value violates unique constraint" },
  });

  // ユーザーイベント操作用のセットアップ
  const user = userEvent.setup();
  render(<InsertUserNameApp user_id="test_user_id" />);
  const input = screen.getByLabelText("User Name:");
  const button = screen.getByRole("button", { name: "Submit" });
  await user.type(input, "duplicateUser");
  await user.click(button);
  await waitFor(() => {
    expect(mockInsertUsername).toHaveBeenCalledWith(
      "test_user_id",
      "duplicateUser",
    );
    expect(alertSpy).toHaveBeenCalledWith(
      "そのユーザー名はすでに使用されています。別のユーザー名を選択してください。",
    );
    expect(mockPush).not.toHaveBeenCalled();
  });
});
