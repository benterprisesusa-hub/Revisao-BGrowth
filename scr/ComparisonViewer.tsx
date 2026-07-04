import React, { useState } from 'react';
import { useReviewStore } from '../data/store';
import { Screen, Project } from '../types';
import { 
  FileText, MessageSquare, AlertTriangle, CheckCircle, 
  Play, Calendar, Trash2, Edit3, Shield, Star, Plus, MonitorPlay
} from 'lucide-react';
import { motion } from 'motion/react';

interface DashboardProps {
  onSelectScreen: (screenId: string) => void;
  onOpenNewScreen: () => void;
  onOpenNewProject: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  onSelectScreen,
  onOpenNewScreen,
  onOpenNewProject,
}) => {
  const {
    projects,
    screens,
    comments,
    activeProjectId,
    updateProjectStatus,
    deleteScreen
  } = useReviewStore();

  const activeProject = projects.find((p) => p.id === activeProjectId) || projects[0];

  // Filtering data for active project
  const projectScreens = screens.filter((s) => s.projectId === activeProjectId);
  const projectScreensIds = projectScreens.map((s) => s.id);
  const projectComments = comments.filter((c) => projectScreensIds.includes(c.screenId));

  // Calculating Metrics
  const openIssues = projectComments.filter((c) => !c.resolved).length;
  const resolvedIssues = projectComments.filter((c) => c.resolved).length;
  const criticalIssues = projectComments.filter((c) => c.priority === 'Critical' && !c.resolved).length;
  
  // Checklist completions
  let totalChecklistItems = 0;
  let checkedChecklistItems = 0;
  projectScreens.forEach((scr) => {
    scr.checklist.forEach((item) => {
      totalChecklistItems++;
      if (item.checked) checkedChecklistItems++;
    });
  });

  const checklistProgress = totalChecklistItems > 0 
    ? Math.round((checkedChecklistItems / totalChecklistItems) * 100) 
    : 0;

  const totalIssues = projectComments.length;
  const issueProgress = totalIssues > 0 
    ? Math.round((resolvedIssues / totalIssues) * 100) 
    : 100;

  // Composite completion percentage
  const projectCompletion = totalScreensCount() > 0 
    ? Math.round((issueProgress + checklistProgress) / 2)
    : 0;

  function totalScreensCount() {
    return projectScreens.length;
  }

  return (
    <div className="flex-1 overflow-y-auto bg-[#F8FAFC] p-6 space-y-6 select-none font-sans">
      {/* Upper Brand Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center bg-white p-6 rounded-2xl border border-slate-200/65 shadow-sm space-y-4 lg:space-y-0">
        <div>
          <div className="flex items-center space-x-3">
            <span className="bg-blue-50 text-[#1061EC] text-[10px] font-extrabold px-3 py-1 rounded-full border border-blue-100 uppercase tracking-wider">
              {activeProject?.module === 'FinTech SaaS v4' ? 'SaaS FinTech v4' : (activeProject?.module || 'Módulo do Sistema')}
            </span>
            <span className="text-slate-400 text-xs font-medium">Atualizado há 3 min</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
            {activeProject?.name}
          </h2>
          <p className="text-slate-500 text-sm max-w-2xl mt-1 leading-relaxed">
            {activeProject?.description}
          </p>
        </div>

        <div className="flex items-center space-x-3 shrink-0">
          <div className="flex flex-col items-end">
            <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Status do Projeto</span>
            <select
              id="select-project-status"
              value={activeProject?.status || 'Draft'}
              onChange={(e) => updateProjectStatus(activeProject.id, e.target.value as Project['status'])}
              className="mt-1 text-xs font-bold bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-blue-500 text-slate-700"
            >
              <option value="Draft">Rascunho</option>
              <option value="In Progress">Em Progresso</option>
              <option value="Reviewed">Revisado</option>
              <option value="Approved">Aprovado</option>
            </select>
          </div>
        </div>
      </div>

      {/* Metrics Bento Grid Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric Card: Completion Progress */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Conclusão do Workspace</span>
            <CheckCircle className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="mt-4">
            <div className="flex items-baseline space-x-1">
              <span className="text-3xl font-extrabold text-slate-900 leading-none">{projectCompletion}%</span>
            </div>
            {/* Progress bar */}
            <div className="w-full bg-slate-100 h-2 rounded-full mt-3 overflow-hidden">
              <div 
                className="bg-emerald-500 h-full rounded-full transition-all duration-500" 
                style={{ width: `${projectCompletion}%` }}
              />
            </div>
            <p className="text-[10px] text-slate-400 mt-2">Taxa combinada de checklist e problemas</p>
          </div>
        </div>

        {/* Metric Card: Open Issues */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Problemas Pendentes</span>
            <MessageSquare className="w-4 h-4 text-blue-500" />
          </div>
          <div className="mt-4">
            <div className="flex items-baseline space-x-2">
              <span className="text-3xl font-extrabold text-slate-900 leading-none">{openIssues}</span>
              <span className="text-xs font-semibold text-slate-400">/ {totalIssues} no total</span>
            </div>
            {/* mini status logs */}
            <div className="flex space-x-2 mt-4 text-[10px] font-bold">
              <span className="text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                {resolvedIssues} resolvidos
              </span>
              <span className="text-slate-400 bg-slate-50 px-2 py-0.5 rounded">
                {totalIssues - openIssues - resolvedIssues} em progresso
              </span>
            </div>
          </div>
        </div>

        {/* Metric Card: Critical Alerts */}
        <div className="bg-[#FFF8F8] p-5 rounded-2xl border border-red-100 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-red-500 uppercase tracking-wider">Alertas Críticos</span>
            <AlertTriangle className="w-4 h-4 text-red-500 animate-bounce" />
          </div>
          <div className="mt-4">
            <div className="flex items-baseline space-x-2">
              <span className="text-3xl font-extrabold text-red-600 leading-none">{criticalIssues}</span>
              <span className="text-xs font-semibold text-red-400">Impedimentos</span>
            </div>
            <p className="text-[10px] text-red-400 mt-4 leading-normal">
              {criticalIssues > 0 
                ? 'Requer correções visuais e de layout imediatas' 
                : 'Nenhum impedimento crítico ativo'}
            </p>
          </div>
        </div>

        {/* Metric Card: Checklist Completion */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tarefas do Checklist</span>
            <FileText className="w-4 h-4 text-[#1061EC]" />
          </div>
          <div className="mt-4">
            <div className="flex items-baseline space-x-2">
              <span className="text-3xl font-extrabold text-slate-900 leading-none">{checklistProgress}%</span>
              <span className="text-xs font-semibold text-slate-400">
                ({checkedChecklistItems}/{totalChecklistItems})
              </span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full mt-3 overflow-hidden">
              <div 
                className="bg-[#1061EC] h-full rounded-full transition-all duration-500" 
                style={{ width: `${checklistProgress}%` }}
              />
            </div>
            <p className="text-[10px] text-slate-400 mt-2">Pontuação de verificação do checklist de QA</p>
          </div>
        </div>
      </div>

      {/* Screen List Heading */}
      <div className="flex justify-between items-center border-b border-slate-200/60 pb-3">
        <div>
          <h3 className="font-display font-extrabold text-lg text-slate-800 tracking-tight">
            Telas do Projeto
          </h3>
          <p className="text-slate-400 text-xs mt-0.5">Selecione uma tela abaixo para fazer anotações ou revisão</p>
        </div>
        <button
          id="btn-add-screen-dashboard"
          onClick={onOpenNewScreen}
          className="flex items-center space-x-1.5 px-3 py-1.5 bg-[#1061EC]/10 hover:bg-[#1061EC]/20 text-[#1061EC] font-bold text-xs rounded-lg transition"
        >
          <Plus className="w-4 h-4" />
          <span>Nova Tela</span>
        </button>
      </div>

      {/* Screens Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projectScreens.map((scr) => {
          const scrComments = comments.filter((c) => c.screenId === scr.id);
          const unresolvedCount = scrComments.filter((c) => !c.resolved).length;
          
          // Checklist completion rate for single screen
          const screenTotalChecklist = scr.checklist.length;
          const screenCheckedChecklist = scr.checklist.filter((i) => i.checked).length;
          const screenChecklistProgress = screenTotalChecklist > 0 
            ? Math.round((screenCheckedChecklist / screenTotalChecklist) * 100) 
            : 0;

          return (
            <motion.div
              key={scr.id}
              whileHover={{ y: -4, boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)' }}
              className="bg-white border border-slate-200/65 rounded-2xl overflow-hidden flex flex-col h-[340px]"
            >
              {/* Screen Mock Preview box */}
              <div className="h-44 bg-slate-900 relative group overflow-hidden border-b border-slate-100 flex items-center justify-center">
                {/* Simulated Thumbnail background */}
                {scr.screenshot === 'dashboard' ? (
                  <div className="w-full h-full scale-50 origin-center opacity-30 select-none pointer-events-none filter blur-[0.5px] bg-[#fafbfc]">
                    <div className="text-[20px] font-black text-slate-300 p-8">SaaS Executive Console</div>
                    <div className="w-40 h-10 bg-slate-200 rounded m-8"></div>
                  </div>
                ) : scr.screenshot === 'login' ? (
                  <div className="w-full h-full scale-50 origin-center opacity-30 select-none pointer-events-none filter blur-[0.5px] bg-white flex">
                    <div className="w-1/2 bg-slate-900"></div>
                    <div className="w-1/2"></div>
                  </div>
                ) : scr.screenshot === 'crm' ? (
                  <div className="w-full h-full scale-50 origin-center opacity-30 select-none pointer-events-none filter blur-[0.5px] bg-[#f8fafc]">
                    <div className="w-full h-10 bg-slate-100 border-b"></div>
                  </div>
                ) : (
                  <img
                    src={scr.screenshot}
                    alt={scr.title}
                    className="w-full h-full object-cover opacity-50"
                    referrerPolicy="no-referrer"
                  />
                )}

                {/* Overlays on Hover */}
                <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2 z-10">
                  <button
                    id={`btn-open-studio-${scr.id}`}
                    onClick={() => onSelectScreen(scr.id)}
                    className="px-4 py-2 bg-[#1061EC] hover:bg-blue-600 text-white font-bold text-xs rounded-lg flex items-center space-x-1.5 shadow-lg shadow-blue-500/30 transition-all transform translate-y-2 group-hover:translate-y-0"
                  >
                    <MonitorPlay className="w-4 h-4" />
                    <span>Abrir no Estúdio Visual</span>
                  </button>
                </div>

                {/* Left corner Screen version badge */}
                <span className="absolute top-3 left-3 bg-slate-950/65 text-slate-200 font-mono text-[9px] font-bold px-2 py-0.5 rounded backdrop-blur">
                  {scr.version}
                </span>

                {/* Right corner comment count */}
                {unresolvedCount > 0 && (
                  <span className="absolute top-3 right-3 bg-red-500 text-white font-bold text-[10px] h-5 px-2 rounded-full flex items-center justify-center shadow-md">
                    {unresolvedCount} {unresolvedCount === 1 ? 'Problema' : 'Problemas'}
                  </span>
                )}
              </div>

              {/* Screen details */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start">
                    <h4 className="font-display font-bold text-sm text-slate-800 hover:text-[#1061EC] cursor-pointer truncate mr-2" onClick={() => onSelectScreen(scr.id)}>
                      {scr.title}
                    </h4>
                    <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                      scr.reviewStatus === 'Needs Review' ? 'bg-blue-50 text-blue-600 border border-blue-100' :
                      scr.reviewStatus === 'In Progress' ? 'bg-amber-50 text-amber-600 border border-amber-100' :
                      scr.reviewStatus === 'Waiting' ? 'bg-purple-50 text-purple-600 border border-purple-100' :
                      scr.reviewStatus === 'Approved' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                      'bg-slate-100 text-slate-500 border border-slate-200'
                    }`}>
                      {scr.reviewStatus === 'Needs Review' ? 'Precisa de Revisão' : 
                       scr.reviewStatus === 'Approved' ? 'Aprovado' : 
                       scr.reviewStatus === 'In Progress' ? 'Em Progresso' : scr.reviewStatus}
                    </span>
                  </div>
                  <p className="text-slate-400 text-[11px] leading-relaxed line-clamp-2 mt-1">
                    {scr.description}
                  </p>
                </div>

                {/* Sub Stats checklist progress */}
                <div className="pt-3 border-t border-slate-100 mt-3">
                  <div className="flex justify-between items-center text-[10px] text-slate-400 mb-1.5 font-semibold">
                    <span>Progresso do Checklist</span>
                    <span>{screenCheckedChecklist}/{screenTotalChecklist} marcados ({screenChecklistProgress}%)</span>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className="bg-[#1061EC] h-full rounded-full transition-all duration-300" 
                      style={{ width: `${screenChecklistProgress}%` }}
                    />
                  </div>
                </div>

                {/* Quick actions row */}
                <div className="flex justify-between items-center text-[10px] text-slate-400 pt-3">
                  <span className="font-mono">ID: {scr.id}</span>
                  <div className="flex space-x-2">
                    <button
                      id={`btn-del-scr-${scr.id}`}
                      onClick={() => deleteScreen(scr.id)}
                      className="p-1 hover:text-red-500 hover:bg-red-50 rounded transition"
                      title="Excluir tela"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}

        {/* Upload Screen Dotted card trigger */}
        <button
          id="btn-add-screen-dotted"
          onClick={onOpenNewScreen}
          className="border-2 border-dashed border-slate-200 hover:border-blue-500 hover:bg-blue-50/20 rounded-2xl h-[340px] flex flex-col items-center justify-center text-slate-400 hover:text-blue-600 transition p-6 focus:outline-none"
        >
          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-blue-100 group-hover:text-blue-600 mb-3">
            <Plus className="w-6 h-6" />
          </div>
          <span className="font-display font-bold text-sm">Adicionar Nova Tela</span>
          <span className="text-[11px] text-slate-400 text-center max-w-xs mt-1">
            Arraste e solte uma imagem, cole um print (Ctrl+V) ou carregue modelos interativos do BGrowth.
          </span>
        </button>
      </div>
    </div>
  );
};
