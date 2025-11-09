import { GoogleGenAI, Type } from "@google/genai";
import type { AnalysisResult, AnnotatedTurn, DashboardMetric, DeepDiveConcept, KeyFormulation, KeyMoment, HighlightAnalysis } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

// --- NEW, MORE ROBUST SCHEMA ---

const keyFormulationSchema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING, description: "The short legend title, e.g., 'Proactive Guidance & Implicature'." },
    description: { type: Type.STRING, description: "The longer text for the card, e.g., 'Anticipate user needs...'" }
  },
  required: ['title', 'description']
};

const highlightAnalysisSchema = {
  type: Type.OBJECT,
  properties: {
    keyFormulationTitle: { type: Type.STRING, description: "CRITICAL: Must exactly match a 'title' from the 'keyFormulations' list." },
    tooltipText: { type: Type.STRING, description: "The specific analysis for this turn (for the hover tooltip)." },
    snippetToHighlight: { type: Type.STRING, description: "The exact, word-for-word snippet from the turn's text to be highlighted." }
  },
  required: ['keyFormulationTitle', 'tooltipText', 'snippetToHighlight']
};

const annotatedTurnSchema = {
  type: Type.OBJECT,
  properties: {
    speaker: { type: Type.STRING, description: "The speaker, e.g., 'User' or 'AI'." },
    text: { type: Type.STRING, description: "The full text of the turn." },
    turnNumber: { type: Type.NUMBER, description: "The turn number (1-indexed)." },
    analysis: {
      type: Type.ARRAY,
      description: "An array of analysis objects for this turn. Can be empty.",
      items: highlightAnalysisSchema
    }
  },
  required: ['speaker', 'text', 'turnNumber']
};

const dashboardMetricSchema = {
  type: Type.OBJECT,
  properties: {
    metric: { type: Type.STRING, description: "The name of the metric, e.g., 'Rapport'." },
    score: { type: Type.NUMBER, description: "A score from 1-10 for this metric." },
    keyFinding: { type: Type.STRING, description: "A 10-WORD-MAX, plain-language summary." },
    analysis: { type: Type.STRING, description: "A 1-2 sentence witty observation in your persona." }
  },
  required: ['metric', 'score', 'keyFinding', 'analysis']
};

const deepDiveSchema = {
    type: Type.OBJECT,
    properties: {
        concept: { type: Type.STRING },
        explanation: { type: Type.STRING },
        analysis: { type: Type.STRING },
        source: { type: Type.STRING }
    },
    required: ['concept', 'explanation', 'analysis', 'source']
};


const responseSchema = {
  type: Type.OBJECT,
  properties: {
    vibeTitle: {
      type: Type.STRING,
      description: "This is the 'Vibe Headline.' It MUST follow the naming convention: '[Primary Descriptor] & [Secondary Descriptor]'. The Primary Descriptor is the main adjective for the feel (e.g., 'Efficient', 'Frustrating'). The Secondary Descriptor is a second adjective or short noun phrase for the behavior (e.g., 'Accommodating', 'Unhelpful Loop'). Good Examples: 'Efficient & Accommodating', 'Frustrating & Unhelpful Loop', 'Helpful & Proactive'. Bad Examples: 'This bot was helpful', 'A frustrating chat'."
    },
    keyFormulations: {
      type: Type.ARRAY,
      description: "CRITICAL: The dynamic legend. The Top 3 most important 'Key Formulations' or 'Design Takeaways' for this specific chat.",
      items: keyFormulationSchema
    },
    annotatedTranscript: {
      type: Type.ARRAY,
      description: "The turn-by-turn transcript. Add analysis objects for any turn that has a key moment.",
      items: annotatedTurnSchema
    },
    dashboardMetrics: {
      type: Type.ARRAY,
      description: "An array containing exactly 6 metric objects: Rapport, Purpose, Flow, Implicature, Cohesion, Accommodation.",
      items: dashboardMetricSchema
    },
    keyMoment: {
      type: Type.OBJECT,
      properties: {
        transcriptSnippet: { type: Type.STRING, description: "The single most important line or exchange from the transcript." },
        analysis: { type: Type.STRING, description: "A concise, one-sentence explanation of why this moment was the 'catalyst' for the conversation's vibe." },
      },
      required: ['transcriptSnippet', 'analysis']
    },
    deepDive: {
      type: Type.ARRAY,
      description: "An array of 6 deep dive objects for each academic concept.",
      items: deepDiveSchema
    }
  },
  required: ['vibeTitle', 'keyFormulations', 'annotatedTranscript', 'dashboardMetrics', 'keyMoment', 'deepDive']
};


