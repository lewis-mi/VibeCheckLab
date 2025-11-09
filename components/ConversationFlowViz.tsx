import React, { useMemo } from 'react';

interface ConversationFlowVizProps {
  transcript: string;
}

const ConversationFlowViz: React.FC<ConversationFlowVizProps> = ({ transcript }) => {
  const turns = useMemo(() => {
    const lines = transcript.split('\n').filter(line => line.trim() !== '');
    return lines.map(line => {
      const separatorIndex = line.indexOf(': ');
      if (separatorIndex === -1) {
        return { speaker: 'Unknown', text: line };
      }
      return {
        speaker: line.substring(0, separatorIndex),
        text: line.substring(separatorIndex + 2),
      };
    });
  }, [transcript]);

  const flowPercentages = useMemo(() => {
    if (turns.length === 0) {
      return { human: 0, ai: 0, humanTurns: 0, aiTurns: 0 };
    }
    const humanTurns = turns.filter(turn => turn.speaker.toLowerCase().trim() !== 'ai').length;
    const aiTurns = turns.length - humanTurns;
    const human = (humanTurns / turns.length) * 100;
    const ai = (aiTurns / turns.length) * 100;
    return { human, ai, humanTurns, aiTurns };
  }, [turns]);


  return (
    <div className="insight-card" style={styles.container}>
      <h2 style={styles.title}>Flow</h2>
      <div style={styles.flowBar}>
        <div
          style={{
            ...styles.barSegment,
            width: `${flowPercentages.human}%`,
            backgroundColor: 'var(--human-color)',
          }}
          title={`Human: ${flowPercentages.humanTurns} turns (${flowPercentages.human.toFixed(1)}%)`}
        />
        <div
          style={{
            ...styles.barSegment,
            width: `${flowPercentages.ai}%`,
            backgroundColor: 'var(--ai-color)',
          }}
          title={`AI: ${flowPercentages.aiTurns} turns (${flowPercentages.ai.toFixed(1)}%)`}
        />
      </div>
      <div style={styles.legend}>
        <div style={styles.legendItem}>
          <span style={{...styles.legendColor, backgroundColor: 'var(--human-color)'}}></span> Human ({flowPercentages.human.toFixed(0)}%)
        </div>
        <div style={styles.legendItem}>
          <span style={{...styles.legendColor, backgroundColor: 'var(--ai-color)'}}></span> AI ({flowPercentages.ai.toFixed(0)}%)
        </div>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    padding: '20px 24px',
    height: '100%',
  },
  title: {
    margin: '0 0 16px 0',
    fontSize: '1.25em',
  },
  flowBar: {
    display: 'flex',
    width: '100%',
    height: '24px',
    borderRadius: '6px',
    overflow: 'hidden',
    backgroundColor: 'var(--subtle-background)',
  },
  barSegment: {
    height: '100%',
    minWidth: '2px',
    transition: 'width 0.3s ease-in-out',
  },
  legend: {
    display: 'flex',
    gap: '20px',
    marginTop: '12px',
    fontSize: '0.9em',
  },
  legendItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  legendColor: {
    display: 'inline-block',
    width: '12px',
    height: '12px',
    borderRadius: '3px',
  }
};

export default ConversationFlowViz;