"use client";
import { useState } from "react";
import styles from "./comment.module.css";
import { addComment } from "@/app/supabase_function/comment";
import CommentList from "@/app/components/comment/list";
import { CommentWithProfile } from "@/app/type/types";
import { formatUserName, getAvatarUrl } from "@/app/supabase_function/profile";
type Props = {
  id: number;
  userId: string;
};

const CommentApp = (props: Props) => {
  const { id: recruitment_id, userId: user_id } = props;

  const [commentList, setCommentList] = useState<CommentWithProfile[]>([]);
  const [text, setText] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!text || !user_id) return;
    const { data } = await addComment(user_id, recruitment_id, text);
    const updatedComment: CommentWithProfile = {
      ...data,
      avatar_url: getAvatarUrl(user_id),
      username: formatUserName(user_id),
    };
    setCommentList((prev) => [...prev, updatedComment]);
    setText("");
  };

  return (
    <div>
      <CommentList id={recruitment_id} />
      <div className={styles.app_container}>
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
      </div>
    </div>
  );
};

export default CommentApp;
