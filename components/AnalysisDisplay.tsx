import React, { useState } from 'react';
import type { AnalysisResult, DeepDive } from '../types';
import AnalysisCard from './AnalysisCard';
import Modal from './Modal';
import AnnotatedTranscript from './AnnotatedTranscript';
import KeyRecommendations from './KeyRecommendations';
import AcademicDeepDive from './AcademicDeepDive';
import { generateSummaryMarkdown, generateTranscriptMarkdown } from '../services/exportService';

interface AnalysisDisplayProps {
  analysis: AnalysisResult;
  // FIX: Corrected a typo in the function type definition. 'from' should be '=>'.
  onReset: () => void;
  transcript: string;
  isMobile: boolean;
}

type ActiveView = 'summary' | 'transcript';

const AnalysisDisplay: React.FC<AnalysisDisplayProps> = ({ analysis, onReset, transcript, isMobile }) => {
  const { vibeTitle, dashboardMetrics, keyMoment, deepDive, momentAnalysis, keyRedesignTips } = analysis;
  const [selectedConceptKey, setSelectedConceptKey] = useState<keyof DeepDive | null>(null);
  const [modalTitle, setModalTitle] = useState<string>('');
  const [activeView, setActiveView] = useState<ActiveView>('summary');

  const selectedConcept = selectedConceptKey ? deepDive[selectedConceptKey] : null;

  const handleCardClick = (conceptKey: keyof DeepDive, title: string) => {
    setSelectedConceptKey(conceptKey);
    setModalTitle(title);
  };
  
  const handleCloseModal = () => {
    setSelectedConceptKey(null);
    setModalTitle('');
  };

  const handleExport = () => {
    const isSummary = activeView === 'summary';
    const content = isSummary
      ? generateSummaryMarkdown(analysis)
      : generateTranscriptMarkdown(transcript, momentAnalysis);
    
    const filename = `vibe-check-${activeView}-${new Date().toISOString().split('T')[0]}.md`;

    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Responsive styles
  const mainHeadlineStyle: React.CSSProperties = {
    ...styles.mainHeadline,
    fontSize: isMobile ? '1.8em' : '2.5em',
  };

  const mainGridStyle: React.CSSProperties = {
    ...styles.mainGrid,
    gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(350px, 1fr))',
    gap: isMobile ? '16px' : '20px',
  };

  const activeButtonStyles: React.CSSProperties = {
      ...styles.activeButton,
      padding: isMobile ? '10px 16px' : '10px 20px',
  };
  
  const inactiveButtonStyles: React.CSSProperties = {
      ...styles.inactiveButton,
      padding: isMobile ? '10px 16px' : '10px 20px',
  };

  const renderSummaryView = () => (
    <>
      <KeyRecommendations tips={keyRedesignTips} />
      <div style={mainGridStyle}>
        <AnalysisCard title="Key Moment" borderColor="var(--primary-lime)">
          <div style={styles.snippetContainer}>
              <blockquote style={styles.blockquote}>
                "{keyMoment.transcriptSnippet}"
              </blockquote>
          </div>
          <p style={{marginTop: '16px'}}>
              <strong style={styles.catalyst}>The Catalyst:</strong>
              {keyMoment.analysis}
          </p>
        </AnalysisCard>
        
        <AcademicDeepDive
            dashboardMetrics={dashboardMetrics}
            onCardClick={handleCardClick}
        />
      </div>
    </>
  );

  return (
    <div style={styles.container}>
      <h1 style={mainHeadlineStyle}>
        <span style={styles.vibeLabel}>The Vibe:</span> {vibeTitle}
      </h1>
      
      <div style={styles.viewSwitcher}>
        <button 
          style={activeView === 'summary' ? activeButtonStyles : inactiveButtonStyles}
          onClick={() => setActiveView('summary')}
          aria-pressed={activeView === 'summary'}
        >
          Summary
        </button>
        <button 
          style={activeView === 'transcript' ? activeButtonStyles : inactiveButtonStyles}
          onClick={() => setActiveView('transcript')}
          aria-pressed={activeView === 'transcript'}
        >
          Annotated Transcript
        </button>
      </div>

      {activeView === 'summary' ? renderSummaryView() : (
        <AnnotatedTranscript transcript={transcript} moments={momentAnalysis} />
      )}

      <div style={styles.footer}>
        <button onClick={onReset} className="ghost-button">
          Check another vibe.
        </button>
        <button onClick={handleExport} className="ghost-button" style={{ marginLeft: '16px' }}>
          Export {activeView === 'summary' ? 'Summary' : 'Transcript'}
        </button>
      </div>


      {selectedConcept && (
        <Modal 
          isOpen={!!selectedConceptKey} 
          onClose={handleCloseModal} 
          title={modalTitle}
        >
          <div>
            <h3 style={modalStyles.sectionTitle}>What it is:</h3>
            <p>{selectedConcept.explanation}</p>
            <h3 style={modalStyles.sectionTitle}>In your transcript:</h3>
            <p>{selectedConcept.analysis}</p>
            <div style={modalStyles.sourceSection}>
                {selectedConcept.source}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
    container: {
        width: '100%',
        maxWidth: '1000px',
        display: 'flex',
        flexDirection: 'column',
    },
    mainHeadline: {
        fontSize: '2.5em',
        fontWeight: 700,
        marginBottom: '20px',
        textAlign: 'center',
    },
    vibeLabel: {
        display: 'block',
        fontSize: '0.5em',
        fontWeight: 400,
        color: '#5f6368',
        marginBottom: '4px',
    },
    viewSwitcher: {
      display: 'flex',
      justifyContent: 'center',
      marginBottom: '30px',
      border: '1px solid #000',
      borderRadius: '8px',
      overflow: 'hidden',
      alignSelf: 'center',
    },
    activeButton: {
      padding: '10px 20px',
      border: 'none',
      background: 'var(--primary-lime)',
      cursor: 'pointer',
      fontSize: '1em',
      fontWeight: '700',
    },
    inactiveButton: {
      padding: '10px 20px',
      border: 'none',
      background: 'transparent',
      cursor: 'pointer',
      fontSize: '1em',
      fontWeight: '700',
    },
    mainGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
        gap: '20px',
        width: '100%',
        alignItems: 'start',
        marginTop: '30px',
    },
    snippetContainer: {
        backgroundColor: '#f8f8f8',
        borderLeft: '4px solid var(--primary-lime)',
        padding: '12px 16px',
        borderRadius: '4px',
    },
    blockquote: {
        fontStyle: 'italic',
        paddingLeft: '0',
        margin: '0',
        fontSize: '1.1em',
        whiteSpace: 'pre-line',
    },
    catalyst: {
        display: 'block',
        marginBottom: '4px',
        fontWeight: 700,
    },
    footer: {
        marginTop: '40px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
};

const modalStyles: { [key: string]: React.CSSProperties } = {
    sectionTitle: {
        marginTop: '20px',
        marginBottom: '8px',
        fontSize: '1em',
        fontWeight: 700,
    },
    sourceSection: {
        marginTop: '24px',
        paddingTop: '16px',
        borderTop: '1px solid #eee',
        fontSize: '0.9em',
        color: '#666',
        fontStyle: 'italic',
    }
}

export default AnalysisDisplay;