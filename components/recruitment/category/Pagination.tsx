import styles from "./category.module.css";
import Link from "next/link";
import { GrLinkNext, GrLinkPrevious } from "react-icons/gr";

type Props = {
  currentPage: number;
  hasNextPage: boolean;
  tag: string;
  filterQuery: string;
};
const Pagination = (props: Props) => {
  const { currentPage, tag, hasNextPage, filterQuery } = props;

  return (
    <div className={styles.page_navigation}>
      {currentPage > 1 && (
        <Link href={`/category/${tag}/${currentPage - 1}${filterQuery}`}>
          <GrLinkPrevious
            className={styles.page_link}
            data-testid="icon-previous"
          />
        </Link>
      )}
      <span className={styles.current_page}> {currentPage} </span>
      {hasNextPage && (
        <Link href={`/category/${tag}/${currentPage + 1}${filterQuery}`}>
          <GrLinkNext className={styles.page_link} data-testid="icon-next" />
        </Link>
      )}
    </div>
  );
};

export default Pagination;
