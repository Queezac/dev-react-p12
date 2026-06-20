import { getBackendOrigin } from "./config";

/**
 * Formate l'URL d'une image pour s'assurer qu'elle est valide et pointe vers le serveur.
 * @param {string | null} [url] - L'URL de l'image à formater.
 * @returns {string} L'URL finale valide pour l'affichage de l'image.
 */
export function formatImageUrl(url?: string | null): string {
  if (!url) return "/placeholder-house.jpg";
  if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("data:")) {
    return url;
  }
  if (url.startsWith("/")) {
    return `${getBackendOrigin()}${url}`;
  }
  return url;
}

/**
 * Calcule l'index de l'image suivante dans le diaporama (bouclage).
 * @param {number} currentIndex - L'index de l'image actuellement affichée.
 * @param {number} len - Le nombre total d'images dans le diaporama.
 * @returns {number} L'index de l'image suivante.
 */
export function getNextIndex(currentIndex: number, len: number): number {
  if (len <= 0) return 0;
  return (currentIndex + 1) % len;
}

/**
 * Calcule l'index de l'image précédente dans le diaporama (bouclage).
 * @param {number} currentIndex - L'index de l'image actuellement affichée.
 * @param {number} len - Le nombre total d'images dans le diaporama.
 * @returns {number} L'index de l'image précédente.
 */
export function getPrevIndex(currentIndex: number, len: number): number {
  if (len <= 0) return 0;
  return (currentIndex - 1 + len) % len;
}
