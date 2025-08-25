import type { SupabaseClient } from "@supabase/supabase-js";
import type { Message, MessageWithProfile, Profile, SupabaseResponse } from "@/types/supabase/types";
import { formatAvatarUrl, formatUserName } from "./profile";
import { formatDatetime } from "@/utils/date";

const formatMessageWithProfile = (
  message: Message & { sender: Profile | null; receiver: Profile | null }
): MessageWithProfile => {
  const { sender, receiver, ...restOfMessage } = message;
  return {
    ...restOfMessage,
    sender_avatar_url: formatAvatarUrl(sender?.avatar_url),
    receiver_avatar_url: formatAvatarUrl(receiver?.avatar_url),
    sender_username: formatUserName(sender?.username),
    receiver_username: formatUserName(receiver?.username),
    created_at: formatDatetime(message.created_at),
  };
};

export const getReceivedMessages = async (
  supabase: SupabaseClient,
  userId: string,
): Promise<MessageWithProfile[]> => {
  const { data, error } = await supabase
    .from("messages")
    .select("*, sender:profiles!sender_id(*)")
    .eq("receiver_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching received messages:", error);
    return [];
  }
  
  const messages = data as unknown as (Message & { sender: Profile | null; receiver: Profile | null })[];
  return messages.map(formatMessageWithProfile);
};

export const getSentMessages = async (
  supabase: SupabaseClient,
  userId: string,
): Promise<MessageWithProfile[]> => {
  const { data, error } = await supabase
    .from("messages")
    .select("*,  receiver:profiles!receiver_id(*)")
    .eq("sender_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching sent messages:", error);
    return [];
  }

  const messages = data as unknown as (Message & { sender: Profile | null; receiver: Profile | null })[];
  return messages.map(formatMessageWithProfile);
};

export const addSendMessage = async (
  supabase: SupabaseClient,
  receiverId: string,
  title: string,
  text: string,
): Promise<SupabaseResponse<Message>> => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { data: null, error: new Error("User not authenticated") };
  }
  const senderId = user.id;
  const { data, error } = await supabase
    .from("messages")
    .insert({
      sender_id: senderId,
      receiver_id: receiverId,
      title: title,
      text: text,
    })
    .select("*")
    .single();

  if (error) {
    return { data: null, error };
  }

  return { data, error: null };
};