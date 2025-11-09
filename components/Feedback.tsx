import React from 'react';
import { useLocalStorage } from '../hooks';
import { ThumbsUpIcon, ThumbsDownIcon } from './icons';

interface FeedbackProps {
  analysisId: string | null;
}

const Feedback: React.FC<FeedbackProps> = ({ analysisId }) => {
  const [feedback, setFeedback] = useLocalStorage<Record<string, 'yes' | 'no'>>('vibe-check-feedback', {});

  const hasSubmitted = analysisId && feedback[analysisId];

  const handleFeedback = (response: 'yes' | 'no') => {
    if (!analysisId) return;
    setFeedback(prev => ({ ...prev, [analysisId]: response }));
    // In a real application, this would send to an analytics endpoint.
    console.log(`Feedback submitted for analysis ${analysisId}: ${response}`);
  };

  if (!analysisId) {
    return null;
  }

  if (hasSubmitted) {
    return (
      <div style={styles.container}>
        <p style={styles.thanks}>Thanks for your feedback!</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <p style={styles.question}>Was this analysis helpful?</p>
      <div style={styles.buttonGroup}>
        <button style={styles.feedbackButton} onClick={() => handleFeedback('yes')} aria-label="Yes, this was helpful">
          <ThumbsUpIcon /> Yes
        </button>
        <button style={styles.feedbackButton} onClick={() => handleFeedback('no')} aria-label="No, this was not helpful">
          <ThumbsDownIcon /> No
        </button>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    textAlign: 'center',
    padding: '16px',
    backgroundColor: 'var(--subtle-background)',
    borderRadius: 'var(--border-radius)',
    border: '1px solid var(--border-color-light)',
    width: '100%',
    maxWidth: '400px',
  },
  question: {
    margin: '0 0 12px 0',
    fontWeight: 700,
    fontSize: '1em',
  },
  thanks: {
    margin: 0,
    fontWeight: 700,
    color: 'var(--text-color-secondary)',
  },
  buttonGroup: {
    display: 'flex',
    justifyContent: 'center',
    gap: '12px',
  },
  feedbackButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 16px',
    fontSize: '0.9em',
    border: '1px solid var(--border-color)',
    borderRadius: 'var(--border-radius)',
    backgroundColor: 'transparent',
    color: 'var(--text-color)',
    cursor: 'pointer',
    fontWeight: 700,
    transition: 'background-color 0.2s ease',
  },
};

export default Feedback;