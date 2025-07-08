import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, expect, test, vi, beforeEach, type Mock } from "vitest";

const redirectMock = vi.fn();
const pushMock = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: pushMock,
    refresh: vi.fn(),
  }),
  redirect: (url: string) => {
    redirectMock(url);
    throw new Error("NEXT_REDIRECT");
  },
}));

// --- 共通モック関数 ---
const setupUser = (userId = "user1") => {
  vi.doMock("@/utils/supabase/server", () => ({
    createClient: async () => ({
      auth: {
        getUser: async () => ({ data: { user: { id: userId } } }),
      },
    }),
  }));
};

type ProfileData = {
  id: string;
  username: string | null;
  avatar_url: string | null;
} | null;

const setupProfile = (
  profile: ProfileData = {
    id: "user1",
    username: "testuser",
    avatar_url: null,
  },
) => {
  vi.doMock("@/lib/supabase_function/profile", () => ({
    DEFAULT_AVATAR_URL: "https://example.com/default-avatar.png",
    fetchProfile: async () => ({ data: profile }),
  }));
};

type RecruitmentData = {
  id: number;
  user_id: string;
  title: string;
  explanation: string;
  status: string;
  profile: { id: string; username: string | null; avatar_url: string | null };
} | null;

const setupRecruitment = (
  recruitmentData: RecruitmentData = null,
  updateRecruitmentFn?: () => Promise<{ error: null }>,
) => {
  vi.doMock("@/lib/supabase_function/recruitment", () => ({
    getRecruitmentById: async () => ({ data: recruitmentData }),
    ...(updateRecruitmentFn ? { updateRecruitment: updateRecruitmentFn } : {}),
  }));
};
// ----------------------

describe("recruitment/[id] test", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.restoreAllMocks();
    redirectMock.mockClear();
    pushMock.mockClear();
  });

  test("usernameが未確認の場合、/insertUserNameにリダイレクトされる", async () => {
    setupUser("user1");
    setupProfile(null);
    setupRecruitment({
      id: 1,
      user_id: "user1",
      title: "タイトル",
      explanation: "内容",
      status: "open",
      profile: { id: "user1", username: "testuser", avatar_url: null },
    });

    const { default: RecruitmentPage } = await import(
      "@/app/recruitment/[id]/page"
    );
    await expect(
      RecruitmentPage({ params: Promise.resolve({ id: 1 }) }),
    ).rejects.toThrow("NEXT_REDIRECT");
    expect(redirectMock).toHaveBeenCalledWith("/insertUserName");
  });

  test("募集データが存在しない場合、エラーメッセージが表示される", async () => {
    setupUser("user1");
    setupProfile();
    setupRecruitment(null);

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
    setupUser("user1");
    setupProfile();
    setupRecruitment({
      id: 1,
      user_id: "user1",
      title: "テストタイトル",
      explanation: "これは募集の内容です",
      status: "open",
      profile: { id: "user1", username: "testuser", avatar_url: null },
    });

    const { default: RecruitmentPage } = await import(
      "@/app/recruitment/[id]/page"
    );
    const rendered = await RecruitmentPage({
      params: Promise.resolve({ id: 1 }),
    });
    render(rendered);

    expect(await screen.findByText("テストタイトル")).toBeInTheDocument();
    expect(screen.getByText("これは募集の内容です")).toBeInTheDocument();
    expect(screen.getByText("open")).toBeInTheDocument();
  });

  test("募集の投稿者の場合、編集ボタンが表示される", async () => {
    setupUser("user1");
    setupProfile();
    setupRecruitment({
      id: 1,
      user_id: "user1",
      title: "テストタイトル",
      explanation: "これは募集の内容です",
      status: "open",
      profile: { id: "user1", username: "testuser", avatar_url: null },
    });

    const { default: RecruitmentPage } = await import(
      "@/app/recruitment/[id]/page"
    );
    const rendered = await RecruitmentPage({
      params: Promise.resolve({ id: 1 }),
    });
    render(rendered);

    expect(await screen.findByText("内容を編集する")).toBeInTheDocument();
  });

  test("募集の投稿者でない場合、編集ボタンが表示されない", async () => {
    setupUser("user2");
    setupProfile({ id: "user2", username: "testuser2", avatar_url: null });
    setupRecruitment({
      id: 1,
      user_id: "user1",
      title: "テストタイトル",
      explanation: "これは募集の内容です",
      status: "open",
      profile: { id: "user1", username: "testuser", avatar_url: null },
    });

    const { default: RecruitmentPage } = await import(
      "@/app/recruitment/[id]/page"
    );
    const rendered = await RecruitmentPage({
      params: Promise.resolve({ id: 1 }),
    });
    render(rendered);

    expect(screen.queryByText("内容を編集する")).not.toBeInTheDocument();
  });

  test("編集ボタンをクリックして募集内容を更新し、表示に反映される", async () => {
    setupUser("user1");
    setupProfile();
    const mockedUpdateRecruitment = vi.fn().mockResolvedValue({ error: null });
    setupRecruitment(
      {
        id: 1,
        user_id: "user1",
        title: "元のタイトル",
        explanation: "元の説明",
        status: "open",
        profile: { id: "user1", username: "testuser", avatar_url: null },
      },
      mockedUpdateRecruitment,
    );

    const { default: RecruitmentPage } = await import(
      "@/app/recruitment/[id]/page"
    );
    const rendered = await RecruitmentPage({
      params: Promise.resolve({ id: 1 }),
    });
    render(rendered);

    // 編集ボタンをクリック
    const editButton = await screen.findByText("内容を編集する");
    fireEvent.click(editButton);

    // 編集フォームが開くことを確認し、内容を変更
    const titleInput = await screen.findByDisplayValue("元のタイトル");
    const explanationTextarea = await screen.findByDisplayValue("元の説明");
    const newTitle = "更新後のタイトル";
    const newExplanation = "更新後の説明";
    fireEvent.change(titleInput, { target: { value: newTitle } });
    fireEvent.change(explanationTextarea, {
      target: { value: newExplanation },
    });

    // 保存ボタンをクリック
    const saveButton = screen.getByText("保存");
    fireEvent.click(saveButton);

    // updateRecruitmentが正しい引数で呼び出されたか確認
    await waitFor(() => {
      expect(mockedUpdateRecruitment).toHaveBeenCalledWith(
        1,
        newTitle,
        newExplanation,
      );
    });

    // 画面に変更が反映されているか確認
    await waitFor(() => {
      expect(screen.getByText(newTitle)).toBeInTheDocument();
      expect(screen.getByText(newExplanation)).toBeInTheDocument();
    });

    // フォームが閉じていることを確認
    expect(screen.queryByText("保存")).not.toBeInTheDocument();
    expect(screen.queryByDisplayValue(newTitle)).not.toBeInTheDocument();
  });
});
