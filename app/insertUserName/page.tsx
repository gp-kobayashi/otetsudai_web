import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import InsertUserNameApp from "@/components/profiles/username/InsertUserNameApp";
import styles from "./inserUserName.module.css";

const InsertUserName = async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return redirect("/login");
  }
  const user_id = user.id;

  return (
    <div className={styles.username_container}>
      <h2 className={styles.title}>ユーザーネームを設定してください。</h2>
      <p className={styles.text}>依頼やコメントの投稿に必須です。</p>
      <p>設定した名前はあなたのページのURLになります。</p>

      <p className={styles.text}>例：/userProfile/（username）</p>

      <InsertUserNameApp user_id={user_id} />
      <p className={styles.attention}>
        ※ユーザーネームは３文字以上で英数字のみ使用できます。
      </p>
    </div>
  );
};
export default InsertUserName;
