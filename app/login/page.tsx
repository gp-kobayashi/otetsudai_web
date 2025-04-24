import { login, signup } from "./actions";
import styles from "./login.module.css";

export default function LoginPage() {
  return (
    <div className={styles.login_container}>
      <h2>Login or signUp</h2>
      <form>
        <label className={styles.login_label} htmlFor="email">
          Email:
        </label>
        <input
          className={styles.login_input}
          id="email"
          name="email"
          type="email"
          required
        />
        <label className={styles.login_label} htmlFor="password">
          Password:
        </label>
        <input
          className={styles.login_input}
          id="password"
          name="password"
          type="password"
          required
        />
        <button className={styles.btn} formAction={login}>
          Log in
        </button>
        <button className={styles.btn} formAction={signup}>
          Sign up
        </button>
      </form>
    </div>
  );
}
