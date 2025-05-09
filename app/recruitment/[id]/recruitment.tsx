"use client";

import styles from "./recruitment.module.css";
import Image from "next/image";
import { CiClock2 } from "react-icons/ci";
import Link from "next/link";
import DeleteButton from "../../components/recruitment/delete/deleteButton";
import EditButton from "../../components/recruitment/edit/editButton";
import { RecruitmentWithProfile } from "@/app/type/types";
import { useState } from "react";
type Props = {
  recruitmentData: RecruitmentWithProfile;
  id: number;
  userId: string | null;
};

const RecruitmentComponent = (props: Props) => {
  const { recruitmentData: initialData, id, userId } = props;
  const [recruitmentData, setRecruitmentData] = useState(initialData);
  const onUpdate = (updated: { title: string; explanation: string }) => {
    setRecruitmentData((prev) => ({
      ...prev,
      title: updated.title,
      explanation: updated.explanation,
    }));
  };

  return (
    <div className={styles.recruitment_container}>
      {userId === recruitmentData.user_id && (
        <EditButton recruitmentData={recruitmentData} onUpdate={onUpdate} />
      )}
      <h3 className={styles.title}>{recruitmentData.title}</h3>
      <p className={styles.text}>{recruitmentData.explanation}</p>
      <div className={styles.recruitment_user}>
        <p className={styles.tag}>{recruitmentData.tag}</p>
        <Image
          src={recruitmentData.avatar_url}
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

export default RecruitmentComponent;
