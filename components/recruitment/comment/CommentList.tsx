"use client";

import { DEFAULT_AVATAR_URL } from "@/lib/supabase_function/profile";
import styles from "./comment.module.css";
import Image from "next/image";
import { CiClock2 } from "react-icons/ci";
import { CommentWithProfile } from "@/types/supabase/types";
type Props = {
  commentList: CommentWithProfile[];
};

const CommentList = ({ commentList }: Props) => {
  return (
    <div className={styles.comment_container}>
      <h3>コメント</h3>
      {commentList.map((comment) => (
        <div key={comment.id} className={styles.comment_item}>
          <p className={styles.comment_text}>{comment.text}</p>
          <div className={styles.comment_user}>
            <Image
              src={comment.avatar_url || DEFAULT_AVATAR_URL}
              alt="avatar"
              width={20}
              height={20}
            />
            <p className={styles.user_item}>{comment.username}</p>
            <CiClock2 className={styles.info_icon} />
            <p className={styles.user_item}>{comment.created_at}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CommentList;
