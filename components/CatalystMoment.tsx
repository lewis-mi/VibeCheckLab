import React from 'react';
import type { KeyMoment } from '../types';

interface CatalystMomentProps {
  moment: KeyMoment;
}

const CatalystMoment: React.FC<CatalystMomentProps> = ({ moment }) => {
  if (!moment) return null;

  // Format snippet for better readability and consistency
  const formatSnippet = (snippet: string) => {
    // Replace "User:" with "Human:" for consistency with transcript view
    let formatted = snippet.replace(/User:/g, 'Human:');
    
    // Add a line break before a new speaker turn for clarity in exchanges
    // This looks for " AI:" or " Human:" that isn't at the very start of the string.
    formatted = formatted.replace(/\s(AI:|Human:)/g, '\n$1');

    return formatted;
  };

  return (
    <div className="insight-card" style={styles.container}>
      <h2 style={styles.title}>Key Moment</h2>
      <blockquote style={styles.blockquote}>
        "{formatSnippet(moment.transcriptSnippet)}"
      </blockquote>
      <p style={styles.analysis}>{moment.analysis}</p>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    padding: '20px 24px',
    height: '100%',
  },
  title: {
    margin: '0 0 12px 0',
    fontSize: '1.25em',
  },
  blockquote: {
    margin: '0 0 16px 0',
    padding: '12px',
    fontStyle: 'italic',
    backgroundColor: 'var(--subtle-background)',
    borderLeft: `4px solid var(--primary-accent)`,
    whiteSpace: 'pre-wrap',
  },
  analysis: {
    margin: 0,
    lineHeight: 1.6,
    color: 'var(--text-color)',
  }
};

export default CatalystMoment;
