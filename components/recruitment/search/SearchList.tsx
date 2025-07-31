"use client";
import { searchRecruitment } from "@/lib/supabase_function/recruitment";
import RecruitmentCard from "@/components/recruitment/card/RecruitmentCard";
import { useEffect, useState } from "react";
import type { RecruitmentWithProfile } from "@/types/supabase/types";

type Props = {
  keyword: string;
};
const SearchList = ({ keyword }: Props) => {
  const [recruitmentList, setRecruitmentList] = useState<
    RecruitmentWithProfile[]
  >([]);
  useEffect(() => {
    const fetchRecruitments = async () => {
      const { data, error } = await searchRecruitment(keyword);
      if (error) {
        console.error("Error fetching recruitments:", error);
      } else {
        setRecruitmentList(data || []);
      }
    };
    fetchRecruitments();
  }, [keyword]);
  if (recruitmentList.length === 0) {
    return <div>"{keyword}"に該当する募集はありません。</div>;
  }
  return (
    <div>
      <ul>
        {recruitmentList?.map((recruitment) => (
          <RecruitmentCard key={recruitment.id} recruitment={recruitment} />
        ))}
      </ul>
    </div>
  );
};

export default SearchList;
