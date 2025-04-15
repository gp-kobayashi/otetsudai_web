import styles from "./createRecruitment.module.css";
import { createClient } from "@/utils/supabase/server";
import { fetchProfile } from "../supabase_function/profile";
import { redirect } from "next/navigation";
import RecruitmentForm from "./form";

const createRecruitment = async () => {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const UserProfile = await fetchProfile(user.id || "");
  const user_id = UserProfile.data?.id || "";

  return (
    <div className={styles.page_container}>
      <h3>募集する</h3>
      <RecruitmentForm user_id={user_id} />
    </div>
  );
};

export default createRecruitment;
