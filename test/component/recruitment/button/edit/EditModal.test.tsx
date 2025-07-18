import { describe, expect, test, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import EditModal from "@/components/recruitment/recruitmentBtn/edit/EditModal";
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
const mockNoRecruitmentData = {
  id: 0,
  title: "",
  explanation: "",
  tag: "",
  status: "",
  user_id: "",
  username: "",
  avatar_url: "",
  created_at: "",
  updated_at: "",
};
const mockOnClose = vi.fn();
const mockOnSave = vi.fn();

describe("EditModal Component", () => {
  test("モーダルが正しくレンダリングされる", () => {
    render(
      <EditModal
        recruitmentData={mockRecruitmentData}
        isEditOpen={true}
        onClose={mockOnClose}
        onSave={mockOnSave}
      />,
    );
    expect(screen.getByLabelText("タイトル")).toHaveValue(
      mockRecruitmentData.title,
    );
    expect(screen.getByLabelText("内容")).toHaveValue(
      mockRecruitmentData.explanation,
    );
  });

  test("モーダルが閉じる", () => {
    render(
      <EditModal
        recruitmentData={mockRecruitmentData}
        isEditOpen={true}
        onClose={mockOnClose}
        onSave={mockOnSave}
      />,
    );
    const closeButton = screen.getByRole("button", { name: "×" });
    closeButton.click();
    expect(mockOnClose).toHaveBeenCalled();
  });

  test("保存ボタンがクリックされたときにonSaveが呼ばれる", () => {
    render(
      <EditModal
        recruitmentData={mockRecruitmentData}
        isEditOpen={true}
        onClose={mockOnClose}
        onSave={mockOnSave}
      />,
    );
    const saveButton = screen.getByRole("button", { name: "保存" });
    saveButton.click();
    expect(mockOnSave).toHaveBeenCalledWith({
      title: mockRecruitmentData.title,
      explanation: mockRecruitmentData.explanation,
    });
  });
  test("データがない場合、アラートが表示される", () => {
    render(
      <EditModal
        recruitmentData={mockNoRecruitmentData as RecruitmentWithProfile}
        isEditOpen={true}
        onClose={mockOnClose}
        onSave={mockOnSave}
      />,
    );
    window.alert = vi.fn();
    const saveButton = screen.getByRole("button", { name: "保存" });
    saveButton.click();
    expect(window.alert).toHaveBeenCalledWith("タイトルと内容は必須です");
  });
});
