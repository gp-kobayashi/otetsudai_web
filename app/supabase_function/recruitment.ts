import { createClient } from "@/utils/supabase/client";
import type {
  Recruitment,
  RecruitmentWithProfile,
  SupabaseResponse,
} from "../type/types";
import { formatAvatarUrl, formatUserName } from "./profile";

const supabase = createClient();

export const getRecruitmentList = async (): Promise<
  SupabaseResponse<RecruitmentWithProfile[]>
> => {
  const { data, error } = await supabase
    .from("recruitments")
    .select("*,profiles(avatar_url,username)")
    .order("created_at", { ascending: false });

  if (error) {
    return { data: null, error };
  }
  const RecruitmentData = data.map((recruitmen) => {
    const avatarUrl = formatAvatarUrl(recruitmen.profiles.avatar_url);
    const userName =formatUserName(recruitmen.profiles.username);
    return {
      ...recruitmen,
      avatar_url: avatarUrl,
      username: userName,
    };
  });
  return { data: RecruitmentData, error: null };
};

export const getRecruitmentBytagList = async (
  tag: string,
): Promise<SupabaseResponse<Recruitment[]>> => {
  const { data, error } = await supabase
    .from("recruitments")
    .select("*")
    .eq("tag", tag);

  if (error) {
    return { data: null, error };
  }

  return { data, error: null };
};

export const getRecruitmentByUserList = async (
  user_id: string,
): Promise<SupabaseResponse<Recruitment[]>> => {
  const { data, error } = await supabase
    .from("recruitments")
    .select("*")
    .eq("uesr_id", user_id);

  if (error) {
    return { data: null, error };
  }

  return { data, error: null };
};

export const getRecruitmentById = async (
  id: number,
): Promise<SupabaseResponse<RecruitmentWithProfile>> => {
  const { data, error } = await supabase
    .from("recruitments")
    .select("*,profiles(avatar_url,username)")
    .eq("id", id)
    .single();

  if (error) {
    return { data: null, error };
  }

  const avatarUrl = formatAvatarUrl(data.profiles.avatar_url);
  const userName = formatUserName(data.profiles.username);

  const recruitmentData = {
    ...data,
    avatar_url: avatarUrl,
    username: userName,
  };

  return { data: recruitmentData, error: null };
}

export const addRecruitment = async (
  title: string,
  explanation: string,
  user_id: string,
  tag: string,
): Promise<SupabaseResponse<Recruitment>> => {
  const { data, error } = await supabase.from("recruitments").insert({
    title: title,
    explanation: explanation,
    user_id: user_id,
    tag: tag,
  });

  if (error) {
    return { data: null, error };
  }

  return { data, error: null };
};

export const deleteRecruitment = async (
  id: string,
): Promise<SupabaseResponse<Recruitment>> => {
  const { data, error } = await supabase
    .from("recruitments")
    .delete()
    .eq("id", id);

  if (error) {
    return { data: null, error };
  }

  return { data, error: null };
};
