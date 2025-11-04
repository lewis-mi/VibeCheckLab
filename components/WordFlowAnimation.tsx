import React from 'react';

const words = [
  { text: 'vibe', color: '#32CD32', delay: '0s', duration: '5s', rotation: 45 },
  { text: 'flow', color: '#129490', delay: '1s', duration: '6s', rotation: 60 },
  { text: 'eat', color: '#7A28CB', delay: '2s', duration: '4s', rotation: 80 },
  { text: 'smile', color: '#32CD32', delay: '3s', duration: '5.5s', rotation: 50 },
  { text: 'zone', color: '#129490', delay: '4s', duration: '4.5s', rotation: 70 },
  { text: 'bench', color: '#7A28CB', delay: '0.5s', duration: '6.5s', rotation: 90 },
  { text: 'most', color: '#32CD32', delay: '1.5s', duration: '5s', rotation: 45 },
  { text: 'phone', color: '#129490', delay: '2.5s', duration: '4s', rotation: 85 },
];

const WordFlowAnimation: React.FC = () => {
  return (
    <div style={styles.container}>
      <style>
        {`
          @keyframes bubble-up {
            0% {
              opacity: 0;
              transform: translateY(0) rotate(var(--rotation, 45deg));
            }
            20% {
              opacity: 1;
            }
            80% {
                opacity: 1;
            }
            100% {
              opacity: 0;
              transform: translateY(-200px) rotate(calc(var(--rotation, 45deg) + 10deg));
            }
          }
        `}
      </style>
      <div style={styles.beaker}>
        <div style={styles.beakerLip}></div>
        <div style={styles.beakerBase}></div>
      </div>
      <div style={styles.animationContainer}>
        {words.map((word, index) => (
          <span
            key={index}
            style={{
              ...styles.word,
              '--rotation': `${word.rotation}deg`, // CSS custom property for rotation
              color: word.color,
              animation: `bubble-up ${word.duration} ease-in-out infinite`,
              animationDelay: word.delay,
            } as React.CSSProperties}
          >
            {word.text}
          </span>
        ))}
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    position: 'relative',
    width: '130px', // Adjusted for narrower beaker
    height: '200px',
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  beaker: {
    width: '80px', // Narrower
    height: '150px',
    position: 'relative',
  },
  beakerLip: {
    position: 'absolute',
    top: 0,
    left: '-10px',
    width: '100px', // Adjusted for narrower beaker
    height: '10px',
    border: '3px solid black',
    borderRadius: '2px',
  },
  beakerBase: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '80px', // Narrower
    height: '140px',
    border: '3px solid black',
    borderTop: 'none',
    borderBottomLeftRadius: '20px',
    borderBottomRightRadius: '20px',
  },
  animationContainer: {
    position: 'absolute',
    bottom: '10px',
    left: '50%',
    width: '70px', // Narrower to hug words
    height: '100px',
    transform: 'translateX(-50%)',
  },
  word: {
    position: 'absolute',
    bottom: 0,
    left: '50%',
    transform: 'translateX(-50%)',
    fontFamily: "'Inter', sans-serif",
    fontWeight: 700,
    fontSize: '1.2em',
    whiteSpace: 'nowrap',
    willChange: 'transform, opacity',
    opacity: 0,
  },
};

export default WordFlowAnimation;
