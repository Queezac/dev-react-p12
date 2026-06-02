"use client";

import React, { useState } from "react";
import Link from "next/link";
import styles from "./Signin.module.css";

export default function SigninPage() {
  const [lastName, setLastName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lastName || !firstName || !email || !password) {
      setError("Veuillez remplir tous les champs obligatoires.");
      return;
    }
    if (!termsAccepted) {
      setError("Vous devez accepter les conditions générales d'utilisation.");
      return;
    }
    setError("");

    try {
      const res = await fetch("http://localhost:3001/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: `${firstName} ${lastName}`,
          email: email.trim(),
          password: password,
          role: "client"
        })
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || "Une erreur est survenue lors de l'inscription.");
      }

      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue lors de l'inscription.");
    }
  };

  return (
    <div className={styles.container}>
      <main className={styles.card}>

        <div className={styles.header}>
          <h1 className={styles.title}>Rejoignez la communauté Kasa</h1>
          <p className={styles.subtitle}>
            Créez votre compte et commencez à voyager autrement : réservez des logements uniques, découvrez de nouvelles destinations et partagez vos propres lieux avec d&apos;autres voyageurs.
          </p>
        </div>

        {success ? (
          <div className={styles.successBlock}>
            <div className={styles.successIcon}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" width="36" height="36">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2>Inscription réussie !</h2>
            <p>Bienvenue chez Kasa, <strong>{firstName} {lastName}</strong> ! Votre compte a été créé.</p>
            <Link href="/login" className={styles.loginBtn}>
              Se connecter à mon espace
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className={styles.form}>
            {error && <div className={styles.errorBanner}>{error}</div>}

            <div className={styles.inputGroup}>
              <label htmlFor="lastName">Nom</label>
              <input
                type="text"
                id="lastName"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="firstName">Prénom</label>
              <input
                type="text"
                id="firstName"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>

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

            <div className={styles.checkboxGroup}>
              <input
                type="checkbox"
                id="terms"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className={styles.checkboxInput}
              />
              <label htmlFor="terms" className={styles.checkboxLabel}>
                J&apos;accepte les <a href="#terms" className={styles.termsLink}>conditions générales d&apos;utilisation</a>
              </label>
            </div>

            <div className={styles.actionSection}>
              <button type="submit" className={styles.submitBtn}>
                S&apos;inscrire
              </button>

              <p className={styles.footerLink}>
                Déjà membre ? <Link href="/login">Se connecter</Link>
              </p>
            </div>
          </form>
        )}

      </main>
    </div>
  );
}
