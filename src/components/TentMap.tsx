'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { TransformWrapper, TransformComponent, ReactZoomPanPinchRef } from 'react-zoom-pan-pinch';
import { booths, Booth, sampleStartups } from '@/data/booths';
import BoothBox from './BoothBox';
import Sidebar from './Sidebar';
import CompanyDirectory from './CompanyDirectory';

interface ScaleConfig {
  scale: number;
  minScale: number;
  posX: number;
  posY: number;
}

// Booth position data for panning (approximate center positions in the tent-map coordinate system)
const boothPositions: Record<number, { x: number; y: number }> = {
  // Row 1
  1: { x: 55, y: 95 }, 2: { x: 170, y: 95 }, 3: { x: 260, y: 95 }, 4: { x: 350, y: 95 },
  5: { x: 440, y: 95 }, 6: { x: 530, y: 95 }, 7: { x: 645, y: 95 },
  // Row 2
  8: { x: 170, y: 170 }, 9: { x: 225, y: 170 }, 10: { x: 280, y: 170 }, 11: { x: 335, y: 170 },
  12: { x: 390, y: 170 }, 13: { x: 445, y: 170 }, 14: { x: 500, y: 170 }, 15: { x: 555, y: 170 },
  // Row 3
  16: { x: 55, y: 255 }, 17: { x: 170, y: 255 }, 18: { x: 260, y: 255 }, 19: { x: 350, y: 255 },
  20: { x: 440, y: 255 }, 21: { x: 530, y: 255 }, 22: { x: 645, y: 255 },
  // Row 4
  23: { x: 170, y: 330 }, 24: { x: 225, y: 330 }, 25: { x: 280, y: 330 }, 26: { x: 335, y: 330 },
  27: { x: 390, y: 330 }, 28: { x: 445, y: 330 }, 29: { x: 500, y: 330 }, 30: { x: 555, y: 330 },
  // Row 5
  31: { x: 55, y: 415 }, 32: { x: 170, y: 415 }, 33: { x: 260, y: 415 }, 34: { x: 350, y: 415 },
  35: { x: 440, y: 415 }, 36: { x: 530, y: 415 }, 37: { x: 645, y: 415 },
  // Outside bottom (38-41)
  38: { x: 75, y: 580 }, 39: { x: 205, y: 580 }, 40: { x: 335, y: 580 }, 41: { x: 465, y: 580 },
  // Outside right (42-43)
  42: { x: 905, y: 115 }, 43: { x: 905, y: 245 },
};

