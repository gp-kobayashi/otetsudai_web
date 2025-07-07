import {
  describe,
  expect,
  test,
  beforeAll,
  afterEach,
  afterAll,
  vi,
} from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AccountForm from "../../app/account/account-form";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import { User } from "@supabase/supabase-js";

// Avatarコンポーネントをモック化し、onUploadを呼び出すボタンを設置
vi.mock("../../app/account/avatar", () => ({
  default: ({ onUpload }: { onUpload: (url: string) => void }) => (
    <div>
      <button onClick={() => onUpload("new-avatar.png")}>
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

const mockProfile = {
  username: "testuser",
  website: "https://example.com",
  bio: "This is a test bio.",
  avatar_url: "test-avatar.png",
};

// 2. MSW（Mock Service Worker）によるAPIモックサーバーのセットアップ
const server = setupServer(
  http.get(
    "https://ridyklrbkirszfklksng.supabase.co/rest/v1/profiles",
    ({ request }) => {
      const url = new URL(request.url);
      if (
        url.searchParams.get("id") === `eq.${mockUser.id}` &&
        request.headers.get("Accept") === "application/vnd.pgrst.object+json"
      ) {
        return HttpResponse.json(mockProfile);
      }
    },
  ),
  // プロフィール更新(upsertはPOST)リクエスト用のハンドラ
  http.post(
    "https://ridyklrbkirszfklksng.supabase.co/rest/v1/profiles",
    async () => {
      // 成功時はerrorプロパティを含まない空のJSONを返す
      return HttpResponse.json({}, { status: 200 });
    },
  ),
);

// 3. テスト全体のライフサイクルでモックサーバーを制御
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

// 4. テストスイート
describe("AccountForm", () => {
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
    const user = userEvent.setup();
    const alertSpy = vi.spyOn(window, "alert").mockImplementation(() => {});

    render(<AccountForm user={mockUser} />);

    // 初期データがフォームに表示されるのを待つ
    await screen.findByDisplayValue(mockProfile.username);

    // フォームの値を変更する
    const newUsername = "newtestuser";
    const usernameInput = screen.getByLabelText("Username");
    await user.clear(usernameInput);
    await user.type(usernameInput, newUsername);

    // 更新ボタンをクリックする
    const updateButton = screen.getByRole("button", { name: /Update/i });
    await user.click(updateButton);

    // アラートが表示されるのを待つ
    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith("プロフィールが更新されました");
    });
    alertSpy.mockRestore();
  });

  test("アバター画像が正しく更新される。", async () => {
    const user = userEvent.setup();
    const alertSpy = vi.spyOn(window, "alert").mockImplementation(() => {});
    const mockUpsert = vi.fn();

    // このテストケースでのみPOSTハンドラを上書きしてリクエストボディを検証
    server.use(
      http.post(
        "https://ridyklrbkirszfklksng.supabase.co/rest/v1/profiles",
        async ({ request }) => {
          const requestBody = await request.json();
          mockUpsert(requestBody);
          return HttpResponse.json({}, { status: 200 });
        },
      ),
    );

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
});
