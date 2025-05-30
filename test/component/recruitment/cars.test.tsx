import { describe, expect, test } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import RecruitmentCard from "@/components/recruitment/card/card";
import { RecruitmentWithProfile } from "@/types/supabase/types";

describe("RecruitmentCard", () => {
  const mockRecruitment: RecruitmentWithProfile = {
    id: 1,
    title: "募集のテストをします",
    explanation: "募集のテスト説明です。",
    status: "募集中",
    tag: "programming",
    username: "testuser",
    avatar_url: "https://example.com/avatar.png",
    created_at: "2025-10-05T00:00:00Z",
    updated_at: "2025-10-05T00:00:00Z",
    user_id: "user_123",
  };

  test("初期レンダリングが行われる", () => {
    render(<RecruitmentCard recruitment={mockRecruitment} />);
    expect(screen.getByText("募集のテストをします")).toBeInTheDocument();
    expect(screen.getByText("募集のテスト説明です。")).toBeInTheDocument();
    expect(screen.getByText("募集中")).toBeInTheDocument();
    expect(screen.getByText("programming")).toBeInTheDocument();
  });
});
