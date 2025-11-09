import { jsPDF } from 'jspdf';
import type { AnalysisResult } from '../types';

// Helper function to handle text wrapping and page breaks
const addWrappedText = (
  doc: jsPDF,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  options: { fontStyle?: string; fontSize?: number; isTitle?: boolean } = {}
): number => {
  if (options.fontStyle) {
    doc.setFont('helvetica', options.fontStyle);
  }
  if (options.fontSize) {
    doc.setFontSize(options.fontSize);
  }

  const lines = doc.splitTextToSize(text, maxWidth);
  const lineHeight = doc.getLineHeight() / doc.internal.scaleFactor;
  const textHeight = lines.length * lineHeight;
  
  // Check if it fits on the current page (A4 height is ~297mm, using 280 as a safe margin)
  if (y + textHeight > 280) { 
    doc.addPage();
    y = 20; // Reset y to top margin
  }

  doc.text(lines, x, y);

  // Reset to default font
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);

  return y + (lines.length * (lineHeight + 0.5)); // Return new y position
};

export const exportReportAsPdf = (analysis: AnalysisResult, transcript: string) => {
  const doc = new jsPDF();
  const page_width = doc.internal.pageSize.getWidth();
  const margin = 20;
  const content_width = page_width - margin * 2;
  let y = 20;

  // 1. Vibe Title
  y = addWrappedText(doc, `Vibe Check Report: ${analysis.vibeTitle}`, margin, y, content_width, { fontSize: 18, fontStyle: 'bold' });
  y += 5;
  doc.setDrawColor(224, 224, 224); // Light gray
  doc.line(margin, y, page_width - margin, y);
  y += 10;
  
  // 2. Key Formulations
  y = addWrappedText(doc, 'Key Formulations', margin, y, content_width, { fontSize: 14, fontStyle: 'bold' });
  y += 2;
  
  analysis.keyFormulations.forEach(kf => {
    y = addWrappedText(doc, `- ${kf.title}`, margin, y, content_width, { fontSize: 11, fontStyle: 'bold' });
    y = addWrappedText(doc, kf.description, margin + 5, y, content_width - 5);
  });
  y += 5;

  // 3. Key Moment
  y = addWrappedText(doc, 'The Catalyst: Key Moment', margin, y, content_width, { fontSize: 14, fontStyle: 'bold' });
  
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(100, 100, 100); // Gray text for quote
  y = addWrappedText(doc, `"${analysis.keyMoment.transcriptSnippet}"`, margin + 5, y, content_width - 5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(0, 0, 0); // Black text
  y = addWrappedText(doc, analysis.keyMoment.analysis, margin, y, content_width);
  y += 5;
  
  // 4. Vibe Metrics
  y = addWrappedText(doc, 'Vibe Metrics', margin, y, content_width, { fontSize: 14, fontStyle: 'bold' });
  
  analysis.dashboardMetrics.forEach(metric => {
    y = addWrappedText(doc, `${metric.metric} (Score: ${metric.score}/10)`, margin, y, content_width, { fontSize: 11, fontStyle: 'bold' });
    y = addWrappedText(doc, `Key Finding: ${metric.keyFinding}`, margin + 5, y, content_width - 5);
    y = addWrappedText(doc, `Analysis: ${metric.analysis}`, margin + 5, y, content_width - 5);
  });
  y += 5;

  // 5. Annotated Transcript
  doc.addPage();
  y = 20;
  y = addWrappedText(doc, 'Annotated Transcript', margin, y, content_width, { fontSize: 16, fontStyle: 'bold' });
  
  analysis.annotatedTranscript.forEach(turn => {
    const turnHeader = `Turn ${turn.turnNumber}: ${turn.speaker}`;
    y = addWrappedText(doc, turnHeader, margin, y, content_width, { fontSize: 11, fontStyle: 'bold' });
    
    y = addWrappedText(doc, turn.text, margin, y, content_width);
    
    if (turn.analysis && turn.analysis.length > 0) {
      doc.setFont('helvetica', 'italic');
      doc.setTextColor(100, 100, 100);
      turn.analysis.forEach(analysisItem => {
          let analysisText = `> Insight (${analysisItem.keyFormulationTitle}): "${analysisItem.snippetToHighlight}" — ${analysisItem.tooltipText}`;
          y = addWrappedText(doc, analysisText, margin + 5, y, content_width - 5);
      });
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(0, 0, 0);
    }
    
    y += 3;
  });

  doc.save(`vibe-check-report-${new Date().toISOString().split('T')[0]}.pdf`);
};
