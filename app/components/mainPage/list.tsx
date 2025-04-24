"use client";
import { getRecruitmentList } from "@/app/supabase_function/recruitment";
import { useEffect, useState } from "react";
import type { RecruitmentWithProfile } from "@/app/type/types";
import styles from "./list.module.css";
import Image from "next/image";
import { CiClock2 } from "react-icons/ci";
import { useRouter } from "next/navigation";

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

  const handleClick = (id: number) => {
    router.push(`/recruitment/${id}`);
  };

  return (
    <div>
      <h1 className={styles.title}>最新募集一覧</h1>
      <ul className={styles.recruitment_list_container}>
        {message && <p className={styles.error_message}>{message}</p>}
        {recruitmentList?.map((recruitment) => (
          <li
            key={recruitment.id}
            className={styles.recruitment_list}
            onClick={() => handleClick(recruitment.id)}
          >
            <h3 className={styles.list_title}>{recruitment.title}</h3>
            <p className={styles.list_text}>{recruitment.explanation}</p>
            <div className={styles.recruitment_info}>
              <p className={styles.info_tag}>{recruitment.tag}</p>
              <Image
                src={recruitment.avatar_url}
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
        ))}
      </ul>
    </div>
  );
};

export default MainPageList;
