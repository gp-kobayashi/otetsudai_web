import { getRecruitmentById } from "@/app/supabase_function/recruitment";
import { fetchProfile } from "@/app/supabase_function/profile";
import RecruitmentComponent from "./recruitment";
import CommentApp from "@/app/components/comment/app";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

interface Params {
  id: number;
}

const recruitment = async ({ params }: { params: Params }) => {
  const { id } = params;
  const { data } = await getRecruitmentById(id);
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let userId = null;
  let username = null;

  if (user) {
    userId = user.id;
    username = (await fetchProfile(userId)).data?.username;
  }
  if (!username) {
    redirect("/insertUserName");
  }
  if (!data) {
    return <div>募集が見つかりませんでした</div>;
  }
  return (
    <div>
      <RecruitmentComponent id={id} userId={userId} recruitmentData={data} />

      <CommentApp id={id} userId={userId} username={username} />
    </div>
  );
};

export default recruitment;
