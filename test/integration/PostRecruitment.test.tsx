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

// 共通モック関数
const mockAuthUser = (user: { id: string } | null = { id: "user123" }) => {
  vi.doMock("@/utils/supabase/server", () => ({
    createClient: async () => ({
      auth: {
        getUser: async () => ({ data: { user } }),
      },
    }),
  }));
};

type MockProfile = {
  id: string;
  username: string | null;
  website: string;
  avatar_url: string;
  bio: string;
} | null;

const mockProfile = (
  profile: MockProfile = {
    id: "user123",
    username: "testuser",
    website: "http://example.com",
    avatar_url: "avatar.png",
    bio: "テスト",
  },
) => {
  vi.doMock("@/lib/supabase_function/profile", () => ({
    fetchProfile: () => Promise.resolve({ data: profile }),
  }));
};

type MockAddRecruitmentResult = {
  error: { message: string } | null;
};

const mockAddRecruitment = (
  result: MockAddRecruitmentResult = { error: null },
) => {
  const addRecruitmentMock = vi.fn().mockResolvedValue(result);
  vi.doMock("@/lib/supabase_function/recruitment", () => ({
    addRecruitment: addRecruitmentMock,
  }));
  return { addRecruitmentMock };
};

describe("CreateRecruitmentPage", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.spyOn(window, "alert").mockImplementation(() => {});
    pushMock.mockClear();
    redirectMock.mockClear();
  });
  afterEach(() => {
    vi.resetModules();
  });

  test("認証済みユーザーが正しい値を入力し投稿に成功すると、addRecruitmentとpushが正しく呼ばれる", async () => {
    mockAuthUser();
    mockProfile();
    const { addRecruitmentMock } = mockAddRecruitment();

    const { default: createRecruitment } = await import(
      "@/app/createRecruitment/page"
    );
    const authenticatedPage = await createRecruitment();
    render(authenticatedPage);

    fireEvent.change(screen.getByLabelText("タイトル:"), {
      target: { value: "テストタイトル" },
    });
    fireEvent.change(screen.getByLabelText("内容:"), {
      target: { value: "テスト内容" },
    });
    fireEvent.change(screen.getByLabelText("カテゴリー:"), {
      target: { value: "Video" },
    });

    fireEvent.click(screen.getByRole("button", { name: "募集する" }));

    await waitFor(() => {
      // addRecruitmentが正しく呼ばれたか
      expect(addRecruitmentMock).toHaveBeenCalledWith(
        "テストタイトル",
        "テスト内容",
        "user123",
        "Video",
      );
      // pushが呼ばれたか
      expect(pushMock).toHaveBeenCalledWith("/");
    });
  });

  test("未ログインユーザーはページレベルでリダイレクトされる", async () => {
    mockAuthUser(null);
    mockProfile();
    mockAddRecruitment();

    const { default: createRecruitment } = await import(
      "@/app/createRecruitment/page"
    );
    await expect(createRecruitment()).rejects.toThrow("NEXT_REDIRECT");
    expect(redirectMock).toHaveBeenCalledWith("/login");
  });

  test("ユーザープロフィールが取得できない場合、リダイレクトされる", async () => {
    mockAuthUser();
    mockProfile(null);
    mockAddRecruitment();

    const { default: createRecruitment } = await import(
      "@/app/createRecruitment/page"
    );
    await expect(createRecruitment()).rejects.toThrow("NEXT_REDIRECT");
    expect(redirectMock).toHaveBeenCalledWith("/login");
  });

  test("ユーザー名が未設定の場合、リダイレクトされる", async () => {
    mockAuthUser();
    mockProfile({
      id: "user123",
      username: null,
      website: "http://example.com",
      avatar_url: "avatar.png",
      bio: "テスト",
    });
    mockAddRecruitment();

    const { default: createRecruitment } = await import(
      "@/app/createRecruitment/page"
    );
    await expect(createRecruitment()).rejects.toThrow("NEXT_REDIRECT");
    expect(redirectMock).toHaveBeenCalledWith("/insertUserName");
  });

  test("認証ユーザーがフォームに空の値を入力した場合、エラーメッセージが表示される", async () => {
    mockAuthUser();
    mockProfile();
    mockAddRecruitment();

    const { default: createRecruitment } = await import(
      "@/app/createRecruitment/page"
    );
    const authenticatedPage = await createRecruitment();
    render(authenticatedPage);

    fireEvent.click(screen.getByRole("button", { name: "募集する" }));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith("タイトルと内容は必須です");
    });
  });

  test("認証ユーザーが正しい値を入力したが投稿に失敗した場合、エラーメッセージが表示される", async () => {
    mockAuthUser();
    mockProfile();
    mockAddRecruitment({ error: { message: "投稿に失敗しました" } });

    const { default: createRecruitment } = await import(
      "@/app/createRecruitment/page"
    );
    const authenticatedPage = await createRecruitment();
    render(authenticatedPage);

    fireEvent.change(screen.getByLabelText("タイトル:"), {
      target: { value: "失敗テストタイトル" },
    });
    fireEvent.change(screen.getByLabelText("内容:"), {
      target: { value: "失敗テスト内容" },
    });
    fireEvent.change(screen.getByLabelText("カテゴリー:"), {
      target: { value: "Video" },
    });

    fireEvent.click(screen.getByRole("button", { name: "募集する" }));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith("投稿に失敗しました");
    });
    expect(pushMock).not.toHaveBeenCalled();
  });

  test("例外的なエラーが出た場合、アラートでエラーメッセージが表示される", async () => {
    mockAuthUser();
    mockProfile();
    // addRecruitmentが例外をスローするようにモック
    vi.doMock("@/lib/supabase_function/recruitment", () => ({
      addRecruitment: vi
        .fn()
        .mockRejectedValue(new Error("Database connection failed")),
    }));

    const { default: createRecruitment } = await import(
      "@/app/createRecruitment/page"
    );
    const authenticatedPage = await createRecruitment();
    render(authenticatedPage);

    // フォームに入力して送信
    fireEvent.change(screen.getByLabelText("タイトル:"), {
      target: { value: "例外テスト" },
    });
    fireEvent.change(screen.getByLabelText("内容:"), {
      target: { value: "例外テストの内容" },
    });
    fireEvent.click(screen.getByRole("button", { name: "募集する" }));

    // アラートが表示されることを確認
    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith("投稿に失敗しました");
    });

    // ページ遷移が起こらないことを確認
    expect(pushMock).not.toHaveBeenCalled();
  });
});
