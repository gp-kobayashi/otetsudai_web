"use client";

import { useState } from "react";
import type { MessageWithProfile } from "@/types/supabase/types";
import { DEFAULT_AVATAR_URL } from "@/lib/supabase_function/profile";
import Image from "next/image";
import styles from "./message.module.css";
import Link from "next/link";

interface Props {
  messages: MessageWithProfile[];
  boxType: string;
}

const MessageList = (props: Props) => {
  const { messages, boxType } = props;
  const [selectedId, setSelectedId] = useState<number | null>(null);

  if (!messages || messages.length === 0) {
    return <p>メッセージはありません。</p>;
  }

  const handleToggle = (id: number) => {
    setSelectedId(selectedId === id ? null : id);
  };

  return (
    <div className={styles.message_list}>
      {messages.map((message) => {
        const isInbox = boxType === "inbox";
        const user = isInbox
          ? {
              avatar: message.sender_avatar_url,
              name: message.sender_username,
            }
          : {
              avatar: message.receiver_avatar_url,
              name: message.receiver_username,
            };
        const userLabel = isInbox ? "送信者" : "受信者";

        return (
          <div
            key={message.id}
            className={styles.message_item_wrapper}
            onClick={() => handleToggle(message.id)}
          >
            <div className={styles.message_container}>
              <div className={styles.avatar_container}>
                <Image
                  src={user.avatar || DEFAULT_AVATAR_URL}
                  alt={`${user.name}'s Avatar`}
                  width={50}
                  height={50}
                  className={styles.avatar}
                />
              </div>

              <div className={styles.content_container}>
                <p className={styles.title}>{message.title}</p>
                <div className={styles.meta_container}>
                  <p
                    className={styles.username}
                  >{`${userLabel}: ${user.name}`}</p>
                  <div className={styles.meta_right}>
                    <p className={styles.timestamp}>{message.created_at}</p>
                    <Link
                      href={`/message/send/${user.name}`}
                      className={styles.reply_button}
                    >
                      返信
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            {selectedId === message.id && (
              <div className={styles.message_body}>
                <p>{message.text}</p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default MessageList;
