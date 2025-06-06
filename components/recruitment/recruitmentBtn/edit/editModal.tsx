"use client";
import { RecruitmentWithProfile } from "@/types/supabase/types";
import { useEffect, useState } from "react";
import styles from "./edit.module.css";
type Props = {
  recruitmentData: RecruitmentWithProfile;
  isEditOpen: boolean;
  onClose: () => void;
  onSave: (data: { title: string; explanation: string }) => void;
};

const EditModal = (props: Props) => {
  const { recruitmentData, isEditOpen, onClose, onSave } = props;
  const [title, setTitle] = useState("");
  const [explanation, setExplanation] = useState("");

  useEffect(() => {
    if (isEditOpen && recruitmentData) {
      setTitle(recruitmentData.title);
      setExplanation(recruitmentData.explanation);
    }
  }, [isEditOpen, recruitmentData]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!title.trim() || !explanation.trim()) {
      alert("タイトルと内容は必須です");
      return;
    }
    onSave({ title, explanation });
    onClose();
  };
  if (!isEditOpen) return null;
  return (
    <div>
      <div className={styles.overlay}>
        <div className={styles.modal}>
          <button onClick={onClose} className={styles.closeButton}>
            ×
          </button>
          <form onSubmit={handleSubmit}>
            <label htmlFor="title" className={styles.label}>
              タイトル
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={styles.input}
            />
            <label htmlFor="explanation" className={styles.label}>
              内容
            </label>
            <textarea
              id="explanation"
              value={explanation}
              onChange={(e) => setExplanation(e.target.value)}
              className={styles.textarea}
            />
            <button type="submit" className={styles.btn}>
              保存
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditModal;
