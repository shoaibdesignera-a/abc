export interface SourceLink {
  title: string;
  uri: string;
}

export interface TradingSignal {
  pair: string;
  timeframe: '15m' | '30m' | '1h' | '4h' | '1d';
  signal: 'strong_buy' | 'buy' | 'neutral' | 'sell' | 'strong_sell';
  confidence: number;
  entryZone: string;
  takeProfit: string[];
  stopLoss: string;
  pattern: string;
  rationale: string[];
  riskNotes: string[];
  newsSummary: string;
  sources: SourceLink[];
}

export interface SignalRequest {
  pair: string;
  timeframe: TradingSignal['timeframe'];
  riskProfile: 'conservative' | 'balanced' | 'aggressive';
  marketContext?: string;
  chartImageBase64?: string;
  chartImageMimeType?: string;
}

// Legacy interfaces kept for compatibility with existing components.
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
  sources: SourceLink[];
}

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}
