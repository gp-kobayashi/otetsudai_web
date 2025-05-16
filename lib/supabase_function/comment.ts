import { createClient } from "@/utils/supabase/client";
import { formatAvatarUrl, formatUserName } from "./profile";
import type { Comment, CommentWithProfile, SupabaseResponse } from "../../types/supabase/types";
import { formatDatetime } from "@/utils/date";

const supabase = createClient();

export const getComment = async (): Promise<SupabaseResponse<Comment[]>> => {
  const { data, error } = await supabase.from("comments").select("*");

  if (error) {
    return { data: null, error };
  }

  return { data, error: null };
};

export const getCommentByRecruitment = async (
  recruitment_id: number,
): Promise<SupabaseResponse<CommentWithProfile[]>> => {
  const { data, error } = await supabase
    .from("comments")
    .select("*,profiles(avatar_url,username)")
    .eq("recruitment_id", recruitment_id);
  
  if (error) {
    return { data: null, error };
  }
  const commentsData = data.map((recruitmen) => {
      const avatarUrl = formatAvatarUrl(recruitmen.profiles.avatar_url);
      const userName = formatUserName(recruitmen.profiles.username);
      const created_at = formatDatetime(recruitmen.created_at);
      return {
        ...recruitmen,
        avatar_url: avatarUrl,
        username: userName,
        created_at: created_at,
      };
    });
    return { data: commentsData, error: null };
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

export const addComment = async (
  user_id: string,
  recruitment_id: number,
  text: string,
): Promise<SupabaseResponse<Comment>> => {
  const { data, error } = await supabase
    .from("comments")
    .insert({ user_id, recruitment_id, text})
    .select("*")
    .single();

  if (error) {
    return { data: null, error };
  }

  return { data, error: null };
}