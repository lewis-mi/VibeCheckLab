import React, { useMemo } from 'react';
import type { Moment } from '../types';
import MomentCard from './MomentCard';

interface AnnotatedTranscriptProps {
  transcript: string;
  moments: Moment[];
}

interface Turn {
  speaker: string;
  text: string;
  turnNumber: number;
}

const AnnotatedTranscript: React.FC<AnnotatedTranscriptProps> = ({ transcript, moments }) => {
  // Memoize parsing logic to prevent re-calculation on re-renders
  const turns: Turn[] = useMemo(() => {
    const lines = transcript.split('\n').filter(line => line.trim() !== '');
    return lines.map((line, index) => {
      const [speaker, ...textParts] = line.split(': ');
      return {
        speaker: speaker || 'Unknown',
        text: textParts.join(': '),
        turnNumber: index + 1,
      };
    });
  }, [transcript]);

  const momentsByTurn = useMemo(() => {
    const map = new Map<number, Moment>();
    moments.forEach(moment => {
      map.set(moment.turn, moment);
    });
    return map;
  }, [moments]);

  const renderTurn = (turn: Turn) => {
    const moment = momentsByTurn.get(turn.turnNumber);

    if (moment) {
      const isPositive = moment.impact === 'Positive';
      const color = isPositive ? '#E8F5E9' : '#FEF3C7'; // Use a subtle green for positive, light yellow for negative
      
      return (
        <details style={styles.details} key={turn.turnNumber}>
          <summary style={{ ...styles.summary, backgroundColor: color }}>
            <div style={styles.turnHeader}>
                <span style={styles.speaker}>{turn.speaker}</span>
                <span style={styles.turnNumber}>Turn {turn.turnNumber}</span>
            </div>
            <p style={styles.turnText}>{turn.text}</p>
            <div style={styles.learnMore}>Click to see analysis...</div>
          </summary>
          <div style={styles.momentContent}>
            <MomentCard moment={moment} />
          </div>
        </details>
      );
    }

    return (
      <div style={styles.turnContainer} key={turn.turnNumber}>
        <div style={styles.turnHeader}>
            <span style={styles.speaker}>{turn.speaker}</span>
            <span style={styles.turnNumber}>Turn {turn.turnNumber}</span>
        </div>
        <p style={styles.turnText}>{turn.text}</p>
      </div>
    );
  };
  
  return (
    <div style={styles.container}>
      <p style={styles.instructions}>This is the full conversation. Key moments are highlighted. Click on one to expand the analysis.</p>
      <div style={styles.transcriptBox}>
        {turns.map(renderTurn)}
      </div>
    </div>
  );
};

// Hide default marker for Webkit browsers
const styleSheet = document.createElement("style");
styleSheet.innerText = `summary::-webkit-details-marker { display: none; } summary::marker { display: none; }`;
document.head.appendChild(styleSheet);


const styles: { [key: string]: React.CSSProperties } = {
  container: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  instructions: {
    textAlign: 'center',
    color: '#5f6368',
    maxWidth: '500px',
    marginBottom: '20px',
  },
  transcriptBox: {
    width: '100%',
    maxWidth: '800px',
    border: '1px solid #eee',
    borderRadius: '8px',
    backgroundColor: '#fff',
  },
  turnContainer: {
    padding: '12px 16px',
    borderBottom: '1px solid #eee',
  },
  turnHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px',
  },
  speaker: {
    fontWeight: 700,
  },
  turnNumber: {
    fontSize: '0.8em',
    color: '#666',
  },
  turnText: {
    margin: 0,
    lineHeight: 1.6,
    whiteSpace: 'pre-wrap',
  },
  details: {
    borderBottom: '1px solid #eee',
  },
  summary: {
    padding: '12px 16px',
    cursor: 'pointer',
    listStyle: 'none',
    transition: 'background-color 0.2s',
  },
  learnMore: {
    marginTop: '8px',
    fontSize: '0.9em',
    fontWeight: 700,
    color: '#333',
  },
  momentContent: {
    padding: '16px',
    backgroundColor: '#f9fafb',
    borderTop: '1px solid #eee',
  },
};

export default AnnotatedTranscript;