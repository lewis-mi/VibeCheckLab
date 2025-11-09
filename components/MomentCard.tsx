import React from 'react';
import type { Moment } from '../types';
import { ArrowUpIcon, ArrowDownIcon } from './icons';

interface MomentCardProps {
  moment: Moment;
}

const getConstructColor = (construct: string) => {
    const lowerConstruct = construct.toLowerCase();
    if (lowerConstruct.includes('rapport')) return 'var(--rapport-color)';
    if (lowerConstruct.includes('flow')) return 'var(--flow-color)';
    if (lowerConstruct.includes('empathy')) return 'var(--empathy-color)';
    return 'var(--default-construct-color)';
};

const MomentCard: React.FC<MomentCardProps> = ({ moment }) => {
  const isPositive = moment.impact === 'Positive';
  const color = getConstructColor(moment.construct);

  const containerStyle: React.CSSProperties = {
    ...styles.container,
    borderLeft: `4px solid ${color}`,
  };

  const constructStyle: React.CSSProperties = {
    ...styles.construct,
    color: color,
  };

  return (
    <div style={containerStyle} className="insight-card">
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
    padding: '16px 20px',
    border: 'none', // Shadow is handled by the insight-card class
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
    backgroundColor: 'var(--subtle-background)',
    border: '1px solid var(--border-color-light)',
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
    color: 'var(--text-color-secondary)',
  }
};

export default MomentCard;