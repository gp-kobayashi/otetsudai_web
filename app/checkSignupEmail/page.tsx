import styles from "./checkSignup.module.css";

const CheckSignupEmail = () => {
  return (
    <div className={styles.check_email_container}>
      <h2>サインアップ確認用のメールを送信しました</h2>
      <p className={styles.text}>
        メールを確認し記載されたURLから認証を完了してください。
      </p>
    </div>
  );
};

export default CheckSignupEmail;
