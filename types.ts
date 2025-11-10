export interface KeyFormulation {
  title: string;
  description: string;
}

export interface DashboardMetric {
  metric: string;
  score: number;
  keyFinding: string;
  analysis: string;
}

// FIX: Add DashboardMetrics type definition to resolve an import error in the legacy/unused AcademicDeepDive component.
export interface DashboardMetrics {
  rapport: DashboardMetric;
  purpose: DashboardMetric;
  flow: DashboardMetric;
  implicature: DashboardMetric;
  cohesion: DashboardMetric;
  accommodation: DashboardMetric;
}

export interface KeyMoment {
  transcriptSnippet: string;
  analysis: string;
}

// FIX: Add Moment type definition to resolve import errors in the legacy/unused MomentAnalysis and MomentCard components.
export interface Moment {
  construct: string;
  impact: string;
  transcriptSnippet: string;
  explanation: string;
  redesignTip: string;
}

export interface DeepDiveConcept {
  concept: string;
  explanation: string;
  analysis: string;
  source: string;
}

// FIX: Add DeepDive type definition to resolve an import error in the legacy/unused AcademicDeepDive component.
export interface DeepDive {
  rapport: DeepDiveConcept;
  purpose: DeepDiveConcept;
  flow: DeepDiveConcept;
  implicature: DeepDiveConcept;
  cohesion: DeepDiveConcept;
  accommodation: DeepDiveConcept;
}

export interface HighlightAnalysis {
  keyFormulationTitle: string;
  tooltipText: string;
  snippetToHighlight: string;
}

export interface AnnotatedTurn {
  speaker: string;
  text: string;
  turnNumber: number;
  analysis?: HighlightAnalysis[];
}

export interface AnalysisResult {
  vibeTitle: string;
  keyFormulations: KeyFormulation[];
  dashboardMetrics: DashboardMetric[];
  keyMoment: KeyMoment;
  annotatedTranscript: AnnotatedTurn[];
}

export interface Turn {
  speaker: string;
  text: string;
}

export interface SampleTranscript {
  id: string;
  dataset: string;
  title: string;
  tags: string[];
  turns: Turn[];
}