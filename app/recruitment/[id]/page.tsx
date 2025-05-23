import { getRecruitmentById } from "@/lib/supabase_function/recruitment";
import { fetchProfile } from "@/lib/supabase_function/profile";
import CommentApp from "@/components/recruitment/comment/app";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Recruitment from "@/components/recruitment/recruitment/recruitment";
interface Params {
  params: Promise<{ id: number }>;
}

const recruitment = async ({ params }: Params) => {
  const { id } = await params;
  const { data } = await getRecruitmentById(id);
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let userId = null;
  let username = null;
  let avatarUrl = null;
  if (user) {
    userId = user.id;
    username = (await fetchProfile(userId)).data?.username;
    avatarUrl = (await fetchProfile(userId)).data?.avatar_url;
  }
  if (!username) {
    redirect("/insertUserName");
  }
  if (!data) {
    return <div>募集が見つかりませんでした</div>;
  }

  return (
    <div>
      <Recruitment data={data} userId={userId} id={id} />

      <CommentApp
        id={id}
        userId={userId}
        username={username}
        avatarUrl={avatarUrl}
      />
    </div>
  );
};

export default recruitment;
