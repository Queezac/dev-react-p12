"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { PropertySummary } from "@/lib/types";
import styles from "./PropertyCard.module.css";

import { isFavorite, toggleFavorite } from "@/lib/favorites";

interface PropertyCardProps {
  property: PropertySummary;
  initialLiked?: boolean;
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

export default function PropertyCard({ property, initialLiked = false }: PropertyCardProps) {
  const [isLiked, setIsLiked] = useState(initialLiked);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("user"));
    setIsLiked(isFavorite(property.id));
  }, [property.id]);

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const updatedFavs = toggleFavorite(property.id);
    setIsLiked(updatedFavs.includes(property.id));
  };

  return (
    <Link href={`/logement/${property.id}`} className={styles.propertyCard}>

      <div className={styles.imageContainer}>
        <Image
          src={formatImageUrl(property.cover)}
          alt={property.title}
          className={styles.coverImage}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />

        {isLoggedIn && (
          <button
            onClick={handleLike}
            className={`${styles.heartButton} ${isLiked ? styles.heartActive : ""}`}
            title={isLiked ? "Retirer des favoris" : "Ajouter aux favoris"}
            aria-label="Sauvegarder"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill={isLiked ? "currentColor" : "none"}
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className={styles.heartIcon}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
            </svg>
          </button>
        )}
      </div>

      <div className={styles.cardBody}>
        <h4 className={styles.propertyTitle} title={property.title}>
          {property.title}
        </h4>
        <span className={styles.locationText}>
          {property.location || "Non spécifié"}
        </span>
        <div className={styles.priceTag}>
          <span className={styles.priceValue}>{property.price_per_night}€</span>{" "}
          <span className={styles.perNight}>par nuit</span>
        </div>
      </div>

    </Link>
  );
}
