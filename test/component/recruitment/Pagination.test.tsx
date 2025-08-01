import { describe, expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import Pagination from "@/components/util/Pagination";

describe("Pagination", () => {
  test("初期レンダリングが行われる", () => {
    render(
      <Pagination
        currentPage={1}
        hasNextPage={true}
        tag={"Video"}
        filterQuery={""}
      />,
    );
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByTestId("icon-next")).toBeInTheDocument();
  });
  test("前後のページリンクが表示される", () => {
    render(
      <Pagination
        currentPage={2}
        hasNextPage={true}
        tag={"Video"}
        filterQuery={""}
      />,
    );
    expect(screen.getByTestId("icon-next")).toBeInTheDocument();
    expect(screen.getByTestId("icon-previous")).toBeInTheDocument();
  });
  test("前後のページに遷移する", async () => {
    render(
      <Pagination
        currentPage={2}
        hasNextPage={true}
        tag={"Video"}
        filterQuery={""}
      />,
    );
    const nextLink = screen.getByTestId("icon-next").closest("a");
    const previousLink = screen.getByTestId("icon-previous").closest("a");
    expect(nextLink).toHaveAttribute("href", "/category/Video/3");
    expect(previousLink).toHaveAttribute("href", "/category/Video/1");
  });
  test("次のページがない場合、次のリンクが表示されない", () => {
    render(
      <Pagination
        currentPage={3}
        hasNextPage={false}
        tag={"Video"}
        filterQuery={""}
      />,
    );
    expect(screen.queryByTestId("icon-next")).not.toBeInTheDocument();
  });
  test("cssクラスが適用されている", () => {
    render(
      <Pagination
        currentPage={1}
        hasNextPage={true}
        tag={"Video"}
        filterQuery={""}
      />,
    );
    const paginationDiv = screen.getByText("1").closest("div");
    expect(paginationDiv?.className).toEqual(
      expect.stringContaining("page_navigation"),
    );
    expect(screen.getByText("1").className).toEqual(
      expect.stringContaining("current_page"),
    );
  });
  test("currentPageが0の場合、0と表示される", () => {
    render(
      <Pagination
        currentPage={0}
        hasNextPage={false}
        tag={""}
        filterQuery={""}
      />,
    );
    expect(screen.queryByText("0")).toBeInTheDocument();
    expect(screen.queryByTestId("icon-next")).not.toBeInTheDocument();
    expect(screen.queryByTestId("icon-previous")).not.toBeInTheDocument();
  });
});
