import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';
import type { IncomingMessage, ServerResponse } from 'http';

// --- Start of API Logic copied from api/analyze.ts ---

const MAX_TRANSCRIPT_LENGTH = 10000;

// Allowed origins for CORS (development mode)
const ALLOWED_ORIGINS = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:3001'
];

// Simple rate limiter for development
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_MAX = 10;
const RATE_LIMIT_WINDOW = 60000; // 1 minute

function checkRateLimit(ip: string): { allowed: boolean; remaining: number; resetTime: number } {
  const now = Date.now();
  const entry = rateLimitStore.get(ip);

  if (!entry || now > entry.resetTime) {
    const resetTime = now + RATE_LIMIT_WINDOW;
    rateLimitStore.set(ip, { count: 1, resetTime });
    return { allowed: true, remaining: RATE_LIMIT_MAX - 1, resetTime };
  }

  if (entry.count >= RATE_LIMIT_MAX) {
    return { allowed: false, remaining: 0, resetTime: entry.resetTime };
  }

  entry.count++;
  return { allowed: true, remaining: RATE_LIMIT_MAX - entry.count, resetTime: entry.resetTime };
}

function getClientIp(req: IncomingMessage): string {
  const forwarded = req.headers['x-forwarded-for'];
  if (forwarded) {
    const ips = typeof forwarded === 'string' ? forwarded.split(',') : forwarded;
    return ips[0].trim();
  }
  return req.socket.remoteAddress || 'unknown';
}

const piiPatterns = [
  { name: 'email address', pattern: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/gi },
  { name: 'phone number', pattern: /\b(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b/gi },
  { name: 'credit card number', pattern: /\b(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|6(?:011|5[0-9]{2})[0-9]{12}|3[47][0-9]{13})\b/gi },
  { name: 'Social Security Number', pattern: /\b\d{3}-\d{2}-\d{4}\b/gi },
  { name: 'IP address', pattern: /\b((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\b/gi }
];

const analysisSchema = {
    type: Type.OBJECT,
    properties: {
        vibeTitle: { type: Type.STRING, description: 'A short, catchy, vibe-based title for the conversation analysis. (e.g., "Efficient but Impersonal," "Frustrating Loop," "Helpful and Proactive").' },
        keyFormulations: {
            type: Type.ARRAY,
            description: 'Identify the top 3 most important, high-level design takeaways that define the conversational dynamics. These are the core findings.',
            items: {
                type: Type.OBJECT,
                properties: {
                    title: { type: Type.STRING, description: 'A short title for the design takeaway. (e.g., "Clarity through Confirmation," "Lack of Empathy," "Failure to Understand Indirect Requests").' },
                    description: { type: Type.STRING, description: 'A one-sentence explanation of this design principle in the context of the transcript.' }
                },
                required: ['title', 'description']
            }
        },
        dashboardMetrics: {
            type: Type.ARRAY,
            description: 'An array of 6 specific conversational metrics.',
            items: {
                type: Type.OBJECT,
                properties: {
                    metric: { type: Type.STRING, description: 'The name of the metric. Must be one of: Rapport, Purpose, Flow, Implicature, Cohesion, Accommodation.' },
                    score: { type: Type.INTEGER, description: 'A score from 1-10 representing the performance on this metric.' },
                    keyFinding: { type: Type.STRING, description: 'A very short (2-5 word) summary of the key finding for this metric.' },
                    analysis: { type: Type.STRING, description: 'A one-sentence analysis explaining the score and key finding.' }
                },
                required: ['metric', 'score', 'keyFinding', 'analysis']
            }
        },
        keyMoment: {
            type: Type.OBJECT,
            description: 'The single most critical moment or exchange in the transcript that acts as a catalyst for the overall vibe.',
            properties: {
                transcriptSnippet: { type: Type.STRING, description: 'An exact quote of 1-3 turns from the transcript representing the key moment.' },
                analysis: { type: Type.STRING, description: 'A one or two-sentence analysis of why this moment is so pivotal.' }
            },
            required: ['transcriptSnippet', 'analysis']
        },
        annotatedTranscript: {
            type: Type.ARRAY,
            description: 'The original transcript, annotated with specific insights. Every turn must be included.',
            items: {
                type: Type.OBJECT,
                properties: {
                    speaker: { type: Type.STRING, description: 'The speaker of the turn (e.g., "User", "AI").' },
                    text: { type: Type.STRING, description: 'The exact text of the turn.' },
                    turnNumber: { type: Type.INTEGER, description: 'The number of the turn, starting from 1.' },
                    analysis: {
                        type: Type.ARRAY,
                        description: 'An array of highlighted analyses within this turn. Can be empty.',
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                keyFormulationTitle: { type: Type.STRING, description: 'The title of the Key Formulation this highlight relates to. Must be one of the titles from the top-level keyFormulations array.' },
                                tooltipText: { type: Type.STRING, description: 'A short (10-15 word) explanation of why this specific phrase is significant.' },
                                snippetToHighlight: { type: Type.STRING, description: 'The exact substring from the turn\'s text that should be highlighted.' }
                            },
                            required: ['keyFormulationTitle', 'tooltipText', 'snippetToHighlight']
                        }
                    }
                },
                required: ['speaker', 'text', 'turnNumber']
            }
        }
    },
    required: ['vibeTitle', 'keyFormulations', 'dashboardMetrics', 'keyMoment', 'annotatedTranscript']
};

const MASTER_PROMPT = `You are an expert Conversation Analyst at the "Vibe Check Lab." Your task is to analyze a provided transcript of a human-AI conversation and produce a detailed, structured analysis in JSON format.

Your analysis must be grounded in the following academic frameworks of linguistics and human-computer interaction:
- **Politeness Theory** (Brown & Levinson): How social face and rapport are managed.
- **Speech Act Theory** (Austin): The actions performed with words (e.g., promising, warning).
- **Conversation Analysis** (Sacks, Schegloff, Jefferson): The structure of conversation, like turn-taking and flow.
- **Conversational Implicature** (Grice): How meaning is conveyed beyond literal words.
- **Discourse Analysis** (Halliday & Hasan): How sentences are woven together to create cohesion.
- **Accommodation Theory** (Giles): How speakers adjust their communication style to signal social closeness or distance.

Your analysis process is as follows:
1.  **Read and Internalize:** Thoroughly read the entire transcript.
2.  **Identify Core Dynamics:** Based on the frameworks, identify the top 3 most critical design takeaways or "Key Formulations" that define the conversation's success or failure. These are the foundational insights.
3.  **Score and Analyze Metrics:** Evaluate the conversation against the 6 core dashboard metrics: Rapport, Purpose, Flow, Implicature, Cohesion, and Accommodation. Provide a score and a concise analysis for each.
4.  **Pinpoint the Catalyst:** Identify the single most important "Key Moment" in the transcript that best exemplifies the overall vibe.
5.  **Annotate the Transcript:** Go back through the transcript. Find the 5-7 most compelling phrases across the entire conversation that are strong examples of one of your 3 Key Formulations. Create annotations for these specific phrases. Most turns will not have an annotation.
6.  **Format as JSON:** Structure your entire analysis into a single, valid JSON object according to the provided schema. Do not output any text outside of the JSON object.

The user will provide the transcript. Your entire output MUST be the JSON analysis.`;


function setSecurityHeaders(res: ServerResponse): void {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self' data:;"
  );
}

