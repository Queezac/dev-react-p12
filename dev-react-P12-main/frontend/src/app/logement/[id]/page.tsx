import React from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getPropertyById } from "@/lib/api";
import styles from "./Logement.module.css";
import ContactButton from "./ContactButton";
import DeletePropertyButton from "./DeletePropertyButton";
import PropertyGallery from "@/components/PropertyGallery/PropertyGallery";
import { Metadata } from "next";

interface LogementProps {
  params: Promise<{ id: string }>;
}

function formatImageUrl(url?: string | null): string {
  if (!url) return "/placeholder-house.jpg";
  if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("data:")) {
    return url;
  }
  if (url.startsWith("/")) {
    return `http://localhost:3001${url}`;
  }
  return url;
}

export async function generateMetadata({ params }: LogementProps): Promise<Metadata> {
  const { id } = await params;
  try {
    const { property } = await getPropertyById(id);
    if (!property) {
      return {
        title: "Logement non trouvé - Kasa",
      };
    }
    const title = `${property.title} - Kasa`;
    const description = property.description
      ? property.description.substring(0, 160) + "..."
      : `Découvrez cet hébergement exceptionnel à ${property.location || 'Kasa'} proposé par ${property.host?.name || 'son hôte'}.`;
    return {
      title,
      description,
      openGraph: {
        title,
        description,
        images: property.cover ? [{ url: formatImageUrl(property.cover) }] : [],
      },
    };
  } catch (e) {
    return {
      title: "Logement - Kasa",
    };
  }
}

export default async function LogementPage({ params }: LogementProps) {
  const { id } = await params;
  const { property } = await getPropertyById(id);

  if (!property) {
    notFound();
  }

  const roundedRating = Math.round(property.rating_avg);

  const uniquePics = [
    property.cover,
    ...(property.pictures || [])
  ]
    .filter((val): val is string => Boolean(val))
    .filter((val, idx, self) => self.indexOf(val) === idx);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Accommodation",
    "name": property.title,
    "description": property.description || "",
    "image": formatImageUrl(property.cover),
    "address": {
      "@type": "PostalAddress",
      "addressLocality": property.location || "France",
    },
    "amenityFeature": property.equipments.map((eq: string) => ({
      "@type": "LocationFeatureSpecification",
      "name": eq,
      "value": true
    })),
    "offers": {
      "@type": "Offer",
      "price": property.price_per_night,
      "priceCurrency": "EUR",
      "category": "per night",
      "availability": "https://schema.org/InStock"
    },
    ...(property.rating_avg > 0 ? {
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": property.rating_avg,
        "bestRating": "5",
        "worstRating": "1",
        "ratingCount": property.ratings_count || 1
      }
    } : {})
  };

  return (
    <div className={styles.pageContainer}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className={styles.mainContent}>

        <div className={styles.navigationRow}>
          <Link href="/" className={styles.backButton}>
            &larr; Retour aux annonces
          </Link>
          <DeletePropertyButton
            propertyId={property.id}
            hostName={property.host?.name}
            hostId={property.host?.id}
          />
        </div>

        <div className={styles.dashboardGrid}>

          <div className={styles.leftCol}>

            <PropertyGallery uniquePics={uniquePics} propertyTitle={property.title} />

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
                  <Image
                    src={formatImageUrl(property.host.picture)}
                    alt={property.host.name}
                    className={styles.hostAvatar}
                    width={80}
                    height={80}
                  />
                  <div className={styles.hostInfoBlock}>
                    <span className={styles.hostName}>{property.host.name}</span>
                  </div>
                  <div className={styles.ratingBadge}>
                    <span className={styles.starChar}>&#9733;</span>
                    <span className={styles.ratingValue}>{property.host.rating || roundedRating}</span>
                  </div>
                </div>

                <div className={styles.buttonGroup}>
                  <ContactButton />
                </div>

              </section>
            )}

          </div>

        </div>

      </main>
    </div>
  );
}
