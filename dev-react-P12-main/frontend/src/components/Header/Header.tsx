"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./Header.module.css";

export default function Header() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <header className={styles.headerContainer}>
      <nav className={styles.navCapsule}>

        <div className={styles.Links}>
          <Link
            href="/"
            className={`${styles.navLink} ${isActive("/") ? styles.activeLink : ""}`}
          >
            Accueil
          </Link>
          <Link
            href="/a-propos"
            className={`${styles.navLink} ${isActive("/a-propos") ? styles.activeLink : ""}`}
          >
            À propos
          </Link>

          <Link href="/" className={styles.logoWrapper} aria-label="Kasa Accueil">
            <img
              src="/images/LogoHeader.png"
              alt="Kasa Logo"
              className={styles.logoImg}
            />
          </Link>

          <Link
            href="/ajout-propriete"
            className={`${styles.addPropertyBtn} ${isActive("/ajout-propriete") ? styles.activeBtn : ""}`}
          >
            +Ajouter un logement
          </Link>

          <div className={styles.iconGroup}>

            <Link
              href="/favoris"
              className={`${styles.iconLink} ${isActive("/favoris") ? styles.activeIcon : ""}`}
              title="Mes Favoris"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill={isActive("/favoris") ? "currentColor" : "none"}
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className={styles.iconSvg}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
              </svg>
            </Link>

            <span className={styles.divider}>|</span>

            <Link
              href="/messagerie"
              className={`${styles.iconLink} ${isActive("/messagerie") ? styles.activeIcon : ""}`}
              title="Ma Messagerie"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill={isActive("/messagerie") ? "currentColor" : "none"}
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className={styles.iconSvg}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.92 1.786c-.083.097-.05.25.074.29a7.352 7.352 0 002.72.488c.8 0 1.575-.124 2.296-.356a1.981 1.981 0 011.05-.07z" />
              </svg>
            </Link>

          </div>

        </div>

      </nav>
    </header>
  );
}
