import { describe, expect, test, vi, type Mock } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import {
  addRecruitment,
  getRecruitmentList,
} from "@/lib/supabase_function/recruitment";
import RecruitmentForm from "@/components/recruitment/create/RecruitmentForm";
import MainPageList from "@/components/mainPage/MainPageList";
import { useRouter } from "next/navigation";

vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
}));
vi.mock("@/lib/supabase_function/recruitment", () => ({
  addRecruitment: vi.fn(),
  getRecruitmentList: vi.fn(),
}));

describe("PostRecruitment", () => {
  test("投稿成功時に router.push('/') が呼ばれる", async () => {
    const pushMock = vi.fn();
    (useRouter as unknown as Mock).mockReturnValue({ push: pushMock });

    (addRecruitment as Mock).mockResolvedValue(undefined);

    render(<RecruitmentForm user_id="user123" />);

    fireEvent.change(screen.getByLabelText("タイトル:"), {
      target: { value: "タイトル" },
    });
    fireEvent.change(screen.getByLabelText("内容:"), {
      target: { value: "内容" },
    });

    fireEvent.click(screen.getByRole("button", { name: "募集する" }));

    await waitFor(() => {
      expect(addRecruitment).toHaveBeenCalledWith(
        "タイトル",
        "内容",
        "user123",
        "Video",
      );
      expect(pushMock).toHaveBeenCalledWith("/");
    });
  });

  test("タイトルまたは内容が空のとき投稿できず、アラートが出る", () => {
    window.alert = vi.fn();

    render(<RecruitmentForm user_id="user123" />);

    fireEvent.click(screen.getByRole("button", { name: "募集する" }));

    expect(window.alert).toHaveBeenCalledWith("タイトルと内容は必須です");
  });

  test("取得した募集が表示される", async () => {
    (getRecruitmentList as Mock).mockResolvedValue({
      data: [
        {
          id: 1,
          title: "タイトルA",
          explanation: "内容A",
          tag: "Video",
          user_id: "user123",
          profile: { username: "testuser", avatar_url: "" },
        },
      ],
      error: null,
    });

    render(<MainPageList />);

    await waitFor(() => {
      expect(screen.getByText("タイトルA")).toBeInTheDocument();
      expect(screen.getByText("内容A")).toBeInTheDocument();
    });
  });

  test("カテゴリーを変更して投稿できる", async () => {
    const pushMock = vi.fn();
    (useRouter as unknown as Mock).mockReturnValue({ push: pushMock });
    (addRecruitment as Mock).mockResolvedValue(undefined);

    render(<RecruitmentForm user_id="user456" />);

    fireEvent.change(screen.getByLabelText("タイトル:"), {
      target: { value: "別タイトル" },
    });
    fireEvent.change(screen.getByLabelText("内容:"), {
      target: { value: "別内容" },
    });
    fireEvent.change(screen.getByLabelText("カテゴリー:"), {
      target: { value: "Text" },
    });

    fireEvent.click(screen.getByRole("button", { name: "募集する" }));

    await waitFor(() => {
      expect(addRecruitment).toHaveBeenCalledWith(
        "別タイトル",
        "別内容",
        "user456",
        "Text",
      );
      expect(pushMock).toHaveBeenCalledWith("/");
    });
  });

  test("addRecruitmentが失敗した場合、router.push('/')が呼ばれずフォームはリセットされない", async () => {
    const pushMock = vi.fn();
    (useRouter as unknown as Mock).mockReturnValue({ push: pushMock });
    // addRecruitmentがエラーをthrow
    (addRecruitment as Mock).mockRejectedValue(new Error("投稿失敗"));

    render(<RecruitmentForm user_id="user999" />);

    const titleInput = screen.getByLabelText("タイトル:") as HTMLInputElement;
    const explanationInput = screen.getByLabelText(
      "内容:",
    ) as HTMLTextAreaElement;
    const categorySelect = screen.getByLabelText(
      "カテゴリー:",
    ) as HTMLSelectElement;

    fireEvent.change(titleInput, { target: { value: "エラーテスト" } });
    fireEvent.change(explanationInput, { target: { value: "エラー内容" } });
    fireEvent.change(categorySelect, { target: { value: "Audio" } });

    fireEvent.click(screen.getByRole("button", { name: "募集する" }));

    // エラー時はpushが呼ばれず、フォーム値がそのまま
    await waitFor(() => {
      expect(pushMock).not.toHaveBeenCalled();
      expect(titleInput.value).toBe("エラーテスト");
      expect(explanationInput.value).toBe("エラー内容");
      expect(categorySelect.value).toBe("Audio");
    });
  });

  test("投稿成功後、フォームがリセットされる", async () => {
    const pushMock = vi.fn();
    (useRouter as unknown as Mock).mockReturnValue({ push: pushMock });
    (addRecruitment as Mock).mockResolvedValue(undefined);

    render(<RecruitmentForm user_id="user789" />);

    const titleInput = screen.getByLabelText("タイトル:") as HTMLInputElement;
    const explanationInput = screen.getByLabelText(
      "内容:",
    ) as HTMLTextAreaElement;
    const categorySelect = screen.getByLabelText(
      "カテゴリー:",
    ) as HTMLSelectElement;

    fireEvent.change(titleInput, { target: { value: "リセットテスト" } });
    fireEvent.change(explanationInput, { target: { value: "リセット内容" } });
    fireEvent.change(categorySelect, { target: { value: "Audio" } });

    fireEvent.click(screen.getByRole("button", { name: "募集する" }));

    await waitFor(() => {
      expect(titleInput.value).toBe("");
      expect(explanationInput.value).toBe("");
      expect(categorySelect.value).toBe("Video");
    });
  });
});
