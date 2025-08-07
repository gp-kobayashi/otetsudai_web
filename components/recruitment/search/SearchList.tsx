"use client";
import RecruitmentCard from "@/components/recruitment/card/RecruitmentCard";
import type { RecruitmentWithProfile } from "@/types/supabase/types";

type Props = {
  keyword: string;
  recruitmentList: RecruitmentWithProfile[] | null;
  zodError: string | null;
};

const SearchList = ({ keyword, recruitmentList, zodError }: Props) => {
  if (zodError) {
    return <div>{zodError}</div>;
  }
  if (!recruitmentList || recruitmentList.length === 0) {
    return <div>&quot;{keyword}&quot;に該当する募集はありません。</div>;
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
