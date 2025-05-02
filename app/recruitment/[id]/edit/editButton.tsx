"use client";
import EditModal from "@/app/recruitment/[id]/edit/editModal";
import { updateRecruitment } from "@/app/supabase_function/recruitment";
import { RecruitmentWithProfile } from "@/app/type/types";
import { useState } from "react";
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
      <button onClick={() => setIsEditOpen(true)}>内容を編集する</button>
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
