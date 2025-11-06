import React, { useState, useCallback, useEffect } from 'react';
import { analyzeTranscript } from './services/geminiService';
import type { AnalysisResult } from './types';
import TranscriptInput from './components/TranscriptInput';
import AnalysisDisplay from './components/AnalysisDisplay';
import LoadingSpinner from './components/LoadingSpinner';
import RecentPanel from './components/HistoryPanel';
import { useLocalStorage } from './hooks';
import HeaderLogo from './components/HeaderLogo';
import Modal from './components/Modal';
import ErrorDisplay from './components/ErrorDisplay';

type View = 'input' | 'loading' | 'report';
export type RecentItem = {
  id: string;
  transcript: string;
  analysis: AnalysisResult;
  timestamp: string;
};

const App: React.FC = () => {
  const [view, setView] = useState<View>('input');
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [recentItems, setRecentItems] = useLocalStorage<RecentItem[]>('vibe-check-history', []);
  const [currentTranscript, setCurrentTranscript] = useState('');
  const [isRecentOpen, setIsRecentOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);

  // State to track screen size for responsive design
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Effect to listen for window resize events
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleAnalyze = async (transcript: string) => {
    setView('loading');
    setError(null);
    setCurrentTranscript(transcript);

    try {
      const result = await analyzeTranscript(transcript);
      setAnalysis(result);
      
      const newRecentItem: RecentItem = {
        id: new Date().toISOString(),
        transcript,
        analysis: result,
        timestamp: new Date().toLocaleString(),
      };
      setRecentItems([newRecentItem, ...recentItems]);

      setView('report');
    } catch (err) {
      console.error(err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred during analysis. Please try again.');
      }
      setView('input');
    }
  };

  const handleReset = () => {
    setView('input');
    setAnalysis(null);
    setError(null);
    setCurrentTranscript('');
  };

  const handleDismissError = () => {
    setError(null);
  };

  const handleSelectRecent = useCallback((item: RecentItem) => {
    setAnalysis(item.analysis);
    setCurrentTranscript(item.transcript);
    setView('report');
    setIsRecentOpen(false);
  }, []);

  const handleClearRecent = () => {
    setRecentItems([]);
    handleReset();
    setIsRecentOpen(false);
  };

  const renderView = () => {
    switch (view) {
      case 'loading':
        return <LoadingSpinner />;
      case 'report':
        return analysis && (
          <AnalysisDisplay 
            analysis={analysis} 
            onReset={handleReset} 
            transcript={currentTranscript} 
            isMobile={isMobile}
          />
        );
      case 'input':
      default:
        return (
          <>
            {error && <ErrorDisplay message={error} onDismiss={handleDismissError} />}
            <TranscriptInput 
              onSubmit={handleAnalyze} 
              // FIX: The `isLoading` prop is set to false because this component only renders
              // when `view` is 'input'. The comparison `view === 'loading'` would always be false
              // in this context, causing a TypeScript error.
              isLoading={false} 
            />
          </>
        );
    }
  };

  const headerStyle = {
    ...styles.header,
    padding: isMobile ? '40px 24px 20px' : '40px 96px 20px',
  };

  const viewContainerStyle = {
      ...styles.viewContainer,
      padding: isMobile ? '24px' : '40px',
  };

  return (
    <div style={styles.appContainer}>
      <header style={headerStyle}>
        <HeaderLogo isClickable={view !== 'input'} onClick={handleReset} />
        <div>
          <button className="ghost-button" style={{ border: 'none', marginRight: '16px' }} onClick={() => setIsAboutOpen(true)}>About</button>
          <button className="ghost-button" style={{ border: 'none' }} onClick={() => setIsRecentOpen(true)}>Recent</button>
        </div>
      </header>
      <main style={viewContainerStyle}>
          {renderView()}
      </main>
      <RecentPanel 
        recentItems={recentItems} 
        onSelect={handleSelectRecent} 
        onClear={handleClearRecent}
        isOpen={isRecentOpen}
        onClose={() => setIsRecentOpen(false)}
      />
      <Modal
        isOpen={isAboutOpen}
        onClose={() => setIsAboutOpen(false)}
        title="About Vibe Check Lab"
      >
        <div>
          <p>
            The Vibe Check Lab is an AI-powered conversation analysis tool designed for students, researchers, and anyone curious about the mechanics of human-computer interaction.
          </p>
          <p>
            Simply paste in a transcript, and the lab will provide an in-depth analysis grounded in established linguistic theories, including:
          </p>
          <ul style={{ paddingLeft: '20px', listStyle: 'none' }}>
            <li style={{ marginBottom: '16px' }}>
                <strong>Politeness Theory:</strong> How we manage social-face and rapport.
                <div style={{ fontSize: '0.9em', color: '#666', marginTop: '4px' }}>
                    <em>Key Source: Brown & Levinson (1987). 'Politeness: Some Universals in Language Usage.'</em>
                </div>
            </li>
            <li style={{ marginBottom: '16px' }}>
                <strong>Speech Act Theory:</strong> The actions we perform with words (e.g., promising, warning, apologizing).
                <div style={{ fontSize: '0.9em', color: '#666', marginTop: '4px' }}>
                    <em>Key Source: J. L. Austin (1962). 'How to Do Things with Words.'</em>
                </div>
            </li>
            <li style={{ marginBottom: '16px' }}>
                <strong>Conversation Analysis:</strong> The structure of conversation, like turn-taking and flow.
                <div style={{ fontSize: '0.9em', color: '#666', marginTop: '4px' }}>
                    <em>Key Source: Sacks, Schegloff, & Jefferson (1974). 'A simplest systematics for the organization of turn-taking for conversation.'</em>
                </div>
            </li>
             <li style={{ marginBottom: '16px' }}>
                <strong>Conversational Implicature:</strong> How meaning is conveyed beyond literal words through shared context.
                <div style={{ fontSize: '0.9em', color: '#666', marginTop: '4px' }}>
                    <em>Key Source: Paul Grice (1975). 'Logic and Conversation.'</em>
                </div>
            </li>
            <li style={{ marginBottom: '16px' }}>
                <strong>Discourse Analysis:</strong> How sentences are woven together to create a cohesive and coherent conversation.
                <div style={{ fontSize: '0.9em', color: '#666', marginTop: '4px' }}>
                    <em>Key Source: Halliday & Hasan (1976). 'Cohesion in English.'</em>
                </div>
            </li>
            <li>
                <strong>Accommodation Theory:</strong> How we adjust our communication style to signal social closeness or distance.
                <div style={{ fontSize: '0.9em', color: '#666', marginTop: '4px' }}>
                    <em>Key Source: Giles, H. (1973). 'Accent mobility: a model and some data.'</em>
                </div>
            </li>
          </ul>
          <p>
            This tool is for educational and exploratory purposes to help make complex academic concepts more accessible and applicable to real-world conversations.
          </p>
        </div>
      </Modal>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  appContainer: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    backgroundColor: '#FFFFFF',
    position: 'relative',
    overflow: 'hidden'
  },
  header: {
    borderBottom: '1px solid #000',
    flexShrink: 0,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  viewContainer: {
    flex: '1 1 auto',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
};

export default App;
