"use client";
import { getRecruitmentList } from "@/lib/supabase_function/recruitment";
import { useEffect, useState } from "react";
import type { RecruitmentWithProfile } from "@/types/supabase/types";
import styles from "./mainpageList.module.css";

import RecruitmentCard from "@/components/recruitment/card/RecruitmentCard";

const MainPageList = () => {
  const [recruitmentList, setRecruitmentList] = useState<
    RecruitmentWithProfile[] | null
  >([]);

  useEffect(() => {
    const recruitmentList = async () => {
      const { data, error } = await getRecruitmentList();
      if (error) {
        return;
      }
      setRecruitmentList(data?.slice(0, 10) || []);
    };
    recruitmentList();
  }, []);

  return (
    <div>
      <h1 className={styles.title}>最新募集一覧</h1>
      <ul className={styles.recruitment_list_container}>
        {recruitmentList?.map((recruitment) => (
          <RecruitmentCard key={recruitment.id} recruitment={recruitment} />
        ))}
      </ul>
    </div>
  );
};

export default MainPageList;
