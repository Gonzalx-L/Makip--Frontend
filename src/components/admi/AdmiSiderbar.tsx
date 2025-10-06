import styles from "./_admi.module.scss";
import {
  FaHome,
  FaFolder,
  FaRegChartBar,
  FaCog,
  FaRegQuestionCircle,
  FaRegUserCircle,
  FaTh,
  FaExternalLinkAlt,
} from "react-icons/fa";
import { MdOutlineDashboard, MdExpandMore } from "react-icons/md";
import { useState } from "react";

const NAV_OPTIONS = [
  { icon: <FaHome />, label: "Home" },
  { icon: <MdOutlineDashboard />, label: "Dashboard" },
  { icon: <FaTh />, label: "Projects" },
  { icon: <FaFolder />, label: "Folders", expand: true },
  { divider: true },
  { icon: <FaRegChartBar />, label: "Reporting" },
  { icon: <FaCog />, label: "Settings" },
  { icon: <FaRegQuestionCircle />, label: "Support", badge: "Online" },
  { icon: <FaExternalLinkAlt size={14} />, label: "Open in browser" },
];

const AdmiSiderbar = () => {
  const [showSidebar, setShowSidebar] = useState(true);
  return (
    <>
      <button
        className={styles.menuBtn}
        onClick={() => setShowSidebar(!showSidebar)}>
        <span />
        <span />
        <span />
      </button>
      <div
        className={`${styles.sidebar} ${
          showSidebar ? styles.open : styles.closed
        }`}>
        {/* Header */}
        <div className={styles.header}>
          <span className={styles.logo}></span>
          <span className={styles.title}>MAKIP</span>
        </div>

        {/* Search */}
        <div className={styles.searchBox}>
          <input className={styles.searchInput} placeholder='Search' />
          <span className={styles.searchIcon}>
            <svg width='16' height='16' fill='none'>
              <path
                d='M12.5 12.5L10 10M11 6.5A4.5 4.5 0 1 1 2 6.5a4.5 4.5 0 0 1 9 0Z'
                stroke='currentColor'
                strokeWidth='1.5'
                strokeLinecap='round'
              />
            </svg>
          </span>
        </div>

        {/* Nav */}
        <ul className={styles.nav}>
          {NAV_OPTIONS.map((item, i) =>
            item.divider ? (
              <li className={styles.divider} key={i} />
            ) : (
              <li className={styles.navItem} key={i}>
                <a tabIndex={0}>
                  <span className={styles.iconLabel}>
                    {item.icon} {item.label}
                  </span>
                  {item.expand && (
                    <MdExpandMore className={styles.expandIcon} />
                  )}
                  {item.badge && (
                    <span className={styles.onlineBadge}>{item.badge}</span>
                  )}
                </a>
              </li>
            )
          )}
        </ul>

        {/* User */}
        <div className={styles.userCard}>
          <img
            src='https://randomuser.me/api/portraits/women/44.jpg'
            alt='Olivia Rhye'
          />
          <div>
            <div className={styles.userName}>Olivia Rhye</div>
            <div className={styles.userMail}>olivia@untitledui.com</div>
          </div>
          <button className={styles.userBtn}>
            <FaRegUserCircle size={20} />
          </button>
        </div>
      </div>
    </>
  );
};

export default AdmiSiderbar;
