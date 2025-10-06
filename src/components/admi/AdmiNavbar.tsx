import { useState, useRef, useEffect } from "react";
import styles from "./_navbar.module.scss";
import { FaChevronDown, FaSignOutAlt } from "react-icons/fa";

const USER = {
  name: "Gonzalo",
  avatar: "https://randomuser.me/api/portraits/men/32.jpg",
};

const AdmiNavbar = () => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={styles.adbar}>
      <div className={styles.rightSection}>
        <span className={styles.greeting}>
          Hola, <b>{USER.name}</b>
        </span>
        <img className={styles.avatar} src={USER.avatar} alt={USER.name} />
        <div className={styles.dropdown} ref={menuRef}>
          <button className={styles.dropBtn} onClick={() => setOpen((v) => !v)}>
            <FaChevronDown />
          </button>
          {open && (
            <div className={styles.menu}>
              <button className={styles.menuItem}>
                <FaSignOutAlt className={styles.menuIcon} />
                Cerrar sesión
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdmiNavbar;
