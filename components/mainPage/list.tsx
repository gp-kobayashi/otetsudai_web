"use client";
import { getRecruitmentList } from "@/lib/supabase_function/recruitment";
import { useEffect, useState } from "react";
import type { RecruitmentWithProfile } from "@/types/supabase/types";
import styles from "./list.module.css";
import Image from "next/image";
import { CiClock2 } from "react-icons/ci";
import { useRouter } from "next/navigation";
import RecruitmentCard from "@/components/recruitment/recruitment/card/card";

const MainPageList = () => {
  const router = useRouter();
  const [recruitmentList, setRecruitmentList] = useState<
    RecruitmentWithProfile[] | null
  >([]);
  const [message, setMessages] = useState("");

  useEffect(() => {
    const recruitmentList = async () => {
      const { data, error } = await getRecruitmentList();
      if (error) {
        setMessages("エラーが発生しました" + error.message);
        return;
      }
      setRecruitmentList(data?.slice(0, 10) || []);
    };
    recruitmentList();
  }, []);

  return (
    <div>
      <h1 className={styles.title}>最新募集一覧</h1>
      <RecruitmentCard recruitmentList={recruitmentList} />
    </div>
  );
};

export default MainPageList;
