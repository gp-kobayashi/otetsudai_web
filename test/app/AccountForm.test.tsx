import { describe, expect, test, beforeAll, afterEach, afterAll } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import AccountForm from "../../app/account/account-form";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import { User } from "@supabase/supabase-js";

// 1. テスト用のモックデータ
const mockUser: User = {
  id: "a1b2c3d4-e5f6-7890-1234-567890abcdef",
  email: "test@example.com",
  app_metadata: { provider: "email" },
  user_metadata: {},
  aud: "authenticated",
  created_at: new Date().toISOString(),
};

const mockProfile = {
  username: "testuser",
  website: "https://example.com",
  bio: "This is a test bio.",
  avatar_url: "test-avatar.png",
};

// 2. MSW（Mock Service Worker）によるAPIモックサーバーのセットアップ
const server = setupServer(
  http.get(
    "https://ridyklrbkirszfklksng.supabase.co/rest/v1/profiles",
    ({ request }) => {
      const url = new URL(request.url);
      if (
        url.searchParams.get("id") === `eq.${mockUser.id}` &&
        request.headers.get("Accept") === "application/vnd.pgrst.object+json"
      ) {
        return HttpResponse.json(mockProfile);
      }
    },
  ),
);

// 3. テスト全体のライフサイクルでモックサーバーを制御
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

// 4. テストスイート
describe("AccountForm", () => {
  test("既存のプロフィール情報がフォームの初期値として正しく表示される。", async () => {
    render(<AccountForm user={mockUser} />);

    // フォームの初期値が正しく設定されているか確認
    await waitFor(() => {
      expect(screen.getByLabelText("Username")).toHaveValue(
        mockProfile.username,
      );
      expect(screen.getByLabelText("Website")).toHaveValue(mockProfile.website);
      expect(screen.getByLabelText("自己紹介")).toHaveValue(mockProfile.bio);
    });

    expect(screen.getByLabelText("Email")).toHaveValue(mockUser.email);
  });
});
