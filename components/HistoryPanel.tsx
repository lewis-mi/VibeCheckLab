import React, { useState } from 'react';
import type { RecentItem } from '../App';
import { TrashIcon, XIcon } from './icons';

interface HistoryPanelProps {
  recentItems: RecentItem[];
  isOpen: boolean;
  onSelect: (item: RecentItem) => void;
  onClear: () => void;
  onClose: () => void;
}

const RecentItemView: React.FC<{item: RecentItem, onSelect: () => void}> = ({ item, onSelect }) => {
    const [isHovered, setIsHovered] = useState(false);

    const itemStyle = {
        ...styles.recentItem,
        transform: isHovered ? 'translateX(-4px)' : 'none',
        borderLeft: isHovered ? `3px solid var(--secondary-accent)` : '3px solid transparent',
    };

    return (
        <div
            onClick={onSelect}
            style={itemStyle}
            tabIndex={0}
            onKeyPress={(e) => e.key === 'Enter' && onSelect()}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <p style={styles.itemText}>
              "{item.transcript.substring(0, 40)}{item.transcript.length > 40 ? '...' : ''}"
            </p>
            <span style={styles.itemTimestamp}>{item.timestamp}</span>
        </div>
    );
};


const HistoryPanel: React.FC<HistoryPanelProps> = ({ recentItems, isOpen, onSelect, onClear, onClose }) => {
  const handleSelect = (item: RecentItem) => {
    onSelect(item);
    onClose();
  };
  
  return (
    <>
      {isOpen && <div style={styles.backdrop} onClick={onClose} />}
      <aside style={{ ...styles.panel, transform: isOpen ? 'translateX(0)' : 'translateX(100%)' }}>
        <div style={styles.header}>
          <h3>history</h3>
          <div style={{display: 'flex', alignItems: 'center'}}>
            {recentItems.length > 0 && (
                <button onClick={onClear} style={styles.iconButton} aria-label="Clear history">
                    <TrashIcon />
                </button>
            )}
             <button onClick={onClose} style={styles.iconButton} aria-label="Close history">
                <XIcon />
            </button>
          </div>
        </div>
        <div style={styles.list}>
          {recentItems.length === 0 ? (
            <p style={styles.emptyText}>Your previous experiments will be stored here.</p>
          ) : (
            recentItems.map((item) => (
              <RecentItemView 
                key={item.id}
                item={item} 
                onSelect={() => handleSelect(item)} 
              />
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
    borderLeft: '1px solid var(--border-color)',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'var(--card-background)',
    color: 'var(--text-color)',
    zIndex: 1000,
    transition: 'transform 0.3s ease-in-out',
    boxShadow: '-4px 0px 15px rgba(0, 0, 0, 0.1)',
  },
  header: {
    padding: '20px',
    borderBottom: '1px solid var(--border-color)',
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
    color: 'var(--text-color-secondary)',
    fontSize: '0.9em',
  },
  recentItem: {
    padding: '15px',
    borderRadius: 'var(--border-radius)',
    marginBottom: '10px',
    cursor: 'pointer',
    backgroundColor: 'var(--subtle-background)',
    borderLeft: '3px solid transparent',
    transition: 'background-color 0.2s, border-left-color 0.2s, transform 0.2s ease',
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
    color: 'var(--text-color-secondary)',
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
      marginLeft: '10px',
      color: 'inherit'
  }
};

export default HistoryPanel;