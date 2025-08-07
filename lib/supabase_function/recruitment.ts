import { createClient } from "@/utils/supabase/client";
import type {
  Recruitment,
  RecruitmentWithProfile,
  SupabaseResponse,
} from "@/types/supabase/types";
import { PostgrestError } from "@supabase/supabase-js";
import { formatAvatarUrl, formatUserName } from "./profile";
import { formatDatetime } from "@/utils/date";
import { searchSchema } from "@/utils/zod";
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
  const RecruitmentData = data.map((recruitment) => {
    const avatarUrl = formatAvatarUrl(recruitment.profiles.avatar_url);
    const userName =formatUserName(recruitment.profiles.username);
    const created_at = formatDatetime(recruitment.created_at);
    return {
      ...recruitment,
      avatar_url: avatarUrl,
      username: userName,
      created_at: created_at,
    };
  });
  return { data: RecruitmentData, error: null };
};

export const getRecruitmentBytag = async (
  tag: string, limit = 5, offset = 0, status?: string | null,
): Promise<{data:RecruitmentWithProfile[]|null;count: number | null;
  error: PostgrestError | null}> => {
    let query  = supabase
    .from("recruitments")
    .select("*,profiles(avatar_url,username)",{ count: "exact" })
    .eq("tag", tag)
    .range(offset, offset + limit - 1)
    .order("created_at", { ascending: false });
  if (status) {
      query = query.eq("status", status);
    }
  const { data, count, error } = await query;
  if (error) {
    return { data: null,count:null ,error };
  }
  const RecruitmentData = data.map((recruitment) => {
    const avatarUrl = formatAvatarUrl(recruitment.profiles.avatar_url);
    const userName =formatUserName(recruitment.profiles.username);
    const created_at = formatDatetime(recruitment.created_at);
    return {
      ...recruitment,
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
  const created_at = formatDatetime(data.created_at);
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

export const updateStatus = async (
  id: number,
  status: string,
): Promise<SupabaseResponse<Recruitment>> => {
  const { data, error } = await supabase
    .from("recruitments")
    .update({ status: status })
    .eq("id", id);

  if (error) {
    return { data: null, error };
  }

  return { data, error: null };
}

export const updateRecruitment = async (
  id: number,
  title: string,
  explanation: string,
): Promise<SupabaseResponse<Recruitment>> => {
  const { data, error } = await supabase
    .from("recruitments")
    .update({ title: title, explanation: explanation })
    .eq("id", id);

  if (error) {
    return { data: null, error };
  }

  return { data, error: null };
};

export const searchRecruitment = async (
  keyword: string,
  limit = 5,
  offset = 0,
): Promise<{
  data: RecruitmentWithProfile[] | null;
  count: number | null;
  error: PostgrestError | null;
  zodError: string | null;
}> => {
  const validatedKeyword = searchSchema.safeParse({ keyword });
  if (!validatedKeyword.success) {
    return {
      data: null,
      count: null,
      error: null,
      zodError: validatedKeyword.error.errors[0].message,
    };
  }
  const { data, count, error } = await supabase
    .from("recruitments")
    .select("*,profiles(avatar_url,username)", { count: "exact" })
    .or(`title.ilike.%${validatedKeyword.data.keyword}%,explanation.ilike.%${validatedKeyword.data.keyword}%`)
    .range(offset, offset + limit - 1)
    .order("created_at", { ascending: false });

  if (error) {
    return { data: null, count: null, error, zodError: null };
  }

  const RecruitmentData = data.map((recruitment) => {
    const avatarUrl = formatAvatarUrl(recruitment.profiles.avatar_url);
    const userName = formatUserName(recruitment.profiles.username);
    const created_at = formatDatetime(recruitment.created_at);
    return {
      ...recruitment,
      avatar_url: avatarUrl,
      username: userName,
      created_at: created_at,
    };
  });

  return { data: RecruitmentData, count, error: null, zodError: null };
};