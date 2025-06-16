"use client";
import { useRouter } from "next/navigation";
import styles from "./recruitmentCard.module.css";
import Image from "next/image";
import { CiClock2 } from "react-icons/ci";
import { RecruitmentWithProfile } from "@/types/supabase/types";
import { DEFAULT_AVATAR_URL } from "@/lib/supabase_function/profile";
type Props = {
  recruitment: RecruitmentWithProfile;
};

const RecruitmentCard = ({ recruitment }: Props) => {
  const router = useRouter();
  const handleClick = (id: number) => {
    router.push(`/recruitment/${id}`);
  };

  return (
    <li
      key={recruitment.id}
      className={styles.recruitment_list}
      onClick={() => handleClick(recruitment.id)}
    >
      <div className={styles.info_status}>{recruitment.status}</div>
      <h3 className={styles.list_title}>{recruitment.title}</h3>

      <p className={styles.list_text}>{recruitment.explanation}</p>
      <div className={styles.recruitment_info}>
        <p className={styles.info_tag}>{recruitment.tag}</p>
        <Image
          src={
            recruitment.avatar_url ? recruitment.avatar_url : DEFAULT_AVATAR_URL
          }
          alt="avatar"
          width={20}
          height={20}
          className={styles.avatar_img}
        />
        <p className={styles.info_item}>{recruitment.username}</p>
        <CiClock2 className={styles.info_icon} />
        <p className={styles.info_item}>{recruitment.created_at}</p>
      </div>
    </li>
  );
};

export default RecruitmentCard;
