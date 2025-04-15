import { getRecruitmentBytag } from "@/app/supabase_function/recruitment";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import CategoryList from "./list";

interface Params {
  tag: string;
}

const categoryPage = async ({ params }: { params: Promise<Params> }) => {
  const { tag } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login");
  }
  const { data } = await getRecruitmentBytag(tag);
  if (!data) {
    redirect("/");
  }
  const recruitmentList = data.map((recruitment) => {
    return {
      ...recruitment,
      avatar_url: recruitment.avatar_url,
      username: recruitment.username,
    };
  });
  return (
    <div>
      <h3>カテゴリー：{tag}</h3>
      <CategoryList recruitmentList={recruitmentList} />
    </div>
  );
};

export default categoryPage;
