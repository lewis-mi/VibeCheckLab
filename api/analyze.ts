import type { IncomingMessage, ServerResponse } from 'http';
import { GoogleGenAI, Type } from '@google/genai';

const MAX_TRANSCRIPT_LENGTH = 10000;

const piiPatterns = [
  { name: 'email address', pattern: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/gi },
  {
    name: 'phone number',
    pattern: /\b(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b/gi,
  },
  {
    name: 'credit card number',
    pattern:
      /\b(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|6(?:011|5[0-9]{2})[0-9]{12}|3[47][0-9]{13})\b/gi,
  },
  { name: 'Social Security Number', pattern: /\b\d{3}-\d{2}-\d{4}\b/gi },
  {
    name: 'IP address',
    pattern: /\b((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\b/gi,
  },
];

const analysisSchema = {
  type: Type.OBJECT,
  properties: {
    vibeTitle: {
      type: Type.STRING,
      description:
        'A short, catchy, vibe-based title for the conversation analysis. (e.g., "Efficient but Impersonal," "Frustrating Loop," "Helpful and Proactive").',
    },
    keyFormulations: {
      type: Type.ARRAY,
      description:
        'Identify the top 3 most important, high-level design takeaways that define the conversational dynamics. These are the core findings.',
      items: {
        type: Type.OBJECT,
        properties: {
          title: {
            type: Type.STRING,
            description:
              'A short title for the design takeaway. (e.g., "Clarity through Confirmation," "Lack of Empathy," "Failure to Understand Indirect Requests").',
          },
          description: {
            type: Type.STRING,
            description: 'A one-sentence explanation of this design principle in the context of the transcript.',
          },
        },
        required: ['title', 'description'],
      },
    },
    dashboardMetrics: {
      type: Type.ARRAY,
      description: 'An array of 6 specific conversational metrics.',
      items: {
        type: Type.OBJECT,
        properties: {
          metric: {
            type: Type.STRING,
            description:
              'The name of the metric. Must be one of: Rapport, Purpose, Flow, Implicature, Cohesion, Accommodation.',
          },
          score: { type: Type.INTEGER, description: 'A score from 1-10 representing the performance on this metric.' },
          keyFinding: {
            type: Type.STRING,
            description: 'A very short (2-5 word) summary of the key finding for this metric.',
          },
          analysis: {
            type: Type.STRING,
            description: 'A one-sentence analysis explaining the score and key finding.',
          },
        },
        required: ['metric', 'score', 'keyFinding', 'analysis'],
      },
    },
    keyMoment: {
      type: Type.OBJECT,
      description:
        'The single most critical moment or exchange in the transcript that acts as a catalyst for the overall vibe.',
      properties: {
        transcriptSnippet: {
          type: Type.STRING,
          description: 'An exact quote of 1-3 turns from the transcript representing the key moment.',
        },
        analysis: {
          type: Type.STRING,
          description: 'A one or two-sentence analysis of why this moment is so pivotal.',
        },
      },
      required: ['transcriptSnippet', 'analysis'],
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
                keyFormulationTitle: {
                  type: Type.STRING,
                  description:
                    'The title of the Key Formulation this highlight relates to. Must be one of the titles from the top-level keyFormulations array.',
                },
                tooltipText: {
                  type: Type.STRING,
                  description: 'A short (10-15 word) explanation of why this specific phrase is significant.',
                },
                snippetToHighlight: {
                  type: Type.STRING,
                  description: 'The exact substring from the turn\'s text that should be highlighted.',
                },
              },
              required: ['keyFormulationTitle', 'tooltipText', 'snippetToHighlight'],
            },
          },
        },
        required: ['speaker', 'text', 'turnNumber'],
      },
    },
  },
  required: ['vibeTitle', 'keyFormulations', 'dashboardMetrics', 'keyMoment', 'annotatedTranscript'],
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

class ApiError extends Error {
  statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'ApiError';
  }
}

