import React from "react";
import styles from "./APropos.module.css";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "À propos - Kasa",
  description: "Découvrez notre mission, nos valeurs d'authenticité et de partage, et comment Kasa connecte voyageurs et hôtes.",
};

export default function AProposPage() {
  return (
    <div className={styles.pageContainer}>
      <main className={styles.mainContent}>

        <section className={styles.headerSection}>
          <h1 className={styles.pageTitle}>À propos</h1>
          <p className={styles.introParagraph}>
            Chez Kasa, nous croyons que chaque voyage mérite un lieu unique où se sentir bien.
          </p>
          <p className={styles.subIntroParagraph}>
            Depuis notre création, nous mettons en relation des voyageurs en quête d&apos;authenticité avec des hôtes passionnés qui aiment partager leur région et leurs bonnes adresses.
          </p>
        </section>

        <section className={styles.largeImageSection}>
          <div className={styles.largeImageWrapper}>
            <img
              src="/images/aPropos1.png"
              alt="Kasa Maison de campagne chaleureuse"
              className={styles.largeImage}
            />
          </div>
        </section>

        <section className={styles.missionSplitSection}>

          <div className={styles.textContentCol}>
            <h2 className={styles.missionTitle}>Notre mission est simple :</h2>
            <ul className={styles.missionList}>
              <li>1. Offrir une plateforme fiable et simple d&apos;utilisation</li>
              <li>2. Proposer des hébergements variés et de qualité</li>
              <li>3. Favoriser les échanges humains et chaleureux entre hôtes et voyageurs</li>
            </ul>
            <p className={styles.missionFooterText}>
              Que vous cherchiez un appartement cosy en centre-ville, une maison en bord de mer ou un chalet à la montagne, Kasa vous accompagne pour que chaque séjour devienne un souvenir inoubliable.
            </p>
          </div>

          <div className={styles.imageCol}>
            <div className={styles.sideImageWrapper}>
              <img
                src="/images/aPropos2.png"
                alt="Kasa Chalet en bois"
                className={styles.sideImage}
              />
            </div>
          </div>

        </section>

      </main>
    </div>
  );
}
