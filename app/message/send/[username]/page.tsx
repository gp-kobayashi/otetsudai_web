type props = {
  params: { username: string };
};
import SendForm from "@/components/message/send/SendForm";
import {
  fetchProfileByUsername,
  fetchProfile,
} from "@/lib/supabase_function/profile";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
const SendMessagePage = async ({ params }: props) => {
  const { username } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return redirect("/login");
  }
  const { data: senderProfile, error: senderError } = await fetchProfile(
    user.id,
  );

  if (senderError || !senderProfile) {
    return (
      <p>
        メッセージを送信するには、まずプロフィールを作成する必要があります。
      </p>
    );
  }
  if (!senderProfile.username) {
    return redirect("/insertUserName");
  }
  if (!username) {
    return <p>ユーザーが存在しません</p>;
  }
  const { data: receiverProfile, error } =
    await fetchProfileByUsername(username);

  if (error || !receiverProfile) {
    return <p>ユーザーが見つかりませんでした。</p>;
  }
  const receiverId = receiverProfile.id;

  return (
    <div>
      <SendForm
        receiverId={receiverId}
        senderId={user.id}
        receivUsername={username}
      />
    </div>
  );
};
export default SendMessagePage;
