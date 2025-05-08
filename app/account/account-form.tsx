"use client";
import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { type User } from "@supabase/supabase-js";
import Avatar from "./avatar";
import styles from "./account.module.css";
import { profileSchema } from "@/app/utils/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

type ProfileFormData = z.infer<typeof profileSchema>;

export default function AccountForm({ user }: { user: User | null }) {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [avatar_url, setAvatarUrl] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username: "",
      website: "",
      bio: "",
      avatar_url: "",
    },
  });

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
        reset({
          username: data.username,
          website: data.website,
          bio: data.bio,
          avatar_url: data.avatar_url,
        });
        setAvatarUrl(data.avatar_url);
      }
    } finally {
      setLoading(false);
    }
  }, [user, supabase, reset]);

  useEffect(() => {
    getProfile();
  }, [user, getProfile]);

  const onSubmit = async (values: ProfileFormData) => {
    try {
      setLoading(true);
      const { error } = await supabase.from("profiles").upsert({
        id: user?.id,
        ...values,
        updated_at: new Date().toISOString(),
      });

      if (error) {
        if (error.code === "23505") {
          alert("そのユーザー名はすでに使用されています。");
        } else {
          alert("プロフィールの更新中にエラーが発生しました。");
        }
        return;
      }

      alert("プロフィールが更新されました");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.account_container}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Avatar
          uid={user?.id ?? null}
          url={avatar_url}
          size={150}
          onUpload={(url) => {
            setAvatarUrl(url);
            setValue("avatar_url", url);
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
            {...register("username", { required: "ユーザー名は必須です" })}
            className={styles.account_input}
          />
          {errors.username && (
            <p className={styles.account_error}>{errors.username.message}</p>
          )}
        </div>
        <div>
          <label htmlFor="website">Website</label>
          <input
            id="website"
            type="url"
            {...register("website")}
            className={styles.account_input}
          />
          {errors.website && (
            <p className={styles.account_error}>{errors.website.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="bio">自己紹介</label>
          <textarea
            id="bio"
            {...register("bio")}
            className={styles.account_textarea}
          />
          {errors.bio && (
            <p className={styles.account_error}>{errors.bio.message}</p>
          )}
        </div>
        <div>
          <button
            className={styles.account_btn}
            type="submit"
            disabled={loading}
          >
            {loading ? "Loading ..." : "Update"}
          </button>
        </div>
      </form>
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
