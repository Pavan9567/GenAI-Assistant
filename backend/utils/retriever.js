import fs from "fs";
import path from "path";
import { cosineSimilarity } from "./vector_math.js";
import { getEmbedding } from "./embeddings.js";

const storePath = path.resolve("data/vector_store.json");

export async function retrieveRelevant(query, topK = 3, threshold = 0.5) {
  const store = JSON.parse(fs.readFileSync(storePath, "utf-8"));

  const queryVector = await getEmbedding(query);

  const scored = store
    .map(doc => ({
      ...doc,
      score: cosineSimilarity(queryVector, doc.embedding)
    }))
    .filter(d => d.score >= threshold)
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);
  
  console.log(store.map(d => ({
      title: d.title,
      score: cosineSimilarity(queryVector, d.embedding)
    }))
  );

  return scored;
}