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
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    // Cycle through messages to create a sense of progress
    const intervalId = setInterval(() => {
      setMessageIndex((prevIndex) => (prevIndex + 1) % loadingMessages.length);
    }, 1500); // Timed to sync with the 1.5s fade animation in index.html

    return () => clearInterval(intervalId); // Cleanup on component unmount
  }, []);

  return (
    <div style={styles.container}>
        <WordFlowAnimation />
        {/* The key prop is crucial here. It forces React to re-mount the <p> element
            when the message changes, which re-triggers the CSS animation. */}
        <p key={messageIndex} style={styles.loadingText} className="anim-fade-in-out">
            {loadingMessages[messageIndex]}
        </p>
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
    height: '2em', // Prevents layout shift between messages
    display: 'flex',
    alignItems: 'center',
  },
};

export default LoadingSpinner;
