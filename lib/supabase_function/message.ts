import type { SupabaseClient } from "@supabase/supabase-js";
import type { Message, SupabaseResponse } from "@/types/supabase/types";


export const getReceivedMessages = async (
  supabase: SupabaseClient,
  userId: string
): Promise<Message[]> => {
  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .eq("receiver_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching received messages:", error);
    return [];
  }

  return data;
};

export const getSentMessages = async (
  supabase: SupabaseClient,
  userId: string
): Promise<Message[]> => {
  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .eq("sender_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching sent messages:", error);
    return [];
  }

  return data;
};
