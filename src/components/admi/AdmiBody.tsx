import styles from "./_admibody.module.scss";

const AdmiBody = ({ children }: { children?: React.ReactNode }) => (
  <main className={styles.body}>
    {children ? children : <h2>Bienvenido al dashboard Makip</h2>}
  </main>
);

export default AdmiBody;
