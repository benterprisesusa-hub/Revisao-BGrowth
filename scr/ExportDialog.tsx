import React, { useState } from 'react';
import { useReviewStore } from '../data/store';
import { ChecklistItem } from '../types';
import { Plus, Check, Trash2, Tag, Calendar, FileText } from 'lucide-react';

export const ChecklistPanel: React.FC = () => {
  const {
    screens,
    activeScreenId,
    toggleChecklistItem,
    addChecklistItem,
    deleteChecklistItem,
  } = useReviewStore();

  const [newTask, setNewTask] = useState('');
  const [newCategory, setNewCategory] = useState('UI');

  const activeScreen = screens.find((s) => s.id === activeScreenId);

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask || !activeScreen) return;
    addChecklistItem(activeScreen.id, newTask, newCategory);
    setNewTask('');
  };

  if (!activeScreen) return null;

  const total = activeScreen.checklist.length;
  const checked = activeScreen.checklist.filter((i) => i.checked).length;
  const percentage = total > 0 ? Math.round((checked / total) * 100) : 0;

  const categories = ['Header', 'Footer', 'Navigation', 'Buttons', 'Forms', 'Validation', 'Typography', 'Spacing', 'Responsive', 'Accessibility', 'Animations', 'Performance', 'UI', 'UX', 'General'];

  const categoryTranslations: { [key: string]: string } = {
    'Header': 'Cabeçalho',
    'Footer': 'Rodapé',
    'Navigation': 'Navegação',
    'Buttons': 'Botões',
    'Forms': 'Formulários',
    'Validation': 'Validação',
    'Typography': 'Tipografia',
    'Spacing': 'Espaçamento',
    'Responsive': 'Responsividade',
    'Accessibility': 'Acessibilidade',
    'Animations': 'Animações',
    'Performance': 'Performance',
    'UI': 'UI',
    'UX': 'UX',
    'General': 'Geral'
  };

  return (
    <div className="flex flex-col h-full bg-white select-none text-slate-800 font-sans p-4">
      {/* Dynamic Progress indicator */}
      <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 shrink-0 mb-4">
        <div className="flex justify-between items-center text-xs font-bold text-slate-600 mb-1.5">
          <span className="flex items-center space-x-1.5">
            <FileText className="w-4 h-4 text-[#1061EC]" />
            <span>Progresso de Verificação de QA</span>
          </span>
          <span className="text-[#1061EC] font-mono text-[11px] bg-blue-50 px-2 py-0.5 rounded">
            {checked}/{total} {total === 1 ? 'Tarefa Marcada' : 'Tarefas Marcadas'}
          </span>
        </div>
        <div className="w-full bg-slate-200/60 h-2.5 rounded-full overflow-hidden mt-2">
          <div 
            className="bg-[#1061EC] h-full rounded-full transition-all duration-500" 
            style={{ width: `${percentage}%` }}
          />
        </div>
        <p className="text-[10px] text-slate-400 mt-2">
          {percentage === 100 
            ? '🎉 Conformidade padrão da tela alcançada!' 
            : 'Os objetivos não marcados devem ser resolvidos antes da aprovação.'}
        </p>
      </div>

      {/* Checklist items list */}
      <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
        {activeScreen.checklist.length === 0 ? (
          <div className="h-44 flex flex-col items-center justify-center text-slate-400 border border-dashed border-slate-100 rounded-xl p-4">
            <FileText className="w-8 h-8 mb-1.5 text-slate-300" />
            <p className="text-xs font-bold">Nenhuma lista de conformidade adicionada</p>
            <p className="text-[10px] text-slate-400 mt-0.5">Use o formulário abaixo para anexar critérios de QA</p>
          </div>
        ) : (
          activeScreen.checklist.map((item) => (
            <div
              key={item.id}
              id={`checklist-item-${item.id}`}
              className={`flex items-center justify-between p-3 border rounded-xl hover:border-slate-300 transition ${
                item.checked 
                  ? 'bg-slate-50/70 border-slate-200' 
                  : 'bg-white border-slate-200'
              }`}
            >
              <div className="flex items-center space-x-3 flex-1 min-w-0">
                {/* checkbox button */}
                <button
                  id={`btn-toggle-check-${item.id}`}
                  onClick={() => toggleChecklistItem(activeScreen.id, item.id)}
                  className={`w-4 h-4 rounded border flex items-center justify-center transition shrink-0 ${
                    item.checked
                      ? 'bg-[#1061EC] border-[#1061EC] text-white'
                      : 'border-slate-300 hover:border-[#1061EC] bg-white'
                  }`}
                >
                  {item.checked && <Check className="w-3.5 h-3.5" />}
                </button>

                <div className="min-w-0">
                  <p className={`text-xs font-medium truncate ${
                    item.checked ? 'text-slate-400 line-through' : 'text-slate-800'
                  }`}>
                    {item.task}
                  </p>
                  <span className="text-[9px] font-bold text-[#1061EC] bg-blue-50 px-1.5 py-0.5 rounded mt-1 inline-block uppercase">
                    {categoryTranslations[item.category] || item.category}
                  </span>
                </div>
              </div>

              <button
                id={`btn-del-check-${item.id}`}
                onClick={() => deleteChecklistItem(activeScreen.id, item.id)}
                className="p-1 hover:text-red-500 hover:bg-red-50 rounded transition ml-2 shrink-0"
                title="Excluir tarefa"
              >
                <Trash2 className="w-3.5 h-3.5 text-slate-400 hover:text-red-500" />
              </button>
            </div>
          ))
        )}
      </div>

      {/* Quick Add Checklist item form */}
      <form onSubmit={handleAddItem} className="pt-4 border-t border-slate-100 shrink-0 space-y-2">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Anexar Objetivo ao Checklist de QA</span>
        <div className="flex space-x-2">
          <input
            id="input-checklist-task"
            type="text"
            placeholder="Objetivo (ex: Testar validação de formulários)"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            required
            className="flex-1 px-3 py-1.5 border border-slate-200 rounded-lg text-xs outline-none focus:border-purple-500 transition"
          />
          <select
            id="select-checklist-category"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-xs rounded-lg px-2 text-slate-600 font-semibold focus:outline-none"
          >
            {categories.map((c) => (
              <option key={c} value={c}>{categoryTranslations[c] || c}</option>
            ))}
          </select>
          <button
            id="btn-add-checklist"
            type="submit"
            className="p-2 bg-[#1061EC] hover:bg-blue-700 text-white rounded-lg transition"
            title="Adicionar tarefa"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};
