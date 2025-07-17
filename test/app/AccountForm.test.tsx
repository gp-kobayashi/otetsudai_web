import { describe, expect, test, afterEach, vi } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AccountForm from "../../app/account/account-form";
import { User } from "@supabase/supabase-js";
import { beforeEach } from "vitest";

const mockProfile = {
  username: "testuser",
  website: "https://example.com",
  bio: "This is a test bio.",
  avatar_url: "test-avatar.png",
};

const mockSingle = vi.fn();
const mockUpsert = vi.fn();

vi.mock("@/utils/supabase/client", () => ({
  createClient: () => ({
    storage: {
      from: () => ({
        download: vi.fn().mockResolvedValue({
          data: new Blob(["avatar-image-data"]),
          error: null,
        }),
      }),
    },
    from: vi.fn().mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: mockSingle,
      upsert: mockUpsert,
    }),
  }),
}));

// Avatarコンポーネントをモック化し、onUploadを呼び出すボタンを設置
vi.mock("../../app/account/avatar", () => ({
  default: ({ onUpload }: { onUpload: (url: string) => void }) => (
    <div>
      <button type="button" onClick={() => onUpload("new-avatar.png")}>
        Upload New Avatar
      </button>
    </div>
  ),
}));

// 1. テスト用のモックデータ
const mockUser: User = {
  id: "a1b2c3d4-e5f6-7890-1234-567890abcdef",
  email: "test@example.com",
  app_metadata: { provider: "email" },
  user_metadata: {},
  aud: "authenticated",
  created_at: new Date().toISOString(),
};

