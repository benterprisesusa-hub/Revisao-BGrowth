import React, { useState } from 'react';
import { useReviewStore } from '../data/store';
import { 
  Search, Plus, Save, Download, Sparkles, Settings, 
  ChevronDown, CheckCircle2, RotateCcw, Monitor, FolderPlus,
  Cloud, RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AppHeaderProps {
  onOpenNewProject: () => void;
  onOpenNewScreen: () => void;
  onOpenExport: () => void;
  onOpenPrompt: () => void;
  onOpenSettings: () => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  onOpenNewProject,
  onOpenNewScreen,
  onOpenExport,
  onOpenPrompt,
  onOpenSettings,
}) => {
  const {
    projects,
    screens,
    activeProjectId,
    setActiveProjectId,
    activeScreenId,
    setActiveScreenId,
    searchQuery,
    setSearchQuery,
    clearAllData,
    isCloudSyncing
  } = useReviewStore();

  const [projectDropdownOpen, setProjectDropdownOpen] = useState(false);
  const [saveIndicator, setSaveIndicator] = useState(false);

  const activeProject = projects.find((p) => p.id === activeProjectId) || projects[0];
  const activeScreen = screens.find((s) => s.id === activeScreenId);

  const handleSaveClick = () => {
    setSaveIndicator(true);
    setTimeout(() => setSaveIndicator(false), 2000);
  };

  const projectScreens = screens.filter((s) => s.projectId === activeProjectId);

  return (
    <header className="h-16 border-b border-[#1E3A8A] bg-[#0D2A59] text-white px-6 flex items-center justify-between select-none shrink-0 z-50">
      {/* Brand & Project Switcher */}
      <div className="flex items-center space-x-4">
        {/* Official BGrowth Logo Mark */}
        <div className="flex items-center space-x-3">
          <div className="bg-[#1061EC] w-10 h-10 rounded-lg flex items-center justify-center font-bold text-xl text-white">
            B
          </div>
          <div>
            <h1 className="text-sm font-bold leading-none tracking-tight text-white">BGrowth Review Studio™</h1>
            <p className="text-[9px] uppercase tracking-widest opacity-70 mt-1 text-white">Edição Enterprise • v2.0 Produção</p>
          </div>
        </div>

        <div className="h-6 w-px bg-white/20"></div>

        {/* Project Dropdown selector */}
        <div className="relative">
          <button
            id="btn-project-dropdown"
            onClick={() => setProjectDropdownOpen(!projectDropdownOpen)}
            className="flex items-center bg-white/10 rounded-md px-3 py-1.5 gap-3 border border-white/10 text-white hover:bg-white/15 text-xs font-semibold transition-all"
          >
            <div className="text-xs text-left">
              <span className="opacity-60">Projeto:</span> <span className="font-medium text-white">{activeProject?.name}</span>
            </div>
            <div className="w-px h-4 bg-white/20"></div>
            <div className="text-xs text-left">
              <span className="opacity-60">Revisão:</span> <span className="font-medium text-[#4ADE80]">Atual</span>
            </div>
            <ChevronDown className={`w-3.5 h-3.5 text-white/60 transition-transform ${projectDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          <AnimatePresence>
            {projectDropdownOpen && (
              <>
                <div className="fixed inset-0 z-30" onClick={() => setProjectDropdownOpen(false)} />
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute left-0 mt-2 w-72 bg-white border border-slate-200 rounded-xl shadow-xl z-40 p-1.5 text-slate-800"
                >
                  <div className="text-[10px] font-bold text-slate-400 px-3 py-1.5 uppercase tracking-wider">
                    Meus Projetos
                  </div>
                  <div className="max-h-60 overflow-y-auto space-y-0.5">
                    {projects.map((p) => (
                      <button
                        key={p.id}
                        id={`btn-proj-select-${p.id}`}
                        onClick={() => {
                          setActiveProjectId(p.id);
                          // Auto select first screen of selected project
                          const scrs = screens.filter((s) => s.projectId === p.id);
                          if (scrs.length > 0) {
                            setActiveScreenId(scrs[0].id);
                          }
                          setProjectDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2.5 rounded-lg text-xs flex flex-col transition ${
                          p.id === activeProjectId
                            ? 'bg-blue-50 text-blue-800 font-semibold'
                             : 'text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex justify-between items-center w-full">
                          <span className="font-bold truncate max-w-[180px]">{p.name}</span>
                          <span className="text-[9px] px-1 py-0.2 bg-slate-100 rounded text-slate-500 font-mono">
                            {p.version}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400 truncate mt-0.5">{p.description}</span>
                      </button>
                    ))}
                  </div>

                  <div className="border-t border-slate-100 mt-1.5 pt-1.5">
                    <button
                      id="btn-new-project-header"
                      onClick={() => {
                        setProjectDropdownOpen(false);
                        onOpenNewProject();
                      }}
                      className="w-full text-left px-3 py-2 text-xs font-bold text-[#1061EC] hover:bg-blue-50 rounded-lg flex items-center space-x-2 transition"
                    >
                      <FolderPlus className="w-4 h-4" />
                      <span>Criar Novo Projeto</span>
                    </button>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Screen Info */}
      {activeScreen && (
        <div className="hidden md:flex items-center space-x-2 max-w-sm truncate bg-white/10 border border-white/10 rounded-full py-1.5 px-4 text-white">
          <Monitor className="w-3.5 h-3.5 text-white/60" />
          <span className="text-xs font-semibold text-white/60 uppercase tracking-wider">Revisando:</span>
          <span className="text-xs font-bold text-white truncate max-w-[180px]">
            {activeScreen.title}
          </span>
          <span className="text-[10px] font-bold bg-[#1061EC] border border-[#1E3A8A] text-white rounded px-1.5">
            {activeScreen.reviewStatus === 'Needs Review' ? 'Precisa de Revisão' : 
             activeScreen.reviewStatus === 'Approved' ? 'Aprovado' : 
             activeScreen.reviewStatus === 'In Progress' ? 'Em Progresso' : activeScreen.reviewStatus}
          </span>
        </div>
      )}

      {/* Actions & Global Search */}
      <div className="flex items-center space-x-3">
        {/* Cloud Sync Status Indicator */}
        <div className="hidden sm:flex items-center space-x-1.5 bg-white/10 px-3 py-1.5 rounded-md border border-white/10 text-white select-none">
          {isCloudSyncing ? (
            <>
              <RefreshCw className="w-3 h-3 animate-spin text-amber-400" />
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest">Sincronizando...</span>
            </>
          ) : (
            <>
              <Cloud className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400/20" />
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Nuvem Conectada</span>
            </>
          )}
        </div>

        {/* Instant Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-white/40 absolute left-3 top-2.5" />
          <input
            id="input-header-search"
            type="text"
            placeholder="Buscar telas..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-white/10 border border-white/20 rounded-md py-1.5 pl-9 pr-4 text-xs w-48 text-white focus:outline-none focus:ring-1 focus:ring-[#1061EC] transition-all placeholder:text-white/40"
          />
        </div>

        {/* Buttons */}
        <button
          id="btn-new-screen-header"
          onClick={onOpenNewScreen}
          className="bg-white/10 hover:bg-white/20 border border-white/10 px-4 py-2 rounded-md text-xs font-semibold text-white transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Nova Tela</span>
        </button>

        <button
          id="btn-save-header"
          onClick={handleSaveClick}
          className="bg-white/10 hover:bg-white/20 border border-white/10 px-4 py-2 rounded-md text-xs font-semibold text-white transition-colors flex items-center gap-2 relative"
        >
          <Save className="w-4 h-4 text-white/60" />
          <span className="hidden sm:inline">Salvar</span>
          <AnimatePresence>
            {saveIndicator && (
              <motion.span
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="absolute top-10 right-0 bg-slate-900 text-white font-bold text-[10px] py-1 px-2.5 rounded shadow-lg whitespace-nowrap flex items-center space-x-1 z-50"
              >
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                <span>Salvo no armazenamento local</span>
              </motion.span>
            )}
          </AnimatePresence>
        </button>

        <button
          id="btn-export-header"
          onClick={onOpenExport}
          className="bg-white/10 hover:bg-white/20 border border-white/10 px-4 py-2 rounded-md text-xs font-semibold text-white transition-colors flex items-center gap-2"
        >
          <Download className="w-4 h-4 text-white/60" />
          <span className="hidden sm:inline">Exportar</span>
        </button>

        <button
          id="btn-ai-prompt-header"
          onClick={onOpenPrompt}
          className="bg-[#1061EC] hover:bg-[#0D4EBD] px-4 py-2 rounded-md text-xs font-semibold shadow-lg transition-colors flex items-center gap-2 text-white"
        >
          <Sparkles className="w-4 h-4 text-white" />
          <span>Gerar Prompt de IA</span>
        </button>

        <button
          id="btn-settings-header"
          onClick={onOpenSettings}
          className="bg-white/10 hover:bg-white/20 p-2 rounded-md border border-white/10 transition-colors text-white"
          title="BGrowth Settings & Reset"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
