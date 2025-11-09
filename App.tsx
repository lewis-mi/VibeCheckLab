import React, { useState, useCallback, useEffect } from 'react';
import { analyzeTranscript } from './services/geminiService';
import type { AnalysisResult } from './types';
import TranscriptInput from './components/TranscriptInput';
import AnalysisDisplay from './components/AnalysisDisplay';
import LoadingSpinner from './components/LoadingSpinner';
import HistoryPanel from './components/HistoryPanel';
import { useLocalStorage } from './hooks';
import HeaderLogo from './components/HeaderLogo';
import Modal from './components/Modal';
import ErrorDisplay from './components/ErrorDisplay';
import ThemeToggle from './components/ThemeToggle';
import AcademicSources from './components/AcademicSources';
import Welcome from './components/Welcome';

export type View = 'input' | 'loading' | 'report' | 'sources';
export type RecentItem = {
  id: string;
  transcript: string;
  analysis: AnalysisResult;
  timestamp: string;
};
export type Theme = 'light' | 'dark';

const App: React.FC = () => {
  const [view, setView] = useState<View>('input');
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [recentItems, setRecentItems] = useLocalStorage<RecentItem[]>('vibe-check-history', []);
  const [currentTranscript, setCurrentTranscript] = useState('');
  const [currentAnalysisId, setCurrentAnalysisId] = useState<string | null>(null);
  const [isRecentOpen, setIsRecentOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [theme, setTheme] = useLocalStorage<Theme>('vibe-check-theme', 'dark');

  const [hasSeenWelcome, setHasSeenWelcome] = useLocalStorage('vibe-check-welcome-seen', false);

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

  // Effect to apply the current theme to the document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const handleAnalyze = async (transcript: string) => {
    setView('loading');
    setError(null);
    setCurrentTranscript(transcript);

    // Client-side rate limiting
    const requestTimestamps = JSON.parse(localStorage.getItem('vibe-check-requests') || '[]');
    const now = Date.now();
    const oneMinuteAgo = now - 60000;
    const recentRequests = requestTimestamps.filter((ts: number) => ts > oneMinuteAgo);

    if (recentRequests.length >= 5) {
      setError("You've made too many requests. Please wait a moment before trying again.");
      setView('input');
      return;
    }
    
    localStorage.setItem('vibe-check-requests', JSON.stringify([...recentRequests, now]));


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
      setCurrentAnalysisId(newRecentItem.id);

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
    setCurrentAnalysisId(null);
  };

  const handleDismissError = () => {
    setError(null);
  };

  const handleSelectRecent = useCallback((item: RecentItem) => {
    setAnalysis(item.analysis);
    setCurrentTranscript(item.transcript);
    setCurrentAnalysisId(item.id);
    setView('report');
    setIsRecentOpen(false);
  }, []);

  const handleClearRecent = () => {
    setRecentItems([]);
    handleReset();
    setIsRecentOpen(false);
  };

  const handleShowSources = () => {
    setIsAboutOpen(false);
    setView('sources');
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
            analysisId={currentAnalysisId}
          />
        );
      case 'sources':
        return <AcademicSources onBack={handleReset} />;
      case 'input':
      default:
        return (
          <>
            {error && <ErrorDisplay message={error} onDismiss={handleDismissError} />}
            <TranscriptInput 
              onSubmit={handleAnalyze} 
              isLoading={false} 
              isMobile={isMobile}
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
  
  const mainContent = (
      <>
        <header style={headerStyle}>
            <HeaderLogo isClickable={view !== 'input'} onClick={handleReset} isMobile={isMobile} />
            <div style={styles.headerActions}>
            <button className="text-button" onClick={() => setIsAboutOpen(true)}>about</button>
            <button id="recent-button" className="text-button" onClick={() => setIsRecentOpen(true)}>history</button>
            <ThemeToggle theme={theme} onToggle={toggleTheme} />
            </div>
        </header>
        <main style={viewContainerStyle}>
            {renderView()}
        </main>
        <HistoryPanel 
            recentItems={recentItems} 
            onSelect={handleSelectRecent} 
            onClear={handleClearRecent}
            isOpen={isRecentOpen}
            onClose={() => setIsRecentOpen(false)}
        />
        <Modal
            isOpen={isAboutOpen}
            onClose={() => setIsAboutOpen(false)}
            title="about the vibe check lab"
        >
            <div style={styles.aboutModalContainer}>
                <p style={styles.aboutModalParagraph}>
                    This tool is an exploratory tool designed specifically for analyzing conversations with chatbots and other conversational interfaces.
                </p>
                <p style={styles.aboutModalParagraph}>
                    Start by selecting one of our example transcripts, or paste a transcript from a customer service chat, and our lab assistant will provide an in-depth report on its dynamics.
                </p>
                <p style={styles.aboutModalParagraph}>
                    Each analysis is grounded in established academic frameworks and analyzed by Gemini. Want to learn more? Use the button below.
                </p>
                <div style={styles.aboutModalButtonContainer}>
                    <button className="secondary-button" onClick={handleShowSources}>
                        Consult The Lab Library
                    </button>
                </div>
            </div>
        </Modal>
      </>
  );

  return (
    <div style={styles.appContainer}>
        {!hasSeenWelcome 
            ? <Welcome onStart={() => setHasSeenWelcome(true)} isMobile={isMobile} />
            : mainContent
        }
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  appContainer: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    background: 'var(--background)',
    color: 'var(--text-color)',
    position: 'relative',
    overflow: 'hidden'
  },
  header: {
    borderBottom: '1px solid var(--border-color)',
    flexShrink: 0,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  headerActions: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
  },
  viewContainer: {
    flex: '1 1 auto',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  aboutModalContainer: {
    textAlign: 'center',
    lineHeight: 1.6,
  },
  aboutModalParagraph: {
    margin: '0 0 16px 0',
    color: 'var(--text-color-secondary)',
  },
  aboutModalButtonContainer: {
      marginTop: '24px',
  },
};

export default App;