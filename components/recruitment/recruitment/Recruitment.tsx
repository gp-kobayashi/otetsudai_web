"use client";
import styles from "./recruitment.module.css";
import Image from "next/image";
import { CiClock2 } from "react-icons/ci";
import Link from "next/link";
import DeleteButton from "../recruitmentBtn/delete/DeleteButton";
import RecruitmentStatus from "./RecruitmentStatus";
import type { RecruitmentWithProfile } from "@/types/supabase/types";
import { useState } from "react";
import EditButton from "../recruitmentBtn/edit/EditButton";
import { DEFAULT_AVATAR_URL } from "@/lib/supabase_function/profile";

type Props = {
  data: RecruitmentWithProfile;
  userId: string | null;
  id: number;
};

const Recruitment = (props: Props) => {
  const { data, userId, id } = props;
  const [currentStatus, setCurrentStatus] = useState(data.status);
  const [recruitmentData, setRecruitmentData] = useState(data);
  const onUpdate = (updated: { title: string; explanation: string }) => {
    setRecruitmentData((prev) => ({
      ...prev,
      title: updated.title,
      explanation: updated.explanation,
    }));
  };
  return (
    <div className={styles.recruitment_container}>
      <div className={styles.info_status}>{currentStatus}</div>
      {userId === data.user_id && (
        <div className={styles.btn_container}>
          <RecruitmentStatus
            id={id}
            onStatusChange={setCurrentStatus}
            currentStatus={currentStatus}
          />
          <EditButton recruitmentData={recruitmentData} onUpdate={onUpdate} />
        </div>
      )}
      <h3 className={styles.title}>{recruitmentData.title}</h3>
      <p className={styles.text}>{recruitmentData.explanation}</p>
      <div className={styles.recruitment_user}>
        <p className={styles.tag}>{recruitmentData.tag}</p>
        <Image
          src={
            recruitmentData.avatar_url
              ? recruitmentData.avatar_url
              : DEFAULT_AVATAR_URL
          }
          className={styles.item}
          alt="avatar"
          width={40}
          height={40}
        />
        <Link href={`/userProfile/${recruitmentData.username}`}>
          <p className={styles.item}>{recruitmentData.username}</p>
        </Link>
        <CiClock2 className={styles.info_icon} />
        <p className={styles.item}>{recruitmentData.created_at}</p>
        {userId === recruitmentData.user_id && <DeleteButton id={id} />}
      </div>
    </div>
  );
};

export default Recruitment;
