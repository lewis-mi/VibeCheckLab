import { GoogleGenAI, Type } from '@google/genai';
import type { AnalysisResult, AnnotatedTurn, DashboardMetric, DeepDiveConcept, HighlightAnalysis, KeyFormulation, KeyMoment } from '../types';

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
        deepDive: {
            type: Type.ARRAY,
            description: 'An array of 6 deep-dive academic explanations for each dashboard metric.',
            items: {
                type: Type.OBJECT,
                properties: {
                    concept: { type: Type.STRING, description: 'The name of the academic concept (must match a dashboard metric).' },
                    explanation: { type: Type.STRING, description: 'A brief, academic definition of the concept.' },
                    analysis: { type: Type.STRING, description: 'A one-sentence analysis of how this concept applies to the provided transcript.' },
                    source: { type: Type.STRING, description: 'The primary academic source for this concept (e.g., "Brown & Levinson (1987)").' }
                },
                required: ['concept', 'explanation', 'analysis', 'source']
            }
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
    required: ['vibeTitle', 'keyFormulations', 'dashboardMetrics', 'keyMoment', 'deepDive', 'annotatedTranscript']
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
5.  **Annotate the Transcript:** Go back through the transcript turn-by-turn. For each turn, identify specific phrases or sentences ("snippets") that are strong examples of one of your 3 Key Formulations. Create annotations for these snippets.
6.  **Provide Academic Context:** For each of the 6 core metrics, provide a brief academic definition and explain how it applies to this specific transcript.
7.  **Format as JSON:** Structure your entire analysis into a single, valid JSON object according to the provided schema. Do not output any text outside of the JSON object.

The user will provide the transcript. Your entire output MUST be the JSON analysis.`;

const repairAndValidateAnalysis = (data: unknown): AnalysisResult => {
  const result: Partial<AnalysisResult> = (data ?? {}) as Partial<AnalysisResult>;

  result.vibeTitle = typeof result.vibeTitle === 'string' ? result.vibeTitle : 'Analysis Incomplete';

  result.keyFormulations = Array.isArray(result.keyFormulations)
    ? result.keyFormulations.filter((f: any): f is KeyFormulation => f && typeof f.title === 'string' && typeof f.description === 'string')
    : [];

  result.annotatedTranscript = Array.isArray(result.annotatedTranscript)
    ? result.annotatedTranscript
        .filter((t: any): t is AnnotatedTurn => t && typeof t.speaker === 'string' && typeof t.text === 'string' && typeof t.turnNumber === 'number')
        .map((turn: AnnotatedTurn) => {
          if (Array.isArray(turn.analysis) && turn.analysis.length > 0) {
            const sortedAnalyses = [...turn.analysis]
              .filter((a) => a && typeof a.snippetToHighlight === 'string' && turn.text.includes(a.snippetToHighlight))
              .sort((a, b) => {
                const indexA = turn.text.indexOf(a.snippetToHighlight);
                const indexB = turn.text.indexOf(b.snippetToHighlight);
                return indexA - indexB;
              });

            const validAnalyses: HighlightAnalysis[] = [];
            let lastIndex = 0;

            for (const analysisItem of sortedAnalyses) {
              const snippetIndex = turn.text.indexOf(analysisItem.snippetToHighlight, lastIndex);

              if (snippetIndex !== -1) {
                validAnalyses.push(analysisItem);
                lastIndex = snippetIndex + analysisItem.snippetToHighlight.length;
              }
            }

            turn.analysis = validAnalyses;
          } else {
            turn.analysis = [];
          }

          return turn;
        })
    : [];

  result.dashboardMetrics = Array.isArray(result.dashboardMetrics)
    ? result.dashboardMetrics.filter((m: any): m is DashboardMetric => m && typeof m.metric === 'string' && typeof m.keyFinding === 'string')
    : [];

  result.deepDive = Array.isArray(result.deepDive)
    ? result.deepDive.filter((d: any): d is DeepDiveConcept => d && typeof d.concept === 'string' && typeof d.analysis === 'string')
    : [];

  result.keyMoment = result.keyMoment && typeof (result.keyMoment as KeyMoment).transcriptSnippet === 'string'
    ? result.keyMoment
    : { transcriptSnippet: 'N/A', analysis: 'Could not determine a key moment.' };

  if (result.keyFormulations.length === 0 || result.dashboardMetrics.length < 6 || result.annotatedTranscript.length === 0) {
    throw new Error('Received incomplete analysis from the analysis service. Critical sections like formulations or metrics are missing.');
  }

  return result as AnalysisResult;
};

const parseJsonResponse = (text: string): unknown => {
  try {
    return JSON.parse(text);
  } catch (error) {
    throw new Error('The analysis service returned an unexpected response format. Please try again.');
  }
};

export const analyzeTranscript = async (transcript: string): Promise<AnalysisResult> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-pro',
      contents: transcript,
      config: {
        systemInstruction: MASTER_PROMPT,
        responseMimeType: 'application/json',
        responseSchema: analysisSchema,
      },
    });

    const responseText = response.text;

    if (!responseText) {
      throw new Error('Received an empty response from the analysis service. Please try again.');
    }

    const rawResult = parseJsonResponse(responseText);
    return repairAndValidateAnalysis(rawResult);
  } catch (error) {
    console.error('Error analyzing transcript with Gemini:', error);

    if (error instanceof Error) {
        if (error.message.includes('unexpected response format') || error.message.includes('incomplete analysis')) {
            throw error;
        }
        if (error.message.includes('API key')) {
            throw new Error("There is an issue with the application's API configuration.");
        }
    }
    
    throw new Error('An error occurred while communicating with the AI. Please check your connection and try again.');
  }
};
