import React, { useState, useRef, useEffect } from 'react';
import { useReviewStore } from '../data/store';
import { LoginMockup, DashboardMockup, CrmMockup } from '../data/mockups';
import { Columns, Layers, Sliders, Eye, Link, Link2Off, ChevronLeft } from 'lucide-react';
import { motion } from 'motion/react';

interface ComparisonViewerProps {
  onBackToSingle: () => void;
}

export const ComparisonViewer: React.FC<ComparisonViewerProps> = ({ onBackToSingle }) => {
  const {
    screens,
    activeScreenId,
    comparisonMode,
    setComparisonMode,
    compareScreenIdA,
    compareScreenIdB,
    setCompareScreenIdA,
    setCompareScreenIdB,
    overlayOpacity,
    setOverlayOpacity,
    sliderPosition,
    setSliderPosition,
    syncZoom,
    setSyncZoom,
  } = useReviewStore();

  // Drag slider mechanics
  const [isDraggingSlider, setIsDraggingSlider] = useState(false);
  const sliderContainerRef = useRef<HTMLDivElement>(null);

  // Sync scroll positions
  const leftPanelRef = useRef<HTMLDivElement>(null);
  const rightPanelRef = useRef<HTMLDivElement>(null);

  const activeScreen = screens.find((s) => s.id === activeScreenId) || screens[0];

  // Set default comparative screens on mount if empty
  useEffect(() => {
    if (!compareScreenIdA) setCompareScreenIdA(activeScreen.id);
    if (!compareScreenIdB) {
      const other = screens.find((s) => s.id !== activeScreen.id) || activeScreen;
      setCompareScreenIdB(other.id);
    }
  }, [activeScreen, screens]);

  const screenA = screens.find((s) => s.id === compareScreenIdA) || activeScreen;
  const screenB = screens.find((s) => s.id === compareScreenIdB) || screens[1] || activeScreen;

  // Handle Before/After split slide drag
  const handleSliderMove = (clientX: number) => {
    if (!sliderContainerRef.current) return;
    const rect = sliderContainerRef.current.getBoundingClientRect();
    const pos = ((clientX - rect.left) / rect.width) * 100;
    setSliderPosition(Math.max(0, Math.min(100, pos)));
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isDraggingSlider) return;
    handleSliderMove(e.touches[0].clientX);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDraggingSlider) return;
    handleSliderMove(e.clientX);
  };

  useEffect(() => {
    const handleMouseUp = () => setIsDraggingSlider(false);
    if (isDraggingSlider) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('touchend', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [isDraggingSlider]);

  // Synchronized scrolling/panning in Side-by-Side mode
  const handlePanelScroll = (e: React.UIEvent<HTMLDivElement>, source: 'left' | 'right') => {
    if (!syncZoom) return;
    const target = source === 'left' ? rightPanelRef.current : leftPanelRef.current;
    const trigger = source === 'left' ? leftPanelRef.current : rightPanelRef.current;
    
    if (target && trigger) {
      target.scrollTop = trigger.scrollTop;
      target.scrollLeft = trigger.scrollLeft;
    }
  };

  // Render screenshot or mock templates helper
  const renderScreenMock = (screenshot: string, title: string) => {
    if (screenshot === 'dashboard') return <DashboardMockup />;
    if (screenshot === 'login') return <LoginMockup />;
    if (screenshot === 'crm') return <CrmMockup />;
    return (
      <img
        src={screenshot}
        alt={title}
        className="w-full h-full object-cover"
        referrerPolicy="no-referrer"
      />
    );
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-slate-50 relative h-full select-none font-sans">
      {/* Control header bar */}
      <div className="h-14 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0">
        <div className="flex items-center space-x-3">
          <button
            id="btn-comparison-back"
            onClick={onBackToSingle}
            className="p-1.5 hover:bg-slate-50 rounded-lg text-slate-500 hover:text-slate-800 transition flex items-center space-x-1.5 text-xs font-semibold"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Visualização Única</span>
          </button>
          <div className="h-4 w-px bg-slate-200"></div>
          <span className="text-xs font-bold text-slate-700">Estúdio Comparativo de Telas</span>
        </div>

        {/* Comparative Mode selection */}
        <div className="bg-slate-100 p-1 rounded-xl flex space-x-1">
          <button
            id="btn-mode-side"
            onClick={() => setComparisonMode('side-by-side')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition ${
              comparisonMode === 'side-by-side'
                ? 'bg-white text-blue-700 shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Columns className="w-3.5 h-3.5" />
            <span>Lado a Lado</span>
          </button>
          <button
            id="btn-mode-overlay"
            onClick={() => setComparisonMode('overlay')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition ${
              comparisonMode === 'overlay'
                ? 'bg-white text-blue-700 shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Sobreposição</span>
          </button>
          <button
            id="btn-mode-slider"
            onClick={() => setComparisonMode('slider')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition ${
              comparisonMode === 'slider'
                ? 'bg-white text-blue-700 shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Antes/Depois</span>
          </button>
        </div>

        {/* Sync toggle */}
        {comparisonMode === 'side-by-side' && (
          <button
            id="btn-comparison-sync"
            onClick={() => setSyncZoom(!syncZoom)}
            className={`px-3 py-1.5 border rounded-lg text-xs font-bold flex items-center space-x-1.5 transition ${
              syncZoom 
                ? 'border-blue-200 bg-blue-50 text-blue-700' 
                : 'border-slate-200 text-slate-500 hover:text-slate-700'
            }`}
          >
            {syncZoom ? <Link className="w-3.5 h-3.5" /> : <Link2Off className="w-3.5 h-3.5" />}
            <span>{syncZoom ? 'Arrasto Sincronizado' : 'Arrasto Independente'}</span>
          </button>
        )}

        {/* Dynamic Controls based on Overlay Opacity */}
        {comparisonMode === 'overlay' && (
          <div className="flex items-center space-x-3 text-xs font-semibold text-slate-600">
            <span>Tela Inferior A</span>
            <input
              id="slider-opacity"
              type="range"
              min="0"
              max="100"
              value={overlayOpacity}
              onChange={(e) => setOverlayOpacity(parseInt(e.target.value))}
              className="w-32 accent-blue-600"
            />
            <span>Tela Superior B ({overlayOpacity}%)</span>
          </div>
        )}
      </div>

      {/* Screen Selection dropdown bar */}
      <div className="bg-slate-100/50 border-b border-slate-200 px-6 py-2.5 flex items-center justify-between text-xs shrink-0">
        <div className="flex items-center space-x-4 w-full">
          {/* Choice Screen A */}
          <div className="flex items-center space-x-2 flex-1">
            <span className="font-bold text-slate-400">Tela A (Original):</span>
            <select
              id="select-compare-a"
              value={compareScreenIdA}
              onChange={(e) => setCompareScreenIdA(e.target.value)}
              className="bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-slate-700 font-semibold focus:outline-none"
            >
              {screens.map((s) => (
                <option key={s.id} value={s.id}>{s.title} ({s.version})</option>
              ))}
            </select>
          </div>

          {/* Choice Screen B */}
          <div className="flex items-center space-x-2 flex-1">
            <span className="font-bold text-slate-400">Tela B (Revisada):</span>
            <select
              id="select-compare-b"
              value={compareScreenIdB}
              onChange={(e) => setCompareScreenIdB(e.target.value)}
              className="bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-slate-700 font-semibold focus:outline-none"
            >
              {screens.map((s) => (
                <option key={s.id} value={s.id}>{s.title} ({s.version})</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main comparative workspace canvas viewport */}
      <div className="flex-1 overflow-hidden relative p-8 flex justify-center items-center">
        {/* Render Side by Side comparative grids */}
        {comparisonMode === 'side-by-side' && (
          <div className="w-full h-full grid grid-cols-2 gap-6">
            {/* Panel Left - Screen A */}
            <div className="bg-white border border-slate-200 rounded-2xl flex flex-col overflow-hidden shadow-sm">
              <div className="bg-slate-50 border-b border-slate-100 py-2 px-4 flex justify-between items-center shrink-0">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Visualização Esquerda (A)</span>
                <span className="text-xs font-bold text-slate-700">{screenA?.title}</span>
              </div>
              <div
                ref={leftPanelRef}
                onScroll={(e) => handlePanelScroll(e, 'left')}
                className="flex-1 overflow-auto p-4 flex items-center justify-center bg-slate-100"
              >
                <div className="w-full max-w-[440px] aspect-[16/10] bg-white rounded-xl shadow-lg border">
                  {renderScreenMock(screenA?.screenshot, screenA?.title)}
                </div>
              </div>
            </div>

            {/* Panel Right - Screen B */}
            <div className="bg-white border border-slate-200 rounded-2xl flex flex-col overflow-hidden shadow-sm">
              <div className="bg-slate-50 border-b border-slate-100 py-2 px-4 flex justify-between items-center shrink-0">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Visualização Direita (B)</span>
                <span className="text-xs font-bold text-slate-700">{screenB?.title}</span>
              </div>
              <div
                ref={rightPanelRef}
                onScroll={(e) => handlePanelScroll(e, 'right')}
                className="flex-1 overflow-auto p-4 flex items-center justify-center bg-slate-100"
              >
                <div className="w-full max-w-[440px] aspect-[16/10] bg-white rounded-xl shadow-lg border">
                  {renderScreenMock(screenB?.screenshot, screenB?.title)}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Render Overlay Blend stacks */}
        {comparisonMode === 'overlay' && (
          <div className="w-full max-w-[720px] aspect-[16/10] bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden relative">
            {/* Base layer Screen A */}
            <div className="absolute inset-0">
              {renderScreenMock(screenA?.screenshot, screenA?.title)}
            </div>

            {/* Overlaid layer Screen B with dynamic opacity */}
            <div
              className="absolute inset-0 transition-opacity duration-150"
              style={{ opacity: overlayOpacity / 100 }}
            >
              {renderScreenMock(screenB?.screenshot, screenB?.title)}
            </div>

            {/* Floating indicator */}
            <span className="absolute bottom-4 right-4 bg-slate-900/80 backdrop-blur text-white text-[10px] font-bold py-1 px-2.5 rounded-full z-10">
              Fundo: {screenA?.title} | Topo: {screenB?.title}
            </span>
          </div>
        )}

        {/* Render Before/After vertical sliders */}
        {comparisonMode === 'slider' && (
          <div
            ref={sliderContainerRef}
            className="w-full max-w-[720px] aspect-[16/10] bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden relative cursor-col-resize select-none"
            onMouseDown={() => setIsDraggingSlider(true)}
            onTouchStart={() => setIsDraggingSlider(true)}
          >
            {/* Original Screen A on bottom (The 'Before') */}
            <div className="absolute inset-0">
              {renderScreenMock(screenA?.screenshot, screenA?.title)}
            </div>

            {/* Revised Screen B on top (The 'After') clipped dynamically */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                clipPath: `inset(0 0 0 ${sliderPosition}%)`,
              }}
            >
              {renderScreenMock(screenB?.screenshot, screenB?.title)}
            </div>

            {/* Division vertical handle line */}
            <div
              className="absolute top-0 bottom-0 w-1 bg-blue-600 shadow-lg pointer-events-none"
              style={{ left: `${sliderPosition}%` }}
            >
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-xl ring-4 ring-blue-100">
                ↔
              </div>
            </div>

            {/* Labels overlay */}
            <span className="absolute top-4 left-4 bg-slate-950/75 text-white font-bold text-[10px] px-2.5 py-1 rounded backdrop-blur z-10 pointer-events-none">
              ANTES: {screenA?.title} ({screenA?.version})
            </span>
            <span className="absolute top-4 right-4 bg-blue-600 text-white font-bold text-[10px] px-2.5 py-1 rounded shadow-md z-10 pointer-events-none">
              DEPOIS: {screenB?.title} ({screenB?.version})
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
