import { render, screen, fireEvent, waitFor } from "@testing-library/react";
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
          profile: {
            id: "user1",
            username: "testuser",
            avatar_url: null,
          },
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
          profile: {
            id: "user1",
            username: "testuser",
            avatar_url: null,
          },
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

  test("募集の投稿者の場合、編集ボタンが表示される", async () => {
    // ユーザー認証済み
    vi.doMock("@/utils/supabase/server", () => ({
      createClient: async () => ({
        auth: {
          getUser: async () => ({
            data: { user: { id: "user1" } },
          }),
        },
      }),
    }));
    // プロフィールあり
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
    // 募集データあり
    vi.doMock("@/lib/supabase_function/recruitment", () => ({
      getRecruitmentById: async () => ({
        data: {
          id: 1,
          user_id: "user1",
          title: "テストタイトル",
          explanation: "これは募集の内容です",
          status: "open",
          profile: {
            id: "user1",
            username: "testuser",
            avatar_url: null,
          },
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

    // 編集ボタンが表示されていることを確認
    expect(await screen.findByText("内容を編集する")).toBeInTheDocument();
  });

  test("募集の投稿者でない場合、編集ボタンが表示されない", async () => {
    // ユーザー認証済み
    vi.doMock("@/utils/supabase/server", () => ({
      createClient: async () => ({
        auth: {
          getUser: async () => ({
            data: { user: { id: "user2" } }, // 投稿者とは異なるユーザー
          }),
        },
      }),
    }));
    // プロフィールあり
    vi.doMock("@/lib/supabase_function/profile", () => ({
      DEFAULT_AVATAR_URL: "https://example.com/default-avatar.png",
      fetchProfile: async () => ({
        data: {
          id: "user2",
          username: "testuser2",
          avatar_url: null,
        },
      }),
    }));
    // 募集データあり
    vi.doMock("@/lib/supabase_function/recruitment", () => ({
      getRecruitmentById: async () => ({
        data: {
          id: 1,
          user_id: "user1", // 募集の投稿者はuser1
          title: "テストタイトル",
          explanation: "これは募集の内容です",
          status: "open",
          profile: {
            id: "user1",
            username: "testuser",
            avatar_url: null,
          },
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

    // 編集ボタンが表示されていないことを確認
    expect(screen.queryByText("内容を編集する")).not.toBeInTheDocument();
  });

  test("編集ボタンをクリックして募集内容を更新し、表示に反映される", async () => {
    // Arrange
    // ユーザー認証済み (投稿者と同じID)
    vi.doMock("@/utils/supabase/server", () => ({
      createClient: async () => ({
        auth: {
          getUser: async () => ({
            data: { user: { id: "user1" } },
          }),
        },
      }),
    }));
    // プロフィールあり
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

    // updateRecruitmentのモックを作成
    const mockedUpdateRecruitment = vi.fn().mockResolvedValue({ error: null });

    // 募集データと更新関数のモック
    vi.doMock("@/lib/supabase_function/recruitment", () => ({
      getRecruitmentById: async () => ({
        data: {
          id: 1,
          user_id: "user1",
          title: "元のタイトル",
          explanation: "元の説明",
          status: "open",
          profile: {
            id: "user1",
            username: "testuser",
            avatar_url: null,
          },
        },
      }),
      updateRecruitment: mockedUpdateRecruitment,
    }));

    // ページインポート・描画
    const { default: RecruitmentPage } = await import(
      "@/app/recruitment/[id]/page"
    );
    const rendered = await RecruitmentPage({
      params: Promise.resolve({ id: 1 }),
    });
    render(rendered);

    // Act
    // 1. 編集ボタンをクリック
    const editButton = await screen.findByText("内容を編集する");
    fireEvent.click(editButton);

    // 2. 編集フォームが開くことを確認し、内容を変更
    const titleInput = await screen.findByDisplayValue("元のタイトル");
    const explanationTextarea = await screen.findByDisplayValue("元の説明");
    const newTitle = "更新後のタイトル";
    const newExplanation = "更新後の説明";
    fireEvent.change(titleInput, { target: { value: newTitle } });
    fireEvent.change(explanationTextarea, {
      target: { value: newExplanation },
    });

    // 3. 保存ボタンをクリック
    const saveButton = screen.getByText("保存");
    fireEvent.click(saveButton);

    // Assert
    // 4. updateRecruitmentが正しい引数で呼び出されたか確認
    await waitFor(() => {
      expect(mockedUpdateRecruitment).toHaveBeenCalledWith(
        1,
        newTitle,
        newExplanation,
      );
    });

    // 5. 画面に変更が反映されているか確認
    await waitFor(() => {
      expect(screen.getByText(newTitle)).toBeInTheDocument();
      expect(screen.getByText(newExplanation)).toBeInTheDocument();
    });

    // 6. フォームが閉じていることを確認
    expect(screen.queryByText("保存")).not.toBeInTheDocument();
    expect(screen.queryByDisplayValue(newTitle)).not.toBeInTheDocument();
  });
});
