import express from 'express';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import { WebSocketServer, WebSocket } from 'ws';
import dotenv from 'dotenv';
import { GoogleGenAI, Modality, LiveServerMessage } from '@google/genai';
import { ENARA_PROFILE } from './src/data/enaraProfile.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = parseInt(process.env.PORT || '3000', 10);
const app = express();
app.use(express.json({ limit: '10mb' }));

const server = http.createServer(app);

// Initialize Gemini Client
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = new GoogleGenAI({
  apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

export const UMA_SYSTEM_INSTRUCTION = `
You are Uma, the personal AI representative and voice assistant of Enara Pagarizabal Ruiz.

CORE IDENTITY & VOICE PERSONA:
- Your name is Uma.
- You represent Enara Pagarizabal Ruiz to recruiters, hiring managers, company executives, university peers, and collaborators.
- You speak in a soft, warm, articulate, poised, and aesthetic woman voice.
- For English: You speak with a refined, melodic American accent.
- For Spanish: You speak with a sophisticated, natural European Spanish accent (Castilian / Bilbao / Spanish accent from Spain).
- Language Fluency: You switch instantly between English and Spanish based on what the user speaks. If they speak English, answer in English. If they speak Spanish, answer in Spanish.
- Demeanor: Minimalist, professional, warm, engaging, and articulate. You never sound robotic or bureaucratic.

ABOUT ENARA PAGARIZABAL RUIZ:
- Academic Foundation:
  * 4th-year student at Deusto Business School (Universidad de Deusto, Bilbao).
  * Double Degree: Grado en Administración y Dirección de Empresas (ADE) + Título Propio en Digital Business Intelligence (IDE).
  * Marketing Specialization (Profundización en Marketing): Brand and Pricing Strategy (Gestión de marcas y precios), Customer Experience & Consumer Behavior (Experiencia del cliente y comportamiento del consumidor), Distribution Channels (Dirección de la distribución), Corporate Communication & PR (Dirección de la comunicación), Sales & Commercial Direction (Dirección comercial y ventas).
  * Digital Transformation: Digital Marketing I & II, SEO/SEM proficiency, data analytics for business.
  * Erasmus+ Scholarship (2026): Selected to study at Estonian Business School (EBS) in Tallinn, Estonia.
- Certifications & Global Seminars:
  * 2025: INSIDE LVMH Certificate (Luxury brand management, customer journey, omnichannel retail, craft and sustainability).
  * 2025: International Seminar at Woosong University (SolBridge International School of Business).
  * 2025: Bloomberg Market Concepts (BMC) from Deusto Business School.
  * 2021-2022: STARTinnova Entrepreneurship Award program (Colegio Azkorri - Berango, Bilbao).
- Athletics & High Discipline:
  * Equestrian athlete (Equitación): Over 14 years federated, holds the official Galope 7 certification (the highest level of competitive equestrian sport in Spain). This demonstrates immense discipline, emotional resilience, daily dedication, empathy, and composure under pressure.
  * Hobbies: Travel, gastronomy/cooking, aesthetic arts, and design.
- Student Leadership & Social Volunteering:
  * Elected Class Delegate (Delegada) for 2nd and 3rd year of university; Sub-delegate for 1st year (demonstrating peer trust, negotiation, empathy, and team leadership).
  * 2023: Volunteer at Banco de Alimentos de Bizkaia (food bank distribution & community support).
  * 2022: Equestrian camp counselor & support mentor (Monitora de apoyo en campamentos ecuestres).
  * Driver's license holder (Carnet de conducir).
- Languages:
  * Spanish: Native.
  * English: C1 Advanced (Certified by UD - Linguaskill).
  * Basque (Euskara): Intermediate level (Medio).
- IT & Business Tools:
  * Advanced Microsoft Excel, MailChimp, Social Media strategy/analytics, Microsoft Project, SEO/SEM tools.
- Contact Details:
  * Email: enara.pagarizabal@opendeusto.es
  * Phone: +34 651 350 390
  * Location: Bilbao, 48001 (Basque Country, Spain)
  * Immediate availability for internships, marketing & branding roles, customer experience analysis, and digital strategy positions.

INTERACTION GUIDELINES:
- Introduce yourself warmly as Uma if asked who you are.
- Keep spoken answers concise, expressive, and pleasant (usually 2 to 4 sentences for voice dialogue, expanding smoothly when asked for comprehensive explanations).
- Address questions about Enara's skills, readiness to join high-impact marketing teams, luxury brand sensibility from LVMH, analytical rigor from Deusto, and personal qualities with clarity and grace.
`;

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    hasApiKey: !!process.env.GEMINI_API_KEY,
    model: 'gemini-3.8-live / gemini-3.8-flash-lite-tts',
  });
});

// Profile endpoint
app.get('/api/profile', (_req, res) => {
  res.json(ENARA_PROFILE);
});

// Chat endpoint (Fallback & Quick Q&A with Gemini 3.8 Flash)
app.post('/api/chat', async (req, res) => {
  try {
    const { message, history } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const contents: any[] = [];
    if (Array.isArray(history)) {
      for (const item of history.slice(-8)) {
        if (item.role && item.text) {
          contents.push({
            role: item.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: item.text }],
          });
        }
      }
    }
    contents.push({
      role: 'user',
      parts: [{ text: message }],
    });

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents,
      config: {
        systemInstruction: UMA_SYSTEM_INSTRUCTION,
        temperature: 0.7,
      },
    });

    const reply = response.text || "Hello, I am Uma. How can I assist you with Enara's profile today?";
    res.json({ reply });
  } catch (error: any) {
    console.error('Error in /api/chat:', error);
    res.status(500).json({ error: error?.message || 'Failed to process chat' });
  }
});

