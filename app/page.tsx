import styles from "./page.module.css";
import List from "@/components/mainPage/MainPageList";
import TagLinks from "@/components/recruitment/category/TagLinks";
export default function Home() {
  return (
    <div>
      <div className={styles.main_container}>
        <h2>お手伝いをしましょう</h2>
        <p>イラスト、音楽、動画編集などのお手伝いをつなぐサイトです</p>
      </div>
      <TagLinks />

      <div>
        <List />
      </div>
    </div>
  );
}
