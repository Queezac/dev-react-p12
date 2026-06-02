export interface Host {
  id?: number;
  name: string;
  picture: string | null;
  rating?: number;
}

export interface PropertySummary {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  cover: string | null;
  location: string | null;
  price_per_night: number;
  rating_avg: number;
  ratings_count?: number;
  host?: Host;
}

export interface PropertyDetails extends PropertySummary {
  pictures: string[];
  equipments: string[];
  tags: string[];
}
