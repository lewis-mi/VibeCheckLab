import React, { useState } from 'react';

interface TranscriptInputProps {
  onSubmit: (transcript: string) => void;
  isLoading: boolean;
}

const EXAMPLE_TRANSCRIPT = `Human: Hi, I'm having trouble with my order #A452. It hasn't arrived.
AI: I can help with that. I see your order was marked as delivered yesterday. Can you confirm your shipping address is 123 Maple Street?
Human: Yes, that's correct. But I haven't seen it. I checked with my neighbors too.
AI: I understand your frustration. I can issue a replacement to be shipped out immediately. Would that work for you?
Human: Yes, please. Thank you so much for the quick help!`;

const TranscriptInput: React.FC<TranscriptInputProps> = ({ onSubmit, isLoading }) => {
  const [transcript, setTranscript] = useState('');

  const placeholderText = `Human: Hi, how are you?
AI: I am an AI, I don't have feelings.
Human: ...ok.

(Heads up: The lab excels at overthinking chatbot interactions—like customer service chats—more than creative, free-flowing conversations with generative AI.)`;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Empty Check
    if (!transcript.trim()) {
      alert("Please paste a transcript first!");
      return;
    }

    // 2. Line Count Check
    const lines = transcript.split('\n').filter(line => line.trim() !== '');
    if (lines.length < 2) {
      alert("Whoa there! A monologue doesn't have a 'vibe.' Please paste a conversation with at least two lines so I can properly overthink it.");
      return;
    }

    // 3. Max Length Check
    if (transcript.length > 10000) {
      alert("Whoa, that's a novel! The lab's beakers are overflowing. Please paste a shorter snippet (around 10,000 characters) so I can properly overthink it.");
      return;
    }
    
    onSubmit(transcript);
  };

  const handleLoadExample = () => {
    setTranscript(EXAMPLE_TRANSCRIPT);
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.mainHeadline}>Overthink a conversation.<br />But with science.</h1>
      <div style={styles.inputCard}>
        <h3>Paste your transcript below.</h3>
        <textarea
          style={styles.textarea}
          value={transcript}
          onChange={(e) => setTranscript(e.target.value)}
          placeholder={placeholderText}
          aria-label="Transcript Input"
          disabled={isLoading}
        />
        <div style={styles.exampleContainer}>
          Don't have a transcript handy?{' '}
          <button onClick={handleLoadExample} style={styles.exampleButton}>
            Try an example.
          </button>
        </div>
        <button
          onClick={handleSubmit}
          className="ghost-button"
          disabled={isLoading}
          style={{marginTop: '20px'}}
        >
          {isLoading ? 'Analyzing...' : 'Check the vibe.'}
        </button>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    width: '100%',
    maxWidth: '600px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
  },
  mainHeadline: {
    fontSize: '2.5em',
    fontWeight: 700,
    marginTop: '0px',
    marginBottom: '20px',
  },
  inputCard: {
    border: '1px solid #000',
    borderRadius: '8px',
    padding: '24px',
    width: '100%',
    backgroundColor: '#FFFFFF',
    textAlign: 'left',
  },
  textarea: {
    width: '100%',
    height: '150px',
    border: 'none',
    borderBottom: '1px solid #eee',
    outline: 'none',
    resize: 'vertical',
    fontFamily: 'inherit',
    fontSize: '1em',
    marginBottom: '10px',
    boxSizing: 'border-box',
    padding: '8px 0',
  },
  exampleContainer: {
    fontSize: '0.9em',
    color: '#666',
  },
  exampleButton: {
    background: 'none',
    border: 'none',
    color: '#000',
    textDecoration: 'underline',
    cursor: 'pointer',
    padding: 0,
    fontFamily: 'inherit',
    fontSize: 'inherit',
    fontWeight: 700,
  }
};

export default TranscriptInput;