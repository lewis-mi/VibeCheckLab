import React, { useState } from 'react';
import MetricCard from './MetricCard';
import { BookOpenIcon } from './icons';
import type { DashboardMetrics, DeepDive } from '../types';

interface AcademicDeepDiveProps {
  dashboardMetrics: DashboardMetrics;
  onCardClick: (conceptKey: keyof DeepDive, title: string) => void;
}

const AcademicDeepDive: React.FC<AcademicDeepDiveProps> = ({ dashboardMetrics, onCardClick }) => {
  const [isOpen, setIsOpen] = useState(false);

  if (!isOpen) {
    return (
      <div style={styles.closedContainer}>
        <div style={styles.header}>
            <BookOpenIcon />
            <h2 style={styles.title}>Academic Deep Dive</h2>
        </div>
        <p style={styles.description}>
          Ready to go deeper? Unpack the analysis to see how academic theories explain the vibe.
        </p>
        <button onClick={() => setIsOpen(true)} className="ghost-button">
          Unpack the Analysis
        </button>
      </div>
    );
  }

  return (
    <div style={styles.openContainer}>
      <h2 style={styles.evidenceHeader}>Supporting Evidence</h2>
      <MetricCard
        {...dashboardMetrics.rapport}
        onClick={() => onCardClick('rapport', dashboardMetrics.rapport.metric)}
      />
      <MetricCard
        {...dashboardMetrics.purpose}
        onClick={() => onCardClick('purpose', dashboardMetrics.purpose.metric)}
      />
      <MetricCard
        {...dashboardMetrics.flow}
        onClick={() => onCardClick('flow', dashboardMetrics.flow.metric)}
      />
      <MetricCard
        {...dashboardMetrics.implicature}
        onClick={() => onCardClick('implicature', dashboardMetrics.implicature.metric)}
      />
      <MetricCard
        {...dashboardMetrics.cohesion}
        onClick={() => onCardClick('cohesion', dashboardMetrics.cohesion.metric)}
      />
      <MetricCard
        {...dashboardMetrics.accommodation}
        onClick={() => onCardClick('accommodation', dashboardMetrics.accommodation.metric)}
      />
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
    closedContainer: {
        border: '1px solid #000',
        borderRadius: 'var(--border-radius)',
        padding: '24px',
        backgroundColor: '#FAFAFA',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        textAlign: 'left',
    },
    header: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
    },
    title: {
        margin: 0,
        fontSize: '1.25em',
    },
    description: {
        margin: '12px 0 20px 0',
        lineHeight: 1.6,
        color: '#333',
    },
    openContainer: {
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
};

export default AcademicDeepDive;
