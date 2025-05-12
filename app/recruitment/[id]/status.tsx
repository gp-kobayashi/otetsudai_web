"use client";
import { useState } from "react";
import styles from "./recruitment.module.css";
import { updateStatus } from "@/app/supabase_function/recruitment";
type StatusType = "募集中" | "対応中" | "完了" | "キャンセル" | "期限切れ";
type Props = {
  id: number;
  onStatusChange: (status: StatusType) => void;
  currentStatus: string | null;
};

const RecruitmentStatus = (props: Props) => {
  const { id, onStatusChange, currentStatus } = props;
  const statuses = ["募集中", "対応中", "完了", "キャンセル", "期限切れ"];
  const [status, setStatus] = useState(currentStatus ?? "募集中");
  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value as StatusType;
    setStatus(newStatus);
    await updateStatus(id, newStatus);
    onStatusChange(newStatus);
  };
  return (
    <div>
      <label className={styles.status_label}>ステータス変更</label>
      <select value={status} onChange={handleChange}>
        {statuses.map((statusOption) => (
          <option key={statusOption} value={statusOption}>
            {statusOption}
          </option>
        ))}
      </select>
    </div>
  );
};

export default RecruitmentStatus;
