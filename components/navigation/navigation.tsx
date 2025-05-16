import { createClient } from "@/utils/supabase/server";
import styles from "./navigation.module.css";
import Link from "next/link";
import { fetchProfile } from "@/lib/supabase_function/profile";

const Navigation = async () => {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let username = null;

  if (user) {
    const { data } = await fetchProfile(user.id);
    username = data?.username || null;
  }

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
          <Link
            href={`/userProfile/${username}`}
            className={styles.account_link}
          >
            profile
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
