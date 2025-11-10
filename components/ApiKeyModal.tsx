import React, { useState } from 'react';
import Modal from './Modal';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (apiKey: string) => void;
}

const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [apiKey, setApiKey] = useState('');

  const handleSubmit = () => {
    if (apiKey.trim()) {
      onSubmit(apiKey.trim());
      setApiKey(''); // Clear field after submit
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Enter Your Gemini API Key">
      <div style={styles.content}>
        <p style={styles.paragraph}>
          To use the Vibe Check Lab, please provide your own Google Gemini API key.
          Your key is stored only in your browser for this session and is not sent to our servers.
        </p>
        <p style={styles.paragraph}>
          You can get a free API key from{' '}
          <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" style={styles.link}>
            Google AI Studio
          </a>.
        </p>
        <input
          type="password"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
          placeholder="Enter your API key here"
          style={styles.input}
          aria-label="Gemini API Key"
        />
        <button onClick={handleSubmit} disabled={!apiKey.trim()} className="primary-button" style={styles.button}>
          Save and Analyze
        </button>
      </div>
    </Modal>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  content: {
    textAlign: 'center',
  },
  paragraph: {
    margin: '0 0 16px 0',
    color: 'var(--text-color-secondary)',
    lineHeight: 1.6,
    textAlign: 'left',
  },
  link: {
    color: 'var(--primary-accent)',
    textDecoration: 'underline',
    fontWeight: 'bold',
  },
  input: {
    width: '100%',
    padding: '12px',
    fontSize: '1em',
    border: '1px solid var(--border-color)',
    borderRadius: 'var(--border-radius)',
    backgroundColor: 'var(--card-background)',
    color: 'var(--text-color)',
    marginTop: '8px',
    boxSizing: 'border-box',
  },
  button: {
    marginTop: '24px',
    width: '100%',
  },
};

export default ApiKeyModal;