function getExistingBody(req: IncomingMessage): unknown {
  const body = (req as any).body;
  if (body === undefined || body === null) {
    return undefined;
  }

  if (typeof body === 'string') {
    return body;
  }

  if (typeof body === 'object') {
    return body;
  }

  return undefined;
}

async function readRequestBody(req: IncomingMessage): Promise<unknown> {
  const existingBody = getExistingBody(req);
  if (existingBody !== undefined) {
    return existingBody;
  }

  return await new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk.toString();
    });
    req.on('end', () => resolve(body));
    req.on('error', reject);
  });
}

function parseJsonBody(body: unknown): Record<string, unknown> {
  if (body === undefined) {
    return {};
  }

  if (typeof body === 'object' && body !== null) {
    return body as Record<string, unknown>;
  }

  if (typeof body === 'string') {
    if (body.trim().length === 0) {
      return {};
    }

    try {
      return JSON.parse(body);
    } catch (error) {
      throw new ApiError(400, 'Request body must be valid JSON.');
    }
  }

  return {};
}

function validateTranscript(transcriptValue: unknown): string {
  if (typeof transcriptValue !== 'string' || transcriptValue.trim().length < 25) {
    throw new ApiError(400, 'A valid transcript with at least 25 characters is required.');
  }

  const transcript = transcriptValue;

  if (transcript.length > MAX_TRANSCRIPT_LENGTH) {
    throw new ApiError(400, `Transcript exceeds the maximum length of ${MAX_TRANSCRIPT_LENGTH} characters.`);
  }

  for (const pii of piiPatterns) {
    pii.pattern.lastIndex = 0;
    if (pii.pattern.test(transcript)) {
      throw new ApiError(400, `Potential ${pii.name} detected. Please remove all personal information.`);
    }
  }

  return transcript;
}

async function performAnalysis(transcript: string): Promise<string> {
  if (!process.env.API_KEY) {
    console.error('API_KEY is not set in environment variables.');
    throw new ApiError(500, 'Server configuration error.');
  }

  try {
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
      throw new ApiError(502, 'Received an empty response from the analysis service.');
    }

    return responseText;
  } catch (error: any) {
    if (error?.message && typeof error.message === 'string' && error.message.includes('API key not valid')) {
      throw new ApiError(401, 'The API key configured on the server is invalid.');
    }
    throw error;
  }
}

function mapToApiError(error: unknown): ApiError {
  if (error instanceof ApiError) {
    return error;
  }

  if (error instanceof SyntaxError) {
    return new ApiError(400, 'Request body must be valid JSON.');
  }

  const statusCode = typeof (error as any)?.statusCode === 'number' ? (error as any).statusCode : 500;

  if (error && typeof (error as any).message === 'string') {
    const message = (error as any).message as string;
    if (message.includes('API key not valid')) {
      return new ApiError(401, 'The API key configured on the server is invalid.');
    }
    if (statusCode !== 500) {
      return new ApiError(statusCode, message);
    }
  }

  return new ApiError(500, 'An error occurred while communicating with the AI analysis service.');
}

function sendJsonResponse(res: ServerResponse, statusCode: number, payload: unknown) {
  if (!res.headersSent) {
    res.statusCode = statusCode;
    res.setHeader('Content-Type', 'application/json');
  }
  res.end(typeof payload === 'string' ? payload : JSON.stringify(payload));
}

export async function handleApiRequest(req: IncomingMessage, res: ServerResponse): Promise<void> {
  try {
    const rawBody = await readRequestBody(req);
    const body = parseJsonBody(rawBody);
    const { transcript } = body as { transcript?: unknown };
    const validatedTranscript = validateTranscript(transcript);
    const responseText = await performAnalysis(validatedTranscript);
    sendJsonResponse(res, 200, responseText);
  } catch (error) {
    console.error('Error processing analysis request:', error);
    const apiError = mapToApiError(error);
    sendJsonResponse(res, apiError.statusCode, { error: apiError.message });
  }
}

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  if (req.method !== 'POST') {
    sendJsonResponse(res, 405, { error: 'Method Not Allowed' });
    return;
  }

  await handleApiRequest(req, res);
}
