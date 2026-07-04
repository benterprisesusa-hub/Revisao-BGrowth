import React, { useState, useEffect } from 'react';
import { useReviewStore } from '../data/store';
import { Sparkles, Copy, Check, RefreshCw, AlertCircle, Eye, CornerDownRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface PromptGeneratorProps {
  onClose: () => void;
}

export const PromptGenerator: React.FC<PromptGeneratorProps> = ({ onClose }) => {
  const {
    screens,
    comments,
    activeScreenId,
    projects,
    activeProjectId,
  } = useReviewStore();

  const activeScreen = screens.find((s) => s.id === activeScreenId) || screens[0];
  const activeProject = projects.find((p) => p.id === activeProjectId) || projects[0];

  const screenComments = comments.filter((c) => c.screenId === activeScreen.id && !c.resolved);

  const [loading, setLoading] = useState(false);
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [copied, setCopied] = useState(false);
  const [systemStyleConstraint, setSystemStyleConstraint] = useState('Maintain current structure');
  
  // Rotating reassuring messages for AI model latency
  const loadingMessages = [
    'Analisando comentários e pins no estilo Figma...',
    'Identificando anomalias no layout visual...',
    'Sintetizando registros de conformidade por categoria...',
    'Consulting Gemini 3.5 Flash para otimização arquitetônica...',
    'Formulando instruções livres de regressão...',
    'Lapidando o prompt de desenvolvedor pronto para produção...'
  ];
  const [loadingMsgIndex, setLoadingMsgIndex] = useState(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (loading) {
      timer = setInterval(() => {
        setLoadingMsgIndex((prev) => (prev + 1) % loadingMessages.length);
      }, 2000);
    }
    return () => clearInterval(timer);
  }, [loading]);

  const handleGeneratePrompt = async () => {
    if (screenComments.length === 0) {
      setGeneratedPrompt('');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    setGeneratedPrompt('');

    const payload = {
      screenName: activeScreen.title,
      projectInfo: {
        name: activeProject.name,
        module: activeProject.module,
      },
      problems: screenComments.map((c) => ({
        title: c.title,
        description: c.description,
        category: c.category,
        priority: c.priority,
      })),
    };

    try {
      const res = await fetch('/api/generate-prompt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error('Server returned error status');
      }

      const data = await res.json();
      setGeneratedPrompt(data.prompt);
    } catch (e: any) {
      console.warn('Backend prompt generator failed, executing premium client fallback...', e);
      // Client-side fallback template builder
      generateClientFallback();
    } finally {
      setLoading(false);
    }
  };

  const generateClientFallback = () => {
    const list = screenComments.map((c, idx) => {
      const priorityTranslation = c.priority === 'Critical' ? 'Crítica' : c.priority === 'High' ? 'Alta' : c.priority === 'Medium' ? 'Média' : 'Baixa';
      const categoryTranslation = c.category === 'Spacing' ? 'Espaçamento' : c.category === 'Typography' ? 'Tipografia' : c.category === 'Colors' ? 'Cores' : c.category === 'Buttons' ? 'Botões' : c.category === 'Other' ? 'Outro' : c.category;
      return `### Problema ${idx + 1}: [Categoria: ${categoryTranslation}] (Prioridade: ${priorityTranslation})
- **Título**: ${c.title}
- **Descrição**: ${c.description || 'Nenhuma descrição adicional fornecida'}
- **Ação Necessária**: Corrigir esta anomalia de layout de acordo com os limites de design do BGrowth.`;
    }).join('\n\n');

    const promptText = `# Prompt de Instrução de Engenharia de Produção BGrowth
## Contexto e Alvos
- **Componente / Tela Alvo**: \`${activeScreen.title}\` (${activeScreen.version})
- **Módulo do Workspace**: \`${activeProject.name}\` (Módulo: ${activeProject.module})
- **Anomalias Detectadas**: ${screenComments.length} problemas visuais pendentes

---

## Diretrizes de Correção Aplicáveis
Por favor, execute as seguintes correções precisas de layout visual e estilo no aplicativo sem alterar outros estados ou elementos estruturais não relacionados.

${list}

---

## Diretrizes de Integração e Implementação
1. **Restrição de Regressão**: Corrija APENAS os itens específicos mencionados. Não redesenhe, reestruture ou refatore outros módulos em funcionamento.
2. **Integridade da Marca**: Mantenha as especificações padrão do BGrowth (Azul Primário: \`#1061EC\`, Azul Escuro: \`#0D2A59\`).
3. **Tipografia**: Mantenha escala rígida de fontes (Poppins para destaque, Inter principal).
4. **Testes Locais**: Verifique a responsividade, espaçamentos e alinhamentos visuais dentro das visualizações do cliente.`;

    setGeneratedPrompt(promptText);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    handleGeneratePrompt();
  }, [activeScreenId]);

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4 select-none">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="bg-white border border-slate-200 rounded-2xl shadow-2xl max-w-2xl w-full flex flex-col max-h-[85vh] overflow-hidden"
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-950 text-white shrink-0">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-yellow-300 animate-pulse" />
            <div className="flex flex-col">
              <span className="font-display font-extrabold text-sm tracking-tight text-white leading-none">
                Gerador de Prompts de IA para Devs
              </span>
              <span className="text-[10px] text-slate-400 mt-1 leading-none font-bold uppercase tracking-wider">
                Gerador Automático do BGrowth Studio
              </span>
            </div>
          </div>
          <button
            id="btn-close-prompt-modal"
            onClick={onClose}
            className="text-slate-400 hover:text-white transition text-xs font-semibold"
          >
            Fechar
          </button>
        </div>

        {/* Content body wrapper */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {screenComments.length === 0 ? (
            <div className="h-60 flex flex-col items-center justify-center text-slate-400 border border-dashed border-slate-200 rounded-xl p-6 text-center">
              <AlertCircle className="w-8 h-8 text-amber-500 mb-2" />
              <p className="text-sm font-bold text-slate-700">Nenhum problema ativo para analisar</p>
              <p className="text-xs text-slate-400 max-w-sm mt-1 leading-relaxed">
                Todas as anotações visuais estão resolvidas ou foram excluídas. Crie novas anotações na tela da imagem para gerar instruções de prompts.
              </p>
            </div>
          ) : (
            <>
              {/* Problem parsing summary */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">Escopo da Revisão</span>
                <div className="flex items-center justify-between text-xs font-bold text-slate-800 mt-1">
                  <span>{activeScreen.title} ({activeScreen.version})</span>
                  <span className="bg-red-50 text-red-600 border border-red-100 px-2 py-0.5 rounded-full font-mono text-[10px]">
                    {screenComments.length} problema{screenComments.length !== 1 ? 's' : ''} detectado{screenComments.length !== 1 ? 's' : ''}
                  </span>
                </div>
                {/* Micro issues bullet list */}
                <div className="mt-3.5 space-y-2.5 max-h-32 overflow-y-auto border-t border-slate-200/50 pt-2.5 text-[11px] text-slate-500">
                  {screenComments.map((c) => {
                    const categoryTranslation = c.category === 'Spacing' ? 'Espaçamento' : c.category === 'Typography' ? 'Tipografia' : c.category === 'Colors' ? 'Cores' : c.category === 'Buttons' ? 'Botões' : c.category === 'Other' ? 'Outro' : c.category;
                    return (
                      <div key={c.id} className="flex items-start space-x-2">
                        <CornerDownRight className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                        <div className="min-w-0">
                          <span className="font-bold text-slate-700">[{categoryTranslation}] </span>
                          <span className="font-semibold text-slate-600">{c.title}: </span>
                          <span className="text-slate-400">{c.description}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Loader */}
              <AnimatePresence mode="wait">
                {loading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center py-12 space-y-4"
                  >
                    <RefreshCw className="w-8 h-8 text-blue-600 animate-spin" />
                    <div className="text-center space-y-1">
                      <p className="text-xs font-bold text-slate-700">Sintetizando Prompt com o Gemini...</p>
                      <p className="text-[10px] text-slate-400 italic">"{loadingMessages[loadingMsgIndex]}"</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Render generated text output box */}
              {!loading && generatedPrompt && (
                <div className="space-y-3.5">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      Prompt Gerado (Markdown)
                    </span>
                    <button
                      id="btn-copy-prompt"
                      onClick={handleCopy}
                      className="flex items-center space-x-1 px-3 py-1 bg-[#1061EC] hover:bg-blue-600 text-white font-bold text-xs rounded-lg shadow-sm shadow-blue-500/15 transition relative"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>{copied ? 'Copiado!' : 'Copiar para a Área de Transferência'}</span>
                    </button>
                  </div>

                  <textarea
                    id="textarea-generated-prompt"
                    readOnly
                    value={generatedPrompt}
                    className="w-full h-80 bg-slate-900 border border-slate-800 text-slate-100 p-4 font-mono text-[11px] rounded-xl outline-none leading-relaxed focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        {screenComments.length > 0 && !loading && (
          <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-between items-center shrink-0">
            <span className="text-[10px] text-slate-400 max-w-xs leading-normal">
              Insira este prompt de instruções diretamente no Gemini ou modelos do Cursor para corrigir os layouts do seu projeto.
            </span>
            <button
              id="btn-regenerate-prompt"
              onClick={handleGeneratePrompt}
              className="flex items-center space-x-1 px-3.5 py-1.5 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-lg transition"
            >
              <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
              <span>Regerar</span>
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
};
