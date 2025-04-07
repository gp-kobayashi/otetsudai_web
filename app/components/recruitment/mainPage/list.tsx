"use client";
import { getRecruitmentList } from "@/app/supabase_function/recruitment";
import { useEffect, useState } from "react";
import type { Recruitment } from "@/app/type/types";
import styles from "./List.module.css";

const MainPageList = () => {
  const [recruitmentList, setRecruitmentList] = useState<Recruitment[] | null>(
    [],
  );
  const [message, setMessages] = useState("");

  useEffect(() => {
    const recruitmentList = async () => {
      const { data, error } = await getRecruitmentList();
      if (error) {
        setMessages("エラーが発生しました" + error.message);
        return;
      }
      setRecruitmentList(data);
    };
    recruitmentList();
  }, []);

  return (
    <div>
      <h1>募集一覧</h1>
      <ul>
        {recruitmentList?.map((recruitment) => (
          <li key={recruitment.id}>
            <h3>{recruitment.title}</h3>
            <p>{recruitment.explanation}</p>
            <div className={styles.recruitment_info}>
              <p className={styles.info_item}>{recruitment.tag}</p>
              <p className={styles.info_item}>{recruitment.user_id}</p>
              <p className={styles.info_item}>{recruitment.created_at}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MainPageList;
