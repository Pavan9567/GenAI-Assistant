import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { retrieveRelevant } from "./utils/retriever.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

// simple in-memory session store
const sessions = {};

app.post("/api/chat", async (req, res) => {
  try {
    const { sessionId, message } = req.body;

    if (!sessionId || !message) {
      return res.status(400).json({ error: "Invalid input" });
    }

    const retrieved = await retrieveRelevant(message);

    // fallback if nothing relevant
    if (!retrieved.length) {
      return res.json({
        reply:
          "I don’t have enough information in the knowledge base to answer that.",
        retrievedChunks: 0,
        tokensUsed: 0
      });
    }

    const contextText = retrieved
      .map((c, i) => `${i + 1}. ${c.content}`)
      .join("\n");

    // conversation history (last 5)
    sessions[sessionId] = sessions[sessionId] || [];
    const history = sessions[sessionId].slice(-5);

    const prompt = `
        You are an HR assistant.

        Use ONLY the context below.
        If answer not present, say you don’t know.

        CONTEXT:
        ${contextText}

        HISTORY:
        ${history.map(h => `User: ${h.user}\nAssistant: ${h.bot}`).join("\n")}

        USER QUESTION:
        ${message}

        ANSWER:
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt
    });

    const reply = response.text;

    sessions[sessionId].push({ user: message, bot: reply });

    res.json({
      reply,
      tokensUsed: response.usageMetadata?.totalTokenCount || 0,
      retrievedChunks: retrieved.length
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Server error" });
  }
});

app.listen(process.env.PORT || 5000, () =>
  console.log("Server running")
);