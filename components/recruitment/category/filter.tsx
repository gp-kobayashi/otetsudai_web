import styles from "@/app/category/[tag]/[page]/category.module.css";
import Link from "next/link";
import { STATUS_VALUES } from "@/utils/enum/enum";

type Props = {
  tag: string;
  currentStatus: string | null;
};

const StatusFilter = ({ tag, currentStatus }: Props) => {
  return (
    <div className={styles.filter_btns}>
      {STATUS_VALUES.map((status) => {
        const isActive = currentStatus === status;
        const href = isActive
          ? `/category/${tag}/1`
          : `/category/${tag}/1?status=${encodeURIComponent(status)}`;
        return (
          <Link
            key={status}
            href={href}
            className={`${styles.filter_btn} ${isActive && styles.active}`}
          >
            {status}
          </Link>
        );
      })}
    </div>
  );
};

export default StatusFilter;
