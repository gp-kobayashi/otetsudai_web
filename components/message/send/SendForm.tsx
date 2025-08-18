"use client";

import { addSendMessage } from "@/lib/supabase_function/message";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import styles from "./sendForm.module.css";

type Props = {
  receiverId: string;
  senderId: string;
  receivUsername: string;
};

const SendForm = (props: Props) => {
  const { receiverId, senderId, receivUsername } = props;
  const router = useRouter();
  const supabase = createClient();
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!title || !text) {
      alert("タイトルとメッセージ内容は必須です。");
      return;
    }

    try {
      const { error } = await addSendMessage(
        supabase,
        senderId,
        receiverId,
        title,
        text,
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
        <button type="submit" className={styles.form_btn}>
          送信
        </button>
      </form>
    </div>
  );
};

export default SendForm;
