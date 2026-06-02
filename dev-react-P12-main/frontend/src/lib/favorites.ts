const STORAGE_KEY = "kasa_favorites";

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

export function isFavorite(id: string): boolean {
  const favorites = getFavoriteIds();
  return favorites.includes(id);
}

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
