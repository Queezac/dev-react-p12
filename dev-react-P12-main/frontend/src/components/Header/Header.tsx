"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./Header.module.css";

/**
 * Composant d'en-tête (Header) de l'application.
 * Contient la navigation principale, le logo de Kasa et gère l'affichage dynamique
 * des boutons liés à l'utilisateur connecté (favoris, messagerie, déconnexion...).
 */
export default function Header() {
  const pathname = usePathname();
  const [user, setUser] = React.useState<{ name: string; role: string } | null>(null);

  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const isActive = (path: string) => pathname === path;

  React.useEffect(() => {
    const checkAuth = () => {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (e) {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    };

    checkAuth();

    window.addEventListener("storage", checkAuth);
    return () => {
      window.removeEventListener("storage", checkAuth);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    window.dispatchEvent(new Event("storage"));
    setIsMenuOpen(false);
    window.location.href = "/";
  };

  return (
    <header className={styles.headerContainer}>
      <nav className={styles.navCapsule}>
        
        {/* Mobile Header Logo & Hamburger */}
        <Link href="/" className={styles.logoMobileWrapper} aria-label="Kasa Accueil" onClick={() => setIsMenuOpen(false)}>
          <img
            src="/images/LogoFooter.png"
            alt="Kasa Logo"
            className={styles.logoImgMobile}
          />
        </Link>

        <button
          className={`${styles.hamburger} ${isMenuOpen ? styles.hamburgerActive : ""}`}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Menu"
        >
          <span className={styles.bar}></span>
          <span className={styles.bar}></span>
        </button>

        {/* Desktop Navigation */}
        <div className={styles.desktopNav}>
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

          {user && (user.role === "owner" || user.role === "admin") && (
            <Link
              href="/ajout-propriete"
              className={`${styles.addPropertyBtn} ${isActive("/ajout-propriete") ? styles.activeBtn : ""}`}
            >
              +Ajouter un logement
            </Link>
          )}

          <div className={styles.iconGroup}>
            {user && (
              <>
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

                <span className={styles.divider}>|</span>
              </>
            )}

            {user ? (
              <button
                onClick={handleLogout}
                className={styles.iconLink}
                title={`Se déconnecter (${user.name})`}
                style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className={styles.iconSvg}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                </svg>
              </button>
            ) : (
              <Link
                href="/login"
                className={`${styles.navLink} ${isActive("/login") ? styles.activeLink : ""}`}
                title="Se connecter"
              >
                Se connecter
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        <div className={`${styles.mobileDrawer} ${isMenuOpen ? styles.drawerOpen : ""}`}>
          <div className={styles.mobileDrawerContent}>
            <Link
              href="/"
              onClick={() => setIsMenuOpen(false)}
              className={`${styles.mobileNavLink} ${isActive("/") ? styles.activeMobileLink : ""}`}
            >
              Accueil
            </Link>
            
            <Link
              href="/a-propos"
              onClick={() => setIsMenuOpen(false)}
              className={`${styles.mobileNavLink} ${isActive("/a-propos") ? styles.activeMobileLink : ""}`}
            >
              À propos
            </Link>

            {user && (user.role === "owner" || user.role === "admin") && (
              <Link
                href="/ajout-propriete"
                onClick={() => setIsMenuOpen(false)}
                className={`${styles.mobileAddPropertyBtn} ${isActive("/ajout-propriete") ? styles.activeMobileBtn : ""}`}
              >
                + Ajouter un logement
              </Link>
            )}

            <div className={styles.mobileDividerLine} />

            <div className={styles.mobileActionsGroup}>
              {user ? (
                <>
                  <div className={styles.mobileUserIcons}>
                    <Link
                      href="/favoris"
                      onClick={() => setIsMenuOpen(false)}
                      className={`${styles.mobileIconLink} ${isActive("/favoris") ? styles.activeMobileIcon : ""}`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill={isActive("/favoris") ? "currentColor" : "none"}
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className={styles.mobileIconSvg}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                      </svg>
                      <span>Favoris</span>
                    </Link>

                    <Link
                      href="/messagerie"
                      onClick={() => setIsMenuOpen(false)}
                      className={`${styles.mobileIconLink} ${isActive("/messagerie") ? styles.activeMobileIcon : ""}`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill={isActive("/messagerie") ? "currentColor" : "none"}
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className={styles.mobileIconSvg}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.92 1.786c-.083.097-.05.25.074.29a7.352 7.352 0 002.72.488c.8 0 1.575-.124 2.296-.356a1.981 1.981 0 011.05-.07z" />
                      </svg>
                      <span>Messagerie</span>
                    </Link>
                  </div>

                  <button
                    onClick={handleLogout}
                    className={styles.mobileLogoutBtn}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      className={styles.mobileIconSvg}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                    </svg>
                    <span>Se déconnecter ({user.name})</span>
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className={styles.mobileLoginBtn}
                >
                  Se connecter
                </Link>
              )}
            </div>
          </div>
        </div>

      </nav>
    </header>
  );
}
