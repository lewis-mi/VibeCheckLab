import React from 'react';
import MetricCard from './MetricCard';
import type { DashboardMetrics, DeepDive } from '../types';

interface AcademicDeepDiveProps {
  dashboardMetrics: DashboardMetrics;
  onCardClick: (conceptKey: keyof DeepDive, title: string) => void;
}

const AcademicDeepDive: React.FC<AcademicDeepDiveProps> = ({ dashboardMetrics, onCardClick }) => {
  return (
    <div style={styles.openContainer}>
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
    openContainer: {
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
    },
};

export default AcademicDeepDive;