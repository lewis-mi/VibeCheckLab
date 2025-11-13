import React from 'react';
import HeaderLogo from './HeaderLogo';

interface WelcomeProps {
  onStart: () => void;
  isMobile: boolean;
}

const Welcome: React.FC<WelcomeProps> = ({ onStart, isMobile }) => {
  const containerStyles = {
    ...styles.container,
    padding: isMobile ? '16px' : '24px',
  };

  const contentStyles = {
    ...styles.content,
    maxWidth: isMobile ? '100%' : '600px',
  };

  const introTextStyles = {
    ...styles.introText,
    fontSize: isMobile ? '1em' : '1.1em',
    lineHeight: isMobile ? 1.6 : 1.7,
  };

  const ctaButtonStyles = {
    ...styles.ctaButton,
    fontSize: isMobile ? '1em' : '1.1em',
    padding: isMobile ? '14px 24px' : '16px 28px',
  };

  return (
    <div style={containerStyles} className="anim-pop-in">
      <div style={contentStyles}>
        <h1 style={{ margin: 0 }}>
            <HeaderLogo size="large" isMobile={isMobile} />
        </h1>
        <p style={introTextStyles}>
          This is an exploratory tool for analyzing conversations with chatbots and other conversational interfaces.
        </p>
        <p style={introTextStyles}>
          Select one of our curated examples or paste your own transcript to get an instant, in-depth report on its conversational dynamics, grounded in established linguistic theory.
        </p>
        <button onClick={onStart} className="primary-button" style={ctaButtonStyles}>
          Start Your First Analysis &rarr;
        </button>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    height: '100%',
    padding: '24px',
  },
  content: {
    maxWidth: '600px',
  },
  introText: {
    fontSize: '1.1em',
    lineHeight: 1.7,
    color: 'var(--text-color-secondary)',
    margin: '0 0 16px 0',
  },
  ctaButton: {
    marginTop: '24px',
    fontSize: '1.1em',
    padding: '16px 28px',
  },
};

export default Welcome;