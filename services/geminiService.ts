
import { GoogleGenAI, Type } from "@google/genai";
import { MarketInsight } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getMarketInsights = async (location: string): Promise<MarketInsight> => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Provide current real estate market insights for ${location}. Include price trends and a summary.`,
    config: {
      tools: [{ googleSearch: {} }],
    },
  });

  const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
  const sources = groundingChunks
    .filter((chunk: any) => chunk.web)
    .map((chunk: any) => ({
      title: chunk.web.title,
      uri: chunk.web.uri,
    }));

  // Simulating extraction of data from text since it's not JSON due to googleSearch
  const text = response.text || "Market data unavailable.";
  const trend = text.toLowerCase().includes("rising") || text.toLowerCase().includes("up") ? "up" : 
                text.toLowerCase().includes("falling") || text.toLowerCase().includes("down") ? "down" : "stable";

  return {
    location,
    trend: trend as any,
    medianPrice: 0, // In a real app we'd regex this or use a better prompt
    summary: text,
    sources,
  };
};

export const chatWithAssistant = async (history: { role: string; content: string }[], message: string) => {
  const chat = ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: 'You are the MM&GG Real Estate Luxury Advisor. You help high-net-worth individuals find properties, understand market dynamics, and make investment decisions. Be professional, elegant, and helpful. Use Google Search to provide up-to-date market info.',
      tools: [{ googleSearch: {} }]
    },
  });

  const response = await chat.sendMessage({ message });
  return {
    text: response.text,
    sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
  };
};
