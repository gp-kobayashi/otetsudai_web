import { createClient } from "@/utils/supabase/server";

import { fetchProfile } from "@/lib/supabase_function/profile";
import NavigationUI from "./NavigationUI";

const Navigation = async () => {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let username = null;

  if (user) {
    try {
      const { data } = await fetchProfile(user.id);
      username = data?.username || null;
    } catch (error) {
      console.error("Failed to fetch profile:", error);
    }
  }

  return <NavigationUI user={user} username={username} />;
};

export default Navigation;
