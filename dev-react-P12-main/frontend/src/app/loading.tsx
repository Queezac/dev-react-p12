import React from "react";
import styles from "./loading.module.css";

export default function Loading() {
  const skeletonCards = Array.from({ length: 6 });

  return (
    <div className={styles.loadingContainer}>
      <main style={{ width: "100%", display: "flex", flexDirection: "column", gap: "3.5rem" }}>

        <section className={styles.heroSkeleton}>
          <div className={`${styles.heroTitleSkeleton} ${styles.shimmer}`} />
          <div className={`${styles.heroSubtitleSkeleton} ${styles.shimmer}`} />
          <div className={`${styles.heroImageSkeleton} ${styles.shimmer}`} />
        </section>

        <section className={styles.gridSkeleton}>
          {skeletonCards.map((_, index) => (
            <div key={index} className={styles.cardSkeleton}>
              <div className={`${styles.imageSkeleton} ${styles.shimmer}`} />
              <div className={styles.bodySkeleton}>
                <div className={`${styles.titleSkeleton} ${styles.shimmer}`} />
                <div className={`${styles.locationSkeleton} ${styles.shimmer}`} />
                <div className={`${styles.priceSkeleton} ${styles.shimmer}`} />
              </div>
            </div>
          ))}
        </section>

      </main>
    </div>
  );
}
