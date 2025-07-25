import { Database } from "@/utils/supabase/database.types";

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];