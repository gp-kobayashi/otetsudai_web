"use client";

import { addSendMessage } from "@/lib/supabase_function/message";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import styles from "./sendForm.module.css";
import { messageSchema } from "@/utils/zod";

type Props = {
  receiverId: string;
  senderId: string;
  receivUsername: string;
};

type FormErrors = {
  title?: string[];
  text?: string[];
};

const SendForm = (props: Props) => {
  const { receiverId, senderId, receivUsername } = props;
  const router = useRouter();
  const supabase = createClient();
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrors({});

    const validationResult = messageSchema.safeParse({ title, text });

    if (!validationResult.success) {
      const newErrors: FormErrors = {};
      for (const issue of validationResult.error.issues) {
        if (issue.path[0] === "title") {
          newErrors.title = [...(newErrors.title || []), issue.message];
        } else if (issue.path[0] === "text") {
          newErrors.text = [...(newErrors.text || []), issue.message];
        }
      }
      setErrors(newErrors);
      return;
    }

    try {
      const { error } = await addSendMessage(
        supabase,
        senderId,
        receiverId,
        validationResult.data.title,
        validationResult.data.text,
      );
      if (error) {
        throw error;
      }
      alert("メッセージが送信されました。");
      router.push(`/message/sent`);
    } catch {
      alert("メッセージの送信に失敗しました。");
    }
  };

  return (
    <div className={styles.send_form_container}>
      <h2>メッセージを送る</h2>
      <form onSubmit={handleSubmit} className={styles.send_form}>
        <p className={styles.receiver}>宛先: {receivUsername}</p>
        <label htmlFor="title" className={styles.form_label}>
          タイトル
        </label>

        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={styles.form_input}
        />
        {errors.title && (
          <p className={styles.error_message}>{errors.title.join(", ")}</p>
        )}
        <label htmlFor="text" className={styles.form_label}>
          内容
        </label>
        <textarea
          id="text"
          placeholder="メッセージ内容"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className={styles.form_textarea}
        />
        {errors.text && (
          <p className={styles.error_message}>{errors.text.join(", ")}</p>
        )}
        <button type="submit" className={styles.form_btn}>
          送信
        </button>
      </form>
    </div>
  );
};

export default SendForm;
