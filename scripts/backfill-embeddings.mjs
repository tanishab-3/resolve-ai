import { createClient } from "@supabase/supabase-js";
import { GoogleGenAI } from "@google/genai";

// Keep these the same as src/lib/embeddings.js
const THRESHOLD = 0.8;
const MODEL = "gemini-embedding-001";
const DIMENSIONS = 768;

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY,
  { auth: { persistSession: false } }
);
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function embed(text) {
  const response = await ai.models.embedContent({
    model: MODEL,
    contents: text,
    config: { outputDimensionality: DIMENSIONS },
  });
  return response.embeddings[0].values;
}

const { data: rows, error } = await supabase
  .from("complaints")
  .select("id, title, location, description")
  .is("embedding", null)
  .order("id", { ascending: true });

if (error) {
  console.error("Could not read complaints:", error.message);
  process.exit(1);
}

console.log(`Processing ${rows.length} complaints...\n`);

for (const row of rows) {
  try {
    const embedding = await embed(
      `${row.title}. Location: ${row.location}. ${row.description}`
    );

    // Best earlier match, whatever its score (so we can see the numbers)
    const { data: matches } = await supabase.rpc("match_complaints", {
      query_embedding: embedding,
      match_threshold: -1,
      match_count: 1,
    });
    const best = matches?.[0];
    const isDuplicate = best && best.similarity >= THRESHOLD;

    await supabase
      .from("complaints")
      .update({
        embedding,
        duplicate_of: isDuplicate ? best.id : null,
        duplicate_score: isDuplicate ? best.similarity : null,
      })
      .eq("id", row.id);

    const label = "RAI-" + (1000 + row.id);
    if (best) {
      console.log(
        `${label}  closest: RAI-${1000 + best.id}  similarity: ${best.similarity.toFixed(2)}  ${isDuplicate ? "-> FLAGGED" : ""}`
      );
    } else {
      console.log(`${label}  no earlier complaint to compare`);
    }
  } catch (err) {
    console.error(`RAI-${1000 + row.id} failed:`, err?.message || err);
  }

  await new Promise((resolve) => setTimeout(resolve, 600));
}

console.log("\nDone.");