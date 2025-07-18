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
});
