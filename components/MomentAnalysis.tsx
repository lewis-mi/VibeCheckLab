import React from 'react';
import type { Moment } from '../types';
import MomentCard from './MomentCard';

interface MomentAnalysisProps {
  moments: Moment[];
}

const MomentAnalysis: React.FC<MomentAnalysisProps> = ({ moments }) => {
  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Conversational Breakdown</h2>
      <div style={styles.grid}>
        {moments.map((moment, index) => (
          <MomentCard key={index} moment={moment} />
        ))}
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    width: '100%',
    marginTop: '40px',
    paddingTop: '20px',
    borderTop: '1px solid #eee',
  },
  header: {
    fontSize: '1em',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    color: '#5f6368',
    marginBottom: '20px',
    textAlign: 'center',
  },
  grid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
};

export default MomentAnalysis;
