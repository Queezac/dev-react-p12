import React from "react";
import styles from "./Favoris.module.css";
import { getProperties } from "@/lib/api";
import PropertyCard from "@/components/PropertyCard/PropertyCard";

export default async function FavorisPage() {
  const { properties, isOffline } = await getProperties();

  const favoriteProperties = properties.slice(0, 3);

  return (
    <div className={styles.container}>
      <main className={styles.mainContent}>

        <section className={styles.favHeader}>
          <h1 className={styles.title}>Vos favoris</h1>
          <p className={styles.subtitle}>
            Retrouvez ici tous les logements que vous avez aimés.<br />
            Prêts à réserver ? Un simple clic et votre prochain séjour est en route.
          </p>
        </section>

        {isOffline && (
          <div className={styles.offlineAlert}>
            <span>Mode Hors ligne : Affichage des favoris locaux sauvegardés.</span>
          </div>
        )}

        {favoriteProperties.length === 0 ? (
          <div className={styles.emptyState}>
            <h3>Aucun favori enregistré</h3>
            <p>Parcourez notre catalogue et cliquez sur le cœur de n&apos;importe quel logement pour le sauvegarder ici.</p>
          </div>
        ) : (
          <section className={styles.gridSection}>
            <div className={styles.propertiesGrid}>
              {favoriteProperties.map((property) => (
                <PropertyCard key={property.id} property={property} initialLiked={true} />
              ))}
            </div>
          </section>
        )}

      </main>
    </div>
  );
}
