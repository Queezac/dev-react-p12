import { PropertySummary, PropertyDetails } from "./types";
const API_BASE_URL = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

/**
 * Récupère tous les logements à partir de l'API backend.
 * @returns {Promise<{properties: PropertySummary[], isOffline: boolean}>} La liste des logements.
 */
export async function getProperties(): Promise<{ properties: PropertySummary[]; isOffline: boolean }> {
  const res = await fetch(`${API_BASE_URL}/properties`, {
    cache: "no-store",
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
  });

  if (!res.ok) {
    throw new Error(`API returned status ${res.status}`);
  }

  const data = await res.json();
  return { property: data, isOffline: false };
}
