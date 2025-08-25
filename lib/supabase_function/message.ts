import type { SupabaseClient } from "@supabase/supabase-js";
import type { Message, MessageWithProfile, Profile, SupabaseResponse } from "@/types/supabase/types";
import { formatAvatarUrl, formatUserName } from "./profile";
import { formatDatetime } from "@/utils/date";

const formatMessageWithProfile = (
  message: Message & { profile: Profile | null },
): MessageWithProfile => {
  const { profile, ...restOfMessage } = message;
  return {
    ...restOfMessage,
    avatar_url: formatAvatarUrl(profile?.avatar_url),
    username: formatUserName(profile?.username),
    created_at: formatDatetime(message.created_at),
  };
};

export const getReceivedMessages = async (
  supabase: SupabaseClient,
  userId: string,
): Promise<MessageWithProfile[]> => {
  const { data, error } = await supabase
    .from("messages")
    .select("*, profile:profiles!sender_id(*)")
    .eq("receiver_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching received messages:", error);
    return [];
  }
  
  const messages = data as unknown as (Message & { profile: Profile | null })[];
  return messages.map(formatMessageWithProfile);
};

export const getSentMessages = async (
  supabase: SupabaseClient,
  userId: string,
): Promise<MessageWithProfile[]> => {
  const { data, error } = await supabase
    .from("messages")
    .select("*, profile:profiles!receiver_id(*)")
    .eq("sender_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching sent messages:", error);
    return [];
  }

  const messages = data as unknown as (Message & { profile: Profile | null })[];
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