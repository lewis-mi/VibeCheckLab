import React, { useState } from 'react';
import type { DashboardMetric } from '../types';

interface MetricListProps {
  dashboardMetrics: DashboardMetric[];
  onLearnMore: (metricName: string) => void;
}

const MetricList: React.FC<MetricListProps> = ({ dashboardMetrics, onLearnMore }) => {
  const [hoveredMetric, setHoveredMetric] = useState<string | null>(null);

  return (
    <div style={styles.container}>
      {dashboardMetrics.map((metric, index) => {
        if (!metric) return null;
        
        const isLast = index === dashboardMetrics.length - 1;
        const isHovered = hoveredMetric === metric.metric;

        const itemStyle: React.CSSProperties = {
          ...styles.item,
          backgroundColor: isHovered ? 'var(--subtle-background)' : 'transparent',
        };

        const learnMoreStyle: React.CSSProperties = {
            ...styles.learnMoreIndicator,
            color: isHovered ? 'var(--text-color)' : 'var(--secondary-accent)',
        };

        return (
          <div key={metric.metric} style={{ borderBottom: isLast ? 'none' : '1px solid var(--border-color-light)'}}>
            <button
              style={itemStyle}
              onClick={() => onLearnMore(metric.metric)}
              onMouseEnter={() => setHoveredMetric(metric.metric)}
              onMouseLeave={() => setHoveredMetric(null)}
            >
              <div>
                <h3 style={styles.metricName}>{metric.metric}</h3>
                <p style={styles.keyFinding}>{metric.keyFinding}</p>
              </div>
              <div style={learnMoreStyle}>
                Learn More &rarr;
              </div>
            </button>
          </div>
        );
      })}
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    marginTop: '16px',
  },
  item: {
    // Reset button styles
    background: 'transparent',
    border: 'none',
    width: '100%',
    textAlign: 'left',
    cursor: 'pointer',
    padding: '16px 0',
    transition: 'background-color 0.2s ease',
  },
  metricName: {
    margin: '0 0 4px 0',
    fontSize: '1em',
    fontWeight: 700,
    color: 'var(--text-color)',
  },
  keyFinding: {
    margin: '0 0 8px 0',
    color: 'var(--text-color-secondary)',
    lineHeight: 1.5,
  },
  learnMoreIndicator: {
    color: 'var(--secondary-accent)',
    fontWeight: 700,
    fontSize: '0.9em',
    transition: 'color 0.2s ease',
  }
};

export default MetricList;