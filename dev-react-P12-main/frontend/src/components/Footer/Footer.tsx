import React from "react";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footerContainer}>
      <div className={styles.footerContent}>

        <div className={styles.logoSection}>
          <img
            src="/images/LogoFooter.png"
            alt="Kasa Logo Footer"
            className={styles.logoImg}
          />
        </div>

        <div className={styles.copyrightSection}>
          <span className={styles.copyrightText}>© 2025 Kasa. All rights reserved</span>
        </div>

      </div>
    </footer>
  );
}
