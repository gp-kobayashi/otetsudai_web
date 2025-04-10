import { createClient } from "@/utils/supabase/client";
import type { Profile, SupabaseResponse } from "../type/types";

const supabase = createClient();
export const DEFAULT_AVATAR_URL = "/default.png";

export const getProfile = async (
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
