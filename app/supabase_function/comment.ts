import { createClient } from "@/utils/supabase/client";
import { formatAvatarUrl, formatUserName } from "./profile";

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
    .select("*,profiles(avatar_url,username)")
    .eq("recruitment_id", recruitment_id);
  
  if (error) {
    return { data: null, error };
  }
  const commentsData = data.map((recruitmen) => {
      const avatarUrl = formatAvatarUrl(recruitmen.profiles.avatar_url);
      const userName = formatUserName(recruitmen.profiles.username);
      return {
        ...recruitmen,
        avatar_url: avatarUrl,
        username: userName,
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
