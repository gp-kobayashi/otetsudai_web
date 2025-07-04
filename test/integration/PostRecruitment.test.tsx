import { describe, expect, test, vi, beforeEach, afterEach } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";

const pushMock = vi.fn();
const redirectMock = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: pushMock }),
  redirect: (path: string) => {
    redirectMock(path);
    throw new Error("NEXT_REDIRECT");
  },
}));

const addRecruitmentMock = vi.fn().mockResolvedValue({ error: null });
vi.doMock("@/lib/supabase_function/recruitment", () => ({
  addRecruitment: addRecruitmentMock,
}));

describe("CreateRecruitmentPage", () => {
  beforeEach(() => {
    // 各テストの前にモックのコール履歴のみをクリア
    pushMock.mockClear();
    redirectMock.mockClear();
  });
  afterEach(() => {
    vi.resetModules();
  });

  test("認証から投稿完了までページ全体の流れが正しく動作する", async () => {
    vi.doMock("@/utils/supabase/server", () => ({
      createClient: async () => ({
        auth: {
          getUser: async () => ({ data: { user: { id: "user123" } } }),
        },
      }),
    }));
    vi.doMock("@/lib/supabase_function/recruitment", () => ({
      addRecruitment: addRecruitmentMock,
    }));

    vi.doMock("@/lib/supabase_function/profile", () => ({
      fetchProfile: () =>
        Promise.resolve({
          data: {
            id: "user123",
            username: "testuser",
            website: "http://example.com",
            avatar_url: "avatar.png",
            bio: "テスト",
          },
        }),
    }));
    const { default: createRecruitment } = await import(
      "@/app/createRecruitment/page"
    );
    const authenticatedPage = await createRecruitment(); // コンポーネントを直接呼び出す
    render(authenticatedPage); // レンダリングはここで行う

    // 入力フォームに値を入力
    fireEvent.change(screen.getByLabelText("タイトル:"), {
      target: { value: "テストタイトル" },
    });

    fireEvent.change(screen.getByLabelText("内容:"), {
      target: { value: "テスト内容" },
    });

    fireEvent.change(screen.getByLabelText("カテゴリー:"), {
      target: { value: "Video" },
    });

    // 投稿ボタンをクリック
    fireEvent.click(screen.getByRole("button", { name: "募集する" }));

    //addRecruitment が正しく呼ばれたか確認
    await waitFor(() => {
      expect(addRecruitmentMock).toHaveBeenCalledWith(
        "テストタイトル",
        "テスト内容",
        "user123",
        "Video",
      );
      // 投稿処理が完了し、router.push("/") が呼ばれたことを確認

      expect(pushMock).toHaveBeenCalledWith("/");
    });
  });

  test("未ログインユーザーはページレベルでリダイレクトされる", async () => {
    vi.doMock("@/utils/supabase/server", () => ({
      createClient: async () => ({
        auth: {
          getUser: async () => ({ data: { user: null } }), // ユーザーをnullに設定
        },
      }),
    }));

    // ページコンポーネントを動的にインポートし、実行
    const { default: createRecruitment } = await import(
      "@/app/createRecruitment/page"
    );
    await expect(createRecruitment()).rejects.toThrow("NEXT_REDIRECT");

    expect(redirectMock).toHaveBeenCalledWith("/login");
  });
  test("ユーザープロフィールが取得できない場合、リダイレクトされる", async () => {
    vi.doMock("@/utils/supabase/server", () => ({
      createClient: async () => ({
        auth: {
          getUser: async () => ({ data: { user: { id: "user123" } } }),
        },
      }),
    }));
    vi.doMock("@/lib/supabase_function/profile", () => ({
      fetchProfile: () => Promise.resolve({ data: null }), // プロフィールが取得できない
    }));

    const { default: createRecruitment } = await import(
      "@/app/createRecruitment/page"
    );
    await expect(createRecruitment()).rejects.toThrow("NEXT_REDIRECT");
    expect(redirectMock).toHaveBeenCalledWith("/login");
  });

  test("ユーザー名が未設定の場合、リダイレクトされる", async () => {
    vi.doMock("@/utils/supabase/server", () => ({
      createClient: async () => ({
        auth: {
          getUser: async () => ({ data: { user: { id: "user123" } } }),
        },
      }),
    }));
    vi.doMock("@/lib/supabase_function/profile", () => ({
      fetchProfile: () =>
        Promise.resolve({
          data: {
            id: "user123",
            username: null, // ユーザー名が未設定
            website: "http://example.com",
            avatar_url: "avatar.png",
            bio: "テスト",
          },
        }),
    }));

    const { default: createRecruitment } = await import(
      "@/app/createRecruitment/page"
    );
    await expect(createRecruitment()).rejects.toThrow("NEXT_REDIRECT");

    expect(redirectMock).toHaveBeenCalledWith("/insertUserName");
  });
});
