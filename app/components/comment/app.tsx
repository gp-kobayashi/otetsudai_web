"use client";
import { useEffect, useState } from "react";
import styles from "./comment.module.css";
import {
  addComment,
  getCommentByRecruitment,
} from "@/app/supabase_function/comment";
import CommentList from "@/app/components/comment/list";
import { CommentWithProfile } from "@/app/type/types";
import { formatAvatarUrl, getusername } from "@/app/supabase_function/profile";
import Link from "next/link";
type Props = {
  id: number;
  userId: string | null;
  username: string | null | undefined;
};

const CommentApp = (props: Props) => {
  const { id: recruitment_id, userId: user_id, username } = props;

  const [commentList, setCommentList] = useState<CommentWithProfile[]>([]);
  const [text, setText] = useState<string>("");

  useEffect(() => {
    const commentList = async () => {
      const { data } = await getCommentByRecruitment(recruitment_id);
      if (!data) return;
      setCommentList(data || []);
    };
    commentList();
  }, [recruitment_id]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!text || !user_id) return;
    const { data } = await addComment(user_id, recruitment_id, text);
    if (!data) return;
    const updatedComment = {
      ...data,
      avatar_url: formatAvatarUrl(user_id),
      username: await getusername(user_id),
    };
    setCommentList((prev) => [...prev, updatedComment]);
    setText("");
  };

  return (
    <div>
      <CommentList commentList={commentList} />
      <div className={styles.app_container}>
        {username ? (
          <form onSubmit={(e) => handleSubmit(e)}>
            <div>
              <label>コメントを投稿:</label>
              <textarea
                className={styles.app_textarea}
                onChange={(e) => setText(e.target.value)}
                value={text}
              ></textarea>
            </div>
            <button type="submit">投稿</button>
          </form>
        ) : (
          <div className={styles.attention}>
            <p>
              コメントを投稿するには<Link href="/login">ログイン</Link>して
              <Link href="/insertUserName">ユーザーネーム</Link>
              の登録をしてください。
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentApp;
