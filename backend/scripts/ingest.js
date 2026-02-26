import fs from "fs";
import path from "path";
import { chunkText } from "../utils/chunker.js";
import { getEmbedding } from "../utils/embeddings.js";

const docsPath = path.resolve("data/docs.json");
const vectorStorePath = path.resolve("data/vector_store.json");

async function ingest() {
  console.log("Starting ingestion...");

  const raw = fs.readFileSync(docsPath, "utf-8");
  const docs = JSON.parse(raw);

  const vectorStore = [];

  for (const doc of docs) {
    const chunks = chunkText(doc.content);

    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];

      console.log(`Embedding: ${doc.title} chunk ${i}`);

      const embedding = await getEmbedding(chunk);

      vectorStore.push({
        id: `${doc.id}_${i}`,
        title: doc.title,
        content: chunk,
        embedding
      });
    }
  }

  fs.writeFileSync(vectorStorePath, JSON.stringify(vectorStore, null, 2));

  console.log("Ingestion complete ✅");
}

ingest();