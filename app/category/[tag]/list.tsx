import { RecruitmentWithProfile } from "@/app/type/types";

type Props = {
  recruitmentList: RecruitmentWithProfile[];
};

const CategoryList = ({ recruitmentList }: Props) => {
  return (
    <div>
      {recruitmentList.map((recruitment) => (
        <div key={recruitment.id}>
          <h4>{recruitment.title}</h4>
          <p>{recruitment.explanation}</p>
          <p>{recruitment.tag}</p>
          <p>{recruitment.username}</p>
          <img src={recruitment.avatar_url} alt="User Avatar" />
        </div>
      ))}
    </div>
  );
};

export default CategoryList;
