import React, { useState, useRef, useEffect } from 'react';
import { sampleTranscripts } from '../data/sampleTranscripts';
import CustomSelect from './CustomSelect';
import { WarningIcon } from './icons';

interface TranscriptInputProps {
  onSubmit: (transcript: string) => void;
  isLoading: boolean;
  isMobile: boolean;
}

const EmptyStateOnboarding: React.FC = () => (
  <div style={styles.emptyStateContainer}>
    <h3 style={styles.emptyStateTitle}>Welcome to the vibe check lab!</h3>
    <p style={styles.emptyStateText}>Start your first analysis in two simple steps:</p>
    <ol style={styles.emptyStateList}>
      <li style={styles.emptyStateListItem}>Select one of our curated examples from the dropdown menu above.</li>
      <li style={styles.emptyStateListItem}>Click "Check the vibe" to see the report.</li>
    </ol>
  </div>
);

const TranscriptInput: React.FC<TranscriptInputProps> = ({ onSubmit, isLoading, isMobile }) => {
  const [activeTab, setActiveTab] = useState<'examples' | 'custom'>('examples');
  const [customTranscript, setCustomTranscript] = useState('');
  const [selectedExampleId, setSelectedExampleId] = useState<string>('');
  const [examplePreview, setExamplePreview] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);
  
  const tabRefs = {
    examples: useRef<HTMLButtonElement>(null),
    custom: useRef<HTMLButtonElement>(null),
  };
  const [underlineStyle, setUnderlineStyle] = useState({});

  useEffect(() => {
    const activeTabRef = tabRefs[activeTab];
    if (activeTabRef.current) {
      setUnderlineStyle({
        left: activeTabRef.current.offsetLeft,
        width: activeTabRef.current.offsetWidth,
      });
    }
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === 'custom') {
      // Character limit check
      if (customTranscript.length > 10000) {
        setValidationError('Transcripts must be under 10,000 characters.');
        return;
      }
      if (customTranscript.trim().length > 0 && customTranscript.trim().length < 25) {
        setValidationError('Please provide a transcript with at least 25 characters for a meaningful analysis.');
        return;
      }

      // PII Patterns - Enhanced for better detection
      const piiPatterns = [
        { name: 'email address', pattern: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/gi },
        { name: 'phone number', pattern: /\b(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b/gi },
        { name: 'credit card number', pattern: /\b(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|6(?:011|5[0-9]{2})[0-9]{12}|3[47][0-9]{13})\b/gi },
        { name: 'Social Security Number', pattern: /\b\d{3}-\d{2}-\d{4}\b/gi },
        { name: 'IP address', pattern: /\b((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\b/gi }
      ];

      for (const pii of piiPatterns) {
        // Reset the regex state before testing
        pii.pattern.lastIndex = 0;
        if (pii.pattern.test(customTranscript)) {
          setValidationError(`We detected a potential ${pii.name}. Please remove all personal information before analyzing.`);
          return;
        }
      }

      // If all checks pass, clear error
      setValidationError(null);
    } else {
      // Clear error when switching tabs
      setValidationError(null);
    }
  }, [customTranscript, activeTab]);

  const handleExampleChange = (id: string) => {
    setSelectedExampleId(id);
    if (id) {
      const selected = sampleTranscripts.find(s => s.id === id);
      if (selected) {
        const text = selected.turns.map(turn => `${turn.speaker}: ${turn.text}`).join('\n');
        setExamplePreview(text);
      }
    } else {
      setExamplePreview('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const transcriptToSubmit = activeTab === 'examples' ? examplePreview : customTranscript;
    
    // The button is disabled, but as a fallback, don't submit if invalid.
    if (isSubmitDisabled) return;

    const lines = transcriptToSubmit.split('\n').filter(line => line.trim() !== '');
    if (lines.length < 2) {
      alert("Whoa there! A monologue doesn't have a 'vibe.' Please provide a conversation with at least two lines.");
      return;
    }
    
    onSubmit(transcriptToSubmit);
  };
  
  const charCount = customTranscript.length;
  const charLimit = 10000;
  const isOverLimit = charCount > charLimit;

  const isSubmitDisabled = isLoading || 
    (activeTab === 'examples' && !selectedExampleId) || 
    (activeTab === 'custom' && (customTranscript.trim().length < 25 || !!validationError));

  const exampleOptions = sampleTranscripts.map(example => ({
    value: example.id,
    label: example.title
  }));
  
  const charCountStyle: React.CSSProperties = {
    ...styles.charCount,
    color: isOverLimit ? '#DC2626' : 'var(--text-color-secondary)',
  };

  const mainHeadlineStyle: React.CSSProperties = {
    ...styles.mainHeadline,
    fontSize: isMobile ? '1.5em' : '1.8em',
  };
  
  const inputCardStyle: React.CSSProperties = {
    ...styles.inputCard,
    padding: isMobile ? '24px' : '32px 48px',
  };

  return (
    <div style={styles.container}>
      <h1 style={mainHeadlineStyle}>
        <span style={styles.headlinePart1}>Overthink a conversation...</span>
        <br />
        <em style={styles.headlinePart2}>but with science. ✨</em>
      </h1>
      <div style={inputCardStyle} className="anim-pop-in">
        <div style={styles.tabSwitcher}>
          <button 
            ref={tabRefs.examples}
            style={{...styles.tabButton, color: activeTab === 'examples' ? 'var(--text-color)' : 'var(--text-color-secondary)'}}
            onClick={() => setActiveTab('examples')}
            aria-pressed={activeTab === 'examples'}
          >
            Example Transcripts
          </button>
          <button 
            ref={tabRefs.custom}
            style={{...styles.tabButton, color: activeTab === 'custom' ? 'var(--text-color)' : 'var(--text-color-secondary)'}}
            onClick={() => setActiveTab('custom')}
            aria-pressed={activeTab === 'custom'}
          >
            Analyze Your Own
          </button>
          <div style={{...styles.tabUnderline, ...underlineStyle}}></div>
        </div>

        <div style={styles.tabContent}>
          {activeTab === 'examples' ? (
            <div id="example-transcript-list">
              <label htmlFor="example-transcript-select" style={styles.selectLabel}>
                Choose a sample conversation
              </label>
              <p style={styles.dropdownHelperText}>
                Transcripts were generated by Gemini to represent a variety of conversational dynamics.
              </p>
              <CustomSelect
                options={exampleOptions}
                value={selectedExampleId}
                onChange={handleExampleChange}
                placeholder="Select an example..."
              />
              {selectedExampleId ? (
                <textarea
                  style={styles.examplePreview}
                  value={examplePreview}
                  readOnly
                  aria-label="Example transcript preview"
                />
              ) : (
                <div style={styles.examplePreview}>
                    <EmptyStateOnboarding />
                </div>
              )}
            </div>
          ) : (
            <div>
              <p style={styles.helperText}>For best results, use task-oriented transcripts like customer support chats or booking interactions.</p>
              <textarea
                id="transcript-textarea"
                style={styles.textarea}
                value={customTranscript}
                onChange={(e) => setCustomTranscript(e.target.value)}
                placeholder="Human: Hi, how are you?&#10;AI: I am an AI, I don't have feelings.&#10;(Paste your transcript here...)"
                aria-label="Transcript Input"
                disabled={isLoading}
              />
              <div style={styles.textareaFooter}>
                {validationError ? (
                  <div style={styles.validationError}>
                      <div style={{ flexShrink: 0 }}><WarningIcon /></div>
                      <span style={{ flex: 1 }}>{validationError}</span>
                  </div>
                ) : <div />}
                <div style={charCountStyle}>
                    {charCount} / {charLimit}
                </div>
              </div>
            </div>
          )}
        </div>
        
        <button
          id="analyze-button"
          onClick={handleSubmit}
          className="primary-button"
          disabled={isSubmitDisabled}
          style={{marginTop: '40px', width: '100%'}}
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
    fontSize: '1.8em',
    fontWeight: 700,
    marginBottom: '40px',
    textAlign: 'center',
    lineHeight: 1.3,
  },
  headlinePart1: {
    color: 'var(--text-color)',
    fontWeight: 700,
  },
  headlinePart2: {
    color: 'var(--text-color)',
    fontWeight: 400,
    fontStyle: 'italic',
  },
  inputCard: {
    border: 'none',
    borderRadius: 'var(--border-radius-lg)',
    padding: '32px 48px',
    width: '100%',
    backgroundColor: 'var(--card-background)',
    boxShadow: 'var(--shadow-subtle)',
  },
  tabSwitcher: {
    display: 'flex',
    position: 'relative',
    borderBottom: '1px solid var(--border-color-light)',
    marginBottom: '24px',
  },
  tabButton: {
    flex: '1',
    padding: '12px 15px',
    border: 'none',
    background: 'none',
    cursor: 'pointer',
    fontSize: '1em',
    fontWeight: '700',
    transition: 'color 0.3s ease',
  },
  tabUnderline: {
    position: 'absolute',
    bottom: '-1px',
    height: '2px',
    backgroundColor: 'var(--primary-accent)',
    transition: 'left 0.3s ease, width 0.3s ease',
  },
  tabContent: {
    minHeight: '300px',
  },
  helperText: {
    fontSize: '0.85em',
    color: 'var(--text-color-secondary)',
    marginTop: 0,
    marginBottom: '8px',
    minHeight: '20px',
    textAlign: 'left',
  },
  dropdownHelperText: {
    fontSize: '0.85em',
    color: 'var(--text-color-secondary)',
    textAlign: 'left',
    marginTop: '4px',
    marginBottom: '12px',
  },
  selectLabel: {
    display: 'block',
    textAlign: 'left',
    fontSize: '0.9em',
    fontWeight: 700,
    color: 'var(--text-color)',
    marginBottom: '8px',
  },
  examplePreview: {
    width: '100%',
    height: '240px',
    border: '1px solid var(--border-color-light)',
    borderRadius: 'var(--border-radius)',
    padding: '12px',
    boxSizing: 'border-box',
    backgroundColor: 'var(--subtle-background)',
    color: 'var(--text-color-secondary)',
    fontFamily: 'var(--font-accent)',
    fontSize: '0.9em',
    resize: 'none',
    lineHeight: 1.6,
    marginTop: '16px'
  },
  textarea: {
    width: '100%',
    height: '280px',
    border: '1px solid var(--border-color-light)',
    borderRadius: 'var(--border-radius)',
    outline: 'none',
    resize: 'vertical',
    fontFamily: 'var(--font-accent)',
    fontSize: '1em',
    padding: '12px',
    boxSizing: 'border-box',
    backgroundColor: 'var(--subtle-background)',
    color: 'var(--text-color-body)',
    lineHeight: 1.6,
  },
  textareaFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginTop: '12px',
    gap: '12px',
  },
  charCount: {
    fontFamily: 'var(--font-accent)',
    fontSize: '0.9em',
    color: 'var(--text-color-secondary)',
    flexShrink: 0,
  },
  validationError: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    color: 'var(--text-color-secondary)',
    backgroundColor: 'var(--subtle-background)',
    border: '1px solid var(--border-color-light)',
    borderRadius: 'var(--border-radius)',
    padding: '8px 12px',
    fontSize: '0.9em',
    textAlign: 'left',
    flex: 1,
  },
  emptyStateContainer: {
    width: '100%',
    height: '100%',
    padding: '16px',
    boxSizing: 'border-box',
    color: 'var(--text-color-secondary)',
    textAlign: 'left',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  emptyStateTitle: {
    margin: '0 0 8px 0',
    fontSize: '1.1em',
    fontWeight: 700,
    color: 'var(--text-color)',
  },
  emptyStateText: {
    margin: '0 0 8px 0',
  },
  emptyStateList: {
    margin: 0,
    paddingLeft: '20px',
  },
  emptyStateListItem: {
    marginBottom: '4px',
  },
};

export default TranscriptInput;