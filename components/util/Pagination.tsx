import styles from "./pagination.module.css";
import Link from "next/link";
import { GrLinkNext, GrLinkPrevious } from "react-icons/gr";

type Props = {
  currentPage: number;
  hasNextPage: boolean;
  filterQuery: string | null;
  basePath: string;
};
const Pagination = (props: Props) => {
  const { currentPage, hasNextPage, filterQuery, basePath } = props;

  return (
    <div className={styles.page_navigation}>
      {currentPage > 1 && (
        <Link href={basePath + `/${currentPage - 1}${filterQuery}`}>
          <GrLinkPrevious
            className={styles.page_link}
            data-testid="icon-previous"
          />
        </Link>
      )}
      <span className={styles.current_page}> {currentPage} </span>
      {hasNextPage && (
        <Link href={basePath + `/${currentPage + 1}${filterQuery}`}>
          <GrLinkNext className={styles.page_link} data-testid="icon-next" />
        </Link>
      )}
    </div>
  );
};

export default Pagination;
