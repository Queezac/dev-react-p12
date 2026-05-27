import React from "react";
import styles from "./page.module.css";
import { getProperties } from "@/lib/api";
import PropertyCard from "@/components/PropertyCard/PropertyCard";

export default async function Home() {

  const { properties } = await getProperties();

  return (
    <div className={styles.pageContainer}>
      <main className={styles.mainContent}>

        <section className={styles.heroSection}>
          <h1 className={styles.heroTitle}>Chez vous, partout et ailleurs</h1>
          <p className={styles.heroSubtitle}>
            Avec Kasa, vivez des séjours uniques dans des hébergements chaleureux, sélectionnés avec soin par nos hôtes.
          </p>

          <div className={styles.heroImageWrapper}>
            <img
              src="/images/dune_cabin.png"
              alt="Kasa Hero Cabin"
              className={styles.heroImage}
            />
          </div>
        </section>

        <section className={styles.catalogSection}>
          <div className={styles.propertiesGrid}>
            {properties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        </section>

        <section className={styles.howItWorksSection}>
          <div className={styles.howItWorksCard}>
            <h2 className={styles.howItWorksTitle}>Comment ça marche ?</h2>
            <p className={styles.howItWorksSubtitle}>
              Que vous partiez pour un week-end improvisé, des vacances en famille ou un voyage professionnel, Kasa vous aide à trouver un lieu qui vous ressemble.
            </p>

            <div className={styles.stepsGrid}>

              <div className={styles.stepBlock}>
                <h3 className={styles.stepTitle}>Recherchez</h3>
                <p className={styles.stepDescription}>
                  Entrez votre destination, vos dates et laissez Kasa faire le reste
                </p>
              </div>

              <div className={styles.stepBlock}>
                <h3 className={styles.stepTitle}>Réservez</h3>
                <p className={styles.stepDescription}>
                  Profitez d&apos;une plateforme sécurisée et de profils d&apos;hôtes vérifiés.
                </p>
              </div>

              <div className={styles.stepBlock}>
                <h3 className={styles.stepTitle}>Vivez l&apos;expérience</h3>
                <p className={styles.stepDescription}>
                  Installez-vous, profitez de votre séjour, et sentez-vous chez vous, partout.
                </p>
              </div>

            </div>
          </div>
        </section>

      </main>
    </div>
  );
}
