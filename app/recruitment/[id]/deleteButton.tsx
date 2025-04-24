"use client";

import { deleteRecruitment } from "@/app/supabase_function/recruitment";
import styles from "./recruitment.module.css";
import { useRouter } from "next/navigation";
type props = {
  id: number;
};

const DeleteButton = ({ id }: props) => {
  const router = useRouter();

  const deleteBtn = async (id: number) => {
    if (!confirm("本当に削除しますか？")) {
      return;
    }
    await deleteRecruitment(id);
    router.push("/");
  };
  return (
    <button
      className={styles.delete_button}
      onClick={(e) => {
        e.stopPropagation();
        deleteBtn(id);
      }}
    >
      削除
    </button>
  );
};

export default DeleteButton;
