import { PropertySummary, PropertyDetails } from "./types";
import mockData from "./mockProperties.json";

const API_BASE_URL = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

function slugify(title: string, id: string): string {
  const s = String(title || id).normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const slug = s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").replace(/-{2,}/g, "-");
  return slug || "property";
}

function deterministicPrice(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) {
    h = (h * 31 + id.charCodeAt(i)) >>> 0;
  }
  return 45 + (h % 256);
}

function mapMockToSummary(mock: any): PropertySummary {
  return {
    id: mock.id,
    slug: slugify(mock.title, mock.id),
    title: mock.title,
    description: mock.description || null,
    cover: mock.cover || null,
    location: mock.location || null,
    price_per_night: deterministicPrice(mock.id),
    rating_avg: mock.rating ? Number(mock.rating) : 0,
    ratings_count: 1,
    host: mock.host ? { name: mock.host.name, picture: mock.host.picture } : undefined,
  };
}

function mapMockToDetails(mock: any): PropertyDetails {
  return {
    ...mapMockToSummary(mock),
    pictures: mock.pictures || [],
    equipments: mock.equipments || [],
    tags: mock.tags || [],
  };
}

export async function getProperties(): Promise<{ properties: PropertySummary[]; isOffline: boolean }> {
  try {
    const res = await fetch(`${API_BASE_URL}/properties`, {
      cache: "no-store",
      signal: AbortSignal.timeout(3000),
    });

    if (!res.ok) {
      throw new Error(`API returned status ${res.status}`);
    }

    const data = await res.json();
    return { properties: data, isOffline: false };
  } catch (error) {
    console.warn("Backend API offline or failed, falling back to mock seed data:", error);
    const fallbackProperties = mockData.map(mapMockToSummary);
    return { properties: fallbackProperties, isOffline: true };
  }
}

export async function getPropertyById(id: string): Promise<{ property: PropertyDetails | null; isOffline: boolean }> {
  try {
    const res = await fetch(`${API_BASE_URL}/properties/${id}`, {
      cache: "no-store",
      signal: AbortSignal.timeout(3000),
    });

    if (!res.ok) {
      throw new Error(`API returned status ${res.status}`);
    }

    const data = await res.json();
    return { property: data, isOffline: false };
  } catch (error) {
    console.warn(`Backend API offline or failed for property ${id}, falling back to mock seed data:`, error);
    const foundMock = mockData.find((p) => p.id === id);
    if (!foundMock) {
      return { property: null, isOffline: true };
    }
    return { property: mapMockToDetails(foundMock), isOffline: true };
  }
}
