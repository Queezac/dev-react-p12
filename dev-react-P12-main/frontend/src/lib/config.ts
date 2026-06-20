/**
 * Renvoie l'URL de base du backend API de manière dynamique.
 * Gère le cas local et le cas déployé sur Vercel.
 */
export function getApiBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  
  if (typeof window !== "undefined") {
    // Côté client (navigateur) sur Vercel
    if (!window.location.hostname.includes("localhost") && !window.location.hostname.includes("127.0.0.1")) {
      return `${window.location.origin}/_/backend/api`;
    }
  } else {
    // Côté serveur sur Vercel
    if (process.env.VERCEL_URL) {
      return "https://dev-react-p12-main.vercel.app/_/backend/api";
    }
  }
  
  return "http://localhost:3001/api";
}

/**
 * Renvoie l'URL d'origine du backend pour les fichiers statiques (images).
 */
export function getBackendOrigin(): string {
  if (typeof window !== "undefined") {
    if (!window.location.hostname.includes("localhost") && !window.location.hostname.includes("127.0.0.1")) {
      return `${window.location.origin}/_/backend`;
    }
  } else {
    if (process.env.VERCEL_URL) {
      return "https://dev-react-p12-main.vercel.app/_/backend";
    }
  }
  return "http://localhost:3001";
}

/**
 * Renvoie l'URL d'origine du frontend de manière dynamique.
 */
export function getFrontendOrigin(): string {
  if (typeof window !== "undefined") {
    return window.location.origin;
  }
  if (process.env.VERCEL_URL) {
    return "https://dev-react-p12-main.vercel.app";
  }
  return "http://localhost:3000";
}
