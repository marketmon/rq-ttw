'use client';

import { useState, useMemo } from 'react';
import { Booth } from '@/data/booths';

interface CompanyDirectoryProps {
  booths: Booth[];
  isOpen: boolean;
  onClose: () => void;
  onSelectBooth: (booth: Booth) => void;
  selectedBoothId?: number;
}

export default function CompanyDirectory({
  booths,
  isOpen,
  onClose,
  onSelectBooth,
  selectedBoothId,
}: CompanyDirectoryProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'assigned' | 'available'>('all');

  // Sort and filter booths
  const filteredBooths = useMemo(() => {
    let filtered = [...booths];

    // Apply filter
    if (filter === 'assigned') {
      filtered = filtered.filter(b => b.startup);
    } else if (filter === 'available') {
      filtered = filtered.filter(b => !b.startup);
    }

    // Apply search
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(b =>
        b.id.toString().includes(term) ||
        b.startup?.name.toLowerCase().includes(term) ||
        b.startup?.representatives.some(r => r.toLowerCase().includes(term))
      );
    }

    // Sort by booth number
    return filtered.sort((a, b) => a.id - b.id);
  }, [booths, searchTerm, filter]);

  // Group booths by location
  const groupedBooths = useMemo(() => {
    const mainTent = filteredBooths.filter(b => b.location === 'main-tent');
    const vendorTents = filteredBooths.filter(b => b.location !== 'main-tent');
    return { mainTent, vendorTents };
  }, [filteredBooths]);

  const assignedCount = booths.filter(b => b.startup).length;

  return (
    <>
      {/* Overlay */}
      {isOpen && <div className="directory-overlay" onClick={onClose} />}

      {/* Directory Sidebar */}
      <div className={`directory ${isOpen ? 'open' : ''}`}>
        <div className="directory-header">
          <div className="directory-title">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
            <span>Company Directory</span>
          </div>
          <button className="directory-close" onClick={onClose}>×</button>
        </div>

        <div className="directory-search">
          <input
            type="text"
            placeholder="Search by booth #, company, or person..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="directory-filters">
          <button
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All ({booths.length})
          </button>
          <button
            className={`filter-btn ${filter === 'assigned' ? 'active' : ''}`}
            onClick={() => setFilter('assigned')}
          >
            Assigned ({assignedCount})
          </button>
          <button
            className={`filter-btn ${filter === 'available' ? 'active' : ''}`}
            onClick={() => setFilter('available')}
          >
            Available ({booths.length - assignedCount})
          </button>
        </div>

        <div className="directory-content">
          {/* Main Tent Section */}
          {groupedBooths.mainTent.length > 0 && (
            <div className="directory-section">
              <h3 className="section-title">Main Tent</h3>
              <div className="booth-list">
                {groupedBooths.mainTent.map(booth => (
                  <button
                    key={booth.id}
                    className={`booth-list-item ${booth.startup ? 'has-startup' : ''} ${selectedBoothId === booth.id ? 'selected' : ''}`}
                    onClick={() => onSelectBooth(booth)}
                  >
                    <div className="booth-number">#{booth.id}</div>
                    <div className="booth-details">
                      {booth.startup ? (
                        <>
                          <div className="company-name">{booth.startup.name}</div>
                          <div className="company-rep">
                            {booth.startup.representatives[0]}
                            {booth.startup.representatives.length > 1 &&
                              ` +${booth.startup.representatives.length - 1}`}
                          </div>
                        </>
                      ) : (
                        <div className="available-text">Available</div>
                      )}
                    </div>
                    <div className="booth-size">{booth.size}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Vendor Tents Section */}
          {groupedBooths.vendorTents.length > 0 && (
            <div className="directory-section">
              <h3 className="section-title">Vendor Tents</h3>
              <div className="booth-list">
                {groupedBooths.vendorTents.map(booth => (
                  <button
                    key={booth.id}
                    className={`booth-list-item ${booth.startup ? 'has-startup' : ''} ${selectedBoothId === booth.id ? 'selected' : ''}`}
                    onClick={() => onSelectBooth(booth)}
                  >
                    <div className="booth-number">#{booth.id}</div>
                    <div className="booth-details">
                      {booth.startup ? (
                        <>
                          <div className="company-name">{booth.startup.name}</div>
                          <div className="company-rep">
                            {booth.startup.representatives[0]}
                            {booth.startup.representatives.length > 1 &&
                              ` +${booth.startup.representatives.length - 1}`}
                          </div>
                        </>
                      ) : (
                        <div className="available-text">Available</div>
                      )}
                    </div>
                    <div className="booth-size">{booth.size}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {filteredBooths.length === 0 && (
            <div className="no-results">
              <p>No booths found matching your search.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
