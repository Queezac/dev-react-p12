"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./Favoris.module.css";
import { getProperties } from "@/lib/api";
import PropertyCard from "@/components/PropertyCard/PropertyCard";
import { PropertySummary } from "@/lib/types";
import { getFavoriteIds } from "@/lib/favorites";

export default function FavorisPage() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [properties, setProperties] = useState<PropertySummary[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      router.push("/login");
      return;
    }
    try {
      const parsed = JSON.parse(storedUser);
      if (parsed) {
        setAuthorized(true);
      } else {
        router.push("/login");
        return;
      }
    } catch (e) {
      router.push("/login");
      return;
    }

    setFavoriteIds(getFavoriteIds());

    const handleUpdate = () => {
      setFavoriteIds(getFavoriteIds());
    };
    window.addEventListener("favorites-updated", handleUpdate);

    getProperties()
      .then((data) => {
        setProperties(data.properties);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });

    return () => {
      window.removeEventListener("favorites-updated", handleUpdate);
    };
  }, [router]);

  if (!authorized || loading) {
    return (
      <div style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        Chargement...
      </div>
    );
  }

  const favoriteProperties = properties.filter((property) =>
    favoriteIds.includes(property.id)
  );

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

        {favoriteProperties.length === 0 ? (
          <div className={styles.emptyState}>
            <h3>Aucun favori enregistré</h3>
            <p>Parcourez notre catalogue et ajoutez les en favoris pour les retrouver ici.</p>
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
