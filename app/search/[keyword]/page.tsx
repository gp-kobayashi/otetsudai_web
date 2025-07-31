import SearchList from "@/components/recruitment/search/SearchList";

interface Params {
  params: Promise<{ keyword: string }>;
}
const search = ({ params }: { params: { keyword: string } }) => {
  const decodedKeyword = decodeURIComponent(params.keyword);

  return (
    <div>
      <h1>"{decodedKeyword}"の検索結果</h1>
      <SearchList keyword={decodedKeyword} />
    </div>
  );
};

export default search;
