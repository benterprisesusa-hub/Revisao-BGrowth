import React, { useState } from 'react';
import { useReviewStore } from '../data/store';
import { Download, FileText, Code, Printer, Copy, Check, Info } from 'lucide-react';
import { motion } from 'motion/react';

interface ExportDialogProps {
  onClose: () => void;
}

export const ExportDialog: React.FC<ExportDialogProps> = ({ onClose }) => {
  const {
    projects,
    screens,
    comments,
    activeProjectId,
  } = useReviewStore();

  const [activeTab, setActiveTab] = useState<'summary' | 'markdown' | 'json'>('summary');
  const [copied, setCopied] = useState(false);

  const activeProject = projects.find((p) => p.id === activeProjectId) || projects[0];
  const projectScreens = screens.filter((s) => s.projectId === activeProjectId);
  const projectScreensIds = projectScreens.map((s) => s.id);
  const projectComments = comments.filter((c) => projectScreensIds.includes(c.screenId));

  // Build Markdown Report text
  const generateMarkdownReport = () => {
    let report = `# Relatório de Auditoria - BGrowth Review Studio™\n`;
    report += `## Projeto: ${activeProject?.name}\n`;
    report += `- **Módulo**: ${activeProject?.module || 'Geral'}\n`;
    report += `- **Versão Global**: ${activeProject?.version || 'v1.0.0'}\n`;
    report += `- **Data da Auditoria**: ${new Date().toLocaleDateString()}\n`;
    report += `- **Status Geral**: ${activeProject?.status === 'Approved' ? 'Aprovado' : activeProject?.status === 'Needs Review' ? 'Precisa de Revisão' : 'Em Progresso'}\n\n`;

    report += `## Matriz de Resumo de Status\n`;
    report += `| Nome da Tela | Versão | Status da Revisão | Total de Problemas | Pendentes | Checklist Concluído |\n`;
    report += `| :--- | :--- | :--- | :--- | :--- | :--- |\n`;

    projectScreens.forEach((scr) => {
      const scComments = projectComments.filter((c) => c.screenId === scr.id);
      const unresolved = scComments.filter((c) => !c.resolved).length;
      
      const chTotal = scr.checklist.length;
      const chChecked = scr.checklist.filter((i) => i.checked).length;
      const progress = chTotal > 0 ? `${Math.round((chChecked/chTotal)*100)}%` : '0%';

      const statusTranslation = scr.reviewStatus === 'Approved' ? 'Aprovado' : scr.reviewStatus === 'Needs Review' ? 'Precisa de Revisão' : 'Em Progresso';
      report += `| ${scr.title} | ${scr.version} | ${statusTranslation} | ${scComments.length} | ${unresolved} | ${progress} (${chChecked}/${chTotal}) |\n`;
    });

    report += `\n\n## Registro de Problemas Pendentes\n`;
    const unresolvedComments = projectComments.filter((c) => !c.resolved);
    if (unresolvedComments.length === 0) {
      report += `Nenhuma anotação visual pendente encontrada! Todos os sistemas verificados em conformidade.\n`;
    } else {
      unresolvedComments.forEach((c) => {
        const scr = projectScreens.find((s) => s.id === c.screenId);
        const priorityTranslation = c.priority === 'Critical' ? 'Crítica' : c.priority === 'High' ? 'Alta' : c.priority === 'Medium' ? 'Média' : 'Baixa';
        const categoryTranslation = c.category === 'Spacing' ? 'Espaçamento' : c.category === 'Typography' ? 'Tipografia' : c.category === 'Colors' ? 'Cores' : c.category === 'Buttons' ? 'Botões' : c.category === 'Other' ? 'Outro' : c.category;
        report += `### Pin #${c.pinNumber} - [${categoryTranslation}] [Prioridade: ${priorityTranslation}] ${c.title}\n`;
        report += `- **Localização**: ${scr?.title || 'Tela'} (Coordenadas: X:${Math.round(c.pinX)}% Y:${Math.round(c.pinY)}%)\n`;
        report += `- **Descrição**: ${c.description || 'Nenhuma descrição fornecida.'}\n`;
        report += `- **Equipe Atribuída**: ${c.assignedTo === 'BGrowth Auditor' ? 'Auditor BGrowth' : (c.assignedTo || 'Não atribuído')}\n\n`;
      });
    }

    return report;
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const jsonDump = JSON.stringify({
    project: activeProject,
    screens: projectScreens,
    comments: projectComments,
  }, null, 2);

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4 print:p-0 print:bg-white select-none">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white border border-slate-200 rounded-2xl shadow-2xl max-w-2xl w-full flex flex-col max-h-[85vh] overflow-hidden print:shadow-none print:border-none print:max-h-full"
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-white shrink-0 print:hidden">
          <h3 className="font-display font-extrabold text-slate-900 tracking-tight text-md">
            Gerar Relatórios de Auditoria
          </h3>
          <button
            id="btn-close-export"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 transition text-xs font-semibold"
          >
            Fechar
          </button>
        </div>

        {/* Tab Controls */}
        <div className="bg-slate-50 border-b border-slate-100 px-6 py-2 flex space-x-4 shrink-0 print:hidden text-xs">
          <button
            id="btn-tab-summary"
            onClick={() => setActiveTab('summary')}
            className={`py-1.5 font-bold transition-all ${
              activeTab === 'summary' 
                ? 'border-b-2 border-blue-600 text-blue-700' 
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Resumo da Revisão
          </button>
          <button
            id="btn-tab-markdown"
            onClick={() => setActiveTab('markdown')}
            className={`py-1.5 font-bold transition-all ${
              activeTab === 'markdown' 
                ? 'border-b-2 border-blue-600 text-blue-700' 
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Exportador Markdown (Jira/Notion)
          </button>
          <button
            id="btn-tab-json"
            onClick={() => setActiveTab('json')}
            className={`py-1.5 font-bold transition-all ${
              activeTab === 'json' 
                ? 'border-b-2 border-blue-600 text-blue-700' 
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Dump de Dados JSON Brutos
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5 print:p-0">
          {/* Summary Tab View / Printable Content */}
          {activeTab === 'summary' && (
            <div className="space-y-4 font-sans text-slate-800 text-xs">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <h1 className="text-xl font-extrabold text-slate-900 print:text-2xl tracking-tight">
                    {activeProject?.name}
                  </h1>
                  <p className="text-slate-500 font-medium">Foco do Módulo: {activeProject?.module}</p>
                </div>
                {/* Print trigger button */}
                <button
                  id="btn-print-summary"
                  onClick={handlePrint}
                  className="flex items-center space-x-1 px-3 py-1.5 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 rounded-lg font-bold print:hidden"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Imprimir Relatório (PDF)</span>
                </button>
              </div>

              {/* Status table */}
              <div className="border border-slate-200/80 rounded-xl overflow-hidden shadow-sm">
                <table className="w-full text-left border-collapse text-[11px]">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
                      <th className="py-2.5 px-4">Nome da Tela</th>
                      <th className="py-2.5 px-4">Status da Revisão</th>
                      <th className="py-2.5 px-4 text-center">Pins Abertos</th>
                      <th className="py-2.5 px-4 text-center">Checklist de QA</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {projectScreens.map((scr) => {
                      const commentsCount = projectComments.filter((c) => c.screenId === scr.id && !c.resolved).length;
                      const chTotal = scr.checklist.length;
                      const chChecked = scr.checklist.filter((i) => i.checked).length;
                      const progress = chTotal > 0 ? Math.round((chChecked / chTotal) * 100) : 0;
                      return (
                        <tr key={scr.id}>
                          <td className="py-3 px-4 font-bold text-slate-700">{scr.title}</td>
                          <td className="py-3 px-4">
                            <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-bold">
                              {scr.reviewStatus === 'Approved' ? 'Aprovado' : scr.reviewStatus === 'Needs Review' ? 'Precisa de Revisão' : 'Em Progresso'}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-center font-bold text-slate-800">{commentsCount} pendente{commentsCount !== 1 ? 's' : ''}</td>
                          <td className="py-3 px-4 text-center">
                            <span className="font-semibold text-slate-600">{chChecked}/{chTotal} ({progress}%)</span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Unresolved items detailed logs */}
              <div className="space-y-3">
                <h3 className="font-display font-extrabold text-slate-800 tracking-tight text-sm">
                  Registro Detalhado de Problemas ({projectComments.filter(c => !c.resolved).length} Pendente{projectComments.filter(c => !c.resolved).length !== 1 ? 's' : ''})
                </h3>
                <div className="space-y-3">
                  {projectComments.filter(c => !c.resolved).map((c) => {
                    const sc = projectScreens.find((s) => s.id === c.screenId);
                    const priorityTranslation = c.priority === 'Critical' ? 'Crítica' : c.priority === 'High' ? 'Alta' : c.priority === 'Medium' ? 'Média' : 'Baixa';
                    const categoryTranslation = c.category === 'Spacing' ? 'Espaçamento' : c.category === 'Typography' ? 'Tipografia' : c.category === 'Colors' ? 'Cores' : c.category === 'Buttons' ? 'Botões' : c.category === 'Other' ? 'Outro' : c.category;
                    return (
                      <div key={c.id} className="p-3 bg-slate-50 border rounded-xl space-y-1.5 relative">
                        <span className={`absolute top-3 right-3 font-black text-[9px] uppercase px-1.5 py-0.2 rounded-full ${
                          c.priority === 'Critical' ? 'bg-red-50 text-red-700' :
                          c.priority === 'High' ? 'bg-orange-50 text-orange-700' :
                          c.priority === 'Medium' ? 'bg-blue-50 text-blue-700' : 'bg-slate-50 text-slate-700'
                        }`}>
                          {priorityTranslation}
                        </span>
                        <div className="flex items-center space-x-2 font-bold text-slate-800">
                          <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-black">
                            {c.pinNumber}
                          </span>
                          <span>{c.title}</span>
                        </div>
                        <p className="text-slate-500 leading-normal pl-7">{c.description}</p>
                        <div className="pl-7 flex space-x-4 text-[10px] text-slate-400 font-semibold">
                          <span>Tela: {sc?.title}</span>
                          <span>•</span>
                          <span>Categoria: {categoryTranslation}</span>
                          <span>•</span>
                          <span>Responsável: {c.assignedTo === 'BGrowth Auditor' ? 'Auditor BGrowth' : c.assignedTo}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Markdown Exporter Tab */}
          {activeTab === 'markdown' && (
            <div className="space-y-3">
              <div className="flex justify-between items-center shrink-0">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Documento Markdown Copiável
                </span>
                <button
                  id="btn-copy-md"
                  onClick={() => handleCopy(generateMarkdownReport())}
                  className="flex items-center space-x-1 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg shadow"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copied ? 'Copiado!' : 'Copiar Markdown'}</span>
                </button>
              </div>

              <textarea
                id="textarea-md-report"
                readOnly
                value={generateMarkdownReport()}
                className="w-full h-80 bg-slate-50 border border-slate-200 text-slate-800 p-4 font-mono text-[11px] rounded-xl outline-none leading-relaxed focus:ring-1 focus:ring-blue-500"
              />
            </div>
          )}

          {/* JSON Tab View */}
          {activeTab === 'json' && (
            <div className="space-y-3">
              <div className="flex justify-between items-center shrink-0">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Backup de Dados JSON Brutos
                </span>
                <button
                  id="btn-copy-json"
                  onClick={() => handleCopy(jsonDump)}
                  className="flex items-center space-x-1 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg shadow"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copied ? 'Copiado!' : 'Copiar JSON'}</span>
                </button>
              </div>

              <textarea
                id="textarea-json-dump"
                readOnly
                value={jsonDump}
                className="w-full h-80 bg-slate-900 border border-slate-800 text-emerald-400 p-4 font-mono text-[11px] rounded-xl outline-none leading-relaxed focus:ring-1 focus:ring-blue-500"
              />
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
