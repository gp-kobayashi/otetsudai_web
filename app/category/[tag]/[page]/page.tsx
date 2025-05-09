import { getRecruitmentBytag } from "@/app/supabase_function/recruitment";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import CategoryList from "./list";
import styles from "./category.module.css";

type Props = {
  params: { tag: string; page: string };
  searchParams?: { [key: string]: string | string[] | undefined };
};

const categoryPage = async ({
  params,
  searchParams,
}: {
  params: { tag: string; page: string };
  searchParams: { filter?: string };
}) => {
  const { tag, page } = params;
  const currentPage = Number(page);
  const itemsPerPage = 5;
  const offset = (currentPage - 1) * itemsPerPage;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login");
  }
  const showOnlyOpen = searchParams.filter === "open";
  const { data, count } = await getRecruitmentBytag(
    tag,
    itemsPerPage,
    offset,
    showOnlyOpen,
  );
  if (!data) {
    redirect("/");
  }
  const totalPages = count ? Math.ceil(count / itemsPerPage) : 1;
  const hasNextPage = currentPage < totalPages;
  const recruitmentList = data.map((recruitment) => {
    return {
      ...recruitment,
      avatar_url: recruitment.avatar_url,
      username: recruitment.username,
    };
  });
  return (
    <div>
      <div className={styles.category_header}>
        <h3>カテゴリー：{tag}</h3>
        <div className={styles.filter_btn}>
          <a
            href={!showOnlyOpen ? `?filter=open` : `/category/${tag}/${page}`}
            className={styles.filter_text}
          >
            募集中のみ
          </a>

          <div
            className={
              !showOnlyOpen ? styles.filter_marker : styles.filter_marker_active
            }
          ></div>
        </div>
        <h4>ページ：{page}</h4>
      </div>
      <CategoryList
        recruitmentList={recruitmentList}
        tag={tag}
        currentPage={currentPage}
        hasNextPage={hasNextPage}
        filter={searchParams?.filter ?? "all"}
      />
    </div>
  );
};

export default categoryPage;
