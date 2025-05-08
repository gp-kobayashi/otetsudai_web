"use client";
import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { type User } from "@supabase/supabase-js";
import Avatar from "./avatar";
import styles from "./account.module.css";
// ...

export default function AccountForm({ user }: { user: User | null }) {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState<string | null>(null);
  const [website, setWebsite] = useState<string | null>(null);
  const [avatar_url, setAvatarUrl] = useState<string | null>(null);
  const [bio, setBio] = useState<string | null>(null);

  const getProfile = useCallback(async () => {
    try {
      setLoading(true);

      const { data, error, status } = await supabase
        .from("profiles")
        .select(`username, website, avatar_url,bio`)
        .eq("id", user?.id)
        .single();

      if (error && status !== 406) {
        console.log(error);
        throw error;
      }

      if (data) {
        setUsername(data.username);
        setWebsite(data.website);
        setAvatarUrl(data.avatar_url);
        setBio(data.bio);
      }
    } finally {
      setLoading(false);
    }
  }, [user, supabase]);

  useEffect(() => {
    getProfile();
  }, [user, getProfile]);

  async function updateProfile({
    username,
    website,
    avatar_url,
  }: {
    username: string | null;
    website: string | null;
    avatar_url: string | null;
    bio: string | null;
  }) {
    try {
      setLoading(true);

      const { error } = await supabase.from("profiles").upsert({
        id: user?.id as string,
        username,
        website,
        avatar_url,
        updated_at: new Date().toISOString(),
        bio,
      });
      if (username) {
        const alphanumericRegex = /^[a-zA-Z0-9]+$/;
        if (!alphanumericRegex.test(username)) {
          alert("ユーザー名は英数字のみ使用できます");
          return;
        }
      }
      if (error) {
        if (error.code === "23505") {
          alert(
            "そのユーザー名はすでに使用されています。別のユーザー名を選択してください。",
          );
        } else {
          console.error(error);
          alert("プロフィールの更新中にエラーが発生しました。");
        }
        return;
      }
      alert("プロフィールが更新されました");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.account_container}>
      <Avatar
        uid={user?.id ?? null}
        url={avatar_url}
        size={150}
        onUpload={(url) => {
          setAvatarUrl(url);
          updateProfile({ username, website, avatar_url: url, bio });
        }}
      />
      {/* ... */}

      <div>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="text"
          value={user?.email}
          disabled
          className={styles.account_input}
        />
      </div>
      <div>
        <label htmlFor="username">Username</label>
        <input
          id="username"
          type="text"
          value={username || ""}
          onChange={(e) => setUsername(e.target.value)}
          className={styles.account_input}
        />
      </div>
      <div>
        <label htmlFor="website">Website</label>
        <input
          id="website"
          type="url"
          value={website || ""}
          onChange={(e) => setWebsite(e.target.value)}
          className={styles.account_input}
        />
      </div>
      <div>
        <label htmlFor="bio">自己紹介</label>
        <textarea
          id="bio"
          value={bio || ""}
          onChange={(e) => setBio(e.target.value)}
          className={styles.account_textarea}
        />
      </div>
      <div>
        <button
          className={styles.account_btn}
          onClick={() => updateProfile({ username, website, avatar_url, bio })}
          disabled={loading}
        >
          {loading ? "Loading ..." : "Update"}
        </button>
      </div>

      <div>
        <form action="/auth/signout" method="post">
          <button className={styles.account_btn} type="submit">
            Sign out
          </button>
        </form>
      </div>
    </div>
  );
}
