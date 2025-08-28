import { TAG_VALUES } from "@/utils/enum/enum";
import styles from "./category.module.css";
const tags = TAG_VALUES;

const TagLinks = () => {
  return (
    <div className={styles.tag_container}>
      {tags.map((tag) => (
        <div key={tag}>
          <a href={`/category/${tag}/1`} className={styles.tag}>
            {tag}
          </a>
        </div>
      ))}
    </div>
  );
};

export default TagLinks;
