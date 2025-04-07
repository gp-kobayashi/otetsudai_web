import type { Database } from "@/database.types";

export type Recruitment = Database["public"]["Tables"]["recruitments"]["Row"];

export type Comment = Database["public"]["Tables"]["comments"]["Row"];

export type SupabaseResponse<T> = {
  data: T | null;
  error: Error | null;
};
