import React, { useMemo, ReactNode } from 'react';
import type { AnnotatedTurn, HighlightAnalysis, KeyFormulation } from '../types';
import Popover from './Popover';
import { getFormulationColorByIndex } from '../utils/colorUtils';

interface AnnotatedTranscriptProps {
  annotatedTranscript: AnnotatedTurn[];
  keyFormulations: KeyFormulation[];
}

const SpeakerLabel: React.FC<{ speaker: string }> = ({ speaker }) => {
  const isAI = speaker.toLowerCase().trim() === 'ai';
  const avatarStyle = isAI ? styles.aiAvatar : styles.humanAvatar;
  const initial = isAI ? 'AI' : 'H';

  return (
      <div style={styles.speakerContainer}>
          <div style={avatarStyle}>{initial}</div>
      </div>
  );
}

const AnnotatedTranscript: React.FC<AnnotatedTranscriptProps> = ({ annotatedTranscript, keyFormulations }) => {
  const formulationToIndexMap = useMemo(() => {
    const map = new Map<string, number>();
    keyFormulations.forEach((formulation, index) => {
      map.set(formulation.title, index);
    });
    return map;
  }, [keyFormulations]);
  
  const totalMoments = useMemo(() => {
    return annotatedTranscript.reduce((acc, turn) => acc + (turn.analysis?.length || 0), 0);
  }, [annotatedTranscript]);

  const renderTurnTextWithHighlights = (turn: AnnotatedTurn): ReactNode => {
    if (!turn.analysis || turn.analysis.length === 0) {
      return turn.text;
    }
    
    // Sort analyses by their appearance in the text to handle multiple highlights correctly
    const sortedAnalyses = [...turn.analysis].sort((a, b) => 
        turn.text.indexOf(a.snippetToHighlight) - turn.text.indexOf(b.snippetToHighlight)
    );

    let lastIndex = 0;
    const parts: ReactNode[] = [];

    sortedAnalyses.forEach((analysis, index) => {
      const snippetIndex = turn.text.indexOf(analysis.snippetToHighlight, lastIndex);
      if (snippetIndex === -1) return;

      // Add the text before the highlight
      if (snippetIndex > lastIndex) {
        parts.push(turn.text.substring(lastIndex, snippetIndex));
      }

      // Find the color for this formulation
      const formulationIndex = formulationToIndexMap.get(analysis.keyFormulationTitle);
      const colorVar = typeof formulationIndex === 'number' 
        ? getFormulationColorByIndex(formulationIndex)
        : '--default-construct-color';
      
      const formulation = keyFormulations[formulationIndex!];

      const popoverContent = (
        <div>
          {formulation && (
            <div style={{...styles.popoverHeader, borderLeftColor: `var(${colorVar})`}}>
              <h4 style={{margin: 0, fontSize: '0.9em'}}>{formulation.title}</h4>
            </div>
          )}
          <p style={{margin: '8px 0 0', fontSize: '0.9em'}}>{analysis.tooltipText}</p>
        </div>
      );

      // Add the highlighted part with a Popover
      parts.push(
        <Popover key={index} content={popoverContent} highlightColor={`var(${colorVar})`}>
          <span>{analysis.snippetToHighlight}</span>
        </Popover>
      );

      lastIndex = snippetIndex + analysis.snippetToHighlight.length;
    });

    // Add any remaining text after the last highlight
    if (lastIndex < turn.text.length) {
      parts.push(turn.text.substring(lastIndex));
    }

    return <>{parts}</>;
  };
  
  return (
    <div style={styles.container} className="insight-card">
        <div style={styles.header}>
            <h2 style={styles.title}>Transcript Analysis</h2>
            <div style={styles.analysisSummary}>
                {totalMoments} catalysts identified.
            </div>
        </div>
        <p style={styles.instructions}>Hover over a highlight to see the lab's analysis.</p>
      
        <div style={styles.transcriptBox}>
            {annotatedTranscript.map((turn, index) => (
                <div style={styles.turnContainer} key={index}>
                    <SpeakerLabel speaker={turn.speaker} />
                    <p style={styles.turnText}>
                        {renderTurnTextWithHighlights(turn)}
                    </p>
                </div>
            ))}
        </div>
    </div>
  );
};


const styles: { [key: string]: React.CSSProperties } = {
  container: {
    padding: '24px',
    width: '100%',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '4px',
  },
  title: {
    margin: 0,
    fontSize: '1.25em',
  },
  instructions: {
    color: 'var(--text-color-secondary)',
    marginTop: 0,
    marginBottom: '20px',
  },
  analysisSummary: {
    fontFamily: 'var(--font-accent)',
    fontSize: '0.9em',
    color: 'var(--text-color-secondary)',
    padding: '4px 12px',
    backgroundColor: 'var(--subtle-background)',
    borderRadius: '6px',
    border: '1px solid var(--border-color-light)',
  },
  transcriptBox: {
    width: '100%',
    border: '1px solid var(--border-color-light)',
    borderRadius: '8px',
    backgroundColor: 'var(--card-background)',
  },
  turnContainer: {
    padding: '16px 20px',
    borderBottom: '1px solid var(--border-color-light)',
    display: 'flex',
    gap: '12px',
    alignItems: 'flex-start',
  },
  speakerContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '60px',
    flexShrink: 0,
    paddingTop: '4px',
  },
  humanAvatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: 'var(--human-color)',
    color: 'var(--avatar-text-color)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 700,
    fontSize: '1.2em',
  },
  aiAvatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: 'var(--ai-color)',
    color: 'var(--avatar-text-color)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 700,
    fontSize: '1em',
  },
  turnText: {
    margin: 0,
    paddingTop: '10px',
    lineHeight: 1.7,
    whiteSpace: 'pre-wrap',
    color: 'var(--text-color-body)',
  },
  popoverHeader: {
    paddingLeft: '8px',
    borderLeft: '3px solid',
    marginBottom: '8px',
  }
};

export default AnnotatedTranscript;