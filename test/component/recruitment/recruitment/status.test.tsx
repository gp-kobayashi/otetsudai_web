import { describe, expect, test, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import RecruitmentStatus from "@/components/recruitment/recruitment/RecruitmentStatus";
import { STATUS_VALUES } from "@/utils/enum/enum";
import userEvent from "@testing-library/user-event";

const mockProps = {
  id: 1,
  onStatusChange: (status: string) => {},
  currentStatus: "募集中",
};
describe("RecruitmentStatus Component", () => {
  test("正しくレンダリングされる", () => {
    render(<RecruitmentStatus {...mockProps} />);
    expect(screen.getByText("ステータス変更")).toBeInTheDocument();
    STATUS_VALUES.forEach((status) => {
      expect(screen.getByRole("option", { name: status })).toBeInTheDocument();
    });
  });
});
test("初期ステータスが正しく設定される", () => {
  render(<RecruitmentStatus {...mockProps} />);
  const selectElement = screen.getByRole("combobox");
  expect(selectElement).toHaveValue(mockProps.currentStatus);
});

test("ステータス変更時にonStatusChangeが呼ばれる", async () => {
  const user = userEvent.setup();
  const mockOnStatusChange = vi.fn();
  render(
    <RecruitmentStatus
      {...{ ...mockProps, onStatusChange: mockOnStatusChange }}
    />,
  );

  const selectElement = screen.getByRole("combobox");
  await user.selectOptions(selectElement, "キャンセル");

  expect(mockOnStatusChange).toHaveBeenCalledWith("キャンセル");
});
test("存在しないステータスが選択された場合、何も起きないかエラーになる", () => {
  const mockOnStatusChange = vi.fn();
  render(
    <RecruitmentStatus {...mockProps} onStatusChange={mockOnStatusChange} />,
  );
  const select = screen.getByRole("combobox");
  fireEvent.change(select, { target: { value: "不正なステータス" } });
  expect(mockOnStatusChange).not.toHaveBeenCalled();
});
