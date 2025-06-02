"use client";

import styles from "./create.module.css";
import { addRecruitment } from "@/lib/supabase_function/recruitment";
import { useState } from "react";
import { useRouter } from "next/navigation";
type Props = {
  user_id: string;
};

const RecruitmentForm = ({ user_id }: Props) => {
  const tags = ["Video", "Text", "Audio", "programming", "design", "other"];
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [explanation, setExplanation] = useState("");
  const [tag, setTag] = useState(tags[0]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await addRecruitment(title, explanation, user_id, tag);
    setTitle("");
    setExplanation("");
    setTag(tags[0]);
    router.push("/");
  };
  return (
    <form className={styles.form_container} onSubmit={handleSubmit}>
      <div className={styles.form_item}>
        <label htmlFor="title" className={styles.form_label}>
          タイトル:
        </label>
        <input
          id="title"
          className={styles.from_input}
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div className={styles.form_item}>
        <label htmlFor="explanation" className={styles.form_label}>
          内容:
        </label>
        <textarea
          id="explanation"
          className={styles.from_textarea}
          value={explanation}
          onChange={(e) => setExplanation(e.target.value)}
        />
      </div>
      <div className={styles.form_item}>
        <label htmlFor="category" className={styles.form_label}>
          カテゴリー:
        </label>
        <select
          id="category"
          value={tag}
          onChange={(e) => setTag(e.target.value)}
        >
          {tags.map((tagOption) => (
            <option key={tagOption} value={tagOption}>
              {tagOption}
            </option>
          ))}
        </select>
      </div>
      <div className={styles.form_btn}>
        <button type="submit">募集する</button>
      </div>
    </form>
  );
};

export default RecruitmentForm;
