import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, test, vi, beforeEach } from "vitest";

const redirectMock = vi.fn();
const pushMock = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: pushMock,
    refresh: vi.fn(), // 必要であれば追加
  }),
  redirect: (url: string) => {
    redirectMock(url);
    throw new Error("NEXT_REDIRECT");
  },
}));

describe("recruitment/[id] test", () => {
  beforeEach(() => {
    vi.resetModules();
    redirectMock.mockClear();
  });

  test("usernameが未確認の場合、/insertUserNameにリダイレクトされる", async () => {
    // supabaseのユーザーは存在するが、プロフィールがnull（username未設定）
    vi.doMock("@/utils/supabase/server", () => ({
      createClient: async () => ({
        auth: {
          getUser: async () => ({ data: { user: { id: "user1" } } }),
        },
      }),
    }));
    vi.doMock("@/lib/supabase_function/profile", () => ({
      fetchProfile: async () => ({ data: null }),
    }));
    vi.doMock("@/lib/supabase_function/recruitment", () => ({
      getRecruitmentById: async () => ({
        data: {
          id: 1,
          user_id: "user1",
          title: "タイトル",
          explanation: "内容",
          status: "open",
          profile: {},
        },
      }),
    }));

    const { default: RecruitmentPage } = await import(
      "@/app/recruitment/[id]/page"
    );
    await expect(
      RecruitmentPage({ params: Promise.resolve({ id: 1 }) }),
    ).rejects.toThrow("NEXT_REDIRECT");
    expect(redirectMock).toHaveBeenCalledWith("/insertUserName");
  });

  test("募集データが存在しない場合、エラーメッセージが表示される", async () => {
    // supabaseのユーザーは存在し、プロフィールも設定されているが、募集データが存在しない
    vi.doMock("@/utils/supabase/server", () => ({
      createClient: async () => ({
        auth: {
          getUser: async () => ({ data: { user: { id: "user1" } } }),
        },
      }),
    }));
    vi.doMock("@/lib/supabase_function/profile", () => ({
      fetchProfile: async () => ({
        data: { id: "user1", username: "testuser", avatar_url: null },
      }),
    }));
    vi.doMock("@/lib/supabase_function/recruitment", () => ({
      getRecruitmentById: async () => ({ data: null }),
    }));

    const { default: RecruitmentPage } = await import(
      "@/app/recruitment/[id]/page"
    );
    const rendered = await RecruitmentPage({
      params: Promise.resolve({ id: 1 }),
    });
    render(rendered);
    expect(
      await screen.findByText("募集が見つかりませんでした"),
    ).toBeInTheDocument();
  });

  test("ユーザー名を確認し募集もある場合、正常に募集が表示される", async () => {
    // モック1: ユーザー認証済み
    vi.doMock("@/utils/supabase/server", () => ({
      createClient: async () => ({
        auth: {
          getUser: async () => ({
            data: { user: { id: "user1" } },
          }),
        },
      }),
    }));

    // モック2: プロフィールあり
    vi.doMock("@/lib/supabase_function/profile", () => ({
      DEFAULT_AVATAR_URL: "https://example.com/default-avatar.png",
      fetchProfile: async () => ({
        data: {
          id: "user1",
          username: "testuser",
          avatar_url: null,
        },
      }),
    }));

    // モック3: 募集データあり
    vi.doMock("@/lib/supabase_function/recruitment", () => ({
      getRecruitmentById: async () => ({
        data: {
          id: 1,
          user_id: "user1",
          title: "テストタイトル",
          explanation: "これは募集の内容です",
          status: "open",
          profile: {},
        },
      }),
    }));

    // ページインポート・描画
    const { default: RecruitmentPage } = await import(
      "@/app/recruitment/[id]/page"
    );
    const rendered = await RecruitmentPage({
      params: Promise.resolve({ id: 1 }),
    });
    render(rendered);

    // 募集タイトルや内容が表示されていること
    expect(await screen.findByText("テストタイトル")).toBeInTheDocument();
    expect(screen.getByText("これは募集の内容です")).toBeInTheDocument();
    expect(screen.getByText("open")).toBeInTheDocument(); // ステータス確認
  });
});
