import { createClient } from "@/utils/supabase/client";
import type { Recruitment, SupabaseResponse } from "../type/types";

const supabase = createClient();

export const getRecruitment = async (): Promise<
  SupabaseResponse<Recruitment[]>
> => {
  const { data, error } = await supabase.from("recruitments").select("*");

  if (error) {
    return { data: null, error };
  }

  return { data, error: null };
};

export const getRecruitmentBytag = async (
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

export const getRecruitmentByUser = async (
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
