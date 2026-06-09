"use client";

import React, { useState } from "react";
import Link from "next/link";
import styles from "./Login.module.css";

type ViewState = "login" | "forgot_password" | "reset_password";

export default function LoginPage() {
  const [view, setView] = useState<ViewState>("login");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [resetEmail, setResetEmail] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");

  const handleLoginSubmit = async (e: React.FormEvent) => {
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

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail) {
      setError("Veuillez renseigner votre adresse email.");
      return;
    }
    setError("");

    try {
      const res = await fetch("http://localhost:3001/auth/request-reset", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: resetEmail }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || "Impossible de réinitialiser le mot de passe.");
      }

      const data = await res.json();
      if (data.token) {
        setResetToken(data.token);
        setView("reset_password");
      } else {
        throw new Error("Impossible de récupérer le jeton de réinitialisation.");
      }
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue.");
    }
  };

  const handleResetPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || !confirmPassword) {
      setError("Veuillez remplir tous les champs.");
      return;
    }
    if (newPassword.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }
    setError("");

    try {
      const res = await fetch("http://localhost:3001/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: resetToken, password: newPassword }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || "Impossible de modifier le mot de passe.");
      }

      alert("Votre mot de passe a été réinitialisé avec succès.");
      setEmail(resetEmail);
      setPassword("");
      setError("");
      setView("login");
      setResetEmail("");
      setResetToken("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue lors de la réinitialisation.");
    }
  };

  const transitionToForgot = (e: React.MouseEvent) => {
    e.preventDefault();
    setError("");
    setResetEmail(email);
    setView("forgot_password");
  };

  const transitionToLogin = (e: React.MouseEvent) => {
    e.preventDefault();
    setError("");
    setView("login");
  };

  return (
    <div className={styles.container}>
      <main className={styles.card}>
        {view === "login" && (
          <>
            <div className={styles.header}>
              <h1 className={styles.title}>Heureux de vous revoir</h1>
              <p className={styles.subtitle}>
                Connectez-vous pour retrouver vos réservations, vos annonces et tout ce qui rend vos séjours uniques.
              </p>
            </div>

            <form onSubmit={handleLoginSubmit} className={styles.form}>
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
                  <a href="#reset" onClick={transitionToForgot} className={styles.forgotLink}>
                    Mot de passe oublié
                  </a>
                </div>

                <p className={styles.footerLink}>
                  Pas encore de compte ? <Link href="/signin">Inscrivez-vous</Link>
                </p>
              </div>
            </form>
          </>
        )}

        {view === "forgot_password" && (
          <>
            <div className={styles.header}>
              <h1 className={styles.title}>Mot de passe oublié</h1>
              <p className={styles.subtitle}>
                Entrez votre adresse email. Si elle existe en base de données, vous pourrez réinitialiser votre mot de passe immédiatement.
              </p>
            </div>

            <form onSubmit={handleRequestReset} className={styles.form}>
              {error && <div className={styles.errorBanner}>{error}</div>}

              <div className={styles.inputGroup}>
                <label htmlFor="reset-email">Adresse email</label>
                <input
                  type="email"
                  id="reset-email"
                  required
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                />
              </div>

              <div className={styles.actionSection}>
                <button type="submit" className={styles.submitBtn}>
                  Vérifier l&apos;email
                </button>

                <div className={styles.forgotPasswordRow}>
                  <a href="#login" onClick={transitionToLogin} className={styles.forgotLink}>
                    Retour à la connexion
                  </a>
                </div>
              </div>
            </form>
          </>
        )}

        {view === "reset_password" && (
          <>
            <div className={styles.header}>
              <h1 className={styles.title}>Choisir un nouveau mot de passe</h1>
              <p className={styles.subtitle}>
                Veuillez entrer votre nouveau mot de passe pour le compte lié à {resetEmail}.
              </p>
            </div>

            <form onSubmit={handleResetPasswordSubmit} className={styles.form}>
              {error && <div className={styles.errorBanner}>{error}</div>}

              <div className={styles.inputGroup}>
                <label htmlFor="new-password">Nouveau mot de passe</label>
                <input
                  type="password"
                  id="new-password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="confirm-password">Confirmer le mot de passe</label>
                <input
                  type="password"
                  id="confirm-password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>

              <div className={styles.actionSection}>
                <button type="submit" className={styles.submitBtn}>
                  Réinitialiser le mot de passe
                </button>

                <div className={styles.forgotPasswordRow}>
                  <a href="#login" onClick={transitionToLogin} className={styles.forgotLink}>
                    Annuler et retourner à la connexion
                  </a>
                </div>
              </div>
            </form>
          </>
        )}
      </main>
    </div>
  );
}
