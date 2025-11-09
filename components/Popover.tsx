import React, { useState, ReactNode } from 'react';

interface PopoverProps {
  content: ReactNode;
  children: ReactNode;
  highlightColor?: string;
}

const Popover: React.FC<PopoverProps> = ({ content, children, highlightColor }) => {
  const [isHovered, setIsHovered] = useState(false);

  const highlightStyle: React.CSSProperties = {
    backgroundColor: `color-mix(in srgb, ${highlightColor || 'var(--primary-accent)'} 30%, transparent)`,
    padding: '2px 1px',
    borderRadius: '3px',
    cursor: 'pointer',
    position: 'relative',
    textDecoration: 'underline',
    textDecorationStyle: 'wavy',
    textDecorationColor: `color-mix(in srgb, ${highlightColor || 'var(--primary-accent)'} 70%, transparent)`,
    textUnderlineOffset: '3px',
  };

  return (
    <span 
      style={styles.container}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <span style={highlightStyle}>
        {children}
      </span>
      {isHovered && (
        <div style={styles.popover} className="anim-pop-in">
          {content}
        </div>
      )}
    </span>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    position: 'relative',
    display: 'inline-block',
  },
  popover: {
    position: 'absolute',
    bottom: '100%',
    left: '50%',
    transform: 'translateX(-50%)',
    marginBottom: '8px',
    backgroundColor: 'var(--card-background)',
    color: 'var(--text-color)',
    padding: '12px',
    borderRadius: 'var(--border-radius)',
    boxShadow: 'var(--shadow-md)',
    width: '280px',
    zIndex: 10,
    textAlign: 'left',
    border: '1px solid var(--border-color)',
    animationDuration: '0.2s',
  },
};

export default Popover;
