import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import InsertUserNameApp from "./app";
const InsertUserName = async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    s;
    return redirect("/login");
  }
  const user_id = user.id;

  return (
    <div>
      <h2>ユーザーネームを設定してください。</h2>
      <p>投稿に必須で設定した名前はあなたのページのURLになります。</p>
      <p>例：/userProfile/"username"</p>

      <InsertUserNameApp user_id={user_id} />
      <p>ユーザーネームは英数字のみ使用できます。</p>
    </div>
  );
};
export default InsertUserName;
