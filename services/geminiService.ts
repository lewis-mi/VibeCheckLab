import type { AnalysisResult, AnnotatedTurn, DashboardMetric, DeepDiveConcept, HighlightAnalysis, KeyFormulation, KeyMoment } from '../types';

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
    const response = await fetch('http://localhost:8080/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ transcript }),
    });

    const responseText = await response.text();

    if (!response.ok) {
        let errorMessage = `Request failed with status ${response.status}`;
        try {
            const errorData = JSON.parse(responseText);
            errorMessage = errorData.error || errorMessage;
        } catch (e) {
            if (responseText.length > 0 && responseText.length < 200) {
                errorMessage = responseText;
            }
        }
        throw new Error(errorMessage);
    }

    if (!responseText) {
      throw new Error('Received an empty response from the analysis service. Please try again.');
    }

    const rawResult = parseJsonResponse(responseText);
    return repairAndValidateAnalysis(rawResult);
  } catch (error) {
    console.error('Error analyzing transcript via proxy:', error);
    if (error instanceof Error) {
        throw new Error(`${error.message}`);
    }
    throw new Error('An unknown error occurred during analysis.');
  }
};