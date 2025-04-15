import { createClient } from "@/utils/supabase/client";
import type { Profile, SupabaseResponse } from "../type/types";

const supabase = createClient();
export const DEFAULT_AVATAR_URL = "/default.png";

export const fetchProfile = async (
  user_id: string,
): Promise<SupabaseResponse<Profile>> => {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user_id)
    .single();

  if (error) {
    return { data: null, error };
  }

  return { data, error: null };
};

export const getAvatarUrl = (avatarUrl: string) => {
  const { data } = supabase.storage.from("avatars").getPublicUrl(avatarUrl);
  return data.publicUrl;
};

export const formatAvatarUrl = (avatarUrl: string | null | undefined) => {
  return avatarUrl ? getAvatarUrl(avatarUrl) : DEFAULT_AVATAR_URL;
};

export const formatUserName = (username: string | null | undefined) => {
  return username ? username : "名無し";
}

export const getusername = async (user_id: string) => {
  const { data } = await fetchProfile(user_id);
  if (!data) return null;
  return formatUserName(data.username);
}