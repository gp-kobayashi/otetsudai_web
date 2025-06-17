import styles from "./navigation.module.css";
import Link from "next/link";
import { User } from "@supabase/supabase-js";

type Props = {
  user: User | null;
  username?: string | null;
};

const NavigationUI = (props: Props) => {
  const { user, username } = props;

  return (
    <div className={styles.navigation_container}>
      <Link href="/" className={styles.logo}>
        otetsudai
      </Link>
      <div className={styles.navigation_link}>
        <Link href="/createRecruitment" className={styles.recruitment_link}>
          募集する
        </Link>
        <Link href="/help" className={styles.help_link}>
          help
        </Link>
        {user ? (
          <Link
            href={username ? `/userProfile/${username}` : `/insertUserName`}
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

export default NavigationUI;
