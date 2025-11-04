import React from 'react';
import type { RecentItem } from '../App';
import { TrashIcon, XIcon } from './icons';

interface RecentPanelProps {
  recentItems: RecentItem[];
  isOpen: boolean;
  onSelect: (item: RecentItem) => void;
  onClear: () => void;
  onClose: () => void;
}

const RecentPanel: React.FC<RecentPanelProps> = ({ recentItems, isOpen, onSelect, onClear, onClose }) => {
  const handleSelect = (item: RecentItem) => {
    onSelect(item);
    onClose();
  };
  
  return (
    <>
      {isOpen && <div style={styles.backdrop} onClick={onClose} />}
      <aside style={{ ...styles.panel, transform: isOpen ? 'translateX(0)' : 'translateX(100%)' }}>
        <div style={styles.header}>
          <h3>Recent</h3>
          <div style={{display: 'flex', alignItems: 'center'}}>
            {recentItems.length > 0 && (
                <button onClick={onClear} style={styles.iconButton} aria-label="Clear recent">
                    <TrashIcon />
                </button>
            )}
             <button onClick={onClose} style={styles.iconButton} aria-label="Close recent">
                <XIcon />
            </button>
          </div>
        </div>
        <div style={styles.list}>
          {recentItems.length === 0 ? (
            <p style={styles.emptyText}>Your recent analyses will appear here.</p>
          ) : (
            recentItems.map((item) => (
              <div
                key={item.id}
                onClick={() => handleSelect(item)}
                style={styles.recentItem}
                tabIndex={0}
                onKeyPress={(e) => e.key === 'Enter' && handleSelect(item)}
              >
                <p style={styles.itemText}>
                  "{item.transcript.substring(0, 40)}{item.transcript.length > 40 ? '...' : ''}"
                </p>
                <span style={styles.itemTimestamp}>{item.timestamp}</span>
              </div>
            ))
          )}
        </div>
      </aside>
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
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 999,
  },
  panel: {
    width: '320px',
    position: 'fixed',
    top: 0,
    right: 0,
    height: '100%',
    borderLeft: 'var(--border)',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    zIndex: 1000,
    transition: 'transform 0.3s ease-in-out',
    boxShadow: '-4px 0px 15px rgba(0, 0, 0, 0.1)',
  },
  header: {
    padding: '20px',
    borderBottom: 'var(--border)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  list: {
    flex: '1 1 auto',
    overflowY: 'auto',
    padding: '10px',
  },
  emptyText: {
    padding: '10px',
    color: '#666',
    fontSize: '0.9em',
  },
  recentItem: {
    padding: '15px',
    border: '1px solid transparent',
    borderRadius: 'var(--border-radius)',
    marginBottom: '10px',
    cursor: 'pointer',
    backgroundColor: '#FAFAFA',
    borderLeft: '3px solid transparent',
    transition: 'background-color 0.2s, border-color 0.2s',
  },
  itemText: {
    margin: 0,
    fontWeight: 700,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  itemTimestamp: {
    fontSize: '0.8em',
    color: '#666',
    marginTop: '4px',
    display: 'block'
  },
  iconButton: {
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      padding: '5px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginLeft: '10px'
  }
};

export default RecentPanel;