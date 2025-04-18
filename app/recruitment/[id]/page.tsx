import { getRecruitmentById } from "@/app/supabase_function/recruitment";
import { redirect } from "next/navigation";
import styles from "./recruitment.module.css";
import Image from "next/image";
import { CiClock2 } from "react-icons/ci";
import CommentApp from "@/app/components/comment/app";
import { createClient } from "@/utils/supabase/server";

interface Params {
  id: number;
}

const recruitment = async ({ params }: { params: Params }) => {
  const { id } = params;
  const { data } = await getRecruitmentById(id);
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login");
  }
  const userId = user.id;

  if (!data) {
    redirect("/");
  }
  return (
    <div>
      <div className={styles.recruitment_container}>
        <h3 className={styles.title}>{data.title}</h3>
        <p>{data.explanation}</p>
        <div className={styles.recruitment_user}>
          <p className={styles.tag}>{data.tag}</p>
          <Image
            src={data.avatar_url}
            className={styles.item}
            alt="avatar"
            width={40}
            height={40}
          />
          <p className={styles.item}>{data.username}</p>
          <CiClock2 className={styles.info_icon} />
          <p className={styles.item}>{data.created_at}</p>
        </div>
      </div>

      <CommentApp id={id} userId={userId} />
    </div>
  );
};

export default recruitment;
