import type { Database } from "@/database.types";

export type Recruitment = Database["public"]["Tables"]["recruitments"]["Row"];

export type Comment = Database["public"]["Tables"]["comments"]["Row"];

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];

export type RecruitmentWithProfile =
  Recruitment & {
    avatar_url: string;
  } & { username: string | null };

export type CommentWithProfile =
  Comment & {
    avatar_url: string;
  } & { username: string | null };
  
export type SupabaseResponse<T> = {
  data: T | null;
  error: Error | null;
};
