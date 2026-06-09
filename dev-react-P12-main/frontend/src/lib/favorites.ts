const STORAGE_KEY = "kasa_favorites";

/**
 * Récupère la liste des identifiants de logements favoris stockés dans le localStorage.
 * @returns {string[]} Tableau contenant les identifiants uniques des logements favoris.
 */
export function getFavoriteIds(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    console.error("Failed to parse favorites from localStorage", e);
    return [];
  }
}

/**
 * Vérifie si un logement fait partie des favoris de l'utilisateur.
 * @param {string} id - L'identifiant unique du logement.
 * @returns {boolean} True si le logement est un favori, sinon false.
 */
export function isFavorite(id: string): boolean {
  const favorites = getFavoriteIds();
  return favorites.includes(id);
}

/**
 * Ajoute ou supprime un logement des favoris (inverse l'état actuel).
 * Déclenche un événement "favorites-updated".
 * @param {string} id - L'identifiant unique du logement.
 * @returns {string[]} La liste mise à jour des identifiants favoris.
 */
export function toggleFavorite(id: string): string[] {
  if (typeof window === "undefined") return [];
  const favorites = getFavoriteIds();
  const updated = favorites.includes(id)
    ? favorites.filter((favId) => favId !== id)
    : [...favorites, id];

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event("favorites-updated"));
  } catch (e) {
    console.error("Failed to save favorites to localStorage", e);
  }

  return updated;
}

/**
 * Ajoute un logement à la liste des favoris s'il n'y est pas déjà présent.
 * Déclenche un événement "favorites-updated".
 * @param {string} id - L'identifiant unique du logement.
 * @returns {string[]} La liste mise à jour des identifiants favoris.
 */
export function addFavorite(id: string): string[] {
  if (typeof window === "undefined") return [];
  const favorites = getFavoriteIds();
  if (favorites.includes(id)) return favorites;
  const updated = [...favorites, id];

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event("favorites-updated"));
  } catch (e) {
    console.error("Failed to save favorites to localStorage", e);
  }

  return updated;
}

/**
 * Supprime un logement de la liste des favoris.
 * Déclenche un événement "favorites-updated".
 * @param {string} id - L'identifiant unique du logement.
 * @returns {string[]} La liste mise à jour des identifiants favoris.
 */
export function removeFavorite(id: string): string[] {
  if (typeof window === "undefined") return [];
  const favorites = getFavoriteIds();
  if (!favorites.includes(id)) return favorites;
  const updated = favorites.filter((favId) => favId !== id);

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event("favorites-updated"));
  } catch (e) {
    console.error("Failed to save favorites to localStorage", e);
  }

  return updated;
}
