import React, { useState, useRef, useEffect } from 'react';
import { useReviewStore } from '../data/store';
import { AnnotationShape, AnnotationTool, Comment } from '../types';
import { LoginMockup, DashboardMockup, CrmMockup } from '../data/mockups';
import { 
  ZoomIn, ZoomOut, Maximize, Palette, Grid, Move, Check, 
  Trash2, HelpCircle, AlertCircle, ArrowUpLeft
} from 'lucide-react';
import { motion } from 'motion/react';

interface AnnotationCanvasProps {
  onAddCommentPrompt: (pinX: number, pinY: number, tempShapes: AnnotationShape[]) => void;
  activeCommentId: string | null;
  onSelectComment: (commentId: string) => void;
}

export const AnnotationCanvas: React.FC<AnnotationCanvasProps> = ({
  onAddCommentPrompt,
  activeCommentId,
  onSelectComment,
}) => {
  const {
    screens,
    comments,
    activeScreenId,
    zoom,
    setZoom,
    panX,
    setPanX,
    panY,
    setPanY,
    currentTool,
    setCurrentTool,
    currentColor,
    setCurrentColor,
    currentThickness,
    setCurrentThickness,
    addScreen,
    activeProjectId,
  } = useReviewStore();

  const activeScreen = screens.find((s) => s.id === activeScreenId);

  // SVG Drawing states
  const [shapes, setShapes] = useState<AnnotationShape[]>([]);
  const [currentShape, setCurrentShape] = useState<Partial<AnnotationShape> | null>(null);
  const [undoStack, setUndoStack] = useState<AnnotationShape[][]>([]);
  const [redoStack, setRedoStack] = useState<AnnotationShape[][]>([]);
  
  // Drag-and-Pan states
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawingStart, setDrawingStart] = useState({ x: 0, y: 0 });

  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  // Filter comments for active screen
  const screenComments = comments.filter((c) => c.screenId === activeScreenId);

  // Key event listeners for panning (Spacebar) or shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && !isPanning && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
        e.preventDefault();
        setIsPanning(true);
      }
      // Ctrl+Z Undo shortcut
      if (e.ctrlKey && e.code === 'KeyZ') {
        e.preventDefault();
        handleUndo();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        setIsPanning(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isPanning, shapes, undoStack]);

  // Handle Ctrl+V Paste anywhere to upload screen
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') {
        return; // Don't interrupt text inputs
      }
      
      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const file = items[i].getAsFile();
          if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
              if (event.target?.result) {
                // Upload screenshot
                addScreen(
                  `Pasted Screenshot - ${new Date().toLocaleTimeString()}`,
                  `Instantly pasted from system clipboard on ${new Date().toLocaleDateString()}`,
                  activeScreen?.version || 'v1.0.0',
                  event.target.result as string
                );
              }
            };
            reader.readAsDataURL(file);
          }
        }
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [activeScreen, activeProjectId]);

  // Translate client coordinates (X, Y) to percentages of image bounding box
  const getRelativeCoords = (clientX: number, clientY: number) => {
    if (!imageRef.current) return { x: 0, y: 0 };
    const rect = imageRef.current.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * 100;
    const y = ((clientY - rect.top) / rect.height) * 100;
    return { x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) };
  };

  // Canvas Mouse Down
  const handleMouseDown = (e: React.MouseEvent) => {
    if (isPanning || currentTool === 'pointer') {
      setIsPanning(true);
      setPanStart({ x: e.clientX - panX, y: e.clientY - panY });
      return;
    }

    // Capture starting percentages for drawing shapes
    const coords = getRelativeCoords(e.clientX, e.clientY);
    setIsDrawing(true);
    setDrawingStart(coords);

    // Initial shape definition
    const id = `shp-${Date.now()}`;
    if (currentTool === 'marker') {
      // Placing Figma-style pins immediately prompts the comment box on client
      onAddCommentPrompt(coords.x, coords.y, []);
      setIsDrawing(false);
      return;
    }

    if (currentTool === 'text') {
      const textVal = prompt('Digite o texto da anotação:');
      if (textVal) {
        const textShape: AnnotationShape = {
          id,
          type: 'text',
          color: currentColor,
          thickness: currentThickness,
          points: [coords.x, coords.y],
          text: textVal,
        };
        saveShapeState([...shapes, textShape]);
      }
      setIsDrawing(false);
      return;
    }

    setCurrentShape({
      id,
      type: currentTool,
      color: currentColor,
      thickness: currentThickness,
      points: [coords.x, coords.y, coords.x, coords.y], // starting point
    });
  };

  // Canvas Mouse Move
  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPanning) {
      setPanX(e.clientX - panStart.x);
      setPanY(e.clientY - panStart.y);
      return;
    }

    if (!isDrawing || !currentShape) return;

    const coords = getRelativeCoords(e.clientX, e.clientY);

    if (currentTool === 'freehand' || currentTool === 'highlighter') {
      const pts = currentShape.points ? [...currentShape.points, coords.x, coords.y] : [coords.x, coords.y];
      setCurrentShape((prev) => ({ ...prev, points: pts }));
    } else {
      // Rectangle, Circle, Arrow, Callout, Blur
      setCurrentShape((prev) => ({
        ...prev,
        points: [drawingStart.x, drawingStart.y, coords.x, coords.y],
      }));
    }
  };

  // Canvas Mouse Up
  const handleMouseUp = (e: React.MouseEvent) => {
    if (isPanning) {
      setIsPanning(false);
      return;
    }

    if (!isDrawing || !currentShape) return;
    setIsDrawing(false);

    // Save drawn shape
    const finalShape = currentShape as AnnotationShape;
    const updatedShapes = [...shapes, finalShape];
    saveShapeState(updatedShapes);
    setCurrentShape(null);

    // Prompt user to add comment matching the drawing
    const centerPoint = getShapeCenter(finalShape);
    onAddCommentPrompt(centerPoint.x, centerPoint.y, [finalShape]);
    
    // Clear temporary visual shapes until they are saved inside a Comment's pins
    setShapes([]);
  };

  const getShapeCenter = (shape: AnnotationShape) => {
    const pts = shape.points;
    if (!pts || pts.length < 2) return { x: 50, y: 50 };
    if (shape.type === 'freehand' || shape.type === 'highlighter') {
      // Center of paths
      let sumX = 0, sumY = 0;
      for (let i = 0; i < pts.length; i += 2) {
        sumX += pts[i];
        sumY += pts[i+1];
      }
      return { x: sumX / (pts.length/2), y: sumY / (pts.length/2) };
    }
    // Midpoint for lines, rects, circles
    return { x: (pts[0] + pts[2]) / 2, y: (pts[1] + pts[3]) / 2 };
  };

  const saveShapeState = (newShapes: AnnotationShape[]) => {
    setUndoStack((prev) => [...prev, shapes]);
    setShapes(newShapes);
    setRedoStack([]);
  };

  const handleUndo = () => {
    if (undoStack.length === 0) return;
    const prev = undoStack[undoStack.length - 1];
    setRedoStack((prevRedo) => [...prevRedo, shapes]);
    setShapes(prev);
    setUndoStack((prevUndo) => prevUndo.slice(0, -1));
  };

  // Drop handlers for Drag-and-Drop Image Replace/Upload
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            addScreen(
              file.name.split('.')[0] || 'Uploaded Interface Screen',
              `Mockup screen imported from drag-and-drop: ${file.name}`,
              activeScreen?.version || 'v1.0.0',
              event.target.result as string
            );
          }
        };
        reader.readAsDataURL(file);
      }
    }
  };

  // Zoom helpers
  const handleZoomIn = () => setZoom((z) => Math.min(4, z + 0.25));
  const handleZoomOut = () => setZoom((z) => Math.max(0.5, z - 0.25));
  const handleZoomReset = () => {
    setZoom(1);
    setPanX(0);
    setPanY(0);
  };

  // Render specific SVG shapes
  const renderShapeElement = (shape: AnnotationShape) => {
    const pts = shape.points;
    if (!pts || pts.length < 2) return null;

    const stroke = shape.color;
    const strokeWidth = shape.thickness;
    const fillOpacity = shape.type === 'highlighter' ? '0.3' : '0';
    const fill = shape.type === 'highlighter' ? shape.color : 'none';

    switch (shape.type) {
      case 'arrow':
        return (
          <g key={shape.id}>
            <defs>
              <marker
                id={`arrowhead-${shape.id}`}
                markerWidth="8"
                markerHeight="6"
                refX="7"
                refY="3"
                orient="auto"
              >
                <polygon points="0 0, 8 3, 0 6" fill={stroke} />
              </marker>
            </defs>
            <line
              x1={`${pts[0]}%`}
              y1={`${pts[1]}%`}
              x2={`${pts[2]}%`}
              y2={`${pts[3]}%`}
              stroke={stroke}
              strokeWidth={strokeWidth}
              markerEnd={`url(#arrowhead-${shape.id})`}
            />
          </g>
        );
      case 'rect':
        const rx = Math.min(pts[0], pts[2]);
        const ry = Math.min(pts[1], pts[3]);
        const rw = Math.abs(pts[0] - pts[2]);
        const rh = Math.abs(pts[1] - pts[3]);
        return (
          <rect
            key={shape.id}
            x={`${rx}%`}
            y={`${ry}%`}
            width={`${rw}%`}
            height={`${rh}%`}
            stroke={stroke}
            strokeWidth={strokeWidth}
            fill={fill}
            fillOpacity={fillOpacity}
            rx="2"
          />
        );
      case 'circle':
        const cx = pts[0];
        const cy = pts[1];
        // hypotenuse as radius
        const r = Math.sqrt(Math.pow((pts[2] || pts[0]) - pts[0], 2) + Math.pow((pts[3] || pts[1]) - pts[1], 2));
        return (
          <circle
            key={shape.id}
            cx={`${cx}%`}
            cy={`${cy}%`}
            r={`${r}%`}
            stroke={stroke}
            strokeWidth={strokeWidth}
            fill={fill}
            fillOpacity={fillOpacity}
          />
        );
      case 'freehand':
      case 'highlighter':
        let d = `M ${pts[0]} ${pts[1]}`;
        for (let i = 2; i < pts.length; i += 2) {
          d += ` L ${pts[i]} ${pts[i + 1]}`;
        }
        return (
          <path
            key={shape.id}
            d={d}
            stroke={stroke}
            strokeWidth={shape.type === 'highlighter' ? strokeWidth * 4 : strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            opacity={shape.type === 'highlighter' ? 0.35 : 1}
          />
        );
      case 'blur':
        const bx = Math.min(pts[0], pts[2]);
        const by = Math.min(pts[1], pts[3]);
        const bw = Math.abs(pts[0] - pts[2]);
        const bh = Math.abs(pts[1] - pts[3]);
        return (
          <g key={shape.id}>
            <defs>
              <filter id={`svg-blur-filter-${shape.id}`}>
                <feGaussianBlur stdDeviation="6" />
              </filter>
            </defs>
            <rect
              x={`${bx}%`}
              y={`${by}%`}
              width={`${bw}%`}
              height={`${bh}%`}
              filter={`url(#svg-blur-filter-${shape.id})`}
              className="fill-slate-100/40"
            />
            <rect
              x={`${bx}%`}
              y={`${by}%`}
              width={`${bw}%`}
              height={`${bh}%`}
              stroke="#CBD5E1"
              strokeDasharray="4 4"
              strokeWidth="1.5"
              fill="none"
            />
          </g>
        );
      case 'text':
        return (
          <text
            key={shape.id}
            x={`${pts[0]}%`}
            y={`${pts[1]}%`}
            fill={stroke}
            fontSize="12"
            fontWeight="bold"
            fontFamily="monospace"
            className="select-none pointer-events-none drop-shadow"
          >
            {shape.text}
          </text>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-slate-100 relative group overflow-hidden border-r border-slate-200">
      {/* Dynamic Sub-toolbar inside Canvas for quick access */}
      <div className="absolute top-4 left-4 z-20 bg-white border border-slate-200 shadow-lg rounded-xl p-1.5 flex items-center space-x-2">
        <button
          onClick={handleZoomIn}
          className="p-1.5 hover:bg-slate-50 text-slate-600 rounded-lg transition"
          title="Aumentar Zoom"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={handleZoomOut}
          className="p-1.5 hover:bg-slate-50 text-slate-600 rounded-lg transition"
          title="Diminuir Zoom"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <div className="h-4 w-px bg-slate-200"></div>
        <button
          onClick={handleZoomReset}
          className="p-1.5 hover:bg-slate-50 text-slate-600 rounded-lg text-xs font-semibold flex items-center space-x-1"
          title="Redefinir Zoom e Foco"
        >
          <Maximize className="w-3.5 h-3.5" />
          <span>{Math.round(zoom * 100)}%</span>
        </button>
      </div>

      {/* Guide label when zooming / panning */}
      <div className="absolute bottom-4 left-4 z-20 bg-slate-900/85 backdrop-blur text-white text-[10px] font-bold px-3 py-1.5 rounded-full flex items-center space-x-1.5 shadow">
        <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse"></span>
        <span>Segure [ESPAÇO] para arrastar. Cole um print [CTRL+V] para enviar.</span>
      </div>

      {/* Main Drag-Pan Canvas Container */}
      <div
        ref={containerRef}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`flex-1 overflow-hidden relative flex items-center justify-center p-12 ${
          isPanning ? 'cursor-grabbing' : 'cursor-grab'
        }`}
        style={{ touchAction: 'none' }}
      >
        {/* The Zoomable & Pannable target stage */}
        <div
          ref={imageRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          className="relative shadow-2xl rounded-2xl select-none max-w-full origin-center select-none"
          style={{
            transform: `translate(${panX}px, ${panY}px) scale(${zoom})`,
            transition: isPanning || isDrawing ? 'none' : 'transform 0.15s ease-out',
            width: '100%',
            maxWidth: '960px',
            aspectRatio: '16/10',
          }}
        >
          {/* Default template render vs Custom Uploads */}
          {activeScreen?.screenshot === 'dashboard' ? (
            <DashboardMockup />
          ) : activeScreen?.screenshot === 'login' ? (
            <LoginMockup />
          ) : activeScreen?.screenshot === 'crm' ? (
            <CrmMockup />
          ) : activeScreen ? (
            <img
              src={activeScreen.screenshot}
              alt={activeScreen.title}
              className="w-full h-full object-cover rounded-2xl"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-full h-full bg-white flex flex-col items-center justify-center text-slate-400 rounded-2xl border">
              <AlertCircle className="w-8 h-8 mb-2 text-slate-300" />
              <span>Nenhuma tela selecionada</span>
            </div>
          )}

          {/* SVG Overlay representing static & dynamic drawings */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none z-10 rounded-2xl"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            {/* 1. Render all comments existing shapes for this screen */}
            {screenComments.map((comment) =>
              comment.shapes.map((shape) => renderShapeElement(shape))
            )}

            {/* 2. Render user's currently drawing temporary shape */}
            {currentShape && renderShapeElement(currentShape as AnnotationShape)}

            {/* 3. Render raw local temporary drawn shapes */}
            {shapes.map((shape) => renderShapeElement(shape))}
          </svg>

          {/* Figma-style comments Pin coordinates layer */}
          <div className="absolute inset-0 pointer-events-none z-20">
            {screenComments.map((comment) => {
              const isActive = comment.id === activeCommentId;
              return (
                <button
                  key={comment.id}
                  id={`pin-marker-${comment.pinNumber}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectComment(comment.id);
                  }}
                  className={`absolute pointer-events-auto transform -translate-x-1/2 -translate-y-1/2 w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shadow-lg transition-all ${
                    comment.resolved 
                      ? 'bg-slate-400 text-white line-through opacity-70 hover:opacity-100' 
                      : isActive
                      ? 'bg-red-600 text-white ring-4 ring-red-100 scale-125'
                      : 'bg-[#1061EC] text-white hover:bg-blue-700 hover:scale-110'
                  }`}
                  style={{
                    left: `${comment.pinX}%`,
                    top: `${comment.pinY}%`,
                  }}
                >
                  {comment.pinNumber}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
