"use client";

import type { Recruitment } from "@/types/supabase/types";
import styles from "./userRecruitmentList.module.css";
import { useRouter } from "next/navigation";
import { deleteRecruitment } from "@/lib/supabase_function/recruitment";

type props = {
  recruitmentList: Recruitment[] | null;
  checkUsername: boolean;
};

const UserRecruitmentList = (props: props) => {
  const { recruitmentList, checkUsername } = props;
  const router = useRouter();
  if (!recruitmentList) {
    return <div>募集がありません</div>;
  }
  const handleClick = (id: number) => {
    router.push(`/recruitment/${id}`);
  };

  const deleteBtn = async (id: number) => {
    if (!confirm("本当に削除しますか？")) {
      return;
    }
    await deleteRecruitment(id);
    router.refresh();
  };

  return (
    <div>
      <ul>
        {recruitmentList.map((recruitment) => (
          <li
            key={recruitment.id}
            className={styles.recruitment_item}
            onClick={() => handleClick(recruitment.id)}
          >
            <div className={styles.recruitment_info}>
              <div className={styles.list_title}>{recruitment.title}</div>
              <div className={styles.info_status}>{recruitment.status}</div>
            </div>
            <div className={styles.list_text}>{recruitment.explanation}</div>
            <div className={styles.list_item}>
              <div className={styles.list_tag}>{recruitment.tag}</div>
              {checkUsername && (
                <button
                  className={styles.delete_button}
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteBtn(recruitment.id);
                  }}
                >
                  削除
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserRecruitmentList;
