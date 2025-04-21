"use client";

import type { Recruitment } from "@/app/type/types";
import styles from "./userProfile.module.css";
import { useRouter } from "next/navigation";
type props = {
  recruitmentList: Recruitment[] | null;
};

const UserRecruitmentList = ({ recruitmentList }: props) => {
  const router = useRouter();
  if (!recruitmentList) {
    return <div>募集がありません</div>;
  }
  const handleClick = (id: number) => {
    router.push(`/recruitment/${id}`);
  };
  return (
    <div>
      <h2 className={styles.recruitment_title}>募集一覧</h2>
      <ul>
        {recruitmentList.map((recruitment) => (
          <li
            key={recruitment.id}
            className={styles.recruitment_item}
            onClick={() => handleClick(recruitment.id)}
          >
            <div className={styles.list_title}>{recruitment.title}</div>
            <div>{recruitment.explanation}</div>
            <div className={styles.list_tag}>{recruitment.tag}</div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserRecruitmentList;
