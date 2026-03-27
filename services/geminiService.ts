import { GoogleGenAI } from '@google/genai';
import { MarketInsight, SignalRequest, TradingSignal } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

const defaultSignal = (request: SignalRequest): TradingSignal => ({
  pair: request.pair,
  timeframe: request.timeframe,
  signal: 'neutral',
  confidence: 50,
  entryZone: 'Await cleaner setup',
  takeProfit: ['N/A'],
  stopLoss: 'N/A',
  pattern: 'No high-probability pattern confirmed',
  rationale: ['Unable to produce a reliable model response.'],
  riskNotes: ['Do not trade without independent confirmation.'],
  newsSummary: 'No verified news summary available.',
  sources: [],
});

const sanitizeSignal = (raw: any, request: SignalRequest, sources: { title: string; uri: string }[]): TradingSignal => {
  const allowedSignals = new Set(['strong_buy', 'buy', 'neutral', 'sell', 'strong_sell']);
  const signal = allowedSignals.has(raw?.signal) ? raw.signal : 'neutral';

  return {
    pair: request.pair,
    timeframe: request.timeframe,
    signal,
    confidence: Math.max(1, Math.min(99, Number(raw?.confidence) || 50)),
    entryZone: raw?.entryZone || 'N/A',
    takeProfit: Array.isArray(raw?.takeProfit) && raw.takeProfit.length > 0 ? raw.takeProfit.map(String) : ['N/A'],
    stopLoss: raw?.stopLoss || 'N/A',
    pattern: raw?.pattern || 'Pattern not identified',
    rationale: Array.isArray(raw?.rationale) && raw.rationale.length > 0 ? raw.rationale.map(String) : ['No rationale returned.'],
    riskNotes: Array.isArray(raw?.riskNotes) && raw.riskNotes.length > 0 ? raw.riskNotes.map(String) : ['Use strict risk controls.'],
    newsSummary: raw?.newsSummary || 'No news summary returned.',
    sources,
  };
};

export const generateCryptoSignal = async (request: SignalRequest): Promise<TradingSignal> => {
  const chartContext = request.chartImageBase64
    ? [
        {
          inlineData: {
            mimeType: request.chartImageMimeType || 'image/png',
            data: request.chartImageBase64,
          },
        },
      ]
    : [];

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: [
      ...chartContext,
      {
        text: `You are a disciplined crypto signal analyst.
Analyze ${request.pair} on ${request.timeframe} timeframe.
Risk profile: ${request.riskProfile}.
User chart notes: ${request.marketContext || 'None provided'}.
Use recent news and macro context from web search.
Return strict JSON with keys:
signal, confidence, entryZone, takeProfit(array), stopLoss, pattern, rationale(array), riskNotes(array), newsSummary.
Rules:
- confidence must be 1-99
- avoid guarantees and avoid claiming certainty
- include both technical and news logic
- keep rationale and riskNotes concise (max 5 bullets each).`,
      },
    ],
    config: {
      tools: [{ googleSearch: {} }],
      temperature: 0.35,
      responseMimeType: 'application/json',
    },
  });

  const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
  const sources = groundingChunks
    .filter((chunk: any) => chunk.web)
    .map((chunk: any) => ({
      title: chunk.web.title,
      uri: chunk.web.uri,
    }));

  const rawText = response.text?.trim();
  if (!rawText) {
    return defaultSignal(request);
  }

  try {
    const parsed = JSON.parse(rawText);
    return sanitizeSignal(parsed, request, sources);
  } catch {
    return {
      ...defaultSignal(request),
      newsSummary: rawText,
      sources,
    };
  }
};

// Legacy exports kept for compatibility with previous UI components.
export const getMarketInsights = async (location: string): Promise<MarketInsight> => ({
  location,
  trend: 'stable',
  medianPrice: 0,
  summary: 'Legacy market insight mode is deprecated in this crypto-focused build.',
  sources: [],
});

export const chatWithAssistant = async (_history: { role: string; content: string }[], message: string) => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `You are a crypto trading assistant. Keep answers educational and risk-aware. User message: ${message}`,
    config: {
      tools: [{ googleSearch: {} }],
    },
  });

  return {
    text: response.text || 'No response generated.',
    sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks || [],
  };
};
