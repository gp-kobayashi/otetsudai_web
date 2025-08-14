import { createClient } from "@/utils/supabase/client";
import type { Profile, SupabaseResponse } from "@/types/supabase/types";

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

export const fetchProfileByUsername = async (
  username: string,
): Promise<SupabaseResponse<Profile>> => {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("username", username)
    .single();

  if (error) {
    return { data: null, error };
  }

  return { data, error: null };
};

export const insertUsername = async (user_id: string, username: string) => {
  const { data, error } = await supabase
    .from("profiles")
    .update({ username })
    .eq("id", user_id);

  if (error) {
    return { data: null, error };
  }

  return { data, error: null };
}

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

export const getProfilesByIds = async (
  ids: string[],
): Promise<SupabaseResponse<Profile[]>> => {
  if (!ids || ids.length === 0) {
    return { data: [], error: null };
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .in("id", ids);

  if (error) {
    console.error("Error fetching profiles by IDs:", error);
    return { data: null, error };
  }

  return { data, error: null };
};