import { getCommentByRecruitment } from "@/app/supabase_function/comment";
import { redirect } from "next/navigation";
import styles from "./comment.module.css";
import Image from "next/image";
import { CiClock2 } from "react-icons/ci";
type Props = {
  id: number;
};

const ComentList = async ({ id }: Props) => {
  const { data } = await getCommentByRecruitment(id);
  if (!data) {
    redirect("/");
  }
  return (
    <div className={styles.comment_container}>
      <h3>コメント</h3>
      {data.map((comment) => (
        <div key={comment.id} className={styles.comment_item}>
          <p>{comment.content}</p>
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

export default ComentList;
