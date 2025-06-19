import { describe, expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import StatusFilter from "@/components/recruitment/category/StatusFilter";
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
    render(<StatusFilter tag="Video" currentStatus="完了" />);
    const activeLink = screen.getByRole("link", { name: "完了" });
    expect(activeLink.className).toContain("active");
    const inactiveStatuses = STATUS_VALUES.filter(
      (status) => status !== "完了",
    );
    inactiveStatuses.forEach((status) => {
      const link = screen.getByRole("link", { name: status });
      expect(link).not.toHaveClass("active");
    });
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

    expect(() => {
      render(<StatusFilter tag={emptyTag} currentStatus={currentStatus} />);
    }).not.toThrow();

    STATUS_VALUES.forEach((status) => {
      const link = screen.getByRole("link", { name: status });

      const expectedHref =
        status === currentStatus
          ? `/category/${emptyTag}/1`
          : `/category/${emptyTag}/1?status=${encodeURIComponent(status)}`;
      expect(link).toHaveAttribute("href", expectedHref);

      if (status === currentStatus) {
        expect(link.className).toContain("active");
      } else {
        expect(link).not.toHaveClass("active");
      }
    });
  });

  test("不正な tag（特殊文字や日本語を含む文字列）が渡された場合でもクラッシュしない", () => {
    const invalidTag = "不正な/タグ?値#ハッシュ スペース";
    const currentStatus = "完了";

    expect(() => {
      render(<StatusFilter tag={invalidTag} currentStatus={currentStatus} />);
    }).not.toThrow();

    const activeLink = screen.getByRole("link", { name: currentStatus });
    expect(activeLink).toHaveAttribute("href", `/category/${invalidTag}/1`);

    STATUS_VALUES.filter((status) => status !== currentStatus).forEach(
      (status) => {
        const link = screen.getByRole("link", { name: status });
        const expectedHref = `/category/${invalidTag}/1?status=${encodeURIComponent(status)}`;
        expect(link).toHaveAttribute("href", expectedHref);
        expect(link.className).not.toContain("active");
      },
    );
  });
  test("不正な currentStatus が渡されてもクラッシュせず、どのボタンもアクティブにならない", () => {
    const tag = "Video";
    const invalidStatus = "存在しないステータス";

    expect(() => {
      render(<StatusFilter tag={tag} currentStatus={invalidStatus} />);
    }).not.toThrow();

    STATUS_VALUES.forEach((status) => {
      const link = screen.getByRole("link", { name: status });

      expect(link).toBeInTheDocument();

      expect(link.className).not.toContain("active");

      const expectedHref = `/category/${tag}/1?status=${encodeURIComponent(status)}`;
      expect(link).toHaveAttribute("href", expectedHref);
    });
  });
});
