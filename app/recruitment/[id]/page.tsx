import { getRecruitmentById } from "@/lib/supabase_function/recruitment";
import { fetchProfile } from "@/lib/supabase_function/profile";
import CommentApp from "@/components/recruitment/comment/CommentApp";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Recruitment from "@/components/recruitment/recruitment/Recruitment";
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
  if (!user) {
    redirect("/login");
  }

  if (user) {
    userId = user.id;
    const { data: profile } = await fetchProfile(userId);
    if (profile) {
      username = profile.username;
      avatarUrl = profile.avatar_url;
    }
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
