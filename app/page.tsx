import { TAG_VALUES } from "@/utils/enum/enum";
import styles from "./page.module.css";
import List from "@/components/mainPage/list";
export default function Home() {
  const tags = TAG_VALUES;
  return (
    <div>
      <div className={styles.main_container}>
        <h2>お手伝いをしましょう</h2>
        <p>イラスト、音楽、動画編集などのお手伝いをつなぐサイトです</p>
      </div>
      <div className={styles.tag_container}>
        {tags.map((tag) => (
          <div key={tag}>
            <a href={`/category/${tag}/1`} className={styles.tag}>
              {tag}
            </a>
          </div>
        ))}
      </div>

      <div>
        <List />
      </div>
    </div>
  );
}
