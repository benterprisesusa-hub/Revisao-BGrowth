import React from 'react';
import { useReviewStore } from '../data/store';
import { AnnotationTool } from '../types';
import { 
  MousePointer, MapPin, Square, Circle, PenTool, 
  Highlighter, Type, EyeOff, Minus, Check 
} from 'lucide-react';

export const AnnotationToolbar: React.FC = () => {
  const {
    currentTool,
    setCurrentTool,
    currentColor,
    setCurrentColor,
    currentThickness,
    setCurrentThickness,
  } = useReviewStore();

  const tools: { id: AnnotationTool; label: string; icon: React.ReactNode }[] = [
    { id: 'pointer', label: 'Ponteiro / Arrastar [ESPAÇO]', icon: <MousePointer className="w-4 h-4" /> },
    { id: 'marker', label: 'Pin de Comentário [1,2,3]', icon: <MapPin className="w-4 h-4" /> },
    { id: 'arrow', label: 'Desenhar Seta', icon: <span className="font-bold text-xs">↗</span> },
    { id: 'rect', label: 'Desenhar Retângulo', icon: <Square className="w-4 h-4" /> },
    { id: 'circle', label: 'Desenhar Círculo', icon: <Circle className="w-4 h-4" /> },
    { id: 'freehand', label: 'Desenho Livre', icon: <PenTool className="w-4 h-4" /> },
    { id: 'highlighter', label: 'Marca-texto', icon: <Highlighter className="w-4 h-4" /> },
    { id: 'blur', label: 'Desfocar Informações', icon: <EyeOff className="w-4 h-4" /> },
    { id: 'text', label: 'Adicionar Texto', icon: <Type className="w-4 h-4" /> },
  ];

  const colors = [
    { value: '#EF4444', name: 'Vermelho Coral' },
    { value: '#1061EC', name: 'Azul Primário' },
    { value: '#10B981', name: 'Verde Esmeralda' },
    { value: '#F59E0B', name: 'Laranja Âmbar' },
    { value: '#8B5CF6', name: 'Roxo Estrela' },
    { value: '#0F172A', name: 'Grafite Escuro' },
  ];

  const thicknesses = [2, 3, 5, 8];

  return (
    <div className="absolute top-4 right-4 z-20 bg-white border border-slate-200 shadow-lg rounded-2xl p-2 flex flex-col items-center space-y-3 shrink-0">
      {/* Tool select column */}
      <div className="flex flex-col space-y-1">
        <span className="text-[9px] font-bold text-slate-400 text-center uppercase tracking-wider mb-1">
          Ferramenta
        </span>
        {tools.map((t) => (
          <button
            key={t.id}
            id={`btn-tool-${t.id}`}
            onClick={() => setCurrentTool(t.id)}
            title={t.label}
            className={`p-2 rounded-xl transition-all ${
              currentTool === t.id
                ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/15'
                : 'text-slate-500 hover:bg-slate-50'
            }`}
          >
            {t.icon}
          </button>
        ))}
      </div>

      <div className="w-6 h-px bg-slate-100"></div>

      {/* Color Select Column */}
      <div className="flex flex-col items-center space-y-1.5">
        <span className="text-[9px] font-bold text-slate-400 text-center uppercase tracking-wider mb-1">
          Cor
        </span>
        {colors.map((c) => (
          <button
            key={c.value}
            id={`btn-color-${c.value.replace('#', '')}`}
            onClick={() => setCurrentColor(c.value)}
            title={c.name}
            className="w-5 h-5 rounded-full border border-slate-200/40 hover:scale-110 flex items-center justify-center transition-all"
            style={{ backgroundColor: c.value }}
          >
            {currentColor === c.value && (
              <Check className={`w-3 h-3 ${c.value === '#0F172A' ? 'text-white' : 'text-white'}`} />
            )}
          </button>
        ))}
      </div>

      <div className="w-6 h-px bg-slate-100"></div>

      {/* Thickness dropdown Column */}
      <div className="flex flex-col items-center space-y-1">
        <span className="text-[9px] font-bold text-slate-400 text-center uppercase tracking-wider mb-1">
          Tamanho
        </span>
        {thicknesses.map((th) => (
          <button
            key={th}
            id={`btn-size-${th}`}
            onClick={() => setCurrentThickness(th)}
            title={`Espessura ${th}px`}
            className={`w-6 h-6 rounded-md hover:bg-slate-50 flex items-center justify-center transition text-[10px] font-bold ${
              currentThickness === th ? 'bg-slate-100 text-slate-800' : 'text-slate-400'
            }`}
          >
            {th}
          </button>
        ))}
      </div>
    </div>
  );
};
