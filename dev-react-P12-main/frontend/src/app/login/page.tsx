"use client";

import React, { useState } from "react";
import Link from "next/link";
import styles from "./Login.module.css";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Veuillez remplir tous les champs.");
      return;
    }
    setError("");

    try {
      const res = await fetch("http://localhost:3001/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || "Identifiants invalides.");
      }

      const data = await res.json();

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      window.dispatchEvent(new Event("storage"));

      window.location.href = "/";

    } catch (err: any) {
      setError(err.message || "Une erreur est survenue lors de la connexion.");
    }
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

      </main>
    </div>
  );
}
