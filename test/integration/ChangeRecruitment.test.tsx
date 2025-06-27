import { render, screen, fireEvent } from "@testing-library/react";
import Recruitment from "@/components/recruitment/recruitment/Recruitment";
import React from "react";
import { describe, expect, test } from "vitest";
import { RecruitmentWithProfile } from "@/types/supabase/types";

const mockRecruitmentData: RecruitmentWithProfile = {
  id: 1,
  title: "元のタイトル",
  explanation: "元の内容",
  status: "募集中",
  user_id: "user123",
  username: "testuser",
  avatar_url: "",
  tag: "Video",
  created_at: "2024-06-01",
  updated_at: "2024-06-01", // 追加
};

const mockUserId = "user123";

describe("Recruitment 編集内容の反映テスト", () => {
  test("EditModalでタイトルと内容を編集するとRecruitmentに反映される", async () => {
    render(
      <Recruitment
        data={mockRecruitmentData}
        userId={mockUserId}
        id={mockRecruitmentData.id}
      />,
    );

    expect(screen.getByText("元のタイトル")).toBeInTheDocument();
    expect(screen.getByText("元の内容")).toBeInTheDocument();

    // 編集ボタンをクリック
    fireEvent.click(screen.getByRole("button", { name: "内容を編集する" }));

    // モーダル内の入力フォームに新しい値を入力
    fireEvent.change(screen.getByLabelText("タイトル"), {
      target: { value: "新しいタイトル" },
    });
    fireEvent.change(screen.getByLabelText("内容"), {
      target: { value: "新しい内容" },
    });

    // 保存ボタンをクリック
    fireEvent.click(screen.getByRole("button", { name: "保存" }));

    // 編集後のタイトルと内容が表示されているか確認
    expect(await screen.findByText("新しいタイトル")).toBeInTheDocument();
    expect(await screen.findByText("新しい内容")).toBeInTheDocument();
    // 元のタイトルと内容が表示されていないことを確認
    expect(screen.queryByText("元のタイトル")).not.toBeInTheDocument();
    expect(screen.queryByText("元の内容")).not.toBeInTheDocument();
  });

  test("編集モーダルでキャンセルすると変更が反映されない", async () => {
    render(
      <Recruitment
        data={mockRecruitmentData}
        userId={mockUserId}
        id={mockRecruitmentData.id}
      />,
    );

    // 編集ボタンをクリック
    fireEvent.click(screen.getByRole("button", { name: "内容を編集する" }));

    // 入力値を変更
    fireEvent.change(screen.getByLabelText("タイトル"), {
      target: { value: "キャンセルタイトル" },
    });
    fireEvent.change(screen.getByLabelText("内容"), {
      target: { value: "キャンセル内容" },
    });

    // キャンセルボタンをクリック
    fireEvent.click(screen.getByRole("button", { name: "×" }));

    // 元のタイトルと内容が残っていることを確認
    expect(screen.getByText("元のタイトル")).toBeInTheDocument();
    expect(screen.getByText("元の内容")).toBeInTheDocument();
    // 変更後の内容は表示されていないことを確認
    expect(screen.queryByText("キャンセルタイトル")).not.toBeInTheDocument();
    expect(screen.queryByText("キャンセル内容")).not.toBeInTheDocument();
  });

  test("他ユーザーの場合は編集ボタンが表示されない", () => {
    render(
      <Recruitment
        data={mockRecruitmentData}
        userId={"otherUser"}
        id={mockRecruitmentData.id}
      />,
    );

    // 編集ボタンが存在しないことを確認
    expect(
      screen.queryByRole("button", { name: "内容を編集する" }),
    ).not.toBeInTheDocument();
  });
});
