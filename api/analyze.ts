import http from 'http';
import type { IncomingMessage, ServerResponse } from 'http';
import { GoogleGenAI, Type } from '@google/genai';
import fs from 'fs';
import path from 'path';
import url from 'url';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MAX_TRANSCRIPT_LENGTH = 10000;
const PORT = process.env.PORT || 3001;

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

const mimeTypes: { [key: string]: string } = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
};

async function handleApiRequest(req: IncomingMessage, res: ServerResponse) {
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
                console.error('API_KEY is not set in environment variables.');
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Server configuration error.' }));
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
            console.error('Error processing request:', error);
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

function serveStaticFile(req: IncomingMessage, res: ServerResponse) {
    const parsedUrl = url.parse(req.url!);
    const pathname = parsedUrl.pathname || '/';

    // The root of our static files is one level up from the `api` directory inside `dist`.
    const staticFileRoot = path.resolve(__dirname, '..');
    
    // Prevent path traversal attacks
    const safePathSuffix = path.normalize(pathname).replace(/^(\.\.[\/\\])+/, '');
    let staticFilePath = path.join(staticFileRoot, safePathSuffix);

    fs.stat(staticFilePath, (err, stats) => {
        // Fallback to serving index.html for SPA routing
        const serveIndex = () => {
            const indexPath = path.join(staticFileRoot, 'index.html');
            fs.readFile(indexPath, (indexErr, indexData) => {
                if (indexErr) {
                    console.error("CRITICAL: Could not read index.html from path:", indexPath, indexErr);
                    res.writeHead(500, { 'Content-Type': 'text/plain' });
                    res.end('Internal Server Error: App entry point not found.');
                } else {
                    res.writeHead(200, { 'Content-Type': 'text/html' });
                    res.end(indexData);
                }
            });
        };

        if (err) {
            // If stat fails (e.g., file not found for a route like /about), serve index.
            serveIndex();
            return;
        }

        if (stats.isDirectory()) {
            // If the path is a directory, also serve index.
            serveIndex();
            return;
        }

        // Otherwise, it's a file, so serve it.
        fs.readFile(staticFilePath, (fileErr, data) => {
            if (fileErr) {
                serveIndex();
            } else {
                const ext = path.parse(staticFilePath).ext;
                res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
                res.end(data);
            }
        });
    });
}

const server = http.createServer((req: IncomingMessage, res: ServerResponse) => {
    if (req.url?.startsWith('/api/')) {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

        if (req.method === 'OPTIONS') {
            res.writeHead(204);
            res.end();
            return;
        }

        if (req.url === '/api/analyze' && req.method === 'POST') {
            handleApiRequest(req, res);
        } else {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'API route not found' }));
        }
    } else {
        serveStaticFile(req, res);
    }
});

server.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
});
