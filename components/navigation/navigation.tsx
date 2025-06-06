import { createClient } from "@/utils/supabase/server";

import { fetchProfile } from "@/lib/supabase_function/profile";
import NavigationUI from "./navigationUI";

const Navigation = async () => {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let username = null;

  if (user) {
    const { data } = await fetchProfile(user.id);
    username = data?.username || null;
  }

  return <NavigationUI user={user} username={username} />;
};

export default Navigation;
