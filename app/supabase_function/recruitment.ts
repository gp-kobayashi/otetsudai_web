import { createClient } from "@/utils/supabase/client";
import type {
  Recruitment,
  RecruitmentWithProfile,
  SupabaseResponse,
} from "../type/types";
import { PostgrestError } from "@supabase/supabase-js";
import { formatAvatarUrl, formatUserName } from "./profile";
import dayjs from "dayjs";
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

dayjs.extend(utc)
dayjs.extend(timezone)
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
    const userName =formatUserName(recruitmen.profiles.username);7
    const created_at = formatCreateAt(recruitmen.created_at);
    return {
      ...recruitmen,
      avatar_url: avatarUrl,
      username: userName,
      created_at: created_at,
    };
  });
  return { data: RecruitmentData, error: null };
};

export const getRecruitmentBytag = async (
  tag: string, limit = 5, offset = 0
): Promise<{data:RecruitmentWithProfile[]|null;count: number | null;
  error: PostgrestError | null}> => {
  const { data,count, error } = await supabase
    .from("recruitments")
    .select("*,profiles(avatar_url,username)",{ count: "exact" })
    .eq("tag", tag)
    .range(offset, offset + limit - 1)
    .order("created_at", { ascending: false });

  if (error) {
    return { data: null,count:null ,error };
  }
  const RecruitmentData = data.map((recruitmen) => {
    const avatarUrl = formatAvatarUrl(recruitmen.profiles.avatar_url);
    const userName =formatUserName(recruitmen.profiles.username);
    const created_at = formatCreateAt(recruitmen.created_at);
    return {
      ...recruitmen,
      avatar_url: avatarUrl,
      username: userName,
      created_at: created_at,
    };
  });
  return { data:RecruitmentData,count, error: null };
};

export const getRecruitmentByUserList = async (
  user_id: string,
): Promise<SupabaseResponse<Recruitment[]>> => {
  const { data, error } = await supabase
    .from("recruitments")
    .select("*")
    .eq("user_id", user_id)
    .order("created_at" , { ascending: false });

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
  const created_at = formatCreateAt(data.created_at);
  const recruitmentData = {
    ...data,
    avatar_url: avatarUrl,
    username: userName,
    created_at: created_at,
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
  id: number,
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

export const formatCreateAt = (created_at: string) => {
  return dayjs.utc(created_at).tz('Asia/Tokyo').format('YYYY/MM/DD HH:mm')
}