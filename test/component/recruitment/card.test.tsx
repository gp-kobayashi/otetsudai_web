import { describe, expect, test, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import RecruitmentCard from "@/components/recruitment/card/card";
import { RecruitmentWithProfile } from "@/types/supabase/types";
const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

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
  const mockNoRecruitment = {
    id: 0,
    title: "",
    explanation: "",
    status: "",
    tag: "",
    username: "",
    avatar_url: "",
    created_at: "",
    updated_at: "",
    user_id: "",
  };

  test("初期レンダリングが行われる", () => {
    render(<RecruitmentCard recruitment={mockRecruitment} />);
    expect(screen.getByText("募集のテストをします")).toBeInTheDocument();
    expect(screen.getByText("募集のテスト説明です。")).toBeInTheDocument();
    expect(screen.getByText("募集中")).toBeInTheDocument();
    expect(screen.getByText("programming")).toBeInTheDocument();
    expect(screen.getByText("testuser")).toBeInTheDocument();
    const avatar = screen.getByAltText("avatar");
    expect(avatar).toBeInTheDocument();
  });
  test("クリックで詳細ページに遷移する", async () => {
    render(<RecruitmentCard recruitment={mockRecruitment} />);
    const listItem = screen.getByText("募集のテストをします").closest("li");
    expect(listItem).toBeInTheDocument();
    listItem?.click();
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/recruitment/1");
    });
  });
  test("cssクラスが適用されている", () => {
    render(<RecruitmentCard recruitment={mockRecruitment} />);
    const listItem = screen.getByText("募集のテストをします").closest("li");
    expect(listItem?.className).toEqual(
      expect.stringContaining("recruitment_list"),
    );
    expect(screen.getByText("募集中").className).toEqual(
      expect.stringContaining("info_status"),
    );
    expect(screen.getByText("programming").className).toEqual(
      expect.stringContaining("info_tag"),
    );
    expect(screen.getByText("testuser").className).toEqual(
      expect.stringContaining("info_item"),
    );
  });
  test("データが空の場合、要素が表示されない", () => {
    render(
      <RecruitmentCard
        recruitment={mockNoRecruitment as unknown as RecruitmentWithProfile}
      />,
    );
    expect(screen.queryByText(/.+/)).not.toBeInTheDocument();
  });
  test("avatar_urlが空の場合、デフォルトのアバターURLが使用される", () => {
    render(
      <RecruitmentCard
        recruitment={mockNoRecruitment as unknown as RecruitmentWithProfile}
      />,
    );
    const avatar = screen.getByAltText("avatar");
    expect(avatar?.getAttribute("src")).toContain("default.png");
  });
});
