"use client";

import React, { useState } from "react";
import Link from "next/link";
import styles from "./AjoutPropriete.module.css";

export default function AjoutProprietePage() {
  const [submitted, setSubmitted] = useState(false);

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const handleReset = () => {
    setSubmitted(false);
    setSelectedCategories([]);
  };

  const toggleCategory = (cat: string) => {
    if (selectedCategories.includes(cat)) {
      setSelectedCategories(selectedCategories.filter((item) => item !== cat));
    } else {
      setSelectedCategories([...selectedCategories, cat]);
    }
  };

  const equipmentsLeft = [
    "Micro-Ondes", "Douche italienne", "Frigo", "WIFI", "Parking", "Sèche Cheveux",
    "Machine à laver", "Cuisine équipée", "Télévision", "Chambre Séparée", "Climatisation", "Frigo Américain"
  ];

  const equipmentsRight = [
    "Clic-clac", "Four", "Rangements", "Lit", "Bouilloire", "SDB",
    "Toilettes sèches", "Cintres", "Baie vitrée", "Hotte", "Baignoire", "Vue Parc"
  ];

  const categories = [
    "Parc", "Night Life", "Culture", "Nature", "Touristique",
    "Vue sur mer", "Pour les couples", "Famille", "Forêt"
  ];

  return (
    <div className={styles.pageContainer}>
      <main className={styles.mainContent}>

        <div className={styles.navigationRow}>
          <Link href="/" className={styles.backButton}>
            &larr; Retour
          </Link>
        </div>

        {submitted ? (
          <div className={styles.successCard}>
            <div className={styles.successIcon}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" width="48" height="48">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0110.5 21a3.745 3.745 0 01-3.068-1.593 3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0110.5 3a3.745 3.745 0 013.068 1.593 3.746 3.746 0 013.296 1.043 3.745 3.745 0 011.043 3.296A3.745 3.745 0 0121 12z" />
              </svg>
            </div>
            <h2>Propriété ajoutée avec succès !</h2>
            <p>Votre annonce a bien été enregistrée et sera soumise à validation par nos équipes.</p>
            <button onClick={handleReset} className={styles.resetBtn}>
              Ajouter une autre propriété
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className={styles.formContainer}>

            <div className={styles.titleRow}>
              <h1 className={styles.pageTitle}>Ajouter une propriété</h1>
              <button type="submit" className={styles.submitBtn}>
                Ajouter
              </button>
            </div>

            <div className={styles.dashboardGrid}>
              <div className={styles.leftCol}>
                <div className={styles.formCard}>
                  <div className={styles.inputGroup}>
                    <label className={styles.inputLabel} htmlFor="title">Titre de la propriété</label>
                    <input type="text" id="title" className={styles.textInput} placeholder="Ex : Appartement cosy au coeur de paris" />
                  </div>

                  <div className={styles.inputGroup}>
                    <label className={styles.inputLabel} htmlFor="description">Description</label>
                    <textarea id="description" rows={6} className={styles.textareaInput} placeholder="Décrivez votre propriété en détail..." />
                  </div>

                  <div className={styles.inputGroup}>
                    <label className={styles.inputLabel} htmlFor="zip">Code postal</label>
                    <input type="text" id="zip" className={styles.textInput} />
                  </div>

                  <div className={styles.inputGroup}>
                    <label className={styles.inputLabel} htmlFor="location">Localisation</label>
                    <input type="text" id="location" className={styles.textInput} />
                  </div>
                </div>

                <div className={styles.formCard}>
                  <h2 className={styles.sectionHeading}>Équipements</h2>
                  <div className={styles.checkboxGrid}>
                    <div className={styles.checkboxCol}>
                      {equipmentsLeft.map((eq, idx) => (
                        <label key={idx} className={styles.checkboxLabel}>
                          <input type="checkbox" className={styles.checkboxInput} />
                          <span>{eq}</span>
                        </label>
                      ))}
                    </div>
                    <div className={styles.checkboxCol}>
                      {equipmentsRight.map((eq, idx) => (
                        <label key={idx} className={styles.checkboxLabel}>
                          <input type="checkbox" className={styles.checkboxInput} />
                          <span>{eq}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles.rightCol}>
                <div className={styles.formCardRight}>
                  <div className={styles.inputGroup}>
                    <label className={styles.inputLabel}>Image de couverture</label>
                    <div className={styles.inputWithButtonRow}>
                      <input type="text" className={styles.textInput} />
                      <button type="button" className={styles.plusButton}>+</button>
                    </div>
                  </div>

                  <div className={styles.inputGroup}>
                    <label className={styles.inputLabel}>Image du logement</label>
                    <div className={styles.inputWithButtonRow}>
                      <input type="text" className={styles.textInput} />
                      <button type="button" className={styles.plusButton}>+</button>
                    </div>
                    <a href="#add" className={styles.addLink}>+Ajouter une image</a>
                  </div>
                </div>

                <div className={styles.formCardRight}>
                  <div className={styles.inputGroup}>
                    <label className={styles.inputLabel}>Nom de l&apos;hôte</label>
                    <input type="text" className={styles.textInput} />
                  </div>

                  <div className={styles.inputGroup}>
                    <label className={styles.inputLabel}>Photo de profil</label>
                    <div className={styles.inputWithButtonRow}>
                      <input type="text" className={styles.textInput} />
                      <button type="button" className={styles.plusButton}>+</button>
                    </div>
                    <a href="#add" className={styles.addLink}>+Ajouter une image</a>
                  </div>
                </div>

                <div className={styles.formCard}>
                  <h2 className={styles.sectionHeading}>Catégories</h2>
                  <div className={styles.categoryTagsGrid}>
                    {categories.map((cat, idx) => {
                      const isSelected = selectedCategories.includes(cat);

                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => toggleCategory(cat)}
                          className={`${styles.categoryTag} ${isSelected ? styles.categoryTagActive : ''}`}
                        >
                          {cat}
                        </button>
                      );
                    })}
                  </div>

                  <div className={styles.inputGroup}>
                    <label className={styles.inputLabel}>Ajouter une catégorie personnalisée</label>
                    <div className={styles.inputWithButtonRow}>
                      <input type="text" className={styles.textInput} placeholder="Nouveau tag" />
                      <button type="button" className={styles.plusButton}>+</button>
                    </div>
                    <a href="#add" className={styles.addLink}>+Ajouter un tag</a>
                  </div>
                </div>
              </div>
            </div>

          </form>
        )}

      </main>
    </div>
  );
}