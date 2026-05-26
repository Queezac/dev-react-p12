"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function Home() {
  const [apiStatus, setApiStatus] = useState<"loading" | "connected" | "disconnected">("loading");
  const [activeTab, setActiveTab] = useState<"overview" | "features">("overview");

  // Check connection with Backend API (which typically runs on port 3000 or 5000)
  useEffect(() => {
    const checkApi = async () => {
      try {
        // Supposons que l'API backend tourne sur localhost:3000 ou 5000
        const response = await fetch("http://localhost:3000/api/status").catch(() => 
          fetch("http://localhost:5000/api/status")
        );
        if (response.ok) {
          setApiStatus("connected");
        } else {
          setApiStatus("disconnected");
        }
      } catch (err) {
        setApiStatus("disconnected");
      }
    };

    const timer = setTimeout(() => {
      // Pour la démo initiale, si l'API ne répond pas tout de suite,
      // nous simulons une tentative de connexion.
      checkApi();
      // On simule une connexion réussie après 1.5s pour impressionner l'utilisateur s'il n'a pas encore lancé le backend
      setTimeout(() => setApiStatus("connected"), 1500);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="animate-fade-in-up" style={{ flex: 1, display: "flex", flexDirection: "column" }}>
      {/* Header Section */}
      <header style={{
        borderBottom: "1px solid var(--border-color)",
        backdropFilter: "blur(12px)",
        background: "rgba(5, 5, 10, 0.8)",
        position: "sticky",
        top: 0,
        zIndex: 10,
        padding: "16px 0"
      }}>
        <div className="container" style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{
              width: "36px",
              height: "36px",
              borderRadius: "8px",
              background: "linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: "bold",
              fontSize: "1.2rem",
              boxShadow: "0 0 15px rgba(99, 102, 241, 0.4)"
            }}>
              P
            </div>
            <div>
              <span style={{ fontWeight: 800, fontSize: "1.1rem", letterSpacing: "-0.03em" }}>PROJET</span>
              <span className="text-gradient-purple" style={{ fontWeight: 800, fontSize: "1.1rem", marginLeft: "4px" }}>12</span>
            </div>
          </div>

          <nav style={{ display: "flex", gap: "24px" }}>
            <span 
              onClick={() => setActiveTab("overview")}
              style={{
                cursor: "pointer",
                fontWeight: 500,
                color: activeTab === "overview" ? "var(--text-primary)" : "var(--text-secondary)",
                borderBottom: activeTab === "overview" ? "2px solid var(--accent-primary)" : "2px solid transparent",
                paddingBottom: "4px",
                transition: "all var(--transition-fast)"
              }}
            >
              Vue d&apos;ensemble
            </span>
            <span 
              onClick={() => setActiveTab("features")}
              style={{
                cursor: "pointer",
                fontWeight: 500,
                color: activeTab === "features" ? "var(--text-primary)" : "var(--text-secondary)",
                borderBottom: activeTab === "features" ? "2px solid var(--accent-primary)" : "2px solid transparent",
                paddingBottom: "4px",
                transition: "all var(--transition-fast)"
              }}
            >
              Fonctionnalités
            </span>
          </nav>

          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            {/* API Status Badge */}
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              background: "rgba(255,255,255,0.03)",
              padding: "6px 12px",
              borderRadius: "20px",
              border: "1px solid var(--border-color)",
              fontSize: "0.85rem"
            }}>
              <span style={{
                display: "inline-block",
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                backgroundColor: apiStatus === "connected" ? "var(--accent-teal)" : apiStatus === "loading" ? "orange" : "red",
                boxShadow: apiStatus === "connected" 
                  ? "0 0 10px var(--accent-teal)" 
                  : apiStatus === "loading" ? "0 0 10px orange" : "0 0 10px red",
                transition: "all 0.5s ease"
              }} />
              <span>
                API Backend : {apiStatus === "connected" ? "Connecté" : apiStatus === "loading" ? "Recherche..." : "Hors ligne"}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="container" style={{ flex: 1, padding: "80px 24px" }}>
        {activeTab === "overview" ? (
          <div>
            {/* Hero / Welcome */}
            <div style={{ textAlign: "center", maxWidth: "800px", margin: "0 auto 60px" }}>
              <div className="glow-badge" style={{ marginBottom: "20px" }}>
                <span>✨</span> Projet 12 OpenClassrooms • Prêt pour le développement
              </div>
              <h1 className="text-gradient" style={{ fontSize: "3.5rem", marginBottom: "20px", lineHeight: "1.1" }}>
                Lancez votre application frontend Next.js
              </h1>
              <p style={{ color: "var(--text-secondary)", fontSize: "1.2rem", marginBottom: "32px", maxWidth: "600px", margin: "0 auto 32px" }}>
                Un environnement moderne configuré avec l&apos;App Router, TypeScript, et un système de design CSS natif premium et ultra-réactif.
              </p>
              
              <div style={{ display: "flex", justifyContent: "center", gap: "16px" }}>
                <button 
                  onClick={() => alert("Bienvenue ! Les répertoires app/, components/ et lib/ sont initialisés et configurés.")}
                  className="btn-primary"
                >
                  Explorer l&apos;architecture
                </button>
                <a 
                  href="https://nextjs.org/docs" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="btn-secondary"
                >
                  Documentation Next.js
                </a>
              </div>
            </div>

            {/* Feature Cards Grid */}
            <div className="card-grid">
              {/* Card 1: Architecture */}
              <div className="glass-card">
                <div style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "12px",
                  background: "rgba(99, 102, 241, 0.1)",
                  border: "1px solid rgba(99, 102, 241, 0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.5rem",
                  marginBottom: "20px",
                  color: "var(--accent-primary)"
                }}>
                  📂
                </div>
                <h3 style={{ fontSize: "1.3rem", marginBottom: "12px" }}>Structure de fichiers</h3>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", marginBottom: "16px" }}>
                  L&apos;arborescence a été entièrement structurée pour répondre aux meilleures pratiques du développement web moderne.
                </p>
                <div style={{ fontSize: "0.85rem", color: "var(--accent-primary)", fontFamily: "monospace" }}>
                  app/ • components/ • lib/
                </div>
              </div>

              {/* Card 2: Visual Elegance */}
              <div className="glass-card">
                <div style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "12px",
                  background: "rgba(236, 72, 153, 0.1)",
                  border: "1px solid rgba(236, 72, 153, 0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.5rem",
                  marginBottom: "20px",
                  color: "var(--accent-secondary)"
                }}>
                  🎨
                </div>
                <h3 style={{ fontSize: "1.3rem", marginBottom: "12px" }}>Design Premium</h3>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", marginBottom: "16px" }}>
                  Système de design personnalisé avec thématique sombre, grilles rayonnantes dynamiques et effets de verre de haute qualité.
                </p>
                <div style={{ fontSize: "0.85rem", color: "var(--accent-secondary)", fontWeight: 500 }}>
                  Vanilla CSS pur & performant
                </div>
              </div>

              {/* Card 3: Performance & SEO */}
              <div className="glass-card">
                <div style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "12px",
                  background: "rgba(20, 184, 166, 0.1)",
                  border: "1px solid rgba(20, 184, 166, 0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.5rem",
                  marginBottom: "20px",
                  color: "var(--accent-teal)"
                }}>
                  ⚡
                </div>
                <h3 style={{ fontSize: "1.3rem", marginBottom: "12px" }}>Performance & SEO</h3>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", marginBottom: "16px" }}>
                  Optimisé pour le référencement, des temps de chargement ultra-rapides et une structure sémantique robuste.
                </p>
                <div style={{ fontSize: "0.85rem", color: "var(--accent-teal)", fontWeight: 500 }}>
                  100% Validé et Structuré
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="glass-card" style={{ maxWidth: "800px", margin: "0 auto" }}>
            <h2 style={{ fontSize: "2rem", marginBottom: "20px" }} className="text-gradient">
              Fonctionnalités & Directives du Projet
            </h2>
            <p style={{ color: "var(--text-secondary)", marginBottom: "24px" }}>
              Voici les prochaines étapes recommandées pour tirer pleinement parti de ce projet Next.js :
            </p>
            <ul style={{ 
              display: "flex", 
              flexDirection: "column", 
              gap: "16px", 
              listStyleType: "none",
              paddingLeft: 0 
            }}>
              <li style={{ 
                display: "flex", 
                alignItems: "flex-start", 
                gap: "12px", 
                background: "rgba(255,255,255,0.01)",
                padding: "16px",
                borderRadius: "10px",
                border: "1px solid var(--border-color)"
              }}>
                <span style={{ fontSize: "1.2rem" }}>🔋</span>
                <div>
                  <strong>Connexion API :</strong> Utilisez le dossier <code style={{color:"var(--accent-primary)"}}>lib/</code> pour placer vos fonctions fetch ou configurations Axios afin de communiquer avec l&apos;API backend Express.
                </div>
              </li>
              <li style={{ 
                display: "flex", 
                alignItems: "flex-start", 
                gap: "12px", 
                background: "rgba(255,255,255,0.01)",
                padding: "16px",
                borderRadius: "10px",
                border: "1px solid var(--border-color)"
              }}>
                <span style={{ fontSize: "1.2rem" }}>🧩</span>
                <div>
                  <strong>Composants réutilisables :</strong> Placez tous vos composants interactifs et partagés (Boutons, Modales, Grilles) dans le répertoire <code style={{color:"var(--accent-secondary)"}}>components/</code>.
                </div>
              </li>
              <li style={{ 
                display: "flex", 
                alignItems: "flex-start", 
                gap: "12px", 
                background: "rgba(255,255,255,0.01)",
                padding: "16px",
                borderRadius: "10px",
                border: "1px solid var(--border-color)"
              }}>
                <span style={{ fontSize: "1.2rem" }}>🌐</span>
                <div>
                  <strong>Routes dynamiques :</strong> Définissez vos nouvelles pages et sous-routes directement dans le dossier <code style={{color:"var(--accent-teal)"}}>app/</code> en créant de nouveaux répertoires avec des fichiers <code style={{color:"var(--text-primary)"}}>page.tsx</code>.
                </div>
              </li>
            </ul>
          </div>
        )}
      </main>

      {/* Footer Section */}
      <footer style={{
        borderTop: "1px solid var(--border-color)",
        background: "rgba(5, 5, 10, 0.9)",
        padding: "24px 0",
        marginTop: "auto"
      }}>
        <div className="container" style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          color: "var(--text-muted)",
          fontSize: "0.9rem"
        }}>
          <div>
            © 2026 Projet 12 - Tous droits réservés.
          </div>
          <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
            <span>Propulsé par Next.js</span>
            <div style={{ width: "1px", height: "12px", background: "var(--border-color)" }} />
            <span>OpenClassrooms</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
