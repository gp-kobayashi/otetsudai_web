"use client";
import { insertUsername } from "@/lib/supabase_function/profile";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { usernameSchema } from "@/utils/zod";
import styles from "./insertUserNameApp.module.css";
type props = {
  user_id: string;
};
type UsernameFormData = z.infer<typeof usernameSchema>;

const InsertUserNameApp = ({ user_id }: props) => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<UsernameFormData>({
    resolver: zodResolver(usernameSchema),
    mode: "onChange",
  });
  const onSubmit = async (data: UsernameFormData) => {
    const { error } = await insertUsername(user_id, data.username);
    if (error) {
      alert(
        "そのユーザー名はすでに使用されています。別のユーザー名を選択してください。",
      );
      return;
    }
    router.push("/account");
  };
  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label htmlFor="username">User Name:</label>
        <input
          type="text"
          id="username"
          {...register("username")}
          className={styles.input}
        />

        <button
          type="submit"
          className={`${styles.btn} ${!isValid && styles.disabled}`}
          disabled={!isValid}
        >
          Submit
        </button>
        {errors.username && (
          <p className={styles.error}>{errors.username.message}</p>
        )}
      </form>
    </div>
  );
};

export default InsertUserNameApp;
