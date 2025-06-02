import { describe, expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import Recruitment from "@/components/recruitment/recruitment/recruitment";
import { RecruitmentWithProfile } from "@/types/supabase/types";

const mockData: RecruitmentWithProfile = {
  id: 1,
  title: "テスト募集",
  explanation: "テスト内容",
  tag: "Video",
  status: "募集中",
  user_id: "user123",
  username: "testuser",
  avatar_url: "https://example.com/avatar.jpg",
  created_at: "2023-10-01T00:00:00Z",
  updated_at: "2023-10-01T00:00:00Z",
};

const mockProps = {
  data: mockData,
  userId: "user123",
  id: 1,
};

describe("Recruitment Component", () => {
  test("コンポーネントが正しくレンダリングされる", () => {
    render(<Recruitment {...mockProps} />);
    expect(screen.getByText("テスト募集")).toBeInTheDocument();
    expect(screen.getByText("テスト内容")).toBeInTheDocument();
    expect(screen.getAllByText("募集中")[0]).toBeInTheDocument();
    expect(screen.getByText("Video")).toBeInTheDocument();
    expect(screen.getByText("testuser")).toBeInTheDocument();
  });
  test("userIdが一致する場合、ステータス変更と編集ボタンが表示される", () => {
    render(<Recruitment {...mockProps} />);
    expect(
      screen.getByRole("button", { name: "内容を編集する" }),
    ).toBeInTheDocument();
    expect(screen.getByText("ステータス変更")).toBeInTheDocument();
  });
});
