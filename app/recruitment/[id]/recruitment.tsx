"use client";
import styles from "./recruitment.module.css";
import Image from "next/image";
import { CiClock2 } from "react-icons/ci";
import Link from "next/link";
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
