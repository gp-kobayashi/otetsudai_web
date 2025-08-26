"use client";
import EditModal from "./EditModal";
import { updateRecruitment } from "@/lib/supabase_function/recruitment";
import { RecruitmentWithProfile } from "@/types/supabase/types";
import { useState } from "react";
import styles from "./edit.module.css";
type props = {
  recruitmentData: RecruitmentWithProfile;
  onUpdate: (data: { title: string; explanation: string }) => void;
};

const EditButton = (props: props) => {
  const { recruitmentData, onUpdate } = props;
  const [isEditOpen, setIsEditOpen] = useState(false);

  const handleSave = async (updatedData: {
    title: string;
    explanation: string;
  }) => {
    onUpdate(updatedData);
    await updateRecruitment(
      recruitmentData.id,
      updatedData.title,
      updatedData.explanation,
    );
    setIsEditOpen(false);
  };
  return (
    <div>
      <button className={styles.edit_btn} onClick={() => setIsEditOpen(true)}>
        内容を編集する
      </button>
      <div>
        {isEditOpen && (
          <EditModal
            recruitmentData={recruitmentData}
            isEditOpen={isEditOpen}
            onClose={() => setIsEditOpen(false)}
            onSave={handleSave}
          />
        )}
      </div>
    </div>
  );
};

export default EditButton;
