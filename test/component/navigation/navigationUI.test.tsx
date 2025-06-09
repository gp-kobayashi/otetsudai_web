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
  test("リンクが正しく機能することの確認", () => {
    const { rerender } = render(<NavigationUI {...authedProps} />);
    const profileLink = screen.getByText("profile");
    expect(profileLink).toHaveAttribute("href", "/userProfile/testuser");
    const recruitmentLink = screen.getByText("募集する");
    expect(recruitmentLink).toHaveAttribute("href", "/createRecruitment");
    const helpLink = screen.getByText("help");
    expect(helpLink).toHaveAttribute("href", "/help");
    const logoLink = screen.getByText("otetsudai");
    expect(logoLink).toHaveAttribute("href", "/");

    rerender(<NavigationUI {...noAuthedUserProps} />);
    const loginLink = screen.getByText("ログイン");
    expect(loginLink).toHaveAttribute("href", "/login");
    const noProfileLink = screen.queryByText("profile");
    expect(noProfileLink).not.toBeInTheDocument();
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
});
