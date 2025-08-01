import SearchList from "@/components/recruitment/search/SearchList";
import Pagination from "@/components/util/Pagination";
import { searchRecruitment } from "@/lib/supabase_function/recruitment";

type params = {
  keyword: string;
  page: number;
};

const itemsPerPage = 5;

const search = async ({ params }: { params: params }) => {
  const { keyword, page } = params;
  const decodedKeyword = decodeURIComponent(keyword);
  const basePath = `/search/${encodeURIComponent(decodedKeyword)}`;
  const currentPage = Number(page);
  const offset = (currentPage - 1) * itemsPerPage;

  const { data: recruitmentList = [], count = 0 } = await searchRecruitment(
    decodedKeyword,
    itemsPerPage,
    offset,
  );

  const totalPages = count ? Math.ceil(count / itemsPerPage) : 1;
  const hasNextPage = currentPage < totalPages;

  return (
    <div>
      <h1>"{decodedKeyword}"の検索結果</h1>
      <SearchList keyword={decodedKeyword} recruitmentList={recruitmentList} />

      <Pagination
        currentPage={currentPage}
        hasNextPage={hasNextPage}
        filterQuery={""}
        basePath={basePath}
      />
    </div>
  );
};

export default search;
