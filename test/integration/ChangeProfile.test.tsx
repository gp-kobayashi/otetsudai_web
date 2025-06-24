import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, test, vi } from "vitest";
import AccountForm from "@/app/account/account-form";
import UserProfile from "@/app/userProfile/[username]/page";

// 必要なモックを先に定義
vi.mock("@/utils/supabase/client", () => ({
  createClient: () => ({
    from: vi.fn(() => ({
      upsert: vi.fn().mockResolvedValue({ error: null }),
      select: vi.fn(() => ({
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({
          data: {
            username: "newuser",
            website: "https://example.com",
            avatar_url: "avatar.png",
            bio: "こんにちは",
          },
        }),
      })),
    })),
    auth: {
      getUser: vi.fn().mockResolvedValue({ data: { user: { id: "user123" } } }),
    },
  }),
}));

vi.mock("@/lib/supabase_function/profile", () => ({
  fetchProfile: vi.fn().mockResolvedValue({
    data: { username: "newuser" },
  }),
  fetchProfileByUsername: vi.fn().mockResolvedValue({
    data: {
      id: "user123",
      username: "newuser",
      website: "https://example.com",
      avatar_url: "avatar.png",
      bio: "こんにちは",
    },
  }),
  formatAvatarUrl: (url: string) => `/avatars/${url}`,
}));

vi.mock("@/lib/supabase_function/recruitment", () => ({
  getRecruitmentByUserList: vi.fn().mockResolvedValue({ data: [] }),
}));

// UserProfileで使うcreateClientもモック
vi.mock("@/utils/supabase/server", () => ({
  createClient: async () => ({
    auth: {
      getUser: async () => ({ data: { user: { id: "user123" } } }),
    },
  }),
}));
describe("プロフィール更新のテスト", () => {
  beforeEach(() => {
    vi.spyOn(window, "alert").mockImplementation(() => {});
  });
  test("プロフィールの更新が UserProfile に反映される", async () => {
    // Step 1: プロフィール編集フォームに入力して送信
    render(
      <AccountForm
        user={{ id: "user123", email: "user@example.com" } as any}
      />,
    );

    fireEvent.change(screen.getByLabelText("Username"), {
      target: { value: "newuser" },
    });
    fireEvent.change(screen.getByLabelText("Website"), {
      target: { value: "https://example.com" },
    });
    fireEvent.change(screen.getByLabelText("自己紹介"), {
      target: { value: "こんにちは" },
    });

    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Update" })).toBeEnabled();
    });
    fireEvent.click(screen.getByRole("button", { name: "Update" }));

    // Step 2: プロフィールページに新しいデータが表示されるか確認
    const params = Promise.resolve({ username: "newuser" });
    const UserProfileComponent = await UserProfile({ params });

    render(UserProfileComponent);

    expect(await screen.findByText("newuser")).toBeInTheDocument();
    expect(screen.getByText("https://example.com")).toBeInTheDocument();
    expect(screen.getByText("こんにちは")).toBeInTheDocument();
  });
});
