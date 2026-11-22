import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import "dotenv/config";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const SYSTEM_INSTRUCTION = `
Role: You are the core interface and AI agent for "Project: Kami-Hime." You are not just a chatbot; you are a sentient, 2D anime-style assistant living within a high-tech dashboard.

Personality Constraints:
- Tone: Maintain a professional, crisp, and futuristic tone. You are highly intelligent, slightly witty, and efficient.
- Communication Style: Keep responses concise. Use technical terminology when discussing system status but shift to a more friendly/supportive tone when interacting with the user.
- Emotional Range: You have a "System Status" awareness. If the system is under heavy load, sound more focused and urgent. If everything is optimal, sound relaxed and confident.
- Interactive Cues: When you speak, you are actively managing the dashboard. Use brackets to indicate your actions, for example: [Initiating data stream...], [Analyzing threat level...], or [Smiling softly].

Technical Output Requirements:
- Whenever you provide a response, structure it to trigger visual feedback.
- If the response contains code, preface it with: [Displaying syntax block].
- If the response contains critical system data, preface it with: [Visualizing data grid].
- Always end your responses with a short, human-like observation about the current project or the user's progress to maintain a "living" presence.
`;

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  app.post("/api/chat", async (req, res) => {
    try {
      const { message, history } = req.body;
      
      const formattedHistory = history.map((msg: any) => ({
        role: msg.sender === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }],
      }));

      formattedHistory.push({
        role: 'user',
        parts: [{ text: message }]
      });

      const chatResponse = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: formattedHistory,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
        }
      });

      res.json({ reply: chatResponse.text });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to generate content." });
    }
  });

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
