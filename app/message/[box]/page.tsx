import { createClient } from "@/utils/supabase/server";
import {
  getReceivedMessages,
  getSentMessages,
} from "@/lib/supabase_function/message";
import MessageList from "@/components/message/MessageList";
import MessageNavigation from "@/components/message/navigation/MessageNavigation";
import { redirect } from "next/navigation";
import type { MessageWithProfile } from "@/types/supabase/types";
type props = {
  params: { box: string };
};

const MessagePage = async ({ params }: props) => {
  const { box } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  let messages: MessageWithProfile[] = [];

  if (box === "inbox") {
    messages = await getReceivedMessages(supabase, user.id);
  } else if (box === "sent") {
    messages = await getSentMessages(supabase, user.id);
  } else {
    return redirect("/message/inbox");
  }

  return (
    <div>
      <MessageNavigation />
      <MessageList messages={messages} boxType={box} />
    </div>
  );
};
export default MessagePage;
