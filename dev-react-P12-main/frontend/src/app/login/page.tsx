"use client";

import React, { useState } from "react";
import Link from "next/link";
import styles from "./Login.module.css";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Veuillez remplir tous les champs.");
      return;
    }
    setError("");
    setSuccess(true);
  };

  return (
    <div className={styles.container}>
      <main className={styles.card}>

        <div className={styles.header}>
          <h1 className={styles.title}>Heureux de vous revoir</h1>
          <p className={styles.subtitle}>
            Connectez-vous pour retrouver vos réservations, vos annonces et tout ce qui rend vos séjours uniques.
          </p>
        </div>

        {success ? (
          <div className={styles.successBlock}>
            <div className={styles.successIcon}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" width="36" height="36">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2>Connexion réussie !</h2>
            <p>Bienvenue de retour, <strong>{email}</strong>.</p>
            <Link href="/" className={styles.homeBtn}>
              Retour à l&apos;accueil
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className={styles.form}>
            {error && <div className={styles.errorBanner}>{error}</div>}

            <div className={styles.inputGroup}>
              <label htmlFor="email">Adresse email</label>
              <input
                type="email"
                id="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="password">Mot de passe</label>
              <input
                type="password"
                id="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className={styles.actionSection}>
              <button type="submit" className={styles.submitBtn}>
                Se connecter
              </button>

              <div className={styles.forgotPasswordRow}>
                <a href="#reset" className={styles.forgotLink}>Mot de passe oublié</a>
              </div>

              <p className={styles.footerLink}>
                Pas encore de compte ? <Link href="/signin">Inscrivez-vous</Link>
              </p>
            </div>
          </form>
        )}

      </main>
    </div>
  );
}
