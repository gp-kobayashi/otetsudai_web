import { getRecruitmentBytag } from "@/app/supabase_function/recruitment";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import CategoryList from "./list";
import styles from "./category.module.css";
import StatusFilter from "./filter";
import Pagination from "./pagination";

type PageProps = {
  params: Promise<{
    tag: string;
    page: string;
  }>;
  searchParams: Promise<{
    status?: string;
  }>;
};

const categoryPage = async ({ params, searchParams }: PageProps) => {
  const { tag, page } = await params;
  const status = (await searchParams).status ?? null;
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
  const { data, count } = await getRecruitmentBytag(
    tag,
    itemsPerPage,
    offset,
    status,
  );
  if (!data) {
    redirect("/");
  }
  const filterQuery =
    status && status !== "all" ? `?status=${encodeURIComponent(status)}` : "";
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
        <StatusFilter tag={tag} currentStatus={status} />
        <h4>ページ：{page}</h4>
      </div>
      <CategoryList recruitmentList={recruitmentList} />
      <Pagination
        filterQuery={filterQuery}
        currentPage={currentPage}
        hasNextPage={hasNextPage}
        tag={tag}
      />
    </div>
  );
};

export default categoryPage;
