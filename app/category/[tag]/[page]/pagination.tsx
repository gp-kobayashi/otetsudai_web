import styles from "./category.module.css";
import Link from "next/link";
import { GrLinkNext, GrLinkPrevious } from "react-icons/gr";

type Props = {
  currentPage: number;
  hasNextPage: boolean;
  tag: string;
  filter: string | null;
};
const Pagination = (props: Props) => {
  const { currentPage, tag, hasNextPage, filter } = props;
  const filterQuery =
    filter && filter !== "all" ? `?status=${encodeURIComponent(filter)}` : "";
  return (
    <div className={styles.page_navigation}>
      {currentPage > 1 && (
        <Link href={`/category/${tag}/${currentPage - 1}${filterQuery}`}>
          <GrLinkPrevious className={styles.page_link} />
        </Link>
      )}
      <span className={styles.current_page}> {currentPage} </span>
      {hasNextPage && (
        <Link href={`/category/${tag}/${currentPage + 1}${filterQuery}`}>
          <GrLinkNext className={styles.page_link} />
        </Link>
      )}
    </div>
  );
};

export default Pagination;
