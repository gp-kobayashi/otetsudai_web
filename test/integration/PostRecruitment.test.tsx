import { describe, expect, test, vi, type Mock } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import {
  addRecruitment,
  getRecruitmentList,
} from "@/lib/supabase_function/recruitment";
import RecruitmentForm from "@/components/recruitment/create/RecruitmentForm";
import MainPageList from "@/components/mainPage/MainPageList";

vi.mock("@/lib/supabase_function/recruitment", () => ({
  addRecruitment: vi.fn(),
  getRecruitmentList: vi.fn(),
}));

describe("PostRecruitment", () => {
  test("投稿後、MainPageList に新しい募集が表示される", async () => {
    const mockRecruitment = {
      id: 1,
      title: "テストタイトル",
      explanation: "テスト内容",
      tag: "Video",
      user_id: "user123",
      profile: {
        username: "testuser",
        avatar_url: "",
      },
    };

    (addRecruitment as Mock).mockResolvedValue(undefined);

    // 一覧取得モック（投稿後に新しいデータを返す）
    (getRecruitmentList as Mock).mockResolvedValue({
      data: [mockRecruitment],
      error: null,
    });

    render(
      <>
        <RecruitmentForm user_id="user123" />
        <MainPageList />
      </>,
    );

    // 入力
    fireEvent.change(screen.getByLabelText("タイトル:"), {
      target: { value: "テストタイトル" },
    });
    fireEvent.change(screen.getByLabelText("内容:"), {
      target: { value: "テスト内容" },
    });

    // カテゴリ選択（任意）
    fireEvent.change(screen.getByLabelText("カテゴリー:"), {
      target: { value: "Video" },
    });

    // 投稿
    fireEvent.click(screen.getByRole("button", { name: "募集する" }));

    // 投稿後の一覧更新を待つ
    await waitFor(() => {
      expect(screen.getByText("テストタイトル")).toBeInTheDocument();
      expect(screen.getByText("テスト内容")).toBeInTheDocument();
    });
  });
  test("タイトルまたは内容が空のとき投稿できず、アラートが出る", () => {
    window.alert = vi.fn();

    render(<RecruitmentForm user_id="user123" />);

    fireEvent.click(screen.getByRole("button", { name: "募集する" }));

    expect(window.alert).toHaveBeenCalledWith("タイトルと内容は必須です");
  });
});
