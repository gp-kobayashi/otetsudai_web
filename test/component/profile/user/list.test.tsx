import { describe, expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import UserRecruitmentList from "@/components/profiles/user/list";
import { RecruitmentWithProfile } from "@/types/supabase/types";

const mockRecruitment = {
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
const mockNoData = {
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
const mockProps = {
  recruitmentList: [mockRecruitment] as RecruitmentWithProfile[],
  checkUsername: true,
};
const mockUsenameFalseProps = {
  recruitmentList: [mockRecruitment] as RecruitmentWithProfile[],
  checkUsername: false,
};
const mockNoProps = {
  recruitmentList: [mockNoData] as RecruitmentWithProfile[],
  checkUsername: false,
};
const mockEmptyProps = {
  recruitmentList: null,
  checkUsername: false,
};

describe("UserRecruitmentList Component", () => {
  test("コンポーネントが正しくレンダリングされる", () => {
    render(<UserRecruitmentList {...mockProps} />);
    expect(screen.getByText("募集のテストをします")).toBeInTheDocument();
    expect(screen.getByText("募集のテスト説明です。")).toBeInTheDocument();
    expect(screen.getByText("募集中")).toBeInTheDocument();
    expect(screen.getByText("programming")).toBeInTheDocument();
  });

  test("データが空でもクラッシュしない", () => {
    expect(() => {
      render(<UserRecruitmentList {...mockNoProps} />);
    }).not.toThrow();
    expect(screen.queryByText("募集のテストをします")).not.toBeInTheDocument();
  });
  test("募集がない場合のメッセージが表示される", () => {
    render(<UserRecruitmentList {...mockEmptyProps} />);
    expect(screen.getByText("募集がありません")).toBeInTheDocument();
  });
  test("usernameが一致した場合、削除ボタンが表示される", () => {
    render(<UserRecruitmentList {...mockProps} />);
    const deleteButton = screen.getByText("削除");
    expect(deleteButton).toBeInTheDocument();
  });
  test("usernameが一致しない場合、削除ボタンが表示されない", () => {
    render(<UserRecruitmentList {...mockUsenameFalseProps} />);
    const deleteButton = screen.queryByText("削除");
    expect(deleteButton).not.toBeInTheDocument();
  });
});
