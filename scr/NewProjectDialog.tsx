import React from 'react';
import { useReviewStore } from '../data/store';
import { 
  FileUp, MessageSquare, CheckSquare, RefreshCw, 
  Download, PlusCircle, Trash, Clock, ShieldAlert 
} from 'lucide-react';

export const HistoryPanel: React.FC = () => {
  const { history, activeProjectId } = useReviewStore();

  const projectHistory = history.filter((h) => h.projectId === activeProjectId);

  const getActionIcon = (action: string) => {
    const act = action.toLowerCase();
    if (act.includes('upload') || act.includes('screenshot')) return <FileUp className="w-3.5 h-3.5 text-blue-500" />;
    if (act.includes('comment') || act.includes('reply')) return <MessageSquare className="w-3.5 h-3.5 text-[#1061EC]" />;
    if (act.includes('checklist') || act.includes('check')) return <CheckSquare className="w-3.5 h-3.5 text-[#1061EC]" />;
    if (act.includes('export')) return <Download className="w-3.5 h-3.5 text-emerald-500" />;
    if (act.includes('delete')) return <Trash className="w-3.5 h-3.5 text-red-500" />;
    if (act.includes('status') || act.includes('update')) return <RefreshCw className="w-3.5 h-3.5 text-amber-500" />;
    return <PlusCircle className="w-3.5 h-3.5 text-slate-500" />;
  };

  const formatTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' - ' + date.toLocaleDateString();
    } catch {
      return isoString;
    }
  };

  return (
    <div className="flex flex-col h-full bg-white select-none text-slate-800 font-sans p-4">
      <div className="flex items-center space-x-2 shrink-0 border-b border-slate-100 pb-3 mb-4">
        <Clock className="w-4 h-4 text-slate-400" />
        <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Histórico de Atividades do Projeto</span>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 pr-1">
        {projectHistory.length === 0 ? (
          <div className="h-44 flex flex-col items-center justify-center text-slate-400 border border-dashed border-slate-100 rounded-xl p-4 text-center">
            <ShieldAlert className="w-8 h-8 mb-1.5 text-slate-300" />
            <p className="text-xs font-bold">Nenhum histórico de atividades registrado</p>
            <p className="text-[10px] text-slate-400 mt-0.5">Realize algumas ações para começar a registrar o histórico!</p>
          </div>
        ) : (
          <div className="relative border-l border-slate-100 pl-4 ml-2.5 space-y-4">
            {projectHistory.map((log) => (
              <div key={log.id} id={`history-log-${log.id}`} className="relative text-xs space-y-1">
                {/* Timeline node icon */}
                <span className="absolute -left-6.5 top-0.5 w-5 h-5 rounded-full bg-white border border-slate-200 flex items-center justify-center shadow-sm">
                  {getActionIcon(log.action)}
                </span>

                <div className="flex justify-between items-center text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                  <span>{
                    log.action === 'Create Comment' ? 'Criar Comentário' :
                    log.action === 'Resolve Comment' ? 'Resolver Comentário' :
                    log.action === 'Reopen Comment' ? 'Reabrir Comentário' :
                    log.action === 'Add Reply' ? 'Adicionar Resposta' :
                    log.action === 'Update Comment Status' ? 'Atualizar Status do Comentário' :
                    log.action === 'Toggle Checklist' ? 'Marcar Checklist' :
                    log.action === 'Add Checklist Item' ? 'Adicionar Item ao Checklist' :
                    log.action === 'Delete Checklist Item' ? 'Excluir Item do Checklist' :
                    log.action === 'Add Screen' ? 'Adicionar Tela' :
                    log.action === 'Delete Screen' ? 'Excluir Tela' :
                    log.action === 'Create Project' ? 'Criar Projeto' :
                    log.action === 'Update Project Status' ? 'Atualizar Status do Projeto' :
                    log.action === 'Add Attachment' ? 'Adicionar Anexo' : log.action
                  }</span>
                  <span className="font-mono font-medium lowercase tracking-normal">{formatTime(log.timestamp)}</span>
                </div>
                <p className="text-[11px] text-slate-600 font-medium leading-relaxed">
                  {log.details}
                </p>
                {log.screenId && (
                  <span className="inline-block bg-slate-100 text-slate-500 font-mono text-[8px] px-1.5 rounded uppercase mt-1">
                    ID da Tela: {log.screenId.substring(0, 8)}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
