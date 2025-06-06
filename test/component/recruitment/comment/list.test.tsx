import { describe, expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import CommentList from "@/components/recruitment/comment/list";
import type { CommentWithProfile } from "@/types/supabase/types";

const mockCommentList: CommentWithProfile[] = [
  {
    id: 1,
    recruitment_id: 1,
    text: "コメントテスト1です",
    username: "user1",
    user_id: "user12345",
    avatar_url: "https://example.com/avatar.png",
    created_at: "2025-10-01T12:00:00Z",
    updated_at: "2025-10-01T12:00:00Z",
  },
  {
    id: 2,
    recruitment_id: 2,
    text: "コメントテスト2です",
    username: "user2",
    user_id: "user67890",
    avatar_url: "https://example.com/avatar2.png",
    created_at: "2025-10-01T12:30:00Z",
    updated_at: "2025-10-01T12:30:00Z",
  },
];

describe("CommentList Component", () => {
  test("コメントが正しくレンダリングされる", async () => {
    render(<CommentList commentList={mockCommentList} />);

    expect(screen.getByText("コメントテスト1です")).toBeInTheDocument();
    expect(screen.getByText("コメントテスト2です")).toBeInTheDocument();

    expect(screen.getByText("user1")).toBeInTheDocument();
    expect(screen.getByText("user2")).toBeInTheDocument();

    const avatar = screen.getAllByAltText("avatar");
    expect(avatar).toHaveLength(2);
    expect(avatar[0]).toBeInTheDocument();
    expect(avatar[1]).toBeInTheDocument();

    expect(screen.getByText("2025-10-01T12:30:00Z")).toBeInTheDocument();
    expect(screen.getByText("2025-10-01T12:00:00Z")).toBeInTheDocument();
  });
});
