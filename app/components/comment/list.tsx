"use client";

import styles from "./comment.module.css";
import Image from "next/image";
import { CiClock2 } from "react-icons/ci";
import { CommentWithProfile } from "@/app/type/types";
type Props = {
  id: number;
  commentList: CommentWithProfile[];
};

const CommentList = (props: Props) => {
  const { id, commentList } = props;

  return (
    <div className={styles.comment_container}>
      <h3>コメント</h3>
      {commentList.map((comment) => (
        <div key={comment.id} className={styles.comment_item}>
          <p>{comment.text}</p>
          <div className={styles.comment_user}>
            <Image
              src={comment.avatar_url}
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
