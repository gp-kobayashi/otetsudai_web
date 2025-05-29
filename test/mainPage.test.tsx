import { describe, expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import Home from "../app/page";
import List from "../components/mainPage/list";
import RecruitmentCard from "@/components/recruitment/card/card";
import { getRecruitmentList } from "@/lib/supabase_function/recruitment";

describe(Home, () => {
  test("初期レンダリングが行われる", () => {
    render(<Home />);
    expect(screen.getByText("お手伝いをしましょう")).toBeInTheDocument();
    expect(screen.getByText("最新募集一覧")).toBeInTheDocument();
  });
  test("タグが正しく表示される", () => {
    render(<Home />);
    const tags = ["Video", "Text", "Audio", "programming", "design", "other"];
    tags.forEach((tag) => {
      expect(screen.getByText(tag)).toBeInTheDocument();
    });
  });
});

describe(List, () => {
  test("各募集のタイトル、説明が表示される", async () => {
    const mockRecruitments = await getRecruitmentList();
    render(<List />);
    mockRecruitments.data?.slice(0, 10).forEach((recruitment) => {
      expect(screen.getByText(recruitment.title)).toBeInTheDocument();
      expect(screen.getByText(recruitment.explanation)).toBeInTheDocument();
    });
  });
});
