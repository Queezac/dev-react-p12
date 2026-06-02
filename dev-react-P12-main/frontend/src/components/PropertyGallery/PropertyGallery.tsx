"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import styles from "./PropertyGallery.module.css";

interface PropertyGalleryProps {
  uniquePics: string[];
  propertyTitle: string;
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

export default function PropertyGallery({ uniquePics, propertyTitle }: PropertyGalleryProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const len = uniquePics.length;

  const openLightbox = (index: number) => {
    setCurrentIndex(index);
    setIsOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = () => {
    setIsOpen(false);
    document.body.style.overflow = "";
  };

  const handleNext = useCallback(() => {
    if (len === 0) return;
    setCurrentIndex((prev) => (prev + 1) % len);
  }, [len]);

  const handlePrev = useCallback(() => {
    if (len === 0) return;
    setCurrentIndex((prev) => (prev - 1 + len) % len);
  }, [len]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeLightbox();
      } else if (e.key === "ArrowRight") {
        handleNext();
      } else if (e.key === "ArrowLeft") {
        handlePrev();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, handleNext, handlePrev]);

  useEffect(() => {
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  if (len === 0) {
    return (
      <div className={styles.emptyGallery}>
        <Image
          src="/placeholder-house.jpg"
          alt={propertyTitle}
          className={styles.collagePic}
          fill
          priority
          sizes="100vw"
        />
      </div>
    );
  }

  const renderGrid = () => {
    if (len === 1) {
      return (
        <section className={styles.collageGrid}>
          <div className={styles.largePicWrapper} onClick={() => openLightbox(0)}>
            <Image
              src={formatImageUrl(uniquePics[0])}
              alt={propertyTitle}
              className={styles.collagePic}
              fill
              priority
              sizes="100vw"
            />
          </div>
        </section>
      );
    }

    if (len === 2) {
      return (
        <section className={styles.collageGrid}>
          <div className={styles.splitPicWrapper} onClick={() => openLightbox(0)}>
            <Image
              src={formatImageUrl(uniquePics[0])}
              alt={propertyTitle}
              className={styles.collagePic}
              fill
              priority
              sizes="50vw"
            />
          </div>
          <div className={styles.splitPicWrapper} onClick={() => openLightbox(1)}>
            <Image
              src={formatImageUrl(uniquePics[1])}
              alt={propertyTitle}
              className={styles.collagePic}
              fill
              priority
              sizes="50vw"
            />
          </div>
        </section>
      );
    }

    if (len === 3) {
      return (
        <section className={styles.collageGrid}>
          <div className={styles.largePicWrapper} style={{ flex: 1.5 }} onClick={() => openLightbox(0)}>
            <Image
              src={formatImageUrl(uniquePics[0])}
              alt={propertyTitle}
              className={styles.collagePic}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 60vw"
            />
          </div>
          <div className={styles.smallPicsCol}>
            <div className={styles.smallPicWrapper} onClick={() => openLightbox(1)}>
              <Image
                src={formatImageUrl(uniquePics[1])}
                alt={propertyTitle}
                className={styles.collagePic}
                fill
                sizes="(max-width: 768px) 50vw, 40vw"
              />
            </div>
            <div className={styles.smallPicWrapper} onClick={() => openLightbox(2)}>
              <Image
                src={formatImageUrl(uniquePics[2])}
                alt={propertyTitle}
                className={styles.collagePic}
                fill
                sizes="(max-width: 768px) 50vw, 40vw"
              />
            </div>
          </div>
        </section>
      );
    }

    if (len === 4) {
      return (
        <section className={styles.collageGrid}>
          <div className={styles.largePicWrapper} onClick={() => openLightbox(0)}>
            <Image
              src={formatImageUrl(uniquePics[0])}
              alt={propertyTitle}
              className={styles.collagePic}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
          <div className={styles.smallPicsCol}>
            <div className={styles.smallPicWrapper} onClick={() => openLightbox(1)}>
              <Image
                src={formatImageUrl(uniquePics[1])}
                alt={propertyTitle}
                className={styles.collagePic}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
              />
            </div>
            <div className={styles.smallPicWrapper} onClick={() => openLightbox(2)}>
              <Image
                src={formatImageUrl(uniquePics[2])}
                alt={propertyTitle}
                className={styles.collagePic}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
              />
            </div>
          </div>
          <div className={styles.smallPicsCol}>
            <div className={styles.smallPicWrapper} onClick={() => openLightbox(3)}>
              <Image
                src={formatImageUrl(uniquePics[3])}
                alt={propertyTitle}
                className={styles.collagePic}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
              />
            </div>
          </div>
        </section>
      );
    }

    return (
      <section className={styles.collageGrid}>
        <div className={styles.largePicWrapper} onClick={() => openLightbox(0)}>
          <Image
            src={formatImageUrl(uniquePics[0])}
            alt={`${propertyTitle} - 1`}
            className={styles.collagePic}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>

        <div className={styles.smallPicsCol}>
          <div className={styles.smallPicWrapper} onClick={() => openLightbox(1)}>
            <Image
              src={formatImageUrl(uniquePics[1])}
              alt={`${propertyTitle} - 2`}
              className={styles.collagePic}
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
            />
          </div>
          <div className={styles.smallPicWrapper} onClick={() => openLightbox(2)}>
            <Image
              src={formatImageUrl(uniquePics[2])}
              alt={`${propertyTitle} - 3`}
              className={styles.collagePic}
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
            />
          </div>
        </div>

        <div className={styles.smallPicsCol}>
          <div className={styles.smallPicWrapper} onClick={() => openLightbox(3)}>
            <Image
              src={formatImageUrl(uniquePics[3])}
              alt={`${propertyTitle} - 4`}
              className={styles.collagePic}
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
            />
          </div>
          <div className={styles.smallPicWrapper} onClick={() => openLightbox(4)}>
            <Image
              src={formatImageUrl(uniquePics[4])}
              alt={`${propertyTitle} - 5`}
              className={styles.collagePic}
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
            />
          </div>
        </div>
      </section>
    );
  };

  return (
    <>
      {renderGrid()}

      {isOpen && (
        <div className={styles.lightboxBackdrop} onClick={closeLightbox}>
          <button
            className={styles.closeBtn}
            onClick={closeLightbox}
            aria-label="Fermer la galerie"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="24" height="24">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>

          {len > 1 && (
            <>
              <button
                className={`${styles.navBtn} ${styles.prevBtn}`}
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrev();
                }}
                aria-label="Image précédente"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="28" height="28">
                  <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
              </button>

              <button
                className={`${styles.navBtn} ${styles.nextBtn}`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleNext();
                }}
                aria-label="Image suivante"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="28" height="28">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </button>
            </>
          )}

          <div
            className={styles.lightboxContent}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.imageWrapper}>
              <Image
                src={formatImageUrl(uniquePics[currentIndex])}
                alt={`${propertyTitle} - image ${currentIndex + 1} sur ${len}`}
                className={styles.lightboxImage}
                width={1200}
                height={800}
                priority
              />
            </div>

            <div className={styles.imageCounter}>
              {currentIndex + 1} / {len}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
