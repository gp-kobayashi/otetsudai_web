"use client";
import RecruitmentCard from "@/components/recruitment/card/RecruitmentCard";
import type { RecruitmentWithProfile } from "@/types/supabase/types";

type Props = {
  keyword: string;
  recruitmentList: RecruitmentWithProfile[] | null;
};

const SearchList = ({ keyword, recruitmentList }: Props) => {
  if (!recruitmentList) {
    return <div>"{keyword}"に該当する募集はありません。</div>;
  }
  return (
    <div>
      <ul>
        {recruitmentList.map((recruitment) => (
          <RecruitmentCard key={recruitment.id} recruitment={recruitment} />
        ))}
      </ul>
    </div>
  );
};

export default SearchList;
