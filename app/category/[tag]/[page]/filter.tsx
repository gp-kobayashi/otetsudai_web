import styles from "./category.module.css";
import Link from "next/link";

type Props = {
  tag: string;
  page: string;
  currentStatus: string | null;
};

const StatusFilter = ({ tag, page, currentStatus }: Props) => {
  const statuses = ["募集中", "対応中", "完了", "キャンセル", "期限切れ"];

  return (
    <div className={styles.filter_btns}>
      {statuses.map((status) => {
        const isActive = currentStatus === status;
        const href = isActive
          ? `/category/${tag}/${page}`
          : `/category/${tag}/${page}?status=${encodeURIComponent(status)}`;
        return (
          <Link
            key={status}
            href={href}
            className={`${styles.filter_btn} ${isActive ? styles.active : ""}`}
          >
            {status}
          </Link>
        );
      })}
    </div>
  );
};

export default StatusFilter;
