import {
  fetchProfileByUsername,
  formatAvatarUrl,
} from "@/app/supabase_function/profile";
import styles from "./userProfile.module.css";
import Image from "next/image";
import UserRecruitmentList from "./list";
import { getRecruitmentByUserList } from "@/app/supabase_function/recruitment";
interface Params {
  username: string;
}

const UserProfile = async ({ params }: { params: Params }) => {
  const username = params;
  const profileData = (await fetchProfileByUsername(username.username)).data;
  const avatar_url = formatAvatarUrl(profileData?.avatar_url);

  if (!profileData) {
    return <div className={styles.error}>User not found</div>;
  }
  const { data } = await getRecruitmentByUserList(profileData.id);
  return (
    <div>
      <div className={styles.user_profile_container}>
        <h2 className={styles.username}>{profileData.username}</h2>
        <p>website:{profileData.website}</p>
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
      <UserRecruitmentList recruitmentList={data} />
    </div>
  );
};

export default UserProfile;
