import { GoogleGenAI, Type } from "@google/genai";
import type { AnalysisResult, Moment } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

const momentSchema = {
  type: Type.OBJECT,
  properties: {
    turn: { type: Type.NUMBER, description: "The turn number (1-indexed) in the conversation where this snippet appears." },
    transcriptSnippet: { type: Type.STRING, description: "The exact quote from the transcript that represents this moment." },
    construct: { type: Type.STRING, description: "The conversational construct being analyzed, e.g., 'Empathy', 'Clarity', 'Flow'." },
    impact: { type: Type.STRING, description: "The impact of this moment. Must be either 'Positive' or 'Negative'." },
    explanation: { type: Type.STRING, description: "A concise explanation of why this moment matters for the conversation's vibe." },
    redesignTip: { type: Type.STRING, description: "An actionable redesign tip for a student to improve a similar interaction." },
  }
};

const redesignTipSchema = {
  type: Type.OBJECT,
  properties: {
    construct: { type: Type.STRING, description: "The conversational construct this tip relates to, e.g., 'Empathy', 'Clarity'." },
    tip: { type: Type.STRING, description: "The summarized, actionable redesign tip." },
  }
};

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    vibeTitle: { type: Type.STRING, description: "A 2-4 word summary phrase that captures the overall feel of the conversation (e.g., 'Efficient & Helpful,' 'Awkward Misunderstanding,' 'Polite but Tense')." },
    dashboardMetrics: {
      type: Type.OBJECT,
      properties: {
        rapport: {
          type: Type.OBJECT,
          properties: {
            metric: { type: Type.STRING, description: "The name of the metric, e.g., 'Rapport'." },
            keyFinding: { type: Type.STRING, description: "A 10-WORD-MAX, plain-language summary. NO academic jargon. (e.g., 'Polite, friendly, and helpful.')" },
            analysis: { type: Type.STRING, description: "A 1-2 sentence witty observation in your persona. (e.g., 'This AI passed the vibe check! It was both polite and genuinely helpful.')" },
          },
        },
        purpose: {
          type: Type.OBJECT,
          properties: {
            metric: { type: Type.STRING, description: "The name of the metric, e.g., 'Purpose'." },
            keyFinding: { type: Type.STRING, description: "A 10-WORD-MAX, plain-language summary. NO academic jargon. (e.g., 'This was a simple Q&A chat.')" },
            analysis: { type: Type.STRING, description: "A 1-2 sentence witty observation in your persona. (e.w., 'All business. This chat was 100% task-focused, with no chit-chat.')" },
          },
        },
        flow: {
          type: Type.OBJECT,
          properties: {
            metric: { type: Type.STRING, description: "The name of the metric, e.g., 'Flow'." },
            keyFinding: { type: Type.STRING, description: "A 10-WORD-MAX, plain-language summary. NO academic jargon. (e.g., 'A balanced, back-and-forth conversation.')" },
            balancePercent: { type: Type.NUMBER, description: "A float, from 0.0 (all human) to 100.0 (all AI)." },
            analysis: { type: Type.STRING, description: "A 1-2 sentence witty observation in your persona. (e.g., 'A perfect 50/50 split. A beautiful, balanced chat.')" },
          },
        },
        implicature: {
          type: Type.OBJECT,
          properties: {
            metric: { type: Type.STRING, description: "The name of the metric, e.g., 'Implicature'." },
            keyFinding: { type: Type.STRING, description: "A 10-WORD-MAX, plain-language summary. NO academic jargon. (e.g., 'Reading between the lines of the chat.')" },
            analysis: { type: Type.STRING, description: "A 1-2 sentence witty observation in your persona. (e.g., 'What wasn't said was just as important as what was.')" },
          },
        },
        cohesion: {
          type: Type.OBJECT,
          properties: {
            metric: { type: Type.STRING, description: "The name of the metric, e.g., 'Cohesion & Coherence'." },
            keyFinding: { type: Type.STRING, description: "A 10-WORD-MAX, plain-language summary. NO academic jargon. (e.g., 'The conversation stuck together logically.')" },
            analysis: { type: Type.STRING, description: "A 1-2 sentence witty observation in your persona. (e.g., 'The conversational glue was strong here; everything connected seamlessly.')" },
          },
        },
        accommodation: {
          type: Type.OBJECT,
          properties: {
            metric: { type: Type.STRING, description: "The name of the metric, e.g., 'Accommodation'." },
            keyFinding: { type: Type.STRING, description: "A 10-WORD-MAX, plain-language summary. NO academic jargon. (e.g., 'The AI mirrored the user's tone.')" },
            analysis: { type: Type.STRING, description: "A 1-2 sentence witty observation in your persona. (e.g., 'A classic case of convergence. The AI matched the user's vibe perfectly.')" },
          },
        },
      },
    },
    keyMoment: {
      type: Type.OBJECT,
      properties: {
        transcriptSnippet: { type: Type.STRING, description: "The single most important line or exchange from the transcript." },
        analysis: { type: Type.STRING, description: "An explanation (in your witty persona) of why this moment was so significant. You must refer to this moment as the 'catalyst' for the conversation's vibe." },
      },
    },
    deepDive: {
      type: Type.OBJECT,
      properties: {
        rapport: {
          type: Type.OBJECT,
          properties: {
            concept: { type: Type.STRING, description: "Should be 'Rapport'." },
            explanation: { type: Type.STRING, description: "This measures the 'tact' and 'respect' in a conversation. It's based on 'Politeness Theory' by Brown and Levinson." },
            analysis: { type: Type.STRING, description: "A detailed, multi-sentence academic analysis. Explain 'Politeness Theory' and 'face-saving acts' and how they applied to the transcript." },
            source: { type: Type.STRING, description: "Should be 'Key Source: Politeness: Some Universals in Language Usage (1987) by Penelope Brown and Stephen C. Levinson.'" },
          },
        },
        purpose: {
          type: Type.OBJECT,
          properties: {
            concept: { type: Type.STRING, description: "Should be 'Purpose'." },
            explanation: { type: Type.STRING, description: "This analyzes what the words are doing. It's based on 'Speech Act Theory.'" },
            analysis: { type: Type.STRING, description: "A detailed, multi-sentence academic analysis. Explain 'Speech Act Theory' (like 'phatic' or 'assertive' acts) and how it applied to the transcript." },
            source: { type: Type.STRING, description: "Should be 'Key Source: How to Do Things with Words (1962) by J.L. Austin.'" },
          },
        },
        flow: {
          type: Type.OBJECT,
          properties: {
            concept: { type: Type.STRING, description: "Should be 'Flow'." },
            explanation: { type: Type.STRING, description: "This is the nuts and bolts of a chat: the turn-taking and rhythm. It's rooted in 'Conversation Analysis.'" },
            analysis: { type: Type.STRING, description: "A detailed, multi-sentence academic analysis. Explain 'Conversation Analysis' and 'adjacency pairs' and how they applied to the transcript." },
            source: { type: Type.STRING, description: "Should be 'Key Source: Lectures on Conversation (1992) by Harvey Sacks.'" },
          },
        },
        implicature: {
          type: Type.OBJECT,
          properties: {
            concept: { type: Type.STRING, description: "Should be 'Implicature'." },
            explanation: { type: Type.STRING, description: "This is about what's meant, not just what's said. It's based on 'Conversational Implicature' by philosopher Paul Grice." },
            analysis: { type: Type.STRING, description: "A detailed, multi-sentence academic analysis. Explain Grice's 'Cooperative Principle' and 'maxims' (like Quality, Quantity, Relevance, Manner) and how they were followed or flouted in the transcript to create unstated meanings." },
            source: { type: Type.STRING, description: "Should be 'Key Source: Logic and Conversation (1975) by Paul Grice.'" },
          },
        },
        cohesion: {
          type: Type.OBJECT,
          properties: {
            concept: { type: Type.STRING, description: "Should be 'Cohesion & Coherence'." },
            explanation: { type: Type.STRING, description: "This looks at how a conversation 'sticks together' both grammatically and logically. It's a key part of 'Discourse Analysis.'" },
            analysis: { type: Type.STRING, description: "A detailed, multi-sentence academic analysis. Explain 'Discourse Analysis' concepts like 'cohesion' (linking words) and 'coherence' (logical sense) and how they applied to the transcript to create a unified conversation." },
            source: { type: Type.STRING, description: "Should be 'Key Source: Cohesion in English (1976) by M.A.K. Halliday and Ruqaiya Hasan.'" },
          },
        },
        accommodation: {
          type: Type.OBJECT,
          properties: {
            concept: { type: Type.STRING, description: "Should be 'Accommodation'." },
            explanation: { type: Type.STRING, description: "This is about how we shift our speech to be more like the people we're talking to. It's based on 'Communication Accommodation Theory.'" },
            analysis: { type: Type.STRING, description: "A detailed, multi-sentence academic analysis. Explain 'Communication Accommodation Theory' (especially 'convergence' and 'divergence') and how the speakers adapted their language (or didn't) to each other." },
            source: { type: Type.STRING, description: "Should be 'Key Source: 'Accent mobility: a model and some data.' (1973) by Howard Giles.'" },
          },
        },
      },
    },
    momentAnalysis: {
      type: Type.ARRAY,
      description: "A detailed, moment-by-moment analysis of key events in the conversation.",
      items: momentSchema,
    },
    keyRedesignTips: {
      type: Type.ARRAY,
      description: "A summary of the 2-3 most critical, actionable redesign tips for the student.",
      items: redesignTipSchema,
    }
  },
};


