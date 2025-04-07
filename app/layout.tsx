import styles from "./layout.module.css";
import Navigation from "./components/navigation/navigation";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={styles.body}>
        <Navigation />
        <div>{children}</div>
      </body>
    </html>
  );
}
