import { describe, expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import StatusFilter from "@/components/recruitment/category/filter";
import { STATUS_VALUES } from "@/utils/enum/enum";

describe("StatusFilter", () => {
  test("STATUS_VALUESが正しくレンダリングされる", () => {
    render(<StatusFilter tag="Video" currentStatus="" />);
    STATUS_VALUES.forEach((status) => {
      const link = screen.getByRole("link", { name: status });
      expect(link).toBeInTheDocument();
    });
  });

  test("activeクラスが正しく付与される", () => {
    render(<StatusFilter tag="exampleTag" currentStatus="完了" />);
    const activeLink = screen.getByRole("link", { name: "完了" });
    expect(activeLink.className).toContain("active");
    const inactiveLink1 = screen.getByRole("link", { name: "募集中" });
    expect(inactiveLink1).not.toHaveClass("active");
    const inactiveLink2 = screen.getByRole("link", { name: "対応中" });
    expect(inactiveLink2).not.toHaveClass("active");
    const inactiveLink3 = screen.getByRole("link", { name: "キャンセル" });
    expect(inactiveLink3).not.toHaveClass("active");
    const inactiveLink4 = screen.getByRole("link", { name: "期限切れ" });
    expect(inactiveLink4).not.toHaveClass("active");
  });

  test("リンクが正しく機能する", () => {
    render(<StatusFilter tag="Video" currentStatus="完了" />);

    STATUS_VALUES.forEach((status) => {
      const link = screen.getByRole("link", { name: status });
      if (status === "完了") {
        expect(link.getAttribute("href")).toBe("/category/Video/1");
      } else {
        expect(link.getAttribute("href")).toBe(
          `/category/Video/1?status=${encodeURIComponent(status)}`,
        );
      }
    });
  });

  test("空のタグが入力されてもクラッシュしない", () => {
    const emptyTag = "";
    const currentStatus = "完了";
    render(<StatusFilter tag={emptyTag} currentStatus={currentStatus} />);
    const activeLink = screen.getByRole("link", { name: currentStatus });
    expect(activeLink).toHaveAttribute("href", `/category/${emptyTag}/1`);
    const inactiveStatus = "募集中";
    const inactiveLink = screen.getByRole("link", { name: inactiveStatus });
    const expectedHref = `/category/${emptyTag}/1?status=${encodeURIComponent(
      inactiveStatus,
    )}`;
    expect(inactiveLink).toHaveAttribute("href", expectedHref);
  });

  test("不正な tag（特殊文字や日本語を含む文字列）が渡された場合でもクラッシュしない", () => {
    const invalidTag = "不正な/タグ?値#ハッシュ スペース";
    const currentStatus = "完了";

    render(<StatusFilter tag={invalidTag} currentStatus={currentStatus} />);

    const activeLink = screen.getByRole("link", { name: currentStatus });
    expect(activeLink).toHaveAttribute("href", `/category/${invalidTag}/1`);

    const inactiveStatus = "募集中";
    const inactiveLink = screen.getByRole("link", { name: inactiveStatus });
    const expectedHref = `/category/${invalidTag}/1?status=${encodeURIComponent(
      inactiveStatus,
    )}`;
    expect(inactiveLink).toHaveAttribute("href", expectedHref);
  });

  test("不正な currentStatus が渡されてもクラッシュせず、どのボタンもアクティブにならない", () => {
    const tag = "Video";
    const invalidStatus = "存在しないステータス";

    render(<StatusFilter tag={tag} currentStatus={invalidStatus} />);

    STATUS_VALUES.forEach((status) => {
      expect(screen.getByRole("link", { name: status })).toBeInTheDocument();
    });

    STATUS_VALUES.forEach((status) => {
      const link = screen.getByRole("link", { name: status });
      expect(link.className).not.toContain("active");
    });

    STATUS_VALUES.forEach((status) => {
      const link = screen.getByRole("link", { name: status });
      const expectedHref = `/category/${tag}/1?status=${encodeURIComponent(status)}`;
      expect(link).toHaveAttribute("href", expectedHref);
    });
  });
});
