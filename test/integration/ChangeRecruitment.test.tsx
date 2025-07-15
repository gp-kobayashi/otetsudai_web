import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, expect, test, vi, beforeEach, type Mock } from "vitest";

vi.mock("@/utils/supabase/client", () => ({
  createClient: () => ({
    storage: {
      from: () => ({
        download: vi.fn().mockResolvedValue({
          data: new Blob(["avatar-image-data"]),
          error: null,
        }),
        upload: vi.fn().mockResolvedValue({ error: null }),
        getPublicUrl: vi.fn((path) => ({
          data: { publicUrl: `https://example.com/avatars/${path}` },
        })),
      }),
    },
    from: vi.fn().mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockResolvedValue({ data: [], error: null }),
    }),
  }),
}));

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
  vi.doMock("@/lib/supabase_function/profile", async (importOriginal) => {
    const original =
      await importOriginal<typeof import("@/lib/supabase_function/profile")>();
    return {
      ...original,
      fetchProfile: async () => ({ data: profile }),
    };
  });
};

type RecruitmentData = {
  id: number;
  user_id: string;
  title: string;
  explanation: string;
  status: string;
  username: string | null;
  avatar_url: string | null;
  tag: string;
  created_at: string;
} | null;

const setupRecruitment = (
  recruitmentData: RecruitmentData = null,
  updateRecruitmentFn?: () => Promise<{ error: null }>,
  deleteRecruitmentFn?: () => Promise<{ error: null }>,
) => {
  vi.doMock("@/lib/supabase_function/recruitment", () => ({
    getRecruitmentById: async () => ({ data: recruitmentData }),
    ...(updateRecruitmentFn ? { updateRecruitment: updateRecruitmentFn } : {}),
    ...(deleteRecruitmentFn ? { deleteRecruitment: deleteRecruitmentFn } : {}),
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
      username: "testuser",
      avatar_url: null,
      tag: "test",
      created_at: "2023-01-01T00:00:00Z",
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
      username: "testuser",
      avatar_url: null,
      tag: "test",
      created_at: "2023-01-01T00:00:00Z",
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
      username: "testuser",
      avatar_url: null,
      tag: "test",
      created_at: "2023-01-01T00:00:00Z",
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
      username: "testuser",
      avatar_url: null,
      tag: "test",
      created_at: "2023-01-01T00:00:00Z",
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
        username: "testuser",
        avatar_url: null,
        tag: "test",
        created_at: "2023-01-01T00:00:00Z",
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

  test("募集とユーザー情報が正常に表示される場合、コメント欄も表示される", async () => {
    setupUser("user1");
    setupProfile();
    setupRecruitment({
      id: 1,
      user_id: "user1",
      title: "テストタイトル",
      explanation: "これは募集の内容です",
      status: "open",
      username: "testuser",
      avatar_url: null,
      tag: "test",
      created_at: "2023-01-01T00:00:00Z",
    });

    const { default: RecruitmentPage } = await import(
      "@/app/recruitment/[id]/page"
    );
    const rendered = await RecruitmentPage({
      params: Promise.resolve({ id: 1 }),
    });
    render(rendered);

    // 募集タイトル・内容・ユーザー名が表示されていることを確認
    expect(await screen.findByText("テストタイトル")).toBeInTheDocument();
    expect(screen.getByText("これは募集の内容です")).toBeInTheDocument();
    expect(screen.getByText("testuser")).toBeInTheDocument();

    // コメント欄の投稿ボタンが表示されていることを確認
    expect(
      await screen.findByRole("button", { name: "投稿" }),
    ).toBeInTheDocument();
  });

  test("投稿者が削除ボタンを押すと、APIが呼ばれリダイレクトされる", async () => {
    setupUser("user1");
    setupProfile();
    const mockedDeleteRecruitment = vi.fn().mockResolvedValue({ error: null });
    setupRecruitment(
      {
        id: 1,
        user_id: "user1",
        title: "削除される募集",
        explanation: "この募集は削除されます",
        status: "open",
        username: "testuser",
        avatar_url: null,
        tag: "test",
        created_at: "2023-01-01T00:00:00Z",
      },
      undefined,
      mockedDeleteRecruitment,
    );

    // window.confirmをモック化し、常にtrueを返すようにする
    vi.spyOn(window, "confirm").mockReturnValue(true);

    const { default: RecruitmentPage } = await import(
      "@/app/recruitment/[id]/page"
    );
    const rendered = await RecruitmentPage({
      params: Promise.resolve({ id: 1 }),
    });
    render(rendered);

    // 削除ボタンをクリック
    // 注: Recruitmentコンポーネントに name="削除する" のボタン実装が必要
    const deleteButton = await screen.findByRole("button", {
      name: "削除",
    });
    fireEvent.click(deleteButton);

    // 確認ダイアログが表示されたことを確認
    expect(window.confirm).toHaveBeenCalledWith("本当に削除しますか？");

    // deleteRecruitmentが正しい引数で呼び出されたか確認
    await waitFor(() => {
      expect(mockedDeleteRecruitment).toHaveBeenCalledWith(1);
    });

    // router.pushが呼ばれ、トップページにリダイレクトされることを確認
    await waitFor(() => {
      expect(pushMock).toHaveBeenCalledWith("/");
    });
  });
  test("投稿者以外には削除ボタンが表示されない", async () => {
    setupUser("user2");
    setupProfile({ id: "user2", username: "testuser2", avatar_url: null });
    setupRecruitment({
      id: 1,
      user_id: "user1",
      title: "テストタイトル",
      explanation: "これは募集の内容です",
      status: "open",
      username: "testuser",
      avatar_url: null,
      tag: "test",
      created_at: "2023-01-01T00:00:00Z",
    });

    const { default: RecruitmentPage } = await import(
      "@/app/recruitment/[id]/page"
    );
    const rendered = await RecruitmentPage({
      params: Promise.resolve({ id: 1 }),
    });
    render(rendered);

    // 削除ボタンが表示されないことを確認
    expect(
      screen.queryByRole("button", { name: "削除" }),
    ).not.toBeInTheDocument();
  });
  test("ユーザーがログインしていない場合、/loginにリダイレクトされる", async () => {
    // ログインしていない状態を直接モックする
    vi.doMock("@/utils/supabase/server", () => ({
      createClient: async () => ({
        auth: {
          getUser: async () => ({ data: { user: null } }),
        },
      }),
    }));
    setupRecruitment({
      id: 1,
      user_id: "user1",
      title: "テストタイトル",
      explanation: "これは募集の内容です",
      status: "open",
      username: "testuser",
      avatar_url: null,
      tag: "test",
      created_at: "2023-01-01T00:00:00Z",
    });
    const { default: RecruitmentPage } = await import(
      "@/app/recruitment/[id]/page"
    );
    await expect(
      RecruitmentPage({ params: Promise.resolve({ id: 1 }) }),
    ).rejects.toThrow("NEXT_REDIRECT");
    expect(redirectMock).toHaveBeenCalledWith("/login");
  });
  test("ステータスが更新されると、画面に反映される", async () => {
    setupUser("user1");
    setupProfile();

    // updateRecruitmentは使われていないので不要
    // updateStatusをモック
    vi.doMock("@/lib/supabase_function/recruitment", () => ({
      getRecruitmentById: async () => ({
        data: {
          id: 1,
          user_id: "user1",
          title: "テストタイトル",
          explanation: "これは募集の内容です",
          status: "募集中",
          username: "testuser",
          avatar_url: null,
          tag: "test",
          created_at: "2023-01-01T00:00:00Z",
        },
      }),
      updateStatus: vi.fn().mockResolvedValue({ error: null }),
    }));

    const { default: RecruitmentPage } = await import(
      "@/app/recruitment/[id]/page"
    );
    const rendered = await RecruitmentPage({
      params: Promise.resolve({ id: 1 }),
    });
    render(rendered);

    // ステータスが初期値で表示されていることを確認
    expect(screen.getAllByText("募集中").length).toBeGreaterThan(0);

    // ステータス変更ラベルをクリックしてセレクトボックスを取得
    const statusLabel = screen.getByText("ステータス変更");
    fireEvent.click(statusLabel);

    const statusSelect = screen.getByRole("combobox");
    expect(statusSelect).toBeInTheDocument();

    // ステータスを「キャンセル」に変更
    fireEvent.change(statusSelect, { target: { value: "キャンセル" } });

    // 画面に新しいステータスが反映されていることを確認
    await waitFor(() => {
      expect(screen.getByText("キャンセル")).toBeVisible();
    });
  });
  test("コメントを投稿し、画面に反映される", async () => {
    setupUser("user1");
    setupProfile();
    setupRecruitment({
      id: 1,
      user_id: "user1",
      title: "テストタイトル",
      explanation: "これは募集の内容です",
      status: "open",
      username: "testuser",
      avatar_url: null,
      tag: "test",
      created_at: "2023-01-01T00:00:00Z",
    });

    vi.doMock("@/lib/supabase_function/comment", () => ({
      addComment: async (
        userId: string,
        recruitmentId: number,
        text: string,
      ) => ({
        data: {
          id: 2,
          user_id: userId,
          recruitment_id: recruitmentId,
          text,
          created_at: new Date().toISOString(),
        },
        error: null,
      }),
      getCommentByRecruitment: async (recruitmentId: number) => ({
        data: [
          {
            id: 1,
            user_id: "user1",
            recruitment_id: recruitmentId,
            text: "初めてのコメント",
            created_at: new Date().toISOString(),
            profile: { username: "testuser", avatar_url: null },
          },
        ],
        error: null,
      }),
    }));

    const { default: RecruitmentPage } = await import(
      "@/app/recruitment/[id]/page"
    );
    const rendered = await RecruitmentPage({
      params: Promise.resolve({ id: 1 }),
    });
    render(rendered);

    // コメント欄が表示されていることを確認
    expect(await screen.findByText("コメントを投稿:")).toBeInTheDocument();

    // コメント入力欄にテキストを入力
    const commentInput = screen.getByRole("textbox");
    fireEvent.change(commentInput, { target: { value: "新しいコメント" } });

    // 投稿ボタンをクリック
    const submitButton = screen.getByRole("button", { name: "投稿" });
    fireEvent.click(submitButton);

    // コメントが追加され、画面に反映されていることを確認
    await waitFor(() => {
      expect(screen.getByText("新しいコメント")).toBeInTheDocument();
    });

    // 初期コメントも表示されていることを確認
    expect(screen.getByText("初めてのコメント")).toBeInTheDocument();
  });
});
