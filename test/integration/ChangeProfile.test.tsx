import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, test, expect, vi, beforeEach } from "vitest";

const redirectMock = vi.fn();

vi.mock("next/navigation", () => ({
  redirect: (url: string) => {
    redirectMock(url);
    throw new Error("NEXT_REDIRECT");
  },
}));

describe("AccountPage", () => {
  beforeEach(() => {
    vi.resetModules();
    redirectMock.mockClear();
  });

  test("ユーザーが未認証の場合、/loginにリダイレクトされる", async () => {
    vi.doMock("@/utils/supabase/server", () => ({
      createClient: async () => ({
        auth: {
          getUser: async () => ({ data: { user: null } }),
        },
      }),
    }));
    vi.doMock("@/lib/supabase_function/profile", () => ({
      fetchProfile: async () => ({ data: null }),
    }));

    const { default: Account } = await import("@/app/account/page");
    await expect(Account()).rejects.toThrow("NEXT_REDIRECT");
    expect(redirectMock).toHaveBeenCalledWith("/login");
  });

  test("ユーザーが認証済みでusernameが未設定の場合、/insertUserNameにリダイレクトされる", async () => {
    vi.doMock("@/utils/supabase/server", () => ({
      createClient: async () => ({
        auth: {
          getUser: async () => ({ data: { user: { id: "123" } } }),
        },
      }),
    }));
    vi.doMock("@/lib/supabase_function/profile", () => ({
      fetchProfile: async () => ({ data: null }),
    }));

    const { default: Account } = await import("@/app/account/page");
    await expect(Account()).rejects.toThrow("NEXT_REDIRECT");
    expect(redirectMock).toHaveBeenCalledWith("/insertUserName");
  });

  test("ユーザー情報が確認できた場合、AccountFormが表示される", async () => {
    vi.doMock("@/utils/supabase/server", () => ({
      createClient: async () => ({
        auth: {
          getUser: async () => ({
            data: { user: { id: "123", email: "test@example.com" } },
          }),
        },
      }),
    }));
    vi.doMock("@/lib/supabase_function/profile", () => ({
      fetchProfile: async () => ({ data: { username: "testuser" } }),
    }));

    const { default: Account } = await import("@/app/account/page");
    const result = await Account();

    // AccountFormが描画されているか確認
    expect(result.type.name).toBe("AccountForm");
  });

  test("SignOutボタンが存在し、正しく動作する", async () => {
    // 1. Server Component (`Account`) 用の依存関係をモック
    vi.doMock("@/utils/supabase/server", () => ({
      createClient: async () => ({
        auth: {
          getUser: async () => ({
            data: { user: { id: "123", email: "test@example.com" } },
          }),
        },
      }),
    }));
    vi.doMock("@/lib/supabase_function/profile", () => ({
      fetchProfile: async () => ({ data: { username: "testuser" } }),
    }));

    // 2. Client Component (`AccountForm`) 用の依存関係をモック
    vi.doMock("@/utils/supabase/client", () => ({
      createClient: () => ({
        from: () => ({
          select: () => ({
            eq: () => ({
              single: () =>
                Promise.resolve({
                  data: {
                    username: "testuser",
                    website: "",
                    bio: "",
                    avatar_url: "",
                  },
                  error: null,
                }),
            }),
          }),
        }),
      }),
    }));

    const { default: Account } = await import("@/app/account/page");
    // 3. 非同期コンポーネントを `await` してから `render` に渡す
    render(await Account());

    // 4. Sign out ボタンを見つける
    const signOutButton = screen.getByRole("button", { name: /sign out/i });
    expect(signOutButton).toBeInTheDocument();

    // 5. ボタンが正しいactionとmethodを持つform内にあることを検証
    const form = signOutButton.closest("form");
    expect(form).toBeInTheDocument();
    expect(form).toHaveAttribute("action", "/auth/signout");
    expect(form).toHaveAttribute("method", "post");
  });

  test("フォームが不正な初期値で読み込まれた場合、エラーメッセージが表示されUpdateボタンは無効になる", async () => {
    // 1. Server Component (`Account`) 用の依存関係をモック。
    // このテストでは認証済みで、有効なプロフィールがある前提でページが表示される
    vi.doMock("@/utils/supabase/server", () => ({
      createClient: async () => ({
        auth: {
          getUser: async () => ({
            data: { user: { id: "123", email: "test@example.com" } },
          }),
        },
      }),
    }));
    vi.doMock("@/lib/supabase_function/profile", () => ({
      fetchProfile: async () => ({ data: { username: "testuser" } }), // Server-side check passes
    }));

    // 2. Client Component (`AccountForm`) 用の依存関係をモック。
    // AccountFormが読み込むデータはバリデーションに違反するものにする
    vi.doMock("@/utils/supabase/client", () => ({
      createClient: () => ({
        from: () => ({
          select: () => ({
            eq: () => ({
              single: () =>
                Promise.resolve({
                  data: {
                    username: "ab", // 3文字未満の不正な値
                    website: "",
                    bio: "",
                    avatar_url: "",
                  },
                  error: null,
                }),
            }),
          }),
        }),
      }),
    }));

    const { default: Account } = await import("@/app/account/page");
    render(await Account());

    // 3. `getProfile` -> `reset` の非同期処理が完了し、エラーメッセージが表示されるのを待つ
    const errorMessage = await screen.findByText(
      "ユーザー名は3文字以上で入力してください",
    );
    expect(errorMessage).toBeInTheDocument();

    // 4. Updateボタンが無効になっていることを確認
    const updateButton = screen.getByRole("button", { name: /update/i });
    expect(updateButton).toBeDisabled();
  });

  test("プロフィールのUsername,website,自己紹介が正しく更新される", async () => {
    const user = userEvent.setup();
    const alertMock = vi.fn();
    window.alert = alertMock;

    vi.doMock("@/utils/supabase/server", () => ({
      createClient: async () => ({
        auth: {
          getUser: async () => ({
            data: { user: { id: "123", email: "test@example.com" } },
          }),
        },
      }),
    }));
    vi.doMock("@/lib/supabase_function/profile", () => ({
      fetchProfile: async () => ({ data: { username: "testuser" } }),
    }));

    const upsertMock = vi.fn().mockResolvedValue({ error: null });
    vi.doMock("@/utils/supabase/client", () => ({
      createClient: () => ({
        from: () => ({
          select: () => ({
            eq: () => ({
              single: () =>
                Promise.resolve({
                  data: {
                    username: "testuser",
                    website: "https://example.com",
                    bio: "initial bio",
                    avatar_url: "",
                  },
                  error: null,
                }),
            }),
          }),
          upsert: upsertMock,
        }),
      }),
    }));

    const { default: Account } = await import("@/app/account/page");
    render(await Account());

    const usernameInput = screen.getByLabelText(/username/i);
    const websiteInput = screen.getByLabelText(/website/i);
    const bioInput = screen.getByLabelText(/自己紹介/i);
    const updateButton = await screen.findByRole("button", { name: /update/i });

    await user.clear(usernameInput);
    await user.type(usernameInput, "newuser");
    await user.clear(websiteInput);
    await user.type(websiteInput, "https://new-example.com");
    await user.clear(bioInput);
    await user.type(bioInput, "new bio");

    await user.click(updateButton);

    await waitFor(() => {
      expect(upsertMock).toHaveBeenCalledWith(
        expect.objectContaining({
          username: "newuser",
          website: "https://new-example.com",
          bio: "new bio",
        }),
      );
    });

    expect(alertMock).toHaveBeenCalledWith("プロフィールが更新されました");
  });
});
