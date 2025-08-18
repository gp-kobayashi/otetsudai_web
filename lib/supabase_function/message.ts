import type { SupabaseClient } from "@supabase/supabase-js";
import type { Message, MessageWithProfile, SupabaseResponse } from "@/types/supabase/types";
import { fetchProfile, formatAvatarUrl, formatUserName } from "./profile";
import { formatDatetime } from "@/utils/date";

const formatMessageWithProfile = async (message: MessageWithProfile) => {
  const sender = await fetchProfile(message.sender_id);
  const receiver = await fetchProfile(message.receiver_id);
  const senderAvatarUrl = formatAvatarUrl(sender.data?.avatar_url);
  const receiverAvatarUrl = formatAvatarUrl(receiver.data?.avatar_url);
  const senderUsername = formatUserName(sender.data?.username);
  const receiverUsername = formatUserName(receiver.data?.username);
  const created_at = formatDatetime(message.created_at);
  return {
    ...message,
    sender_avatar_url: senderAvatarUrl,
    receiver_avatar_url: receiverAvatarUrl,
    sender_username: senderUsername,
    receiver_username: receiverUsername,
    created_at: created_at,
  };
};


export const getReceivedMessages = async (
  supabase: SupabaseClient,
  userId: string,
): Promise<MessageWithProfile[]> => {
  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .eq("receiver_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching received messages:", error);
    return [];
  }
  return Promise.all(data.map(formatMessageWithProfile));
};

export const getSentMessages = async (
  supabase: SupabaseClient,
  userId: string,
): Promise<MessageWithProfile[]> => {
  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .eq("sender_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching sent messages:", error);
    return [];
  }

  return Promise.all(data.map(formatMessageWithProfile));
};

export const addSendMessage = async (
  supabase: SupabaseClient,
  senderId: string,
  receiverId: string,
  title: string,
  text: string,
): Promise<SupabaseResponse<Message>> => {
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

  return { data , error: null };
}