// 4. テストスイート
describe("AccountForm", () => {
  beforeEach(() => {
    // 各テストの前に、getProfileが成功するデフォルトの振る舞いを設定
    mockSingle.mockResolvedValue({ data: mockProfile, error: null });
    // upsertもデフォルトで成功するように設定
    mockUpsert.mockResolvedValue({ error: null });
  });

  afterEach(() => {
    // 各テストの後にモックの呼び出し履歴をクリア
    mockSingle.mockClear();
    mockUpsert.mockClear();
    vi.restoreAllMocks(); // spyをリストア
  });

  test("既存のプロフィール情報がフォームの初期値として正しく表示される。", async () => {
    render(<AccountForm user={mockUser} />);

    // 非同期のgetProfile関数が完了し、フォームが更新されるのを待つ
    await waitFor(() => {
      expect(screen.getByLabelText("Username")).toHaveValue(
        mockProfile.username,
      );
      expect(screen.getByLabelText("Website")).toHaveValue(mockProfile.website);
      expect(screen.getByLabelText("自己紹介")).toHaveValue(mockProfile.bio);
    });

    expect(screen.getByLabelText("Email")).toHaveValue(mockUser.email);
  });

  test("プロフィールが正しく更新される。", async () => {
    // Arrange: テストの準備
    const user = userEvent.setup();
    const alertSpy = vi.spyOn(window, "alert").mockImplementation(() => {});

    // API呼び出し（upsert）をテスト内で手動で解決できるように設定
    let resolveUpsert: (value: { error: null }) => void;
    const upsertPromise = new Promise<{ error: null }>((resolve) => {
      resolveUpsert = resolve;
    });
    // このテストケース内でのみmockUpsertの実装を上書き
    mockUpsert.mockImplementation(() => upsertPromise);

    render(<AccountForm user={mockUser} />);

    const usernameInput =
      await screen.findByLabelText<HTMLInputElement>("Username");
    const updateButton = screen.getByRole("button", { name: /Update/i });

    // Act: フォームの値を変更
    const newUsername = "newtestuser";
    await user.clear(usernameInput);
    await user.type(usernameInput, newUsername);

    // Assert: 更新前のUI状態を確認（ボタンが有効であること）
    expect(updateButton).toBeEnabled();

    // Act: 更新ボタンをクリック
    await user.click(updateButton);

    // Assert: ローディング中のUI挙動を検証
    // `user.click` 後、`setLoading(true)` による再レンダリングを待つ必要がある。
    // `findByText` は要素が表示されるまで待機するため、非同期更新の検証に適している。
    await screen.findByText("Loading ...");
    // "Loading ..." が表示された時点で、ボタンは無効化されているはず。
    expect(updateButton).toBeDisabled();

    // Assert: API呼び出し（upsert）が正しい引数で呼び出されたか検証
    expect(mockUpsert).toHaveBeenCalledTimes(1);
    expect(mockUpsert).toHaveBeenCalledWith(
      expect.objectContaining({
        id: mockUser.id,
        username: newUsername,
        website: mockProfile.website,
        bio: mockProfile.bio,
      }),
    );

    // Act: API呼び出しを成功させる
    await resolveUpsert!({ error: null });

    // Assert: 更新後のUIとアラートを検証
    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith("プロフィールが更新されました");
    });
    expect(updateButton).toBeEnabled();
    expect(usernameInput).toHaveValue(newUsername); // フォームの値が維持されていることを確認

    alertSpy.mockRestore();
  });

  test("アバター画像が正しく更新される。", async () => {
    const user = userEvent.setup();
    const alertSpy = vi.spyOn(window, "alert").mockImplementation(() => {});
    render(<AccountForm user={mockUser} />);

    // 初期データがフォームに表示されるのを待つ
    await screen.findByDisplayValue(mockProfile.username);

    // モックしたAvatarコンポーネント内のアップロードボタンをクリック
    const uploadButton = screen.getByRole("button", {
      name: /Upload New Avatar/i,
    });
    await user.click(uploadButton);

    // 更新ボタンをクリック
    const updateButton = screen.getByRole("button", { name: /Update/i });
    await user.click(updateButton);

    // upsertが新しいアバターURLを含む正しいデータで呼び出されたか検証
    await waitFor(() => {
      expect(mockUpsert).toHaveBeenCalledTimes(1);
      expect(mockUpsert).toHaveBeenCalledWith(
        expect.objectContaining({
          avatar_url: "new-avatar.png",
        }),
      );
    });
    alertSpy.mockRestore();
  });

  test("サインアウトボタンが正しく設定されている。", async () => {
    render(<AccountForm user={mockUser} />);

    // 初期データがフォームに表示されるのを待つ
    await screen.findByDisplayValue(mockProfile.username);

    // サインアウトボタンを取得
    const signOutButton = screen.getByRole("button", { name: /Sign out/i });
    expect(signOutButton).toBeInTheDocument();

    // ボタンが属するフォームを取得し、その属性を検証
    const form = signOutButton.closest("form");
    expect(form).not.toBeNull();
    expect(form).toHaveAttribute("action", "/auth/signout");
    expect(form).toHaveAttribute("method", "post");
  });

  test("ユーザー名を空にすると、エラーメッセージが表示され更新ボタンが無効になる。", async () => {
    const user = userEvent.setup();
    render(<AccountForm user={mockUser} />);
    const usernameInput =
      await screen.findByLabelText<HTMLInputElement>("Username");
    const updateButton = screen.getByRole("button", { name: /Update/i });

    // 初期値がフォームに設定されるのを待ってからクリアする
    await waitFor(() =>
      expect(usernameInput).toHaveValue(mockProfile.username),
    );
    await user.clear(usernameInput);

    // zodResolverによるバリデーションとUIの更新は非同期の場合がある
    await waitFor(() => {
      expect(
        screen.getByText("ユーザー名は3文字以上で入力してください"),
      ).toBeInTheDocument();
    });
    expect(updateButton).toBeDisabled();
  });

  test("Websiteに無効なURLを入力すると、エラーメッセージが表示され更新ボタンが無効になる。", async () => {
    const user = userEvent.setup();
    render(<AccountForm user={mockUser} />);
    const websiteInput =
      await screen.findByLabelText<HTMLInputElement>("Website");
    const updateButton = screen.getByRole("button", { name: /Update/i });

    // 初期値が設定されるのを待つ
    await waitFor(() => expect(websiteInput).toHaveValue(mockProfile.website));

    // 無効なURLを入力
    await user.clear(websiteInput);
    await user.type(websiteInput, "invalid-url");

    // エラーメッセージが表示されるのを待つ
    await waitFor(() => {
      expect(
        screen.getByText("正しいURL形式で入力してください"),
      ).toBeInTheDocument();
    });
    expect(updateButton).toBeDisabled();
  });

  test("自己紹介が長すぎる場合、エラーメッセージが表示され更新ボタンが無効になる。", async () => {
    const user = userEvent.setup();
    render(<AccountForm user={mockUser} />);
    const bioInput =
      await screen.findByLabelText<HTMLTextAreaElement>("自己紹介");
    const updateButton = screen.getByRole("button", { name: /Update/i });

    // 初期値が設定されるのを待つ
    await waitFor(() => expect(bioInput).toHaveValue(mockProfile.bio));

    // 500文字を超える文字列を入力（z.string().max(500)のようなバリデーションを想定）
    const longBio = "a".repeat(501);
    fireEvent.change(bioInput, { target: { value: longBio } });

    await waitFor(() => {
      expect(
        screen.getByText("自己紹介は500文字以内で入力してください"),
      ).toBeInTheDocument();
    });
    expect(updateButton).toBeDisabled();
  });

  test("一般的なAPIエラーが発生した場合、エラーアラートが表示される。", async () => {
    const user = userEvent.setup();
    const alertSpy = vi.spyOn(window, "alert").mockImplementation(() => {});
    const apiError = new Error("Internal Server Error");
    mockUpsert.mockResolvedValue({ error: apiError });

    render(<AccountForm user={mockUser} />);

    const updateButton = await screen.findByRole("button", {
      name: /Update/i,
    });

    await user.click(updateButton);

    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith(
        "プロフィールの更新中にエラーが発生しました。",
      );
    });
    expect(updateButton).toBeEnabled(); // ローディングが解除されること
    alertSpy.mockRestore();
  });

  test("ユーザー名が重複した場合、専用のエラーアラートが表示される。", async () => {
    const user = userEvent.setup();
    const alertSpy = vi.spyOn(window, "alert").mockImplementation(() => {});
    const duplicateError = { code: "23505", message: "Duplicate key" };
    mockUpsert.mockResolvedValue({ error: duplicateError });

    render(<AccountForm user={mockUser} />);

    const updateButton = await screen.findByRole("button", { name: /Update/i });

    await user.click(updateButton);

    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith(
        "そのユーザー名はすでに使用されています。",
      );
    });
    expect(updateButton).toBeEnabled();
    alertSpy.mockRestore();
  });

  test("プロフィールの読み込みに失敗した場合、エラーのアラートが表示される。", async () => {
    // Arrange: window.alertとconsole.errorをスパイし、APIがエラーを返すようにモックする
    const alertSpy = vi.spyOn(window, "alert").mockImplementation(() => {});
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});
    const apiError = new Error("Failed to fetch profile");
    mockSingle.mockResolvedValue({ data: null, error: apiError, status: 500 });

    // Act: コンポーネントをレンダリングすると、useEffect内でgetProfileが呼ばれる
    render(<AccountForm user={mockUser} />);

    // Assert: catchブロック内の処理が正しく呼び出されたことを確認
    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith(
        "プロフィールの読み込み中にエラーが発生しました。",
      );
    });
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Error loading user data",
      apiError,
    );
  });
});
