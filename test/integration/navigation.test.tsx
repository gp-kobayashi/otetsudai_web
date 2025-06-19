vi.mock("@/utils/supabase/server", () => ({
  createClient: vi.fn(),
}));
vi.mock("@/lib/supabase_function/profile", () => ({
  fetchProfile: vi.fn(),
}));

import { beforeEach, describe, expect, type Mock, test, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import Navigation from "@/components/navigation/Navigation";
import { createClient } from "@/utils/supabase/server";
import { fetchProfile } from "@/lib/supabase_function/profile";

const mockedCreateClient = createClient as Mock;
const mockedFetchProfile = fetchProfile as Mock;

describe("navigation", () => {
  beforeEach(() => {
    mockedCreateClient.mockClear();
    mockedFetchProfile.mockClear();
  });
  test("ユーザー未ログイン状態の確認", async () => {
    mockedCreateClient.mockReturnValue({
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: null } }),
      },
    });
    const { findByText } = render(await Navigation());

    await findByText("ログイン");
  });
  test("ログイン状態の確認", async () => {
    mockedCreateClient.mockReturnValue({
      auth: {
        getUser: vi
          .fn()
          .mockResolvedValue({ data: { user: { id: "user123" } } }),
      },
    });
    mockedFetchProfile.mockResolvedValue({
      data: { username: "testuser" },
    });

    render(await Navigation());

    expect(screen.getByText("profile")).toBeInTheDocument();
  });
  test("ログイン済みだが、ユーザー名がない場合、ユーザー名登録ページへのリンクが表示される", async () => {
    mockedCreateClient.mockReturnValue({
      auth: {
        getUser: vi
          .fn()
          .mockResolvedValue({ data: { user: { id: "user123" } } }),
      },
    });
    mockedFetchProfile.mockResolvedValue({
      data: { username: null },
    });

    render(await Navigation());

    const profileLink = screen.getByText("profile");

    expect(profileLink).toHaveAttribute("href", "/insertUserName");
  });
  test("ログイン済みでユーザー名がある場合、正しいプロフィールページへのリンクが表示される", async () => {
    mockedCreateClient.mockReturnValue({
      auth: {
        getUser: vi
          .fn()
          .mockResolvedValue({ data: { user: { id: "user123" } } }),
      },
    });
    mockedFetchProfile.mockResolvedValue({
      data: { username: "testuser" },
    });

    render(await Navigation());

    const profileLink = screen.getByText("profile");

    expect(profileLink).toHaveAttribute("href", "/userProfile/testuser");
  });

  test("プロフィールの取得に失敗した場合も各ページへのリンクが表示される", async () => {
    mockedCreateClient.mockReturnValue({
      auth: {
        getUser: vi
          .fn()
          .mockResolvedValue({ data: { user: { id: "user123" } } }),
      },
    });

    mockedFetchProfile.mockRejectedValue(new Error("Failed to fetch"));

    render(await Navigation());

    const profileLink = screen.getByText("profile");

    expect(profileLink).toHaveAttribute("href", "/insertUserName");
  });
});
