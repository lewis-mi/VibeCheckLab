import React, { ReactNode, useEffect } from 'react';
import { XIcon } from './icons';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);


  if (!isOpen) {
    return null;
  }

  return (
    <>
      <div style={styles.backdrop} onClick={onClose} />
      <div style={styles.modal} role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <div style={styles.header}>
          <h2 id="modal-title" style={styles.title}>{title}</h2>
          <button onClick={onClose} style={styles.closeButton} aria-label="Close modal">
            <XIcon />
          </button>
        </div>
        <div style={styles.content}>
          {children}
        </div>
      </div>
    </>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  backdrop: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    zIndex: 1000,
  },
  modal: {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: 'var(--card-background)',
    border: '1px solid var(--border-color)',
    borderRadius: 'var(--border-radius)',
    width: '90%',
    maxWidth: '520px',
    zIndex: 1001,
    boxShadow: 'var(--shadow-md)',
    display: 'flex',
    flexDirection: 'column',
    color: 'var(--text-color)',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 24px',
    borderBottom: '1px solid var(--border-color)',
    flexShrink: 0,
  },
  title: {
    margin: 0,
    fontSize: '1.25em',
    fontWeight: 700,
  },
  closeButton: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: 0,
    display: 'flex',
    color: 'inherit',
  },
  content: {
    padding: '24px',
    overflowY: 'auto',
  },
};

export default Modal;