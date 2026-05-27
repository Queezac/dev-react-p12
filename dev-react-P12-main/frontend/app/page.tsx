import React from "react";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.container}>
      <main className={styles.card}>
        
        {/* Header Section */}
        <header className={styles.header}>
          <div className={styles.logoContainer}>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24" 
              fill="currentColor" 
              width="32" 
              height="32"
            >
              <path d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 001.061 1.06l8.69-8.69z" />
              <path d="M12 5.432l8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75H5.625a1.875 1.875 0 01-1.875-1.875v-6.198a2.29 2.29 0 00.091-.086L12 5.43z" />
            </svg>
          </div>
          <div className={styles.titleSection}>
            <h1>Kasa Frontend</h1>
            <p>Next.js App Router • TypeScript • Vanilla CSS</p>
          </div>
        </header>

        {/* Welcome Section */}
        <section className={styles.welcomeSection}>
          <h2>Bienvenue dans votre projet Kasa !</h2>
          <p>
            L&apos;étape 1 a été réalisée avec succès. Le projet a été initialisé avec le compilateur et routeur Next.js moderne, configuré en TypeScript et structuré conformément à vos exigences architecturales.
          </p>
        </section>

        {/* Architecture Section */}
        <section>
          <div style={{ marginBottom: "1rem" }}>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 600, margin: 0 }}>Arborescence configurée</h3>
          </div>
          <div className={styles.archGrid}>
            
            {/* App Directory */}
            <div className={styles.archItem}>
              <div className={styles.archIcon}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" width="24" height="24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
                </svg>
              </div>
              <h3>dossier app/</h3>
              <p>Contient les routes de l&apos;application, les layouts globaux, et les fichiers CSS de premier niveau.</p>
            </div>

            {/* Components Directory */}
            <div className={styles.archItem}>
              <div className={styles.archIcon}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" width="24" height="24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 21m0 0l-.813-5.096L9 21zm0 0h4.991m-4.99H3.988m10.824-5.096l-.812 5.096.812-5.096zm0 0L15 21m0 0h4.991m-4.991 0H9m7.012-10.188L15 4.904 15.988 10.812zm0 0h4.991M15 4.904L14.188 10.81M15 4.904H9.813" />
                </svg>
              </div>
              <h3>dossier components/</h3>
              <p>Dédié aux composants d&apos;interface réutilisables (Card, Banner, Collapse, Header, Footer).</p>
            </div>

            {/* Lib Directory */}
            <div className={styles.archItem}>
              <div className={styles.archIcon}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" width="24" height="24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                </svg>
              </div>
              <h3>dossier lib/</h3>
              <p>Destiné aux fonctions utilitaires, clients d&apos;API, schémas de données, et déclarations de types TypeScript.</p>
            </div>

          </div>
        </section>

        {/* Quickstart Instructions */}
        <section className={styles.instructions}>
          <h3>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" width="20" height="20" style={{ color: "#FF6060" }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
            </svg>
            Commandes pour démarrer le projet
          </h3>
          <ul className={styles.stepList}>
            <li className={styles.stepItem}>
              <div className={styles.stepNumber}>1</div>
              <div className={styles.stepText}>
                Démarrez le **serveur backend** : accédez au dossier `backend/` dans un terminal et exécutez la commande <code>npm start</code>. L&apos;API sera disponible sur <code>http://localhost:3000</code>.
              </div>
            </li>
            <li className={styles.stepItem}>
              <div className={styles.stepNumber}>2</div>
              <div className={styles.stepText}>
                Lancez le **serveur de développement Next.js** : accédez au dossier `frontend/` et exécutez la commande <code>npm run dev</code>. L&apos;interface sera visible sur <code>http://localhost:3001</code>.
              </div>
            </li>
          </ul>
        </section>

        {/* Footer */}
        <footer className={styles.footerCtas}>
          <div className={styles.statusIndicator}>
            <div className={styles.statusDot}></div>
            <span>Environnement prêt au développement</span>
          </div>
          <div className={styles.btnGroup}>
            <a 
              href="https://nextjs.org/docs" 
              target="_blank" 
              rel="noopener noreferrer" 
              className={styles.secondaryBtn}
            >
              Documentation Next.js
            </a>
            <a 
              href="http://localhost:3000/docs.html" 
              target="_blank" 
              rel="noopener noreferrer" 
              className={styles.primaryBtn}
            >
              <span>Swagger API Backend</span>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" width="16" height="16">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
              </svg>
            </a>
          </div>
        </footer>

      </main>
    </div>
  );
}
