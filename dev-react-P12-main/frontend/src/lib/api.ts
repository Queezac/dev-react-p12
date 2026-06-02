import { PropertySummary, PropertyDetails } from "./types";
const API_BASE_URL = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

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
