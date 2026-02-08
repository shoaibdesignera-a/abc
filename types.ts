
export interface Property {
  id: string;
  title: string;
  price: number;
  location: string;
  beds: number;
  baths: number;
  sqft: number;
  imageUrl: string;
  type: 'Villa' | 'Apartment' | 'Penthouse' | 'Mansion';
  description?: string;
}

export interface MarketInsight {
  location: string;
  trend: 'up' | 'down' | 'stable';
  medianPrice: number;
  summary: string;
  sources: { title: string; uri: string }[];
}

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}
