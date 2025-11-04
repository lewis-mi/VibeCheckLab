import React from 'react';
import WordFlowAnimation from './WordFlowAnimation';

const LoadingSpinner: React.FC = () => {
  return (
    <div style={styles.container}>
        <WordFlowAnimation />
        <h1 style={styles.mainHeadline}>Locating the 'Adjacency Pairs'...</h1>
    </div>
  );
};

const styles: { [key:string]: React.CSSProperties } = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    flex: 1,
  },
   mainHeadline: {
    fontSize: '1.5em',
    fontWeight: 700,
    marginTop: '20px',
    maxWidth: '400px',
  },
};

export default LoadingSpinner;