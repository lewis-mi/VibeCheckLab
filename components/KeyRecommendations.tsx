import React from 'react';
import type { RedesignTip } from '../types';
import { LightbulbIcon } from './icons';

interface KeyRecommendationsProps {
  tips: RedesignTip[];
}

const KeyRecommendations: React.FC<KeyRecommendationsProps> = ({ tips }) => {
  if (!tips || tips.length === 0) {
    return null;
  }
  
  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <LightbulbIcon />
        <h2 style={styles.title}>Top Design Takeaways</h2>
      </div>
      <ul style={styles.list}>
        {tips.map((item, index) => (
          <li key={index} style={styles.listItem}>
            <span style={styles.constructTag}>{item.construct}</span>
            <p style={styles.tipText}>{item.tip}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    border: '1px solid var(--primary-purple)',
    backgroundColor: '#FBF5FF',
    borderRadius: 'var(--border-radius)',
    padding: '20px 24px',
    marginBottom: '30px',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    color: 'var(--primary-purple)',
  },
  title: {
    margin: 0,
    fontSize: '1.25em',
  },
  list: {
    listStyle: 'none',
    padding: 0,
    marginTop: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  listItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  constructTag: {
    fontWeight: 700,
    fontSize: '0.9em',
    padding: '2px 8px',
    backgroundColor: 'rgba(122, 40, 203, 0.1)',
    borderRadius: '4px',
    alignSelf: 'flex-start',
  },
  tipText: {
    margin: 0,
    lineHeight: 1.6,
  }
};

export default KeyRecommendations;