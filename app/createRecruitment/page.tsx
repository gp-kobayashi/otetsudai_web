import styles from "./createRecruitment.module.css";
import { createClient } from "@/utils/supabase/server";
import { fetchProfile } from "@/lib/supabase_function/profile";
import { redirect } from "next/navigation";
import RecruitmentForm from "@/components/recruitment/create/RecruitmentForm";

const createRecruitment = async () => {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const UserProfile = await fetchProfile(user.id);
  if (!UserProfile.data) {
    redirect("/login");
  }
  if (!UserProfile.data.username) {
    redirect("/insertUserName");
  }

  const user_id = UserProfile.data.id;

  return (
    <div className={styles.page_container}>
      <h3>募集する</h3>
      <RecruitmentForm user_id={user_id} />
    </div>
  );
};

export default createRecruitment;