const repairAndValidateAnalysis = (data: any): AnalysisResult => {
  const result: Partial<AnalysisResult> = data || {};

  // --- Validate and repair top-level properties and arrays ---
  result.vibeTitle = typeof result.vibeTitle === 'string' ? result.vibeTitle : "Analysis Incomplete";
  
  result.keyFormulations = Array.isArray(result.keyFormulations)
    ? result.keyFormulations.filter((f: any): f is KeyFormulation => f && typeof f.title === 'string' && typeof f.description === 'string')
    : [];

  result.annotatedTranscript = Array.isArray(result.annotatedTranscript)
    ? result.annotatedTranscript
        .filter((t: any): t is AnnotatedTurn => t && typeof t.speaker === 'string' && typeof t.text === 'string' && typeof t.turnNumber === 'number')
        .map((turn: AnnotatedTurn) => {
          // BUG FIX: Filter out analysis items with overlapping or non-existent snippets
          // to ensure the catalyst count matches the number of visible highlights.
          if (Array.isArray(turn.analysis) && turn.analysis.length > 0) {
              const sortedAnalyses = [...turn.analysis]
                  .filter(a => a && typeof a.snippetToHighlight === 'string' && turn.text.includes(a.snippetToHighlight))
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
              turn.analysis = []; // Ensure it's always an array
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

  result.keyMoment = (result.keyMoment && typeof result.keyMoment.transcriptSnippet === 'string')
    ? result.keyMoment
    : { transcriptSnippet: "N/A", analysis: "Could not determine a key moment." };

  // --- Final critical validation ---
  if (result.keyFormulations.length === 0 || result.dashboardMetrics.length < 6 || result.annotatedTranscript.length === 0) {
    throw new Error("Received incomplete analysis from the model. Critical sections like formulations or metrics are missing.");
  }
  
  return result as AnalysisResult;
};


export const analyzeTranscript = async (transcript: string): Promise<AnalysisResult> => {
  try {
    const systemInstruction = `You are Vibe Check Lab,' an expert AI Conversation Analyst with the persona of an insightful, clever, and encouraging professor. Your sole task is to analyze the provided transcript and generate a comprehensive Vibe Index Report as a single, valid JSON object that adheres perfectly to the provided schema.

Analysis Instructions:
1.  **keyFormulations**: First, analyze the entire transcript and decide on the Top 3 "Key Formulations" or "Design Takeaways". For each, provide a short title and a description. These will be the "legend" in the dashboard.
2.  **annotatedTranscript**: Go through the transcript turn-by-turn. For every turn that has a key moment, create one or more analysis objects.
3.  **CRITICAL LINK**: Inside each analysis object, you MUST include a 'keyFormulationTitle'. The value of this field must be an exact match for one of the 'title' strings you created in the 'keyFormulations' list. This links the highlight to the legend.
4.  **tooltip_text**: The specific analysis for that moment goes in the 'tooltipText' field.
5.  **snippetToHighlight**: The exact, word-for-word quote from the turn's text to highlight goes in 'snippetToHighlight'.
6.  Generate all other data as requested by the schema.

Your entire response MUST be a single, valid JSON object. Do not include any markdown formatting like \`\`\`json.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: transcript,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: responseSchema,
        temperature: 0.1,
        topP: 0.95,
      },
    });
    
    let jsonText = response.text.trim();
    if (jsonText.startsWith('```json')) {
        jsonText = jsonText.substring(7, jsonText.length - 3).trim();
    } else if (jsonText.startsWith('```')) {
        jsonText = jsonText.substring(3, jsonText.length - 3).trim();
    }
    
    const rawResult = JSON.parse(jsonText);
    const result = repairAndValidateAnalysis(rawResult);
    
    return result;

  } catch (error) {
    console.error("Error analyzing transcript with Gemini:", error);
    if (error instanceof Error && error.message.includes("Received incomplete analysis")) {
        throw error;
    }
    if (error instanceof SyntaxError) {
        throw new Error("The AI returned a response in an unexpected format. Please try again.");
    }
    if (error instanceof Error) {
        if (error.message.includes('rate limit exceeded')) {
            throw new Error("The lab is experiencing high traffic. Please wait a moment and try again.");
        }
        if (error.message.includes('response was blocked')) {
            throw new Error("The analysis was blocked due to safety filters. Please try a different transcript.");
        }
        if (error.message.includes('API key not valid')) {
            throw new Error("There is an issue with the application's API configuration.");
        }
    }
    throw new Error("An error occurred while communicating with the AI. Please check your connection and try again.");
  }
};