function setCorsHeaders(req: IncomingMessage, res: ServerResponse): void {
  const origin = req.headers.origin;
  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
  } else if (!origin) {
    res.setHeader('Access-Control-Allow-Origin', ALLOWED_ORIGINS[0]);
  }
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

async function handleApiRequest(req: IncomingMessage, res: ServerResponse) {
    // Set security headers
    setSecurityHeaders(res);

    // Set CORS headers
    setCorsHeaders(req, res);

    // Rate limiting check
    const clientIp = getClientIp(req);
    const rateLimitResult = checkRateLimit(clientIp);

    if (!rateLimitResult.allowed) {
      const retryAfter = Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000);
      res.writeHead(429, {
        'Content-Type': 'application/json',
        'Retry-After': retryAfter.toString(),
        'X-RateLimit-Limit': RATE_LIMIT_MAX.toString(),
        'X-RateLimit-Remaining': '0',
        'X-RateLimit-Reset': rateLimitResult.resetTime.toString()
      });
      res.end(JSON.stringify({
        error: 'Too many requests. Please try again later.',
        retryAfter
      }));
      return;
    }

    // Add rate limit headers
    res.setHeader('X-RateLimit-Limit', RATE_LIMIT_MAX.toString());
    res.setHeader('X-RateLimit-Remaining', rateLimitResult.remaining.toString());
    res.setHeader('X-RateLimit-Reset', rateLimitResult.resetTime.toString());

    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });

    req.on('end', async () => {
        try {
            const { transcript } = JSON.parse(body);

            if (!transcript || typeof transcript !== 'string' || transcript.trim().length < 25) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'A valid transcript with at least 25 characters is required.' }));
                return;
            }
            if (transcript.length > MAX_TRANSCRIPT_LENGTH) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: `Transcript exceeds the maximum length of ${MAX_TRANSCRIPT_LENGTH} characters.` }));
                return;
            }
            for (const pii of piiPatterns) {
                pii.pattern.lastIndex = 0;
                if (pii.pattern.test(transcript)) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: `Potential ${pii.name} detected. Please remove all personal information.` }));
                    return;
                }
            }
            if (!process.env.API_KEY) {
                console.error('API_KEY is not set in environment variables. Please create a .env file in the project root.');
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Server configuration error: API_KEY is missing.' }));
                return;
            }

            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: transcript,
                config: {
                    systemInstruction: MASTER_PROMPT,
                    responseMimeType: 'application/json',
                    responseSchema: analysisSchema,
                },
            });

            const responseText = response.text;
            if (!responseText) {
                throw new Error('Received an empty response from the analysis service.');
            }

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(responseText);

        } catch (error: any) {
            console.error('Error processing request in Vite middleware:', error);
            let errorMessage = 'An error occurred while communicating with the AI analysis service.';
            if (error.message && error.message.includes('API key not valid')) {
                errorMessage = 'The API key configured on the server is invalid.';
                res.writeHead(401, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: errorMessage }));
                return;
            }
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: errorMessage }));
        }
    });
}

// --- End of API Logic ---

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '');

  // Make API_KEY available to the process
  process.env.API_KEY = env.API_KEY;

  return {
    server: {
      port: 3000,
      host: '0.0.0.0',
      // The proxy is no longer needed in development, as the API is handled by middleware.
    },
    plugins: [
      react(),
      {
        name: 'vibe-check-api-middleware',
        configureServer(server) {
          server.middlewares.use((req, res, next) => {
            if (req.url === '/api/analyze' && req.method === 'POST') {
              handleApiRequest(req, res);
            } else {
              next();
            }
          });
        },
      },
    ],
    resolve: {
      alias: {
        // FIX: Replace `__dirname` with a URL-based path for ES module compatibility.
        // `__dirname` is a CommonJS variable and is not available in ES modules by default.
        '@': fileURLToPath(new URL('.', import.meta.url)),
      }
    }
  };
});
