import React, { useState, useEffect } from 'react';
import WordFlowAnimation from './WordFlowAnimation';

const loadingMessages = [
  "mixing empathy reagents…",
  "boiling down discourse density…",
  "condensing tone molecules…",
  "stabilizing politeness compounds…",
  "isolating emotional gradients…",
  "culturing conversational flow samples…",
  "adjusting semantic pH levels…",
  "distilling rapport particles…",
  "heating up linguistic synthesis chamber…",
  "preparing vibe analysis buffer…",
];

const LoadingSpinner: React.FC = () => {
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Select a random message when the component mounts
    const randomIndex = Math.floor(Math.random() * loadingMessages.length);
    setMessage(loadingMessages[randomIndex]);
  }, []);

  return (
    <div style={styles.container}>
        <WordFlowAnimation />
        <p style={styles.loadingText}>{message}</p>
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
  loadingText: {
    marginTop: '20px',
    fontSize: '1.2em',
    color: 'var(--text-color-secondary)',
    fontFamily: 'var(--font-accent)',
  },
};

export default LoadingSpinner;