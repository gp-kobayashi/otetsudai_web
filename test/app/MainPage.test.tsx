import { describe, expect, test } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import Home from "../../app/page";
import List from "../../components/mainPage/MainPageList";
import { mockRecruitments } from "../mocks/mockData";

describe(Home, () => {
  test("初期レンダリングが行われる", async () => {
    render(<Home />);
    await waitFor(() => {
      expect(screen.getByText("お手伝いをしましょう")).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByText("最新募集一覧")).toBeInTheDocument();
    });
  });
  test("タグが正しく表示される", async () => {
    render(<Home />);
    const tags = ["Video", "Text", "Audio", "programming", "design", "other"];
    await waitFor(() => {
      tags.forEach((tag) => {
        expect(screen.getByText(tag)).toBeInTheDocument();
      });
    });
  });
});

describe(List, () => {
  test("各募集のタイトル、説明が表示される", async () => {
    render(<List />);

    // MSWでモックされたデータが表示されることを確認
    await waitFor(() => {
      mockRecruitments.slice(0, 10).forEach((recruitment) => {
        expect(screen.getByText(recruitment.title)).toBeInTheDocument();
        expect(screen.getByText(recruitment.explanation)).toBeInTheDocument();
      });
    });
  });
});
