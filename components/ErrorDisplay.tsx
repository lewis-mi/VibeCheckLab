import React from 'react';
import { XIcon, WarningIcon } from './icons';

interface ErrorDisplayProps {
  message: string;
  onDismiss: () => void;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ message, onDismiss }) => {
  return (
    <div style={styles.container} role="alert">
      <div style={styles.iconContainer}>
        <WarningIcon />
      </div>
      <div style={styles.textContainer}>
        <h4 style={styles.title}>Analysis Failed</h4>
        <p style={styles.message}>{message}</p>
      </div>
      <button onClick={onDismiss} style={styles.closeButton} aria-label="Dismiss error">
        <XIcon />
      </button>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    width: '100%',
    maxWidth: '600px',
    backgroundColor: '#FFFBEB',
    color: '#92400E',
    border: '1px solid #FBBF24',
    borderRadius: 'var(--border-radius)',
    padding: '16px',
    marginBottom: '20px',
    display: 'flex',
    alignItems: 'flex-start',
  },
  iconContainer: {
    flexShrink: 0,
    marginRight: '12px',
    color: '#D97706',
  },
  textContainer: {
    flex: '1 1 auto',
  },
  title: {
    margin: '0 0 4px 0',
    fontWeight: 700,
    color: '#92400E',
  },
  message: {
    margin: 0,
    fontSize: '0.9em',
  },
  closeButton: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: 0,
    marginLeft: '16px',
    color: '#92400E',
  },
};

export default ErrorDisplay;
