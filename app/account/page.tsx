import { redirect } from "next/navigation";
import AccountForm from "./account-form";
import { createClient } from "@/utils/supabase/server";
import { fetchProfile } from "@/app/supabase_function/profile";

export default async function Account() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await fetchProfile(user?.id || "");
  const username = profile?.username;
  if (!user) {
    return redirect("/login");
  }
  if (user && !username) {
    return redirect("/insertUserName");
  }

  return <AccountForm user={user} />;
}
