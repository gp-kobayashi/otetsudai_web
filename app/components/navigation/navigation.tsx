import styles from "./navigation.module.css";
import Link from "next/link";

const Navigation = () => {
  return (
    <div className={styles.navigation_container}>
      <h1>otetsudai</h1>
      <div className={styles.navigation_link}>
        <Link href="/createRecruitment" className={styles.recruitment_link}>
          募集する
        </Link>
        <p>plofile</p>
      </div>
    </div>
  );
};

export default Navigation;
