import React, { useState } from 'react';
import { useReviewStore } from '../data/store';
import { FolderPlus } from 'lucide-react';
import { motion } from 'motion/react';

interface NewProjectDialogProps {
  onClose: () => void;
}

export const NewProjectDialog: React.FC<NewProjectDialogProps> = ({ onClose }) => {
  const { addProject } = useReviewStore();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [version, setVersion] = useState('v1.0.0');
  const [module, setModule] = useState('CRM Console');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;
    addProject(name, description, version, module);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4 select-none font-sans">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white border border-slate-200 rounded-2xl shadow-2xl max-w-md w-full flex flex-col overflow-hidden"
      >
        <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-white shrink-0">
          <div className="flex items-center space-x-2">
            <FolderPlus className="w-5 h-5 text-blue-600" />
            <h3 className="font-display font-extrabold text-slate-900 tracking-tight text-sm">
              Criar Novo Projeto no Workspace
            </h3>
          </div>
          <button
            id="btn-close-new-project"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 transition text-xs font-semibold"
          >
            Cancelar
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div className="space-y-1.5">
            <label className="block text-slate-400 font-bold uppercase tracking-wider">Nome do Projeto</label>
            <input
              id="input-new-project-name"
              type="text"
              placeholder="Ex: Plataforma de Analytics BGrowth"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs outline-none focus:border-blue-500 transition"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-slate-400 font-bold uppercase tracking-wider">Versão Inicial</label>
              <input
                id="input-new-project-version"
                type="text"
                placeholder="Ex: v1.0.0"
                value={version}
                onChange={(e) => setVersion(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs outline-none focus:border-blue-500 transition"
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-slate-400 font-bold uppercase tracking-wider">Tipo de Módulo</label>
              <select
                id="select-new-project-module"
                value={module}
                onChange={(e) => setModule(e.target.value)}
                className="w-full bg-white px-3 py-2 border border-slate-200 rounded-lg text-xs outline-none focus:border-blue-500 transition"
              >
                <option value="SaaS Admin">Admin SaaS</option>
                <option value="Core Engine">Motor Principal</option>
                <option value="Mobile Application">Aplicativo Móvel</option>
                <option value="CRM Console">Console CRM</option>
                <option value="Consumer Portal">Portal do Consumidor</option>
                <option value="Marketing Suite">Suíte de Marketing</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-slate-400 font-bold uppercase tracking-wider">Descrição</label>
            <textarea
              id="textarea-new-project-desc"
              placeholder="Forneça uma visão geral do escopo, objetivos de UX ou métricas do produto..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full h-24 px-3 py-2 border border-slate-200 rounded-lg text-xs outline-none resize-none focus:border-blue-500 transition"
            />
          </div>

          <button
            id="btn-submit-new-project"
            type="submit"
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xs transition shadow-md shadow-blue-500/15"
          >
            Provisionar Workspace Ativo
          </button>
        </form>
      </motion.div>
    </div>
  );
};
