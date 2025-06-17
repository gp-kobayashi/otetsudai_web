import { describe, expect, test, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import EditButton from "@/components/recruitment/recruitmentBtn/edit/EditButton";
import { RecruitmentWithProfile } from "@/types/supabase/types";

const mockRecruitmentData: RecruitmentWithProfile = {
  id: 1,
  title: "テスト募集",
  explanation: "テスト内容",
  tag: "Video",
  status: "募集中",
  user_id: "user123",
  username: "testuser",
  avatar_url: "https://example.com/avatar.jpg",
  created_at: "2025-10-01T00:00:00Z",
  updated_at: "2025-10-01T00:00:00Z",
};
const mockOnUpdate = vi.fn();
describe("EditButton Component", () => {
  test("編集ボタンが正しくレンダリングされる", () => {
    render(
      <EditButton
        recruitmentData={mockRecruitmentData}
        onUpdate={mockOnUpdate}
      />,
    );
    expect(
      screen.getByRole("button", { name: "内容を編集する" }),
    ).toBeInTheDocument();
  });

  test("編集モーダルが開く", () => {
    render(
      <EditButton
        recruitmentData={mockRecruitmentData}
        onUpdate={mockOnUpdate}
      />,
    );
    const editButton = screen.getByRole("button", { name: "内容を編集する" });

    editButton.click();
    expect(screen.getByText("内容を編集する")).toBeInTheDocument();
  });
});
