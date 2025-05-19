"use client";
import styles from "@/components/recruitment/recruitment/recruitment.module.css";
import Image from "next/image";
import { CiClock2 } from "react-icons/ci";
import Link from "next/link";
import DeleteButton from "../recruitmentBtn/delete/deleteButton";
import RecruitmentStatus from "./status";
import type { RecruitmentWithProfile } from "@/types/supabase/types";
import { useState } from "react";
import EditButton from "../recruitmentBtn/edit/editButton";
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
        <div>
          <RecruitmentStatus
            id={id}
            onStatusChange={setCurrentStatus}
            currentStatus={currentStatus}
          />
          <EditButton recruitmentData={recruitmentData} onUpdate={onUpdate} />
        </div>
      )}
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
        {userId === data.user_id && <DeleteButton id={id} />}
      </div>
    </div>
  );
};

export default Recruitment;