export const analyzeTranscript = async (transcript: string): Promise<AnalysisResult> => {
  try {
    const systemInstruction = `You are Vibe Check Lab,' an expert AI Conversation Analyst with the persona of an insightful, clever, and encouraging professor. Your task is to analyze the provided transcript and be extremely concise. 
    In addition to the high-level analysis, perform a detailed moment-by-moment breakdown. Identify specific conversational moments that exemplify key constructs (like empathy, clarity, or flow). For each moment, provide the transcript snippet, its turn number (1-indexed), the construct, its impact (positive or negative), an explanation of why it matters, and a concrete redesign tip for students. Store this in the 'momentAnalysis' array.
    After completing the moment analysis, identify the 2-3 most critical redesign tips. Summarize and place them in the 'keyRedesignTips' array. These should be framed as actionable recommendations for a student of conversation design.
    Your entire response MUST be a single, valid JSON object that starts with { and ends with }. Do not include any markdown formatting like \`\`\`json.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: transcript,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: responseSchema,
        temperature: 0,
      },
    });
    
    // Clean potential markdown formatting
    let jsonText = response.text.trim();
    if (jsonText.startsWith('```json')) {
        jsonText = jsonText.substring(7, jsonText.length - 3).trim();
    } else if (jsonText.startsWith('```')) {
        jsonText = jsonText.substring(3, jsonText.length - 3).trim();
    }
    
    const result = JSON.parse(jsonText) as AnalysisResult;

    // Basic validation to prevent downstream errors
    if (!result.vibeTitle || !result.dashboardMetrics || !result.keyMoment || !result.deepDive || !result.momentAnalysis || !result.keyRedesignTips || !result.dashboardMetrics.implicature || !result.deepDive.implicature || !result.dashboardMetrics.cohesion || !result.deepDive.cohesion || !result.dashboardMetrics.accommodation || !result.deepDive.accommodation) {
        throw new Error("Received incomplete analysis from the model.");
    }
    if (result.momentAnalysis.some((moment: Moment) => moment.turn === undefined)) {
      throw new Error("Received incomplete moment analysis from the model (missing turn).");
    }
    
    return result;

  } catch (error) {
    console.error("Error analyzing transcript with Gemini:", error);

    // This error comes from our own validation, so it's already user-friendly
    if (error instanceof Error && error.message.includes("Received incomplete analysis")) {
        throw error;
    }

    if (error instanceof SyntaxError) {
        throw new Error("The AI returned a response in an unexpected format. Please try again, or adjust your transcript.");
    }
    
    if (error instanceof Error) {
        if (error.message.includes('rate limit exceeded')) {
            throw new Error("The lab is experiencing high traffic. Please wait a moment and try again.");
        }
        if (error.message.includes('response was blocked')) {
            throw new Error("The analysis was blocked due to safety filters. This can happen with sensitive content. Please try a different transcript.");
        }
        if (error.message.includes('API key not valid')) {
            throw new Error("There is an issue with the application's API configuration.");
        }
    }
    
    // Generic fallback for network issues, 5xx errors, etc.
    throw new Error("An error occurred while communicating with the AI. Please check your connection and try again.");
  }
};