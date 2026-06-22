import { PropertySummary, PropertyDetails } from "./types";
import { getApiBaseUrl } from "./config";
const API_BASE_URL = getApiBaseUrl();

/**
 * Retourne les en-têtes de requête avec le jeton de contournement de la protection Vercel si disponible.
 */
function getFetchHeaders(): Record<string, string> {
  const headers: Record<string, string> = {};
  if (process.env.VERCEL_AUTOMATION_BYPASS_SECRET) {
    headers["x-vercel-protection-bypass"] = process.env.VERCEL_AUTOMATION_BYPASS_SECRET;
  }
  return headers;
}

/**
 * Récupère tous les logements à partir de l'API backend.
 * @returns {Promise<{properties: PropertySummary[], isOffline: boolean}>} La liste des logements.
 */
export async function getProperties(): Promise<{ properties: PropertySummary[]; isOffline: boolean }> {
  const res = await fetch(`${API_BASE_URL}/properties`, {
    cache: "no-store",
    headers: getFetchHeaders(),
  });

  if (!res.ok) {
    throw new Error(`API returned status ${res.status}`);
  }

  const data = await res.json();
  return { properties: data, isOffline: false };
}

/**
 * Récupère les détails complets d'un logement par son identifiant unique.
 * @param {string} id - L'identifiant unique du logement.
 * @returns {Promise<{property: PropertyDetails | null, isOffline: boolean}>} Les détails du logement.
 */
export async function getPropertyById(id: string): Promise<{ property: PropertyDetails | null; isOffline: boolean }> {
  const res = await fetch(`${API_BASE_URL}/properties/${id}`, {
    cache: "no-store",
    headers: getFetchHeaders(),
  });

  if (res.status === 404) {
    return { property: null, isOffline: false };
  }

  if (!res.ok) {
    throw new Error(`API returned status ${res.status}`);
  }

  const data = await res.json();
  return { property: data, isOffline: false };
}
