import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Initialize Gemini client with proper telemetry header
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });

  // API endpoint to generate high-quality AI prompts from review remarks
  app.post("/api/generate-prompt", async (req, res) => {
    try {
      const { problems, screenName, projectInfo } = req.body;
      if (!problems || !Array.isArray(problems) || problems.length === 0) {
        return res.status(400).json({ error: "Please provide a list of issues to convert." });
      }

      const systemInstruction = `You are a Senior Software Architect and prompt engineer. Your job is to convert a list of user interface and functional software review issues into a highly detailed, professional, and actionable code-correction prompt for an AI coding assistant.
The output prompt should direct the developer to resolve ONLY the issues mentioned, while strictly maintaining the design guidelines, original UI, and existing business logic. Avoid modifying other files or unrelated blocks. Use clean technical language and precise steps.`;

      const contents = `Convert the following visual software review feedback for Screen: "${screenName || 'Interface'}" inside the project: "${projectInfo?.name || 'BGrowth Review Project'}" (Module: ${projectInfo?.module || 'General'}) into a professional AI developer implementation prompt.

List of Issues to Fix:
${problems.map((p, i) => `${i + 1}. [Category: ${p.category || 'General'}] (${p.priority || 'Medium'} Priority) - Title: "${p.title}"
   Description: ${p.description || 'No description provided'}`).join("\n")}

Create a beautifully styled Markdown instruction document containing:
- **Title**: Actionable implementation prompt for ${screenName || 'Interface'}
- **Context**: Summary of issues and priority
- **Implementation Instructions**: Direct, structured steps for an AI Coder (e.g., Gemini/Claude) explaining precisely what needs to be changed for each point.
- **Safety Guidelines**: Strict instructions to avoid regressions, maintain existing classes/components, and perform local visual validation.
Keep the tone constructive and professional.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents,
        config: {
          systemInstruction,
          temperature: 0.15,
        }
      });

      res.json({ prompt: response.text });
    } catch (error: any) {
      console.error("Gemini Generation Error:", error);
      res.status(500).json({ error: error.message || "Failed to generate prompt from Gemini API." });
    }
  });

  // Serve static assets or mount Vite middleware depending on the environment
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
    console.log(`BGrowth Review Studio Server running on port ${PORT}`);
  });
}

startServer();
