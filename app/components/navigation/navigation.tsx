import { createClient } from "@/utils/supabase/server";
import styles from "./navigation.module.css";
import Link from "next/link";

const Navigation = async () => {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className={styles.navigation_container}>
      <Link href="/" className={styles.logo}>
        <h1>otetsudai</h1>
      </Link>
      <div className={styles.navigation_link}>
        <Link href="/createRecruitment" className={styles.recruitment_link}>
          募集する
        </Link>
        <Link href="/help " className={styles.help_link}>
          help
        </Link>
        {user ? (
          <Link href="/account" className={styles.account_link}>
            plofile
          </Link>
        ) : (
          <Link href="/login" className={styles.login_link}>
            ログイン
          </Link>
        )}
      </div>
    </div>
  );
};

export default Navigation;
