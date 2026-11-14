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
// Embeds many texts at once (20 per request)
export async function embedMany(texts) {
  const vectors = [];

  for (let i = 0; i < texts.length; i += 20) {
    const batch = texts.slice(i, i + 20);
    let response;

    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        response = await ai.models.embedContent({
          model: EMBEDDING_MODEL,
          contents: batch,
          config: { outputDimensionality: EMBEDDING_DIMENSIONS },
        });
        break;
      } catch (error) {
        if (attempt === 2) throw error;
        await new Promise((resolve) => setTimeout(resolve, 1500));
      }
    }

    for (const item of response.embeddings) vectors.push(item.values);
  }

  return vectors;
}