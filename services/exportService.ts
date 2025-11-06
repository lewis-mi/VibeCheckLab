import type { AnalysisResult, Moment } from '../types';

/**
 * Generates a markdown string for the analysis summary report.
 * @param analysis The full analysis result object.
 * @returns A string formatted in markdown.
 */
export const generateSummaryMarkdown = (analysis: AnalysisResult): string => {
  const { vibeTitle, keyRedesignTips, keyMoment, dashboardMetrics, deepDive } = analysis;

  let markdown = `# Vibe Check Report: ${vibeTitle}\n\n`;

  // Key Redesign Tips
  if (keyRedesignTips && keyRedesignTips.length > 0) {
    markdown += `## Top Design Takeaways\n`;
    keyRedesignTips.forEach(tip => {
      markdown += `- **${tip.construct}:** ${tip.tip}\n`;
    });
    markdown += '\n';
  }

  // Key Moment
  if (keyMoment) {
    markdown += `## The Catalyst: Key Moment\n`;
    markdown += `> "${keyMoment.transcriptSnippet}"\n\n`;
    markdown += `**Analysis:** ${keyMoment.analysis}\n\n`;
  }

  // Dashboard Metrics
  if (dashboardMetrics) {
    markdown += `## Dashboard Metrics\n\n`;
    Object.values(dashboardMetrics).forEach(metric => {
      markdown += `### ${metric.metric}\n`;
      markdown += `- **Key Finding:** ${metric.keyFinding}\n`;
      if (metric.balancePercent !== undefined) {
          markdown += `- **Balance:** ${100 - metric.balancePercent}% Human / ${metric.balancePercent}% AI\n`;
      }
      markdown += `- **Analysis:** ${metric.analysis}\n\n`;
    });
  }

  // Deep Dive
  if (deepDive) {
    markdown += `## Academic Deep Dive\n\n`;
    Object.values(deepDive).forEach(concept => {
      markdown += `### ${concept.concept}\n`;
      markdown += `${concept.explanation}\n\n`;
      markdown += `**In your transcript:** ${concept.analysis}\n\n`;
      markdown += `*${concept.source}*\n\n`;
    });
  }
  
  return markdown;
};

/**
 * Generates a markdown string for the annotated transcript.
 * @param transcript The original conversation transcript.
 * @param moments The array of analyzed moments.
 * @returns A string formatted in markdown.
 */
export const generateTranscriptMarkdown = (transcript: string, moments: Moment[]): string => {
    const lines = transcript.split('\n').filter(line => line.trim() !== '');
    const turns = lines.map((line, index) => {
        const [speaker, ...textParts] = line.split(': ');
        return {
            speaker: speaker || 'Unknown',
            text: textParts.join(': '),
            turnNumber: index + 1,
        };
    });

    const momentsByTurn = new Map<number, Moment>();
    moments.forEach(moment => {
        momentsByTurn.set(moment.turn, moment);
    });

    let markdown = `# Annotated Transcript\n\n---\n\n`;
    
    turns.forEach(turn => {
        markdown += `**Turn ${turn.turnNumber}: ${turn.speaker}**\n`;
        markdown += `> ${turn.text}\n\n`;
        
        const moment = momentsByTurn.get(turn.turnNumber);
        if (moment) {
            markdown += `**Analysis (Turn ${turn.turnNumber}):**\n`;
            markdown += `- **Construct:** ${moment.construct}\n`;
            markdown += `- **Impact:** ${moment.impact}\n`;
            markdown += `- **Why it matters:** ${moment.explanation}\n`;
            markdown += `- **Redesign Tip:** ${moment.redesignTip}\n\n`;
        }
        markdown += '---\n\n';
    });

    return markdown;
};