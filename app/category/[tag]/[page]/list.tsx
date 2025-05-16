"use client";
import { RecruitmentWithProfile } from "@/app/type/types";
import styles from "./category.module.css";
import { CiClock2 } from "react-icons/ci";
import Image from "next/image";
import { useRouter } from "next/navigation";
type Props = {
  recruitmentList: RecruitmentWithProfile[];
};

const CategoryList = ({ recruitmentList }: Props) => {
  const router = useRouter();
  const handleClick = (id: number) => {
    router.push(`/recruitment/${id}`);
  };

  return (
    <div>
      <ul className={styles.recruitment_list_container}>
        {recruitmentList.map((recruitment) => (
          <li
            key={recruitment.id}
            className={styles.recruitment_list}
            onClick={() => handleClick(recruitment.id)}
          >
            <div className={styles.info_status}>{recruitment.status}</div>
            <h3 className={styles.list_title}>{recruitment.title}</h3>
            <p className={styles.list_text}>{recruitment.explanation}</p>
            <div className={styles.recruitment_info}>
              <p className={styles.info_tag}>{recruitment.tag}</p>
              <Image
                src={recruitment.avatar_url}
                alt="User Avatar"
                width={30}
                height={30}
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

export default CategoryList;
