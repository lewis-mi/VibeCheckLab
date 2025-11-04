import React, { useState } from 'react';
import type { AnalysisResult, DeepDive } from '../types';
import AnalysisCard from './AnalysisCard';
import MetricCard from './MetricCard';
import Modal from './Modal';
import MomentAnalysis from './MomentAnalysis';

interface AnalysisDisplayProps {
  analysis: AnalysisResult;
  onReset: () => void;
  transcript: string;
}

const AnalysisDisplay: React.FC<AnalysisDisplayProps> = ({ analysis, onReset, transcript }) => {
  const { vibeTitle, dashboardMetrics, keyMoment, deepDive, momentAnalysis } = analysis;
  const [selectedConceptKey, setSelectedConceptKey] = useState<keyof DeepDive | null>(null);
  const [modalTitle, setModalTitle] = useState<string>('');

  const selectedConcept = selectedConceptKey ? deepDive[selectedConceptKey] : null;

  const handleCardClick = (conceptKey: keyof DeepDive, title: string) => {
    setSelectedConceptKey(conceptKey);
    setModalTitle(title);
  };
  
  const handleCloseModal = () => {
    setSelectedConceptKey(null);
    setModalTitle('');
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.mainHeadline}>
        <span style={styles.vibeLabel}>The Vibe:</span> {vibeTitle}
      </h1>
      
      <div style={styles.mainGrid}>
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
        
        <div style={styles.metricsContainer}>
          <h2 style={styles.evidenceHeader}>Supporting Evidence</h2>
          <MetricCard 
            {...dashboardMetrics.rapport} 
            onClick={() => handleCardClick('rapport', dashboardMetrics.rapport.metric)} 
          />
          <MetricCard 
            {...dashboardMetrics.purpose} 
            onClick={() => handleCardClick('purpose', dashboardMetrics.purpose.metric)}
          />
          <MetricCard 
            {...dashboardMetrics.flow} 
            onClick={() => handleCardClick('flow', dashboardMetrics.flow.metric)} 
          />
        </div>
      </div>

      {momentAnalysis && momentAnalysis.length > 0 && (
        <MomentAnalysis moments={momentAnalysis} />
      )}

      <button onClick={onReset} className="ghost-button" style={{ marginTop: '40px' }}>
        Check another vibe.
      </button>

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
    mainGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
        gap: '20px',
        width: '100%',
        marginTop: '20px',
        alignItems: 'start',
    },
    metricsContainer: {
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
    },
    evidenceHeader: {
        fontSize: '1em',
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        color: '#5f6368',
        margin: '0 0 -10px 0',
        paddingBottom: '10px',
        borderBottom: '1px solid #eee',
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