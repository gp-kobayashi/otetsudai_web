import { render, screen, waitFor } from "@testing-library/react";
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

  describe("認証済みでプロフィールがある場合", () => {
    beforeEach(() => {
      // 共通のサーバーサイドモック
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
    });

    test("ユーザー情報が確認できた場合、AccountFormが表示される", async () => {
      const { default: Account } = await import("@/app/account/page");
      const result = await Account();

      // AccountFormが描画されているか確認
      expect(result.type.name).toBe("AccountForm");
    });

    test("SignOutボタンが存在し、正しく動作する", async () => {
      // Client Component (`AccountForm`) 用の依存関係をモック
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
      await waitFor(async () => {
        render(await Account());
      });

      const signOutButton = screen.getByRole("button", { name: /sign out/i });
      expect(signOutButton).toBeInTheDocument();

      const form = signOutButton.closest("form");
      expect(form).toBeInTheDocument();
      expect(form).toHaveAttribute("action", "/auth/signout");
      expect(form).toHaveAttribute("method", "post");
    });

    test("フォームが不正な初期値で読み込まれた場合、エラーメッセージが表示されUpdateボタンは無効になる", async () => {
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

      const errorMessage = await screen.findByText(
        "ユーザー名は3文字以上で入力してください",
      );
      expect(errorMessage).toBeInTheDocument();

      const updateButton = screen.getByRole("button", { name: /update/i });
      expect(updateButton).toBeDisabled();
    });

    test("プロフィールのUsername,website,自己紹介,アバターが正しく更新される", async () => {
      const user = userEvent.setup();
      const alertMock = vi.fn();
      window.alert = alertMock;

      // Math.random()をモック化してファイル名を固定
      vi.spyOn(Math, "random").mockReturnValue(0.123456789);
      const expectedAvatarPath = `123-0.123456789.png`;

      const upsertMock = vi.fn().mockResolvedValue({ error: null });
      const uploadMock = vi.fn().mockResolvedValue({ data: { path: expectedAvatarPath }, error: null });

      vi.doMock("@/utils/supabase/client", () => ({
        createClient: () => ({
          from: (table: string) => {
            if (table === "profiles") {
              return {
                select: () => ({
                  eq: () => ({
                    single: () =>
                      Promise.resolve({
                        data: {
                          username: "testuser",
                          website: "https://example.com",
                          bio: "initial bio",
                          avatar_url: "initial_avatar.png",
                        },
                        error: null,
                      }),
                  }),
                }),
                upsert: upsertMock,
              };
            }
            return {};
          },
          storage: {
            from: () => ({
              upload: uploadMock,
              download: vi.fn().mockResolvedValue({
                data: new Blob([""], { type: "image/png" }),
                error: null,
              }),
            }),
          },
        }),
      }));

      const { default: Account } = await import("@/app/account/page");
      render(await Account());

      const usernameInput = screen.getByLabelText(/username/i);
      const websiteInput = screen.getByLabelText(/website/i);
      const bioInput = screen.getByLabelText(/自己紹介/i);
      const fileInput = screen.getByLabelText(/upload/i);
      const updateButton = await screen.findByRole("button", {
        name: /update/i,
      });

      // フォーム入力
      await user.clear(usernameInput);
      await user.type(usernameInput, "newuser");
      await user.clear(websiteInput);
      await user.type(websiteInput, "https://new-example.com");
      await user.clear(bioInput);
      await user.type(bioInput, "new bio");

      // ファイルアップロード
      const file = new File([""], "new_avatar.png", { type: "image/png" });
      await user.upload(fileInput, file);

      // onUploadが呼ばれ、stateが更新されるのを待つ
      await waitFor(() => {
        expect(uploadMock).toHaveBeenCalled();
      });

      // 更新ボタンをクリック
      await user.click(updateButton);

      // upsertが正しい値で呼ばれることを確認
      await waitFor(() => {
        expect(upsertMock).toHaveBeenCalledWith(
          expect.objectContaining({
            username: "newuser",
            website: "https://new-example.com",
            bio: "new bio",
            avatar_url: expectedAvatarPath,
          }),
        );
      });

      expect(alertMock).toHaveBeenCalledWith("プロフィールが更新されました");
    });

    test("更新時にユーザー名が重複した場合、エラーメッセージが表示される", async () => {
      const user = userEvent.setup();
      const alertMock = vi.fn();
      window.alert = alertMock;

      const upsertMock = vi
        .fn()
        .mockResolvedValue({ error: { code: "23505" } }); // ユーザー名重複エラー
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
            upsert: upsertMock,
          }),
        }),
      }));

      const { default: Account } = await import("@/app/account/page");
      render(await Account());

      const updateButton = await screen.findByRole("button", {
        name: /update/i,
      });
      await user.click(updateButton);

      await waitFor(() => {
        expect(alertMock).toHaveBeenCalledWith(
          "そのユーザー名はすでに使用されています。",
        );
      });
    });

    test("更新時に一般的なサーバーエラーが発生した場合、エラーメッセージが表示される", async () => {
      const user = userEvent.setup();
      const alertMock = vi.fn();
      window.alert = alertMock;

      const upsertMock = vi
        .fn()
        .mockResolvedValue({ error: { message: "Internal server error" } }); // 一般的なエラー
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
            upsert: upsertMock,
          }),
        }),
      }));

      const { default: Account } = await import("@/app/account/page");
      render(await Account());

      const updateButton = await screen.findByRole("button", {
        name: /update/i,
      });
      await user.click(updateButton);

      await waitFor(() => {
        expect(alertMock).toHaveBeenCalledWith(
          "プロフィールの更新中にエラーが発生しました。",
        );
      });
    });

    test("ユーザー名を空にするとUpdateボタンが無効になる", async () => {
      const user = userEvent.setup();

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
      render(await Account());

      const usernameInput = screen.getByLabelText(/username/i);
      const updateButton = await screen.findByRole("button", {
        name: /update/i,
      });

      expect(updateButton).not.toBeDisabled();

      await user.clear(usernameInput);

      await waitFor(() => {
        expect(updateButton).toBeDisabled();
      });
    });
  });
});
