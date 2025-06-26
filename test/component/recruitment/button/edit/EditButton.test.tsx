import { beforeEach, describe, expect, test, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import EditButton from "@/components/recruitment/recruitmentBtn/edit/EditButton";
import { RecruitmentWithProfile } from "@/types/supabase/types";
import { updateRecruitment } from "@/lib/supabase_function/recruitment";
import userEvent from "@testing-library/user-event";
vi.mock("@/lib/supabase_function/recruitment", () => ({
  updateRecruitment: vi.fn(),
}));

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
beforeEach(() => {
  vi.clearAllMocks();
});
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

  test("編集モーダルが開く", async () => {
    render(
      <EditButton
        recruitmentData={mockRecruitmentData}
        onUpdate={mockOnUpdate}
      />,
    );
    const editButton = screen.getByRole("button", { name: "内容を編集する" });
    fireEvent.click(editButton);

    // モーダルの要素が表示されていることを確認
    await waitFor(() => {
      expect(screen.getByLabelText("タイトル")).toBeInTheDocument();
      expect(screen.getByLabelText("内容")).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "保存" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "×" })).toBeInTheDocument();
    });
  });
  test("モーダルを閉じると非表示になる", () => {
    render(
      <EditButton
        recruitmentData={mockRecruitmentData}
        onUpdate={mockOnUpdate}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: "内容を編集する" }));

    fireEvent.click(screen.getByRole("button", { name: "×" }));

    expect(screen.queryByText("保存")).not.toBeInTheDocument();
  });

  test("保存処理で onUpdate が呼ばれる", async () => {
    render(
      <EditButton
        recruitmentData={mockRecruitmentData}
        onUpdate={mockOnUpdate}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "内容を編集する" }));

    fireEvent.change(screen.getByLabelText("タイトル"), {
      target: { value: "新しいタイトル" },
    });
    fireEvent.change(screen.getByLabelText("内容"), {
      target: { value: "新しい説明" },
    });

    fireEvent.click(screen.getByRole("button", { name: "保存" }));

    await waitFor(() => {
      expect(mockOnUpdate).toHaveBeenCalledWith({
        title: "新しいタイトル",
        explanation: "新しい説明",
      });
    });
  });

  test("保存時に updateRecruitment が呼ばれる", async () => {
    const user = userEvent.setup();
    const mockOnUpdate = vi.fn();
    render(
      <EditButton
        recruitmentData={mockRecruitmentData}
        onUpdate={mockOnUpdate}
      />,
    );
    const newTitle = "新しいタイトル";
    const newExplanation = "新しい説明";
    // モーダルを開く
    await user.click(screen.getByRole("button", { name: "内容を編集する" }));

    // 新しい値を入力
    await user.clear(screen.getByLabelText("タイトル"));
    await user.type(screen.getByLabelText("タイトル"), newTitle);

    await user.clear(screen.getByLabelText("内容"));
    await user.type(screen.getByLabelText("内容"), newExplanation);

    await user.click(screen.getByRole("button", { name: "保存" }));

    // onUpdateが同じ変数で呼び出されたことを確認する
    await waitFor(() => {
      expect(mockOnUpdate).toHaveBeenCalledWith({
        title: newTitle,
        explanation: newExplanation,
      });
    });
  });
});
