import {
  fetchProfile,
  fetchProfileByUsername,
  formatAvatarUrl,
} from "@/app/supabase_function/profile";
import styles from "./userProfile.module.css";
import Image from "next/image";
import UserRecruitmentList from "./list";
import { getRecruitmentByUserList } from "@/app/supabase_function/recruitment";
import { createClient } from "@/utils/supabase/server";
import { GoLink } from "react-icons/go";
interface Params {
  username: string;
}

const UserProfile = async ({ params }: { params: Params }) => {
  const username = params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let checkUsername = false;
  if (user) {
    const { data: profile } = await fetchProfile(user.id);
    checkUsername = profile?.username === username.username;
  }

  const profileData = (await fetchProfileByUsername(username.username)).data;
  const avatar_url = formatAvatarUrl(profileData?.avatar_url);

  if (!profileData) {
    return <div className={styles.error}>ユーザーが存在しません</div>;
  }
  const { data } = await getRecruitmentByUserList(profileData.id);
  return (
    <div>
      <div className={styles.user_profile_container}>
        {checkUsername && (
          <a href="/account" className={styles.profile_link}>
            プロフィールを編集する
          </a>
        )}
        <h2 className={styles.username}>{profileData.username}</h2>
        <p className={styles.website}>
          <GoLink className={styles.website_icon} />
          {profileData.website}
        </p>
        <div className={styles.profile_item}>
          <Image
            src={avatar_url}
            alt="User Avatar"
            width={50}
            height={50}
            className={styles.avatar}
          />
          <p className={styles.bio}>{profileData.bio}</p>
        </div>
      </div>
      <UserRecruitmentList
        recruitmentList={data}
        checkUsername={checkUsername}
      />
    </div>
  );
};

export default UserProfile;
