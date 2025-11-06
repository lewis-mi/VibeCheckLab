import React, { useState } from 'react';
import type { DashboardMetric } from '../types';
import { ArrowRightIcon } from './icons';

interface MetricCardProps extends DashboardMetric {
  onClick: () => void;
}

const FlowBalanceBar: React.FC<{ balancePercent: number }> = ({ balancePercent }) => (
    <div style={barStyles.container}>
        <div style={barStyles.labels}>
            <span>Human</span>
            <span>AI</span>
        </div>
        <div style={barStyles.bar}>
            <div style={{ ...barStyles.fill, width: `${100 - balancePercent}%`, backgroundColor: 'var(--primary-teal)' }} />
            <div style={{ ...barStyles.fill, width: `${balancePercent}%`, backgroundColor: 'var(--primary-purple)' }} />
        </div>
    </div>
);

const barStyles: { [key: string]: React.CSSProperties } = {
    container: { margin: '10px 0' },
    labels: {
        display: 'flex',
        justifyContent: 'space-between',
        fontSize: '0.8em',
        fontWeight: 700,
        marginBottom: '4px',
    },
    bar: {
        width: '100%',
        height: '12px',
        backgroundColor: '#eee',
        borderRadius: '6px',
        display: 'flex',
        overflow: 'hidden',
    },
    fill: {
        height: '100%',
        transition: 'width 0.5s ease-in-out',
    }
}


const MetricCard: React.FC<MetricCardProps> = ({ metric, keyFinding, analysis, balancePercent, onClick }) => {
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
      {metric === 'Flow' && balancePercent !== undefined ? (
        <FlowBalanceBar balancePercent={balancePercent} />
      ) : (
        <h2 style={styles.keyFinding}>{keyFinding}</h2>
      )}
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