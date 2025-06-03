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
  test("userIdが一致しない場合、ステータス変更と編集ボタンが表示されない", () => {
    render(<Recruitment {...{ ...mockProps, userId: "otherUser" }} />);
    expect(
      screen.queryByRole("button", { name: "内容を編集する" }),
    ).not.toBeInTheDocument();
    expect(screen.queryByText("ステータス変更")).not.toBeInTheDocument();
  });
  test("データがnullの場合、適切にレンダリングされる", () => {
    render(
      <Recruitment
        data={mockNoData as unknown as RecruitmentWithProfile}
        userId={null}
        id={1}
      />,
    );
    expect(screen.queryByText("テスト募集")).not.toBeInTheDocument();
    expect(screen.queryByText("テスト内容")).not.toBeInTheDocument();
    expect(screen.queryByText("募集中")).not.toBeInTheDocument();
    expect(screen.queryByText("Video")).not.toBeInTheDocument();
    expect(screen.queryByText("testuser")).not.toBeInTheDocument();
  });
});
