import { getRecruitmentBytag } from "@/app/supabase_function/recruitment";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import CategoryList from "./list";
import styles from "./category.module.css";

interface Params {
  tag: string;
  page: string;
}

const categoryPage = async ({ params }: { params: Params }) => {
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
  const { data, count } = await getRecruitmentBytag(tag, itemsPerPage, offset);
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
        <h4>ページ：{page}</h4>
      </div>
      <CategoryList
        recruitmentList={recruitmentList}
        tag={tag}
        currentPage={currentPage}
        hasNextPage={hasNextPage}
      />
    </div>
  );
};

export default categoryPage;
