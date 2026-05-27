import React from "react";
import Link from "next/link";
import styles from "./NotFound.module.css";

export default function NotFound() {
  return (
    <div className={styles.container}>
      <main className={styles.content}>

        <h1 className={styles.errorNumber}>404</h1>

        <p className={styles.errorMessage}>
          Il semble que la page que vous cherchez ait pris des vacances… ou n'ait jamais existé.
        </p>

        <div className={styles.actionRow}>
          <Link href="/" className={styles.Link}>
            Accueil
          </Link>
          <Link href="/ajout-propriete" className={styles.Link}>
            Logements
          </Link>
        </div>

      </main>
    </div>
  );
}
