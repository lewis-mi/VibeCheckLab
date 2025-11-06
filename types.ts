export interface DashboardMetric {
  metric: string;
  keyFinding: string;
  analysis: string;
  balancePercent?: number;
}

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

export interface DeepDiveConcept {
  concept: string;
  explanation: string;
  analysis: string;
  source: string;
}

export interface DeepDive {
  rapport: DeepDiveConcept;
  purpose: DeepDiveConcept;
  flow: DeepDiveConcept;
  implicature: DeepDiveConcept;
  cohesion: DeepDiveConcept;
  accommodation: DeepDiveConcept;
}

export interface Moment {
  turn: number;
  transcriptSnippet: string;
  construct: string;
  impact: 'Positive' | 'Negative';
  explanation:string;
  redesignTip: string;
}

export interface RedesignTip {
  construct: string;
  tip: string;
}

export interface AnalysisResult {
  vibeTitle: string;
  dashboardMetrics: DashboardMetrics;
  keyMoment: KeyMoment;
  deepDive: DeepDive;
  momentAnalysis: Moment[];
  keyRedesignTips: RedesignTip[];
}