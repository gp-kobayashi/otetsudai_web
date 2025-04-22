"use client";
import { insertUsername } from "@/app/supabase_function/profile";
import { useRouter } from "next/navigation";
import { useState } from "react";
type props = {
  user_id: string;
};

const InsertUserNameApp = ({ user_id }: props) => {
  const router = useRouter();
  const [username, setUsername] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const alphanumericRegex = /^[a-zA-Z0-9]+$/;
    if (!alphanumericRegex.test(username)) {
      alert("ユーザー名は英数字のみ使用できます");
      return;
    }
    await insertUsername(user_id, username);
    router.push("/account");
  };
  return (
    <div>
      <form onSubmit={(e) => handleSubmit(e)}>
        <label htmlFor="username">User Name:</label>
        <input
          type="text"
          id="username"
          name="username"
          required
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default InsertUserNameApp;
