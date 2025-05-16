"use client";
<<<<<<< HEAD

=======
>>>>>>> add_recruitment_status
import styles from "./recruitment.module.css";
import Image from "next/image";
import { CiClock2 } from "react-icons/ci";
import Link from "next/link";
<<<<<<< HEAD
import DeleteButton from "@/app/components/recruitment/delete/deleteButton";
import EditButton from "@/app/components/recruitment/edit/editButton";
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
=======
import DeleteButton from "./deleteButton";
import RecruitmentStatus from "./status";
import type { RecruitmentWithProfile } from "@/app/type/types";
import { useState } from "react";
type Props = {
  data: RecruitmentWithProfile;
  userId: string | null;
  id: number;
};

const Recruitment = (props: Props) => {
  const { data, userId, id } = props;
  const [currentStatus, setCurrentStatus] = useState(data.status);
  return (
    <div className={styles.recruitment_container}>
      <div className={styles.info_status}>{currentStatus}</div>
      {userId === data.user_id && (
        <RecruitmentStatus
          id={id}
          onStatusChange={setCurrentStatus}
          currentStatus={currentStatus}
        />
      )}
      <h3 className={styles.title}>{data.title}</h3>
      <p className={styles.text}>{data.explanation}</p>
      <div className={styles.recruitment_user}>
        <p className={styles.tag}>{data.tag}</p>
        <Image
          src={data.avatar_url}
>>>>>>> add_recruitment_status
          className={styles.item}
          alt="avatar"
          width={40}
          height={40}
        />
<<<<<<< HEAD
        <Link href={`/userProfile/${recruitmentData.username}`}>
          <p className={styles.item}>{recruitmentData.username}</p>
        </Link>
        <CiClock2 className={styles.info_icon} />
        <p className={styles.item}>{recruitmentData.created_at}</p>
        {userId === recruitmentData.user_id && <DeleteButton id={id} />}
=======
        <Link href={`/userProfile/${data.username}`}>
          <p className={styles.item}>{data.username}</p>
        </Link>
        <CiClock2 className={styles.info_icon} />
        <p className={styles.item}>{data.created_at}</p>
        {userId === data.user_id && <DeleteButton id={id} />}
>>>>>>> add_recruitment_status
      </div>
    </div>
  );
};

<<<<<<< HEAD
export default RecruitmentComponent;
=======
export default Recruitment;
>>>>>>> add_recruitment_status