export default function TentMap() {
  const [selectedBooth, setSelectedBooth] = useState<Booth | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [directoryOpen, setDirectoryOpen] = useState(false);
  const [scaleConfig, setScaleConfig] = useState<ScaleConfig | null>(null);
  const [controlsOpen, setControlsOpen] = useState(false);
  const [legendOpen, setLegendOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const transformRef = useRef<ReactZoomPanPinchRef>(null);
  const controlsRef = useRef<HTMLDivElement>(null);
  const legendRef = useRef<HTMLDivElement>(null);

  // Map dimensions - the actual size of the tent map content
  const MAP_WIDTH = 980;
  const MAP_HEIGHT = 680;

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (controlsRef.current && !controlsRef.current.contains(event.target as Node)) {
        setControlsOpen(false);
      }
      if (legendRef.current && !legendRef.current.contains(event.target as Node)) {
        setLegendOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Calculate scale and position to fit and center the map
  useEffect(() => {
    const calculateScaleAndPosition = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.clientWidth;
        const containerHeight = containerRef.current.clientHeight;

        // Calculate scale to fit the entire map with padding
        const padding = 20;
        const availableWidth = containerWidth - (padding * 2);
        const availableHeight = containerHeight - (padding * 2);

        const scaleX = availableWidth / MAP_WIDTH;
        const scaleY = availableHeight / MAP_HEIGHT;
        const fitScale = Math.min(scaleX, scaleY);

        // Calculate position to center the scaled map
        const scaledWidth = MAP_WIDTH * fitScale;
        const scaledHeight = MAP_HEIGHT * fitScale;
        const posX = (containerWidth - scaledWidth) / 2;
        const posY = (containerHeight - scaledHeight) / 2;

        // Limit zoom out to 80% of fit scale (don't let it get too small)
        const minScale = Math.max(fitScale * 0.8, 0.2);

        setScaleConfig({
          scale: fitScale,
          minScale,
          posX,
          posY,
        });
      }
    };

    // Initial calculation with a small delay
    const timer = setTimeout(calculateScaleAndPosition, 100);

    // Recalculate on resize
    window.addEventListener('resize', calculateScaleAndPosition);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', calculateScaleAndPosition);
    };
  }, []);

  // Get booths with startup data merged in
  const boothsWithStartups = booths.map(booth => ({
    ...booth,
    startup: sampleStartups[booth.id],
  }));

  // Filter booths by row
  const getBoothsByRow = (row: number) => boothsWithStartups.filter(b => b.row === row && b.location === 'main-tent');
  const outsideBottom = boothsWithStartups.filter(b => b.location === 'outside-bottom');
  const outsideRight = boothsWithStartups.filter(b => b.location === 'outside-right');

  const handleBoothClick = (booth: Booth) => {
    setSelectedBooth(booth);
    setSidebarOpen(true);
  };

  const handleCloseSidebar = () => {
    setSidebarOpen(false);
  };

  const handleZoomIn = useCallback(() => {
    transformRef.current?.zoomIn();
  }, []);

  const handleZoomOut = useCallback(() => {
    transformRef.current?.zoomOut();
  }, []);

  const handleReset = useCallback(() => {
    if (scaleConfig) {
      transformRef.current?.setTransform(
        scaleConfig.posX,
        scaleConfig.posY,
        scaleConfig.scale
      );
    }
  }, [scaleConfig]);

  // Pan to a specific booth and select it
  const handlePanToBooth = useCallback((booth: Booth) => {
    if (!containerRef.current || !transformRef.current) return;

    const position = boothPositions[booth.id];
    if (!position) return;

    const containerWidth = containerRef.current.clientWidth;
    const containerHeight = containerRef.current.clientHeight;

    // Zoom in a bit when panning to a booth
    const zoomScale = 1.5;

    // Calculate position to center the booth in the viewport
    const posX = (containerWidth / 2) - (position.x * zoomScale);
    const posY = (containerHeight / 2) - (position.y * zoomScale);

    // Animate to the booth
    transformRef.current.setTransform(posX, posY, zoomScale, 300);

    // Select the booth and close directory
    setSelectedBooth(booth);
    setDirectoryOpen(false);

    // Open details sidebar after a short delay
    setTimeout(() => {
      setSidebarOpen(true);
    }, 350);
  }, []);

  return (
    <div className="app-container">
      <header className="header">
        {/* Hamburger Menu Button */}
        <button
          className="hamburger-btn"
          onClick={() => setDirectoryOpen(!directoryOpen)}
          aria-label="Open company directory"
        >
          <span className="hamburger-icon">
            <span></span>
            <span></span>
            <span></span>
          </span>
        </button>

        <h1 className="header-title">
          <span className="event-name event-name-full">Red Queen 7 Technical Terrain Walk</span>
          <span className="event-name event-name-short">RQ7 TTW Map</span>
        </h1>

        <div className="header-actions">
          {/* Controls Dropdown */}
          <div className="dropdown" ref={controlsRef}>
            <button
              className="dropdown-toggle"
              onClick={() => setControlsOpen(!controlsOpen)}
            >
              <span className="dropdown-label">Controls</span>
              <span className="dropdown-arrow">{controlsOpen ? '▲' : '▼'}</span>
            </button>
            {controlsOpen && (
              <div className="dropdown-menu">
                <button onClick={handleZoomIn}>+ Zoom In</button>
                <button onClick={handleZoomOut}>- Zoom Out</button>
                <button onClick={handleReset}>Reset View</button>
                <div className="dropdown-divider" />
                <div className="dropdown-info">
                  <p>Drag to pan</p>
                  <p>Scroll/pinch to zoom</p>
                </div>
              </div>
            )}
          </div>

          {/* Legend Dropdown */}
          <div className="dropdown" ref={legendRef}>
            <button
              className="dropdown-toggle"
              onClick={() => setLegendOpen(!legendOpen)}
            >
              <span className="dropdown-label">Legend</span>
              <span className="dropdown-arrow">{legendOpen ? '▲' : '▼'}</span>
            </button>
            {legendOpen && (
              <div className="dropdown-menu legend-menu">
                <div className="legend-item">
                  <div className="legend-box main-tent-legend" />
                  <span>Main Tent (1-37)</span>
                </div>
                <div className="legend-item">
                  <div className="legend-box vendor-tent-legend" />
                  <span>Vendor Tents (38-43)</span>
                </div>
                <div className="dropdown-divider" />
                <div className="legend-item">
                  <div className="legend-box size-15" />
                  <span>15' x 15'</span>
                </div>
                <div className="legend-item">
                  <div className="legend-box size-10" />
                  <span>10' x 10'</span>
                </div>
                <div className="legend-item">
                  <div className="legend-box size-6" />
                  <span>6' x 6'</span>
                </div>
                <div className="legend-item">
                  <div className="legend-box size-20" />
                  <span>20' x 20' (Vendor)</span>
                </div>
                <div className="dropdown-divider" />
                <div className="legend-item">
                  <div className="legend-box has-startup-legend" />
                  <span>Has Startup Info</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Company Directory Sidebar */}
      <CompanyDirectory
        booths={boothsWithStartups}
        isOpen={directoryOpen}
        onClose={() => setDirectoryOpen(false)}
        onSelectBooth={handlePanToBooth}
        selectedBoothId={selectedBooth?.id}
      />

      <div className="map-container" ref={containerRef}>
        {scaleConfig === null ? (
          <div className="loading-map">Loading map...</div>
        ) : (
          <TransformWrapper
            key={`transform-${scaleConfig.scale.toFixed(4)}-${scaleConfig.posX.toFixed(0)}-${scaleConfig.posY.toFixed(0)}`}
            ref={transformRef}
            initialScale={scaleConfig.scale}
            initialPositionX={scaleConfig.posX}
            initialPositionY={scaleConfig.posY}
            minScale={scaleConfig.minScale}
            maxScale={3}
            limitToBounds={false}
            wheel={{
              step: 0.08,
            }}
            panning={{
              velocityDisabled: true,
            }}
            pinch={{
              step: 5,
            }}
            doubleClick={{
              disabled: true,
            }}
          >
            <TransformComponent
              wrapperClass="map-wrapper"
              contentClass="map-content"
            >
              <div className="tent-map">
                {/* Main Tent */}
                <div className="main-tent">
                  <div className="main-tent-label">MAIN TENT</div>

                  {/* Row 1 - Top (1, 2-6, 7) */}
                  <div className="booth-row row-1">
                    {getBoothsByRow(1).map(booth => (
                      <BoothBox
                        key={booth.id}
                        booth={booth}
                        isSelected={selectedBooth?.id === booth.id}
                        onClick={handleBoothClick}
                      />
                    ))}
                  </div>

                  {/* Row 2 - 6x6 booths (8-15) */}
                  <div className="booth-row row-2">
                    {getBoothsByRow(2).map(booth => (
                      <BoothBox
                        key={booth.id}
                        booth={booth}
                        isSelected={selectedBooth?.id === booth.id}
                        onClick={handleBoothClick}
                      />
                    ))}
                  </div>

                  {/* Row 3 - Middle (16, 17-21, 22) */}
                  <div className="booth-row row-3">
                    {getBoothsByRow(3).map(booth => (
                      <BoothBox
                        key={booth.id}
                        booth={booth}
                        isSelected={selectedBooth?.id === booth.id}
                        onClick={handleBoothClick}
                      />
                    ))}
                  </div>

                  {/* Row 4 - 6x6 booths (23-30) */}
                  <div className="booth-row row-4">
                    {getBoothsByRow(4).map(booth => (
                      <BoothBox
                        key={booth.id}
                        booth={booth}
                        isSelected={selectedBooth?.id === booth.id}
                        onClick={handleBoothClick}
                      />
                    ))}
                  </div>

                  {/* Row 5 - Bottom (31, 32-36, 37) */}
                  <div className="booth-row row-5">
                    {getBoothsByRow(5).map(booth => (
                      <BoothBox
                        key={booth.id}
                        booth={booth}
                        isSelected={selectedBooth?.id === booth.id}
                        onClick={handleBoothClick}
                      />
                    ))}
                  </div>
                </div>

                {/* Outside Tents - Bottom (38-41) */}
                <div className="outside-tents-bottom">
                  {outsideBottom.map(booth => (
                    <div key={booth.id} className="outside-tent-wrapper">
                      <BoothBox
                        booth={booth}
                        isSelected={selectedBooth?.id === booth.id}
                        onClick={handleBoothClick}
                      />
                      <div className="outside-tent-label">VENDOR TENT</div>
                    </div>
                  ))}
                </div>

                {/* Outside Tents - Right (42-43) */}
                <div className="outside-tents-right">
                  {outsideRight.map(booth => (
                    <div key={booth.id} className="outside-tent-wrapper">
                      <BoothBox
                        booth={booth}
                        isSelected={selectedBooth?.id === booth.id}
                        onClick={handleBoothClick}
                      />
                      <div className="outside-tent-label">VENDOR TENT</div>
                    </div>
                  ))}
                </div>
              </div>
            </TransformComponent>
          </TransformWrapper>
        )}
      </div>

      <Sidebar
        booth={selectedBooth}
        isOpen={sidebarOpen}
        onClose={handleCloseSidebar}
      />

      <footer className="footer">
        <span>Developed by</span>
        <a href="https://commonmission.us" target="_blank" rel="noopener noreferrer">
          Common Mission
        </a>
      </footer>
    </div>
  );
}
