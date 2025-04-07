import { createClient } from "@/utils/supabase/client";

import type { Comment, SupabaseResponse } from "../type/types";

const supabase = createClient();

export const getComment = async (): Promise<SupabaseResponse<Comment[]>> => {
  const { data, error } = await supabase.from("comments").select("*");

  if (error) {
    return { data: null, error };
  }

  return { data, error: null };
};

export const getCommentByRecruitment = async (
  recruitment_id: string,
): Promise<SupabaseResponse<Comment[]>> => {
  const { data, error } = await supabase
    .from("comments")
    .select("*")
    .eq("recruitment_id", recruitment_id);

  if (error) {
    return { data: null, error };
  }

  return { data, error: null };
};

export const getCommentByUser = async (
  user_id: string,
): Promise<SupabaseResponse<Comment[]>> => {
  const { data, error } = await supabase
    .from("comments")
    .select("*")
    .eq("user_id", user_id);

  if (error) {
    return { data: null, error };
  }

  return { data, error: null };
};
