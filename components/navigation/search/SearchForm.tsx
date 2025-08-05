"use client";
import styles from "./search.module.css";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { searchSchema } from "@/utils/zod";

const SearchForm = () => {
  const router = useRouter();
  const [keyword, setKeyword] = useState("");
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = searchSchema.safeParse({ keyword });
    if (!result.success) {
      alert(result.error.errors[0].message);
      return;
    }
    router.push(`/search/${result.data.keyword}/1`);
  };
  return (
    <form className={styles.search_form} onSubmit={handleSubmit}>
      <input
        className={styles.search_input}
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        type="text"
        placeholder="Search..."
      />
      <button className={styles.search_button} type="submit">
        検索
      </button>
    </form>
  );
};

export default SearchForm;
