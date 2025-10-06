import styles from "./_inicioadm.module.scss";
import AdmiSiderbar from "../components/admi/AdmiSiderbar";
import AdmiNavbar from "../components/admi/AdmiNavbar";
import AdmiBody from "../components/admi/AdmiBody";

const InicioAdm = () => (
  <div className={styles.layoutContainer}>
    <AdmiSiderbar />
    <div className={styles.contentColumn}>
      <AdmiNavbar />
      <AdmiBody>{/* Tu dashboard, grid, cards, etc */}</AdmiBody>
    </div>
  </div>
);

export default InicioAdm;
