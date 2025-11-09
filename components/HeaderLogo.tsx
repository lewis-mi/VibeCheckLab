import React, { useRef, useState, useEffect } from 'react';

interface HeaderLogoProps {
  isClickable?: boolean;
  onClick?: () => void;
  isMobile?: boolean;
  size?: 'small' | 'large';
}

const HeaderLogo: React.FC<HeaderLogoProps> = ({ 
  isClickable = false, 
  onClick, 
  isMobile = false,
  size = 'small'
}) => {
  const pathRef = useRef<SVGPathElement>(null);
  const [pathLength, setPathLength] = useState(0);
  const [isFocused, setIsFocused] = useState(false);

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
  
  const isLarge = size === 'large';

  const textStyle: React.CSSProperties = {
    ...styles.text,
    fontSize: isLarge 
      ? (isMobile ? '2.5em' : '3.5em') 
      : (isMobile ? '1.25em' : '1.5em'),
    marginBottom: isLarge ? '12px' : '2px',
  };
  
  const containerStyle: React.CSSProperties = {
      ...styles.container,
      alignItems: isLarge ? 'center' : 'flex-start',
      marginBottom: isLarge ? '24px' : '0px',
      cursor: isClickable ? 'pointer' : 'default',
      borderRadius: '4px',
      outline: 'none',
  };

  const svgHeight = isLarge ? '20px' : '12px';

  return (
    <div
      onClick={isClickable ? onClick : undefined}
      onKeyPress={handleKeyPress}
      onFocus={() => isClickable && setIsFocused(true)}
      onBlur={() => isClickable && setIsFocused(false)}
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : -1}
      aria-label={isClickable ? "Return to Vibe Check Lab homepage" : undefined}
      style={containerStyle}
    >
      <style>
        {`
          @keyframes draw-header {
            to {
              stroke-dashoffset: 0;
            }
          }
          @keyframes pulse-underline {
            0% { transform: scaleY(1); }
            50% { transform: scaleY(0.8); }
            100% { transform: scaleY(1); }
          }
          .logo-underline-path {
            stroke-dasharray: ${pathLength};
            stroke-dashoffset: ${pathLength};
            transform-origin: center;
            animation: 
              draw-header 1.5s ease-out 0.2s forwards,
              pulse-underline 2s ease-in-out 1.7s infinite;
          }
        `}
      </style>
      <div style={textStyle}>vibe check lab</div>
      <svg
        style={{ width: '100%', height: svgHeight }}
        viewBox="0 0 100 20"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          ref={pathRef}
          className="logo-underline-path"
          style={{
            stroke: isFocused ? 'var(--text-color)' : 'var(--header-logo-color, #32CD32)',
            transition: 'stroke 0.2s ease-in-out',
          }}
          d="M0,10 C20,0 30,20 50,10 S80,0 100,10"
          strokeWidth="3"
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
    justifyContent: 'center',
    width: 'auto',
    maxWidth: '100%',
  },
  text: {
    fontFamily: 'Inter, sans-serif',
    fontWeight: 700,
    color: 'var(--text-color)',
    margin: 0,
    padding: 0,
    lineHeight: 1,
    whiteSpace: 'nowrap',
  },
};

export default HeaderLogo;
