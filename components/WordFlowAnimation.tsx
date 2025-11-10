import React from 'react';

const words = [
  { text: 'empathy', color: 'var(--highlight-color-1)', delay: '0s', duration: '5s', left: '20%' },
  { text: 'clarity', color: 'var(--highlight-color-2)', delay: '1s', duration: '6s', left: '80%' },
  { text: 'flow', color: 'var(--highlight-color-3)', delay: '2s', duration: '4s', left: '30%' },
  { text: 'rapport', color: 'var(--highlight-color-1)', delay: '3s', duration: '5.5s', left: '70%' },
  { text: 'vibe', color: 'var(--highlight-color-2)', delay: '4s', duration: '4.5s', left: '50%' },
  { text: 'tone', color: 'var(--highlight-color-3)', delay: '0.5s', duration: '6.5s', left: '40%' },
];

const WordFlowAnimation: React.FC = () => {
  return (
    <div style={styles.container}>
      <style>
        {`
          @keyframes float-dissolve {
            0% {
              opacity: 0;
              transform: translateY(0) scale(0.5);
            }
            10% {
              opacity: 1;
              transform: translateY(-10px) scale(1.05);
            }
            20% {
              transform: translateY(-20px) scale(1) translateX(2px);
            }
            40% {
              transform: translateY(-45px) scale(1) translateX(-2px);
            }
            60% {
              transform: translateY(-70px) scale(0.95) translateX(2px);
            }
            90% {
              opacity: 1;
            }
            100% {
              opacity: 0;
              transform: translateY(-120px) scale(0.8);
            }
          }
          @keyframes pulse-glow {
            0% {
              box-shadow: 0 0 5px 2px color-mix(in srgb, var(--header-logo-color) 50%, transparent);
            }
            50% {
              box-shadow: 0 0 15px 5px color-mix(in srgb, var(--header-logo-color) 70%, transparent);
            }
            100% {
              box-shadow: 0 0 5px 2px color-mix(in srgb, var(--header-logo-color) 50%, transparent);
            }
          }
          @keyframes beaker-glow {
            0%, 100% {
                border-color: var(--border-color);
                box-shadow: 0 0 8px transparent;
            }
            50% {
                border-color: color-mix(in srgb, var(--border-color) 50%, var(--header-logo-color));
                box-shadow: 0 0 20px color-mix(in srgb, var(--header-logo-color) 40%, transparent);
            }
          }
          @keyframes wave-translate {
            from { transform: translateX(0%); }
            to { transform: translateX(-25%); }
          }
          .wave {
            position: absolute;
            width: 400%;
            height: 100px;
            left: 0;
            top: 0;
            border-radius: 45%;
            animation: wave-translate 7s linear infinite;
          }
          .wave.wave-1 {
            background-color: color-mix(in srgb, var(--header-logo-color) 25%, transparent);
            animation-duration: 7s;
            opacity: 0.8;
          }
          .wave.wave-2 {
            background-color: color-mix(in srgb, var(--header-logo-color) 40%, transparent);
            animation-duration: 10s;
            animation-direction: reverse;
            opacity: 0.6;
          }
        `}
      </style>
      <div style={styles.beaker}>
        <div style={styles.liquid}>
            <div className="wave wave-1"></div>
            <div className="wave wave-2"></div>
        </div>
        <div style={styles.animationContainer}>
            {words.map((word, index) => (
            <span
                key={index}
                style={{
                ...styles.word,
                color: word.color,
                left: word.left,
                animation: `float-dissolve ${word.duration} ease-in-out infinite`,
                animationDelay: word.delay,
                } as React.CSSProperties}
            >
                {word.text}
            </span>
            ))}
        </div>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    position: 'relative',
    width: '150px',
    height: '200px',
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  beaker: {
    width: '120px',
    height: '160px',
    border: '4px solid var(--border-color)',
    borderTop: 'none',
    borderBottomLeftRadius: '30px',
    borderBottomRightRadius: '30px',
    position: 'relative',
    background: 'var(--subtle-background)',
    overflow: 'hidden',
    animation: 'beaker-glow 3s ease-in-out infinite',
  },
  liquid: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '60px',
    background: `color-mix(in srgb, var(--header-logo-color) 10%, var(--subtle-background))`,
    borderRadius: '0 0 26px 26px',
    animation: 'pulse-glow 3s ease-in-out infinite',
    overflow: 'hidden',
  },
  animationContainer: {
    position: 'absolute',
    bottom: '20px',
    left: '0',
    right: '0',
    height: '100px',
    filter: 'blur(0.5px)',
  },
  word: {
    position: 'absolute',
    bottom: 0,
    transform: 'translateX(-50%)',
    fontFamily: "'Inter', sans-serif",
    fontWeight: 700,
    fontSize: '1em',
    whiteSpace: 'nowrap',
    willChange: 'transform, opacity',
    opacity: 0,
    backgroundColor: `color-mix(in srgb, var(--card-background) 70%, transparent)`,
    padding: '4px 10px',
    borderRadius: '16px',
  },
};

export default WordFlowAnimation;