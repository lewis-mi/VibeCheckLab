import React, { useRef, useState, useEffect } from 'react';

interface HeaderLogoProps {
  isClickable?: boolean;
  onClick?: () => void;
}

const HeaderLogo: React.FC<HeaderLogoProps> = ({ isClickable = false, onClick }) => {
  const pathRef = useRef<SVGPathElement>(null);
  const [pathLength, setPathLength] = useState(0);

  useEffect(() => {
    if (pathRef.current) {
      const length = pathRef.current.getTotalLength();
      setPathLength(length);
    }
  }, []);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (isClickable && onClick && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <div
      onClick={isClickable ? onClick : undefined}
      onKeyPress={handleKeyPress}
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : -1}
      aria-label={isClickable ? "Return to Vibe Check Lab homepage" : undefined}
      style={{
        ...styles.container, 
        cursor: isClickable ? 'pointer' : 'default',
        borderRadius: '4px'
      }}
    >
      <style>
        {`
          @keyframes draw-header {
            to {
              stroke-dashoffset: 0;
            }
          }
        `}
      </style>
      <div style={styles.text}>Vibe Check Lab</div>
      <svg
        style={{ width: '100%', height: '12px' }}
        viewBox="0 0 250 30"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          ref={pathRef}
          style={{
            strokeDasharray: pathLength,
            strokeDashoffset: pathLength,
            animation: pathLength ? 'draw-header 2s ease-out forwards' : 'none',
          }}
          d="M 5 15 C 25 5, 65 5, 85 15 S 145 25, 165 15 S 225 5, 245 15"
          stroke="#32CD32"
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  text: {
    fontFamily: 'Inter, sans-serif',
    fontWeight: 700,
    fontSize: '1.5em',
    color: '#000000',
    margin: '0 0 2px 0',
    padding: 0,
    lineHeight: 1,
  },
};

export default HeaderLogo;