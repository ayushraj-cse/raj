import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Initialize Gemini SDK with User-Agent header as required
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// App configuration and links
app.get('/api/app-info', (req, res) => {
  const appUrl = process.env.APP_URL || 'https://ais-pre-z5og2sx3u3cjxmeugt57qq-38486606256.asia-southeast1.run.app';
  res.json({
    appUrl,
    hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
    serverTime: new Date().toISOString(),
  });
});

// AI Commute Copilot for Day Scholar Students
app.post('/api/commute-copilot', async (req, res) => {
  try {
    const { prompt, transitMode, origin, destination, weather, urgency } = req.body;

    if (!process.env.GEMINI_API_KEY) {
      // Fallback response with helpful realistic day scholar advice
      return res.json({
        reply: `Here's your smart commuter tip: For your travel from ${origin || 'home'} to ${destination || 'campus'} via ${transitMode || 'public transit'}, maintain a 15-20 min buffer for campus gate security queues. Keep your student ID & metro card in the front bag pocket for zero-fumble tap-in.`,
        tips: [
          'Take the second coach from the back in the Metro for quickest exit at Campus Station Gate 2.',
          'Carry a lightweight 10,000mAh powerbank; screen brightness on navigation drains battery fast.',
          'Review formula flashcards or listen to lecture audio during the 35-minute transit window.'
        ],
        bufferMins: 20
      });
    }

    const systemInstruction = `You are "Campus Commute Copilot", an empathetic, highly practical daily transit advisor specifically built for Day Scholar college students who commute between home and university every day.
Your advice must be concise, realistic, student-budget conscious, and actionable:
1. Recommend smart departure timing, rush-hour survival tips, and peak bottleneck bypasses.
2. Give actionable bag-check reminders (student ID card, bus pass, charger, rain gear if cloudy, packed lunch, umbrella).
3. Suggest commute productivity hacks (best audiobooks, quick revision techniques on bus/train, motion sickness avoidance).
4. Safety and budget tips (splitting rides, monthly transit pass savings, campus gate walking times).
Keep response under 120 words with 3 concise bullet tips.`;

    const contents = `Student commute query:
- User Question: ${prompt || 'Help me plan my daily college commute'}
- Transit Mode: ${transitMode || 'Campus Bus & Metro'}
- From: ${origin || 'City Center / Home'}
- To: ${destination || 'University Campus / Lecture Hall'}
- Current Weather: ${weather || 'Normal'}
- Urgency: ${urgency || 'Regular morning class'}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    const replyText = response.text || '';
    res.json({
      reply: replyText,
      success: true,
    });
  } catch (error: any) {
    console.error('Error in /api/commute-copilot:', error);
    res.status(500).json({
      error: 'Failed to generate transit advice',
      details: error.message,
      fallback: 'Make sure to leave at least 25 minutes before lecture start to account for bus frequency variations and campus entrance walking time.'
    });
  }
});

// Setup Vite middlewares in dev mode, or serve static files in production
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, () => {
    console.log(`CampusCommute server listening on http://0.0.0.0:${port}`);
  });
}

startServer();
