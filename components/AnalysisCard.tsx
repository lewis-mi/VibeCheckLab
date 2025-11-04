import React, { ReactNode } from 'react';

interface AnalysisCardProps {
  title: string;
  children: ReactNode;
  borderColor?: string;
}

const AnalysisCard: React.FC<AnalysisCardProps> = ({ title, children, borderColor }) => {
  const cardStyle: React.CSSProperties = {
    ...styles.card,
    border: borderColor ? `1px solid ${borderColor}` : 'var(--border)',
  };

  return (
    <div style={cardStyle}>
      <h3 style={styles.title}>{title}</h3>
      {children}
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  card: {
    border: 'var(--border)',
    borderRadius: 'var(--border-radius)',
    padding: '16px',
    backgroundColor: '#fff',
    width: '100%',
    boxSizing: 'border-box',
    marginTop: '20px',
  },
  title: {
    marginTop: 0,
    marginBottom: '16px',
    fontSize: '1.2em'
  }
};

export default AnalysisCard;