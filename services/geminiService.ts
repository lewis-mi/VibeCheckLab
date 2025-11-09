import type { AnalysisResult, AnnotatedTurn, DashboardMetric, DeepDiveConcept, HighlightAnalysis, KeyFormulation, KeyMoment } from '../types';

const getAnalysisEndpoint = (): string => {
  const endpoint = import.meta.env.VITE_ANALYSIS_ENDPOINT;
  if (!endpoint) {
    throw new Error('The analysis endpoint is not configured. Please set VITE_ANALYSIS_ENDPOINT in your environment.');
  }
  return endpoint;
};

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

const handleErrorResponse = async (response: Response): Promise<never> => {
  let fallbackMessage = 'An error occurred while communicating with the analysis service. Please try again later.';

  switch (response.status) {
    case 400:
      fallbackMessage = 'The analysis service could not process the transcript. Please verify the input and try again.';
      break;
    case 401:
    case 403:
      fallbackMessage = "There is an issue with the application's API configuration.";
      break;
    case 429:
      fallbackMessage = 'The lab is experiencing high traffic. Please wait a moment and try again.';
      break;
    case 500:
    case 502:
    case 503:
    case 504:
      fallbackMessage = 'The analysis service is temporarily unavailable. Please try again later.';
      break;
    default:
      break;
  }

  try {
    const data = await response.clone().json();
    if (data && typeof data.message === 'string' && data.message.trim().length > 0) {
      throw new Error(data.message);
    }
  } catch (parseError) {
    if (parseError instanceof Error && parseError.name !== 'SyntaxError') {
      throw parseError;
    }
  }

  throw new Error(fallbackMessage);
};

export const analyzeTranscript = async (transcript: string): Promise<AnalysisResult> => {
  try {
    const response = await fetch(getAnalysisEndpoint(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ transcript }),
    });

    if (!response.ok) {
      await handleErrorResponse(response);
    }

    const responseText = await response.text();

    if (!responseText) {
      throw new Error('Received an empty response from the analysis service. Please try again.');
    }

    const rawResult = parseJsonResponse(responseText);
    return repairAndValidateAnalysis(rawResult);
  } catch (error) {
    console.error('Error analyzing transcript with backend service:', error);

    if (error instanceof Error) {
      if (error.message.includes('analysis endpoint is not configured')) {
        throw error;
      }

      if (error.message.includes('Received incomplete analysis')) {
        throw error;
      }

      if (error.message.includes('The analysis service returned an unexpected response format')) {
        throw error;
      }

      if (error.message.includes('analysis service')) {
        throw error;
      }
    }

    throw new Error('An error occurred while communicating with the AI. Please check your connection and try again.');
  }
};
