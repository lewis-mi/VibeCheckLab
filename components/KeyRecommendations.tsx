import React from 'react';
import type { KeyFormulation } from '../types';
import { getFormulationColorByIndex } from '../utils/colorUtils';

interface KeyRecommendationsProps {
  formulations: KeyFormulation[];
}

const KeyRecommendations: React.FC<KeyRecommendationsProps> = ({ formulations }) => {
  if (!formulations || formulations.length === 0) {
    return null;
  }
  
  return (
    <div style={styles.container} className="insight-card">
      <div style={styles.header}>
        <h2 style={styles.title}>✨ Key Formulations</h2>
      </div>
      <ul style={styles.list}>
        {formulations.map((item, index) => {
          const itemStyle: React.CSSProperties = {
            ...styles.listItem,
            borderLeft: `4px solid var(${getFormulationColorByIndex(index)})`,
          };
          
          return (
            <li key={index} style={itemStyle}>
              <h3 style={styles.formulationTitle}>{item.title}</h3>
              <p style={styles.tipText}>{item.description}</p>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    backgroundColor: 'var(--card-background)',
    padding: '20px 24px',
    marginBottom: '30px',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    color: 'var(--text-color)',
    marginBottom: '16px',
  },
  title: {
    margin: 0,
    fontSize: '1.25em',
  },
  list: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  listItem: {
    paddingLeft: '16px',
  },
  formulationTitle: {
    margin: '0 0 4px 0',
    fontSize: '1em',
    fontWeight: 700,
  },
  tipText: {
    margin: 0,
    lineHeight: 1.6,
    color: 'var(--text-color-secondary)',
  }
};

export default KeyRecommendations;