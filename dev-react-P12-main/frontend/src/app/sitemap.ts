import { MetadataRoute } from "next";
import { getProperties } from "@/lib/api";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "http://localhost:3000";

  let properties: any[] = [];
  try {
    const data = await getProperties();
    properties = data.properties || [];
  } catch (error) {
    console.error("Failed to fetch properties for sitemap:", error);
  }

  const propertyUrls = properties.map((prop) => ({
    url: `${baseUrl}/logement/${prop.id}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/a-propos`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.5,
    },
    ...propertyUrls,
  ];
}
