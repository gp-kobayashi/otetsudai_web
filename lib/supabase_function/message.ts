import { createClient } from "@/utils/supabase/client";
import type { Message } from "@/types/supabase/types";

const supabase = createClient();

export const getReceivedMessages = async (userId: string): Promise<Message[]> => {
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

export const getSentMessages = async (userId: string): Promise<Message[]> => {
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
    }