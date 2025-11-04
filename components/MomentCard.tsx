import React from 'react';
import type { Moment } from '../types';
import { ArrowUpIcon, ArrowDownIcon } from './icons';

interface MomentCardProps {
  moment: Moment;
}

const MomentCard: React.FC<MomentCardProps> = ({ moment }) => {
  const isPositive = moment.impact === 'Positive';
  const color = isPositive ? 'var(--primary-lime)' : '#F59E0B'; // Using a warm orange for negative impact

  const containerStyle: React.CSSProperties = {
    ...styles.container,
    borderLeft: `4px solid ${color}`,
  };

  const constructStyle: React.CSSProperties = {
    ...styles.construct,
    color: color,
  };

  return (
    <div style={containerStyle}>
      <div style={styles.header}>
        <h3 style={constructStyle}>
          {moment.construct} {isPositive ? <ArrowUpIcon /> : <ArrowDownIcon />}
        </h3>
      </div>
      <blockquote style={styles.blockquote}>"{moment.transcriptSnippet}"</blockquote>
      <div style={styles.details}>
        <div>
          <h4 style={styles.subheading}>Why it matters:</h4>
          <p style={styles.text}>{moment.explanation}</p>
        </div>
        <div>
          <h4 style={styles.subheading}>Redesign Tip:</h4>
          <p style={styles.text}>{moment.redesignTip}</p>
        </div>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    backgroundColor: '#f9fafb',
    borderRadius: 'var(--border-radius)',
    padding: '16px 20px',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '12px',
  },
  construct: {
    margin: 0,
    fontSize: '1.1em',
    fontWeight: 700,
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  blockquote: {
    margin: '0 0 16px 0',
    padding: '12px',
    fontStyle: 'italic',
    backgroundColor: '#fff',
    border: '1px solid #eee',
    borderRadius: '4px',
    whiteSpace: 'pre-line',
  },
  details: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px',
  },
  subheading: {
    margin: '0 0 4px 0',
    fontSize: '0.9em',
    fontWeight: 700,
  },
  text: {
    margin: 0,
    fontSize: '0.9em',
    lineHeight: 1.6,
    color: '#374151',
  }
};

export default MomentCard;
