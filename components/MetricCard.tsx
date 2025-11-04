import React, { useState } from 'react';
import type { DashboardMetric } from '../types';
import { ArrowRightIcon } from './icons';

interface MetricCardProps extends DashboardMetric {
  onClick: () => void;
}

const MetricCard: React.FC<MetricCardProps> = ({ metric, keyFinding, analysis, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  const cardStyle: React.CSSProperties = {
    ...styles.card,
    ...(isHovered ? styles.cardHover : {})
  };
  
  const footerStyle: React.CSSProperties = {
    ...styles.footer,
    ...(isHovered ? styles.footerHover : {})
  }

  return (
    <div 
      style={cardStyle} 
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      role="button"
      tabIndex={0}
      onKeyPress={(e) => e.key === 'Enter' && onClick()}
    >
      <h3 style={styles.title}>{metric}</h3>
      <h2 style={styles.keyFinding}>{keyFinding}</h2>
      <p style={styles.analysis}>{analysis}</p>
      <div style={footerStyle}>
        <span style={{marginRight: '4px'}}>Deep Dive...</span>
        <ArrowRightIcon />
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  card: {
    border: 'var(--border)',
    borderRadius: 'var(--border-radius)',
    padding: '16px',
    backgroundColor: '#fff',
    display: 'flex',
    flexDirection: 'column',
    cursor: 'pointer',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
  },
  cardHover: {
    transform: 'translateY(-4px)',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  },
  title: {
    marginTop: 0,
    marginBottom: '12px',
    fontSize: '1em',
    fontWeight: 700,
    color: '#000000',
  },
  keyFinding: {
    color: '#5f6368',
    fontSize: '1.75em',
    fontWeight: 'bold',
    margin: '10px 0',
  },
  analysis: {
    fontSize: '0.9em',
    lineHeight: 1.5,
    margin: 0,
    color: '#333',
  },
  footer: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 'auto',
    paddingTop: '16px',
    fontSize: '0.9em',
    fontWeight: 700,
    color: '#666',
    transition: 'color 0.2s ease',
  },
  footerHover: {
    color: '#000',
  }
};

export default MetricCard;