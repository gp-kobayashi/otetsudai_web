import { describe, expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import NavigationUI from "@/components/navigation/navigationUI";
import styles from "@/components/navigation/navigation.module.css";

const noAuthedUserProps = {
  user: null,
  username: null,
};
const authedProps = {
  user: {
    id: "user-123",
    avatar_url: "https://example.com/avatar.png",
    bio: "テストユーザーです",
    full_name: "Test User",
    updated_at: "2024-01-01T00:00:00Z",
    website: "https://example.com",
    app_metadata: {},
    user_metadata: {},
    aud: "authenticated",
    created_at: "2024-01-01T00:00:00Z",
  },
  username: "testuser",
};
const authedNoUsernameProps = {
  user: {
    id: "user-123",
    avatar_url: "https://example.com/avatar.png",
    bio: "テストユーザーです",
    full_name: "Test User",
    updated_at: "2024-01-01T00:00:00Z",
    website: "https://example.com",
    app_metadata: {},
    user_metadata: {},
    aud: "authenticated",
    created_at: "2024-01-01T00:00:00Z",
  },
  username: "",
};
describe("NavigationUI Component", () => {
  test("ユーザーがログインしている場合のレンダリング", () => {
    render(<NavigationUI {...authedProps} />);

    expect(screen.getByText("otetsudai")).toBeInTheDocument();
    expect(screen.getByText("募集する")).toBeInTheDocument();
    expect(screen.getByText("help")).toBeInTheDocument();
    expect(screen.getByText("profile")).toBeInTheDocument();
  });
  test("ユーザーがログインしていない場合のレンダリング", () => {
    render(<NavigationUI {...noAuthedUserProps} />);

    expect(screen.getByText("otetsudai")).toBeInTheDocument();
    expect(screen.getByText("募集する")).toBeInTheDocument();
    expect(screen.getByText("help")).toBeInTheDocument();
    expect(screen.getByText("ログイン")).toBeInTheDocument();
  });
  test("CSSクラスが正しく適用されていることの確認", () => {
    render(<NavigationUI {...authedProps} />);

    const logo = screen.getByText("otetsudai");
    expect(logo).toHaveClass(styles.logo);
    const recruitmentLink = screen.getByText("募集する");
    expect(recruitmentLink).toHaveClass(styles.recruitment_link);
    const helpLink = screen.getByText("help");
    expect(helpLink).toHaveClass(styles.help_link);
    const profileLink = screen.getByText("profile");
    expect(profileLink).toHaveClass(styles.account_link);
  });
  test("ユーザー名が空の場合のレンダリング", () => {
    render(<NavigationUI {...authedNoUsernameProps} />);

    expect(screen.getByText("otetsudai")).toBeInTheDocument();
    expect(screen.getByText("募集する")).toBeInTheDocument();
    expect(screen.getByText("help")).toBeInTheDocument();
    expect(screen.queryByText("profile")).toBeInTheDocument();
  });
  test("ログイン状態でのリンクの確認", () => {
    render(<NavigationUI {...authedProps} />);

    const logoItem = screen.getByText("otetsudai").closest("a");
    const recruitmentItem = screen.getByText("募集する").closest("a");
    const helpItem = screen.getByText("help").closest("a");
    const profileItem = screen.getByText("profile").closest("a");
    expect(logoItem).toHaveAttribute("href", "/");
    expect(recruitmentItem).toHaveAttribute("href", "/createRecruitment");
    expect(helpItem).toHaveAttribute("href", "/help");
    expect(profileItem).toHaveAttribute("href", "/userProfile/testuser");
  });
  test("未ログイン状態でのリンクの確認", () => {
    render(<NavigationUI {...noAuthedUserProps} />);
    const loginItem = screen.getByText("ログイン").closest("a");
    expect(loginItem).toHaveAttribute("href", "/login");
  });
  test("ユーザー名が空の場合のリンク確認", () => {
    render(<NavigationUI {...authedNoUsernameProps} />);
    const noUsernameItem = screen.getByText("profile").closest("a");
    expect(noUsernameItem).toHaveAttribute("href", "/insertUserName");
  });
  test("未ログインからログインした際の変化確認", () => {
    const { rerender } = render(<NavigationUI {...noAuthedUserProps} />);
    expect(screen.getByText("ログイン")).toBeInTheDocument();
    rerender(<NavigationUI {...authedProps} />);
    expect(screen.getByText("profile")).toBeInTheDocument();
  });
});
