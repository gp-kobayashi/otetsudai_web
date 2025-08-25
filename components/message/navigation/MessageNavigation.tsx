"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./messageNavigation.module.css";

const MessageNavigation = () => {
  const pathname = usePathname();

  return (
    <div className={styles.navigation_container}>
      <Link
        href="/message/inbox"
        className={`${styles.navigation_item} ${
          pathname === "/message/inbox" ? styles.active : ""
        }`}
      >
        受信
      </Link>
      <Link
        href="/message/sent"
        className={`${styles.navigation_item} ${
          pathname === "/message/sent" ? styles.active : ""
        }`}
      >
        送信済
      </Link>
    </div>
  );
};

export default MessageNavigation;
