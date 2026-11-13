import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: { timeout: 15000 },
});

export const EMBEDDING_MODEL = "gemini-embedding-001";
export const EMBEDDING_DIMENSIONS = 768;

// 0.80 means "at least 80% similar". We can tune this later.
export const DUPLICATE_THRESHOLD = 0.8;

export function complaintText({ title, location, description }) {
  return `${title}. Location: ${location}. ${description}`;
}

export async function embedText(text) {
  let lastError;

  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const response = await ai.models.embedContent({
        model: EMBEDDING_MODEL,
        contents: text,
        config: { outputDimensionality: EMBEDDING_DIMENSIONS },
      });
      return response.embeddings[0].values;
    } catch (error) {
      lastError = error;
      console.error(`Embedding error (attempt ${attempt}):`, error?.message || error);
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }

  throw lastError;
}