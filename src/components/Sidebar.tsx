'use client';

import { Booth } from '@/data/booths';

interface SidebarProps {
  booth: Booth | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ booth, isOpen, onClose }: SidebarProps) {
  return (
    <div className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-header">
        <h2>Booth {booth?.id}</h2>
        <button className="close-btn" onClick={onClose}>&times;</button>
      </div>
      <div className="sidebar-content">
        {booth?.startup ? (
          <div className="booth-info">
            <h3>{booth.startup.name}</h3>
            <div className="booth-meta">
              <span className="badge">{booth.size}</span>
              <span className="badge">{booth.location}</span>
            </div>
            <p>{booth.startup.description}</p>
            <div className="links">
              <a href={booth.startup.website} target="_blank" rel="noopener noreferrer">
                🌐 Website
              </a>
              {booth.startup.slideDeck && (
                <a href={booth.startup.slideDeck} target="_blank" rel="noopener noreferrer">
                  📊 Slide Deck
                </a>
              )}
            </div>
            <div className="representatives">
              <h4>Representatives</h4>
              <ul>
                {booth.startup.representatives.map((rep, i) => (
                  <li key={i}>{rep}</li>
                ))}
              </ul>
            </div>
          </div>
        ) : booth ? (
          <div className="empty-state">
            <p><strong>Booth {booth.id}</strong></p>
            <p>Size: {booth.size}</p>
            <p>Location: {booth.location}</p>
            <p style={{ marginTop: '20px', color: '#999' }}>
              No startup assigned yet
            </p>
          </div>
        ) : (
          <div className="empty-state">
            <p>Select a booth to view details</p>
          </div>
        )}
      </div>
    </div>
  );
}
