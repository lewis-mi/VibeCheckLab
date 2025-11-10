import React, { useState } from 'react';
import type { AnalysisResult, DeepDiveConcept } from '../types';
import AnnotatedTranscript from './AnnotatedTranscript';
import KeyRecommendations from './KeyRecommendations';
import { exportReportAsPdf } from '../services/exportService';
import Feedback from './Feedback';
import Modal from './Modal';
import MetricList from './MetricList';
import CatalystMoment from './CatalystMoment';
import ConversationFlowViz from './ConversationFlowViz';
import { theoryExplanations } from '../data/theoryExplanations';

interface AnalysisDisplayProps {
  analysis: AnalysisResult;
  onReset: () => void;
  transcript: string;
  isMobile: boolean;
  analysisId: string | null;
}

const sourceCitationMap: { [key: string]: string } = {
    "Rapport": "Brown, P., & Levinson, S. C. (1987). Politeness: Some universals in language usage. Cambridge university press.",
    "Purpose": "Austin, J. L. (1962). How to do things with words. Oxford university press.",
    "Flow": "Sacks, H., Schegloff, E. A., & Jefferson, G. (1974). A simplest systematics for the organization of turn-taking for conversation. Language, 50(4), 696-735.",
    "Implicature": "Grice, H. P. (1975). Logic and conversation. In Speech acts (pp. 41-58). Brill.",
    "Cohesion": "Halliday, M. A. K., & Hasan, R. (1976). Cohesion in English. Longman.",
    "Accommodation": "Giles, H., Taylor, D. M., & Bourhis, R. (1973). Towards a theory of interpersonal accommodation through language: Some Canadian data. Language in society, 2(2), 177-192."
};

const AnalysisDisplay: React.FC<AnalysisDisplayProps> = ({ analysis, onReset, transcript, isMobile, analysisId }) => {
  const { vibeTitle, annotatedTranscript, keyFormulations, dashboardMetrics } = analysis;
  const [activeDeepDive, setActiveDeepDive] = useState<DeepDiveConcept | null>(null);

  const handleOpenDeepDive = (metricName: string) => {
    const theory = theoryExplanations.find(t => t.concept === metricName);
    const metricData = dashboardMetrics.find(m => m.metric === metricName);

    if (theory && metricData) {
        setActiveDeepDive({
            ...theory,
            analysis: metricData.analysis, // Use the analysis from the dashboard metric
        });
    }
  };

  const handleCloseDeepDive = () => {
    setActiveDeepDive(null);
  };

  const handleExportReport = () => {
    exportReportAsPdf(analysis, transcript);
  };

  const mainHeadlineStyle: React.CSSProperties = {
    ...styles.mainHeadline,
    fontSize: isMobile ? '1.8em' : '2.5em',
  };

  const dashboardLayoutStyle: React.CSSProperties = {
    ...styles.dashboardLayout,
    flexDirection: isMobile ? 'column' : 'row',
  };

  const rightColumnStyle: React.CSSProperties = {
      ...styles.rightColumn,
      position: isMobile ? 'static' : 'sticky',
      width: isMobile ? '100%' : 'auto',
  };

  const fullCitation = activeDeepDive ? sourceCitationMap[activeDeepDive.concept as keyof typeof sourceCitationMap] || activeDeepDive.source : '';

  return (
    <div style={styles.container}>
      <h1 style={mainHeadlineStyle}>
        <span style={styles.vibeLabel}>The Vibe:</span> {vibeTitle}
      </h1>
      
      <div style={styles.glanceLayout}>
        <div className="anim-pop-in" style={{ animationDelay: '0.1s' }}>
          <CatalystMoment moment={analysis.keyMoment} />
        </div>
        <div className="anim-pop-in" style={{ animationDelay: '0.2s' }}>
          <ConversationFlowViz transcript={transcript} />
        </div>
      </div>

      <div style={dashboardLayoutStyle}>
        <div style={styles.leftColumn}>
          <div className="anim-pop-in" style={{ animationDelay: '0.3s' }}>
            <AnnotatedTranscript 
              annotatedTranscript={annotatedTranscript}
              keyFormulations={keyFormulations}
            />
          </div>
        </div>

        <div style={rightColumnStyle}>
            <div className="anim-pop-in" style={{ animationDelay: '0.4s' }}>
                <KeyRecommendations formulations={keyFormulations} />
            </div>
            
            <div className="anim-pop-in" style={{ animationDelay: '0.5s', marginTop: '30px' }}>
                <div className="insight-card" style={{padding: '20px 24px'}}>
                    <h2 style={{marginTop: 0, fontSize: '1.25em'}}>Vibe Metrics</h2>
                    <p style={{marginTop: 0, color: 'var(--text-color-secondary)'}}>
                        An elemental breakdown of your conversation's core dynamics.
                    </p>
                    <MetricList 
                        dashboardMetrics={dashboardMetrics} 
                        onLearnMore={handleOpenDeepDive}
                    />
                </div>
            </div>
        </div>
      </div>


      <div style={styles.footer}>
        <div style={styles.footerActions}>
            <button onClick={onReset} className="primary-button">
              Check another vibe.
            </button>
            <button onClick={handleExportReport} className="ghost-button">
                Export as PDF
            </button>
        </div>
        <Feedback analysisId={analysisId} />
      </div>

      {activeDeepDive && (
        <Modal
          isOpen={!!activeDeepDive}
          onClose={handleCloseDeepDive}
          title={`The Lab Library: ${activeDeepDive.concept}`}
        >
          <div style={deepDiveStyles.content}>
            <h3 style={deepDiveStyles.sectionTitle}>What it is:</h3>
            <p>{activeDeepDive.explanation}</p>
            
            <h3 style={deepDiveStyles.sectionTitle}>In your transcript:</h3>
            <p>{activeDeepDive.analysis}</p>
            
            <div style={deepDiveStyles.sourceSection}>
                <em>{fullCitation}</em>
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
        maxWidth: '1200px',
        display: 'flex',
        flexDirection: 'column',
    },
    mainHeadline: {
        fontSize: '2.5em',
        fontWeight: 700,
        marginBottom: '30px',
        textAlign: 'center',
    },
    vibeLabel: {
        display: 'block',
        fontSize: '0.5em',
        fontWeight: 400,
        color: 'var(--text-color-secondary)',
        marginBottom: '4px',
        letterSpacing: '0.05em'
    },
    glanceLayout: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
        gap: '30px',
        marginBottom: '40px',
        width: '100%',
    },
    dashboardLayout: {
        display: 'flex',
        flexDirection: 'row',
        gap: '40px',
        alignItems: 'flex-start',
    },
    leftColumn: {
        flex: '2.3 1 0%', 
        minWidth: 0,
    },
    rightColumn: {
        flex: '1 1 0%',
        position: 'sticky',
        top: '40px',
    },
    footer: {
        marginTop: '60px',
        paddingTop: '30px',
        borderTop: '1px solid var(--border-color-light)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '24px',
    },
    footerActions: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px',
    }
};

const deepDiveStyles: { [key: string]: React.CSSProperties } = {
    content: {
        lineHeight: 1.6,
    },
    sectionTitle: {
        marginTop: '20px',
        marginBottom: '8px',
        fontSize: '1em',
        fontWeight: 700,
    },
    sourceSection: {
        marginTop: '24px',
        paddingTop: '16px',
        borderTop: '1px solid var(--border-color-light)',
        fontSize: '0.9em',
        color: 'var(--text-color-secondary)',
        fontFamily: 'var(--font-accent)',
    }
}

export default AnalysisDisplay;