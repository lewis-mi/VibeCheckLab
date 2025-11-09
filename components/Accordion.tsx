import React, { ReactNode } from 'react';
import { PlusIcon, MinusIcon } from './icons';

interface AccordionProps {
  title: string;
  children: ReactNode;
}

const Accordion: React.FC<AccordionProps> = ({ title, children }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <details style={styles.details} onToggle={(e) => setIsOpen((e.currentTarget as HTMLDetailsElement).open)}>
        <summary style={styles.summary}>
            <span style={styles.icon}>{isOpen ? <MinusIcon /> : <PlusIcon />}</span>
            {title}
        </summary>
        <div style={styles.content}>
            {children}
        </div>
    </details>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
    details: {
        borderBottom: '1px solid var(--border-color-light)',
        padding: '10px 0',
    },
    summary: {
        fontSize: '1.1em',
        fontWeight: 'bold',
        cursor: 'pointer',
        listStyle: 'none',
        display: 'flex',
        alignItems: 'center',
        fontFamily: 'var(--font-display)',
    },
    summaryFocus: {
        outline: 'none',
        boxShadow: '0 0 0 2px var(--secondary-accent)',
    },
    icon: {
        marginRight: '10px',
        display: 'inline-flex',
        alignItems: 'center',
    },
    content: {
        padding: '15px 0 10px 34px',
        color: 'var(--text-color)',
    }
};

// Hide default marker for Webkit browsers
const styleSheet = document.createElement("style");
styleSheet.innerText = `summary::-webkit-details-marker { display: none; }`;
document.head.appendChild(styleSheet);


export default Accordion;