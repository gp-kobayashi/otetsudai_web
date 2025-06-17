import { beforeEach, describe, expect, test, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import UserRecruitmentList from "@/components/profiles/user/UserRecruitmentList";
import type { Recruitment } from "@/types/supabase/types";
import userEvent from "@testing-library/user-event";

const mockPush = vi.fn();
const mockRefresh = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
    refresh: mockRefresh,
  }),
}));

vi.mock("@/lib/supabase_function/recruitment", () => ({
  deleteRecruitment: vi.fn(),
}));

beforeEach(() => {
  vi.clearAllMocks();
});

const mockRecruitment: Recruitment[] = [
  {
    id: 1,
    title: "募集のテストをします",
    explanation: "募集のテスト説明です。",
    status: "募集中",
    tag: "programming",
    created_at: "2025-10-05T00:00:00Z",
    updated_at: "2025-10-05T00:00:00Z",
    user_id: "user_123",
  },
  {
    id: 2,
    title: "募集のテストをします2",
    explanation: "募集のテスト説明です2",
    status: "キャンセル",
    tag: "Video",
    created_at: "2025-10-06T00:00:00Z",
    updated_at: "2025-10-06T00:00:00Z",
    user_id: "user_456",
  },
];

describe("UserRecruitmentList Component", () => {
  test("コンポーネントが正しくレンダリングされる", () => {
    const mockProps = {
      recruitmentList: mockRecruitment,
      checkUsername: true,
    };
    render(<UserRecruitmentList {...mockProps} />);
    expect(screen.getByText("募集のテストをします")).toBeInTheDocument();
    expect(screen.getByText("募集のテスト説明です。")).toBeInTheDocument();
    expect(screen.getByText("募集中")).toBeInTheDocument();
    expect(screen.getByText("programming")).toBeInTheDocument();

    expect(screen.getByText("募集のテストをします2")).toBeInTheDocument();
    expect(screen.getByText("募集のテスト説明です2")).toBeInTheDocument();
    expect(screen.getByText("キャンセル")).toBeInTheDocument();
    expect(screen.getByText("Video")).toBeInTheDocument();
  });

  test("データが空でもエラーが発生しない", () => {
    const mockEmptyProps = {
      recruitmentList: [],
      checkUsername: true,
    };
    expect(() => {
      render(<UserRecruitmentList {...mockEmptyProps} />);
    }).not.toThrow();
  });

  test("募集がない場合のメッセージが表示される", () => {
    const mockEmptyProps = {
      recruitmentList: null,
      checkUsername: true,
    };
    render(<UserRecruitmentList {...mockEmptyProps} />);
    expect(screen.getByText("募集がありません")).toBeInTheDocument();
  });
  test("usernameが一致した場合、削除ボタンが表示される", () => {
    const mockProps = {
      recruitmentList: mockRecruitment,
      checkUsername: true,
    };
    render(<UserRecruitmentList {...mockProps} />);
    const deleteButtons = screen.getAllByRole("button", { name: "削除" });
    expect(deleteButtons).toHaveLength(2);
  });
  test("usernameが一致しない場合、削除ボタンが表示されない", () => {
    const mockUsenameFalseProps = {
      recruitmentList: mockRecruitment,
      checkUsername: false,
    };
    render(<UserRecruitmentList {...mockUsenameFalseProps} />);
    const deleteButton = screen.queryByText("削除");
    expect(deleteButton).not.toBeInTheDocument();
  });
  test("募集がクリックされたときに詳細ページに遷移する", () => {
    const mockProps = {
      recruitmentList: mockRecruitment,
      checkUsername: true,
    };

    render(<UserRecruitmentList {...mockProps} />);

    const listItem = screen.getByText("募集のテストをします").closest("li");
    listItem?.click();
    expect(mockPush).toHaveBeenCalledWith("/recruitment/1");

    const listItem2 = screen.getByText("募集のテストをします2").closest("li");
    listItem2?.click();
    expect(mockPush).toHaveBeenCalledWith("/recruitment/2");
  });
  test("削除ボタンをクリック時に確認ダイアログが表示されOKを押すと削除される", async () => {
    const { deleteRecruitment } = await import(
      "@/lib/supabase_function/recruitment"
    );

    const mockProps = {
      recruitmentList: mockRecruitment,
      checkUsername: true,
    };
    render(<UserRecruitmentList {...mockProps} />);
    window.confirm = vi.fn(() => true);
    const deleteButton = screen.getAllByRole("button", { name: "削除" })[0];
    await userEvent.click(deleteButton);
    expect(window.confirm).toHaveBeenCalledWith("本当に削除しますか？");

    expect(deleteRecruitment).toHaveBeenCalledWith(mockRecruitment[0].id);

    expect(mockRefresh).toHaveBeenCalled();
  });
  test("削除ボタンをクリック時に確認ダイアログが表示されキャンセルを押すと削除されない", async () => {
    const mockProps = {
      recruitmentList: mockRecruitment,
      checkUsername: true,
    };
    mockPush.mockClear();
    render(<UserRecruitmentList {...mockProps} />);

    const deleteButton = screen.getAllByText("削除")[0];
    window.confirm = vi.fn(() => false);
    deleteButton.click();

    expect(window.confirm).toHaveBeenCalledWith("本当に削除しますか？");
    expect(mockPush).not.toHaveBeenCalled();
  });
  test("削除ボタンクリックでstopPropagationが呼ばれ、router.pushは発火しない", () => {
    const mockProps = {
      recruitmentList: mockRecruitment,
      checkUsername: true,
    };
    mockPush.mockClear();

    const confirmSpy = vi
      .spyOn(window, "confirm")
      .mockImplementation(() => false);

    render(<UserRecruitmentList {...mockProps} />);

    const deleteButton = screen.getAllByText("削除")[0];
    const clickEvent = new MouseEvent("click", {
      bubbles: true,
      cancelable: true,
    });

    const stopPropagationSpy = vi.fn();
    Object.defineProperty(clickEvent, "stopPropagation", {
      value: stopPropagationSpy,
    });
    deleteButton.dispatchEvent(clickEvent);
    expect(stopPropagationSpy).toHaveBeenCalled();
    expect(mockPush).not.toHaveBeenCalled();
    confirmSpy.mockRestore();
  });
});
