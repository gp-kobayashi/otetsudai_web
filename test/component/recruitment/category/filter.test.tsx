import { describe, expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import StatusFilter from "@/components/recruitment/category/filter";
import { STATUS_VALUES } from "@/utils/enum/enum";

describe("StatusFilter", () => {
  test("STATUS_VALUESが正しくレンダリングされる", () => {
    render(<StatusFilter tag="exampleTag" currentStatus="open" />);
    STATUS_VALUES.forEach((status) => {
      const link = screen.getByRole("link", { name: status });
      expect(link).toBeInTheDocument();
    });
  });
  test("activeクラスが正しく付与される", () => {
    render(<StatusFilter tag="exampleTag" currentStatus="完了" />);
    const activeLink = screen.getByRole("link", { name: "完了" });
    expect(activeLink.className).toContain("active");
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
});