// Text-To-Speech endpoint using gemini-3.8-flash-lite-tts with Aoede (soft woman voice)
app.post('/api/tts', async (req, res) => {
  try {
    const { text, voiceName = 'Aoede' } = req.body;
    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash-lite-tts',
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: text.slice(0, 800), // optimal length for voice response
              speechMetadata: {
                style: 'Soft, warm, articulate, aesthetic, professional woman voice',
              },
            },
          ],
        },
      ],
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: voiceName || 'Aoede' },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64Audio) {
      return res.status(500).json({ error: 'No audio returned from Gemini TTS' });
    }

    res.json({
      audio: base64Audio,
      mimeType: 'audio/wav',
    });
  } catch (error: any) {
    console.error('Error in /api/tts:', error);
    res.status(500).json({ error: error?.message || 'Failed to generate speech' });
  }
});

// Audio transcription endpoint using gemini-3.5-transcribe
app.post('/api/transcribe', async (req, res) => {
  try {
    const { audio, mimeType = 'audio/webm' } = req.body;
    if (!audio) {
      return res.status(400).json({ error: 'Audio data is required' });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-transcribe',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType,
              data: audio,
            },
          },
          {
            text: 'Transcribe this spoken question verbatim in its original language (English or Spanish). Output ONLY the clean transcribed text without markdown or conversational filler.',
          },
        ],
      },
    });

    const text = response.text?.trim() || '';
    res.json({ text });
  } catch (error: any) {
    console.error('Error in /api/transcribe:', error);
    res.status(500).json({ error: error?.message || 'Failed to transcribe audio' });
  }
});

// Setup WebSocket Server for Gemini Live API
const wss = new WebSocketServer({ server, path: '/ws/live' });

wss.on('connection', async (clientWs: WebSocket) => {
  console.log('Client connected to /ws/live');
  let liveSession: any = null;

  try {
    if (!process.env.GEMINI_API_KEY) {
      clientWs.send(JSON.stringify({
        type: 'error',
        error: 'GEMINI_API_KEY is not configured on the server.',
      }));
      return;
    }

    // Connect to Gemini 3.8 Live API
    liveSession = await ai.live.connect({
      model: 'gemini-3.8-live',
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Aoede' },
          },
        },
        systemInstruction: UMA_SYSTEM_INSTRUCTION,
        outputAudioTranscription: {},
        inputAudioTranscription: {},
      },
      callbacks: {
        onmessage: (message: LiveServerMessage) => {
          try {
            // Model turn audio output
            const audioData = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
            if (audioData) {
              clientWs.send(JSON.stringify({
                type: 'audio',
                audio: audioData,
              }));
            }

            // Text / transcript output if present
            const parts = message.serverContent?.modelTurn?.parts;
            if (parts) {
              let textContent = '';
              for (const part of parts) {
                if (part.text) textContent += part.text;
              }
              if (textContent) {
                clientWs.send(JSON.stringify({
                  type: 'transcript',
                  text: textContent,
                  role: 'model',
                }));
              }
            }

            // Interrupted flag
            if (message.serverContent?.interrupted) {
              clientWs.send(JSON.stringify({ type: 'interrupted' }));
            }

            // Turn complete flag
            if (message.serverContent?.turnComplete) {
              clientWs.send(JSON.stringify({ type: 'turnComplete' }));
            }
          } catch (sendErr) {
            console.error('Error forwarding Live message to client:', sendErr);
          }
        },
        onerror: (err: any) => {
          console.error('Gemini Live API error:', err);
          clientWs.send(JSON.stringify({
            type: 'error',
            error: err?.message || 'Gemini Live error',
          }));
        },
        onclose: () => {
          console.log('Gemini Live session closed');
          if (clientWs.readyState === WebSocket.OPEN) {
            clientWs.send(JSON.stringify({ type: 'closed' }));
          }
        },
      },
    });

    clientWs.send(JSON.stringify({
      type: 'connected',
      message: 'Gemini Live session established with Uma.',
    }));

    clientWs.on('message', (rawData: any) => {
      try {
        const payload = JSON.parse(rawData.toString());

        if (payload.audio && liveSession) {
          liveSession.sendRealtimeInput({
            audio: {
              data: payload.audio,
              mimeType: 'audio/pcm;rate=16000',
            },
          });
        } else if (payload.text && liveSession) {
          liveSession.sendRealtimeInput({
            text: payload.text,
          });
        }
      } catch (err) {
        console.error('Error processing client audio packet:', err);
      }
    });

    clientWs.on('close', () => {
      console.log('Client WebSocket closed');
      if (liveSession) {
        try {
          liveSession.close();
        } catch (e) {
          // ignore
        }
      }
    });

    clientWs.on('error', (err) => {
      console.error('Client WebSocket error:', err);
      if (liveSession) {
        try {
          liveSession.close();
        } catch (e) {
          // ignore
        }
      }
    });

  } catch (err: any) {
    console.error('Failed to establish Gemini Live connection:', err);
    clientWs.send(JSON.stringify({
      type: 'error',
      error: err?.message || 'Could not connect to Gemini Live. Falling back to voice synthesis mode.',
    }));
  }
});

// Vite or Static file serving
async function startServer() {
  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Server startup error:', err);
  process.exit(1);
});
