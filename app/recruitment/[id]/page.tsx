import { getRecruitmentById } from "@/app/supabase_function/recruitment";
import { fetchProfile } from "@/app/supabase_function/profile";
import { redirect } from "next/navigation";
import styles from "./recruitment.module.css";
import Image from "next/image";
import { CiClock2 } from "react-icons/ci";
import CommentApp from "@/app/components/comment/app";
import { createClient } from "@/utils/supabase/server";
import Link from "next/link";

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

  let userId = null;
  let username = null;

  if (user) {
    userId = user.id;
    username = (await fetchProfile(userId)).data?.username;
  }

  if (!data) {
    return <div>募集が見つかりませんでした</div>;
  }

  return (
    <div>
      <div className={styles.recruitment_container}>
        <h3 className={styles.title}>{data.title}</h3>
        <p className={styles.text}>{data.explanation}</p>
        <div className={styles.recruitment_user}>
          <p className={styles.tag}>{data.tag}</p>
          <Image
            src={data.avatar_url}
            className={styles.item}
            alt="avatar"
            width={40}
            height={40}
          />
          <Link href={`/userProfile/${data.username}`}>
            <p className={styles.item}>{data.username}</p>
          </Link>
          <CiClock2 className={styles.info_icon} />
          <p className={styles.item}>{data.created_at}</p>
        </div>
      </div>

      <CommentApp id={id} userId={userId} username={username} />
    </div>
  );
};

export default recruitment;
