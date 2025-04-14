import styles from "./page.module.css";
import List from "./components/mainPage/list";
export default function Home() {
  return (
    <div>
      <div className={styles.main_container}>
        <h2>お手伝いをしましょう</h2>
        <p>イラスト、音楽、動画編集などのお手伝いをつなぐサイトです</p>
      </div>
      <div>
        <List />
      </div>
    </div>
  );
}
