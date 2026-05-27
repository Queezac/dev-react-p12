import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPropertyById } from "@/lib/api";
import styles from "./Logement.module.css";

interface LogementProps {
  params: Promise<{ id: string }>;
}

export default async function LogementPage({ params }: LogementProps) {
  const { id } = await params;
  const { property } = await getPropertyById(id);

  if (!property) {
    notFound();
  }

  const roundedRating = Math.round(property.rating_avg);

  const pics = property.pictures && property.pictures.length >= 5
    ? property.pictures
    : [
      property.cover,
      ...(property.pictures || []),
      property.cover,
      property.cover,
      property.cover,
    ].slice(0, 5);

  return (
    <div className={styles.pageContainer}>
      <main className={styles.mainContent}>

        <div className={styles.navigationRow}>
          <Link href="/" className={styles.backButton}>
            &larr; Retour aux annonces
          </Link>
        </div>

        <div className={styles.dashboardGrid}>

          <div className={styles.leftCol}>

            <section className={styles.collageGrid}>

              <div className={styles.largePicWrapper}>
                <img
                  src={pics[0] || "/placeholder-house.jpg"}
                  alt={`${property.title} - 1`}
                  className={styles.collagePic}
                />
              </div>

              <div className={styles.smallPicsCol}>
                <div className={styles.smallPicWrapper}>
                  <img
                    src={pics[1] || "/placeholder-house.jpg"}
                    alt={`${property.title} - 2`}
                    className={styles.collagePic}
                  />
                </div>
                <div className={styles.smallPicWrapper}>
                  <img
                    src={pics[2] || "/placeholder-house.jpg"}
                    alt={`${property.title} - 3`}
                    className={styles.collagePic}
                  />
                </div>
              </div>

              <div className={styles.smallPicsCol}>
                <div className={styles.smallPicWrapper}>
                  <img
                    src={pics[3] || "/placeholder-house.jpg"}
                    alt={`${property.title} - 4`}
                    className={styles.collagePic}
                  />
                </div>
                <div className={styles.smallPicWrapper}>
                  <img
                    src={pics[4] || "/placeholder-house.jpg"}
                    alt={`${property.title} - 5`}
                    className={styles.collagePic}
                  />
                </div>
              </div>

            </section>

            <section className={styles.infoCard}>
              <h1 className={styles.propertyTitle}>{property.title}</h1>

              <p className={styles.location}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="#565656" width="16" height="16" className={styles.pinIcon}>
                  <path fillRule="evenodd" d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 103 9c0 3.492 1.698 5.988 3.355 7.584a13.731 13.731 0 002.573 1.937 5.348 5.348 0 00.762.433 3.633 3.633 0 00.282.14l.018.008.006.003zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                {property.location || "Localisation non spécifiée"}
              </p>

              <p className={styles.description}>
                {property.description || "Aucune description fournie pour ce logement."}
              </p>

              <div className={styles.detailSection}>
                <h3 className={styles.sectionHeading}>Équipements</h3>
                <div className={styles.tagGrid}>
                  {property.equipments.map((eq, idx) => (
                    <span key={idx} className={styles.tagBadge}>{eq}</span>
                  ))}
                  {property.equipments.length === 0 && (
                    <span className={styles.emptyBadge}>Aucun équipement répertorié.</span>
                  )}
                </div>
              </div>

              <div className={styles.detailSection}>
                <h3 className={styles.sectionHeading}>Catégorie</h3>
                <div className={styles.tagGrid}>
                  {property.tags.map((tag, idx) => (
                    <span key={idx} className={styles.tagBadge}>{tag}</span>
                  ))}
                  {property.tags.length === 0 && (
                    <span className={styles.emptyBadge}>Aucune catégorie répertoriée.</span>
                  )}
                </div>
              </div>

            </section>

          </div>

          <div className={styles.rightCol}>

            {property.host && (
              <section className={styles.hostCard}>
                <h2 className={styles.hostHeading}>Votre hôte</h2>

                <div className={styles.hostProfileRow}>
                  <img
                    src={property.host.picture || "/placeholder-avatar.jpg"}
                    alt={property.host.name}
                    className={styles.hostAvatar}
                  />
                  <div className={styles.hostInfoBlock}>
                    <span className={styles.hostName}>{property.host.name}</span>
                  </div>
                  <div className={styles.ratingBadge}>
                    <span className={styles.starChar}>&#9733;</span>
                    <span className={styles.ratingValue}>{roundedRating}</span>
                  </div>
                </div>

                <div className={styles.buttonGroup}>
                  <button className={styles.ctaButton}>Contacter l&apos;hôte</button>
                  <button className={styles.ctaButton}>Envoyer un message</button>
                </div>

              </section>
            )}

          </div>

        </div>

      </main>
    </div>
  );
}
