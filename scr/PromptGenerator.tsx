import React, { useState } from 'react';
import { useReviewStore, FilterState } from '../data/store';
import { Comment, Reply, Attachment } from '../types';
import { 
  MessageSquare, User, Calendar, Paperclip, Send, Check, 
  Plus, Search, Shield, ChevronDown, CheckCircle2, Circle, AlertCircle, Trash2 
} from 'lucide-react';

interface CommentPanelProps {
  onFocusPin: (commentId: string) => void;
  focusedCommentId: string | null;
  newPinData: { x: number; y: number; shapes: any[] } | null;
  onClearNewPin: () => void;
}

export const CommentPanel: React.FC<CommentPanelProps> = ({
  onFocusPin,
  focusedCommentId,
  newPinData,
  onClearNewPin,
}) => {
  const {
    screens,
    comments,
    activeScreenId,
    addComment,
    updateCommentStatus,
    resolveComment,
    reopenComment,
    addReply,
    addAttachment,
  } = useReviewStore();

  const activeScreen = screens.find((s) => s.id === activeScreenId);

  // New Comment Form state
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('UI');
  const [priority, setPriority] = useState<Comment['priority']>('Medium');

  // Search/Filters inside Comments tab
  const [commentSearch, setCommentSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  // Thread reply state
  const [replyText, setReplyText] = useState<{ [key: string]: string }>({});

  const screenComments = comments.filter((c) => c.screenId === activeScreenId);

  // Trigger form when parent sends a new click coordinate pin
  React.useEffect(() => {
    if (newPinData) {
      setShowForm(true);
      setTitle('');
      setDescription('');
    }
  }, [newPinData]);

  // Filtering Comments logic
  const filteredComments = screenComments.filter((c) => {
    const matchesSearch = 
      c.title.toLowerCase().includes(commentSearch.toLowerCase()) ||
      c.description.toLowerCase().includes(commentSearch.toLowerCase());
    
    const matchesCategory = filterCategory === 'all' || c.category === filterCategory;
    const matchesPriority = filterPriority === 'all' || c.priority === filterPriority;
    
    let matchesStatus = true;
    if (filterStatus === 'all') matchesStatus = true;
    else if (filterStatus === 'resolved') matchesStatus = c.resolved;
    else if (filterStatus === 'open') matchesStatus = !c.resolved && c.status === 'Open';
    else if (filterStatus === 'in-progress') matchesStatus = !c.resolved && c.status === 'In Progress';

    return matchesSearch && matchesCategory && matchesPriority && matchesStatus;
  });

  const categories = [
    'UI', 'UX', 'Layout', 'Spacing', 'Typography', 'Colors', 'Buttons', 'Cards',
    'Forms', 'Inputs', 'Icons', 'Accessibility', 'Performance', 'Responsive',
    'Navigation', 'Functionality', 'Bug', 'Improvement', 'Feature Request',
    'Content', 'Animation', 'Other'
  ];

  const handleCreateComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    const pinX = newPinData ? newPinData.x : 50;
    const pinY = newPinData ? newPinData.y : 50;
    const shapes = newPinData ? newPinData.shapes : [];

    addComment(title, description, category, priority, pinX, pinY, shapes);
    
    // reset
    setShowForm(false);
    setTitle('');
    setDescription('');
    onClearNewPin();
  };

  const handleAddReply = (commentId: string) => {
    const txt = replyText[commentId];
    if (!txt) return;
    addReply(commentId, 'BGrowth Auditor', txt);
    setReplyText((prev) => ({ ...prev, [commentId]: '' }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, commentId: string) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          addAttachment(
            commentId,
            file.name,
            `${Math.round(file.size / 1024)} KB`,
            file.type,
            event.target.result as string
          );
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white select-none text-slate-800 font-sans">
      {/* Review Panel Title Header */}
      <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50 shrink-0">
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Painel de Revisão</span>
        <div className="flex gap-2">
          <span className="text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-bold">
            {screenComments.filter((c) => !c.resolved).length} ABERTOS
          </span>
        </div>
      </div>

      {/* Search & Filter header */}
      <div className="p-4 border-b border-slate-100 shrink-0 space-y-3">
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            id="input-comment-search"
            type="text"
            placeholder="Buscar pins ou observações..."
            value={commentSearch}
            onChange={(e) => setCommentSearch(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 focus:border-blue-500 rounded-lg pl-8.5 pr-3 py-1.5 text-xs outline-none transition"
          />
        </div>

        {/* Categories, Priority filter tags */}
        <div className="grid grid-cols-3 gap-2 text-[10px]">
          <div>
            <label className="block text-slate-400 font-bold uppercase tracking-wider mb-1">Categoria</label>
            <select
              id="select-filter-category"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded px-1.5 py-1 font-semibold text-slate-600 outline-none"
            >
              <option value="all">Todas</option>
              <option value="UI">UI</option>
              <option value="UX">UX</option>
              <option value="Bug">Bug</option>
              <option value="Layout">Layout</option>
              <option value="Spacing">Espaçamento</option>
              <option value="Typography">Tipografia</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-400 font-bold uppercase tracking-wider mb-1">Prioridade</label>
            <select
              id="select-filter-priority"
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded px-1.5 py-1 font-semibold text-slate-600 outline-none"
            >
              <option value="all">Todas</option>
              <option value="Critical">Crítica</option>
              <option value="High">Alta</option>
              <option value="Medium">Média</option>
              <option value="Low">Baixa</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-400 font-bold uppercase tracking-wider mb-1">Status</label>
            <select
              id="select-filter-status"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded px-1.5 py-1 font-semibold text-slate-600 outline-none"
            >
              <option value="all">Todos</option>
              <option value="open">Abertos</option>
              <option value="in-progress">Em Progresso</option>
              <option value="resolved">Resolvidos</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main threaded list of comments scroll wrapper */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Dynamic New Comment Creation Card */}
        {showForm && (
          <form
            onSubmit={handleCreateComment}
            className="bg-slate-50 border border-blue-200 rounded-xl p-4 space-y-3 shadow-md shadow-blue-500/5"
          >
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider flex items-center space-x-1">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
                <span>Inserindo Marcador Pin #{screenComments.length + 1}</span>
              </span>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  onClearNewPin();
                }}
                className="text-xs text-slate-400 hover:text-slate-600 font-bold"
              >
                Cancelar
              </button>
            </div>

            <div className="space-y-2">
              <input
                id="input-comment-title"
                type="text"
                placeholder="Título do Problema (ex: Espaçamento incorreto do cabeçalho)"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs outline-none focus:border-blue-500 transition"
              />
              <textarea
                id="textarea-comment-desc"
                placeholder="Descreva o problema, as especificações aprovadas ou diretrizes de regressão..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs h-20 outline-none resize-none focus:border-blue-500 transition"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-slate-400 text-[9px] font-bold uppercase tracking-wider mb-1">
                  Categoria
                </label>
                <select
                  id="select-comment-category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1 select-none font-medium text-slate-700 focus:outline-none"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>{c === 'Spacing' ? 'Espaçamento' : c === 'Typography' ? 'Tipografia' : c === 'Colors' ? 'Cores' : c === 'Buttons' ? 'Botões' : c === 'Other' ? 'Outro' : c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-400 text-[9px] font-bold uppercase tracking-wider mb-1">
                  Prioridade
                </label>
                <select
                  id="select-comment-priority"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as Comment['priority'])}
                  className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1 select-none font-medium text-slate-700 focus:outline-none"
                >
                  <option value="Critical">🔴 Crítica</option>
                  <option value="High">🟠 Alta</option>
                  <option value="Medium">🟡 Média</option>
                  <option value="Low">🟢 Baixa</option>
                </select>
              </div>
            </div>

            <button
              id="btn-comment-submit"
              type="submit"
              className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xs transition shadow shadow-blue-500/15"
            >
              Fixar e Salvar Pin de Observação
            </button>
          </form>
        )}

        {/* Comments Cards */}
        {filteredComments.length === 0 ? (
          <div className="h-60 flex flex-col items-center justify-center text-slate-400 text-center p-6 border border-dashed border-slate-100 rounded-xl">
            <MessageSquare className="w-8 h-8 mb-2 text-slate-300" />
            <p className="text-xs font-semibold">Nenhuma observação ou anotação corresponde a esses filtros</p>
            <p className="text-[10px] text-slate-400 mt-1">Clique em qualquer lugar da imagem do protótipo para adicionar um Pin!</p>
          </div>
        ) : (
          filteredComments.map((comment) => {
            const isFocused = comment.id === focusedCommentId;
            return (
              <div
                key={comment.id}
                id={`comment-card-${comment.id}`}
                onClick={() => onFocusPin(comment.id)}
                className={`border rounded-xl transition-all duration-200 p-4 space-y-3 cursor-pointer ${
                  isFocused 
                    ? 'border-blue-400 bg-blue-50/10 shadow-lg shadow-blue-500/5 ring-1 ring-blue-400' 
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                {/* Card Header: pin circle, status badges */}
                <div className="flex justify-between items-start">
                  <div className="flex items-start space-x-2.5 min-w-0">
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 ${
                      comment.resolved ? 'bg-slate-400 text-white' : 'bg-[#1061EC] text-white'
                    }`}>
                      {comment.pinNumber}
                    </span>
                    <div className="min-w-0">
                      <h4 className={`text-xs font-bold leading-normal truncate ${
                        comment.resolved ? 'text-slate-400 line-through' : 'text-slate-900'
                      }`}>
                        {comment.title}
                      </h4>
                      {/* date / author info */}
                      <span className="text-[9px] text-slate-400 flex items-center space-x-1 mt-0.5 font-medium">
                        <Calendar className="w-2.5 h-2.5" />
                        <span>{new Date(comment.created).toLocaleDateString()}</span>
                      </span>
                    </div>
                  </div>

                  {/* Badges */}
                  <div className="flex flex-col items-end space-y-1 shrink-0 ml-2">
                    <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase ${
                      comment.priority === 'Critical' ? 'bg-red-100 text-red-600' :
                      comment.priority === 'High' ? 'bg-orange-100 text-orange-600' :
                      comment.priority === 'Medium' ? 'bg-blue-100 text-blue-600' :
                      'bg-slate-100 text-slate-500'
                    }`}>
                      {comment.priority === 'Critical' ? 'Crítica' :
                       comment.priority === 'High' ? 'Alta' :
                       comment.priority === 'Medium' ? 'Média' : 'Baixa'}
                    </span>
                    <span className="bg-slate-100 text-slate-500 text-[9px] font-bold px-1.5 rounded-full">
                      {comment.category === 'Spacing' ? 'Espaçamento' : comment.category === 'Typography' ? 'Tipografia' : comment.category === 'Colors' ? 'Cores' : comment.category === 'Buttons' ? 'Botões' : comment.category === 'Other' ? 'Outro' : comment.category}
                    </span>
                  </div>
                </div>

                {/* Description Body */}
                <p className={`text-[11px] leading-relaxed ${comment.resolved ? 'text-slate-400 line-through' : 'text-slate-600'}`}>
                  {comment.description}
                </p>

                {/* Status selector & Assignee row */}
                <div className="flex justify-between items-center pt-2.5 border-t border-slate-50 text-[10px] shrink-0">
                  <div className="flex items-center space-x-1.5 text-slate-400 font-semibold">
                    <User className="w-3.5 h-3.5" />
                    <span className="truncate max-w-[120px]">{comment.assignedTo === 'BGrowth Auditor' ? 'Auditor BGrowth' : comment.assignedTo}</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    {/* Status Changer */}
                    <select
                      id={`select-status-${comment.id}`}
                      value={comment.status}
                      onChange={(e) => updateCommentStatus(comment.id, e.target.value as Comment['status'])}
                      disabled={comment.resolved}
                      onClick={(e) => e.stopPropagation()}
                      className="bg-slate-50 border border-slate-200 rounded px-1 py-0.5 text-[9px] font-bold text-slate-600 outline-none disabled:opacity-50"
                    >
                      <option value="Open">Aberto</option>
                      <option value="In Progress">Em Progresso</option>
                      <option value="Waiting">Aguardando</option>
                      <option value="Completed">Concluído</option>
                      <option value="Ignored">Ignorado</option>
                    </select>

                    {/* Resolve toggle */}
                    <button
                      id={`btn-resolve-${comment.id}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (comment.resolved) reopenComment(comment.id);
                        else resolveComment(comment.id);
                      }}
                      className={`h-5 px-2 rounded font-bold text-[9px] transition ${
                        comment.resolved
                          ? 'bg-slate-100 hover:bg-slate-200 text-slate-500'
                          : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700'
                      }`}
                    >
                      {comment.resolved ? 'Reabrir' : 'Resolver'}
                    </button>
                  </div>
                </div>

                {/* Attachments Section */}
                {comment.attachments.length > 0 && (
                  <div className="bg-slate-50/70 p-2 rounded-lg space-y-1.5 text-[10px] border border-slate-100">
                    <div className="font-bold text-slate-400 uppercase tracking-wider text-[8px] mb-0.5">Anexos</div>
                    {comment.attachments.map((att) => (
                      <div key={att.id} className="flex justify-between items-center text-slate-600">
                        <span className="truncate max-w-[180px] font-medium flex items-center space-x-1 text-blue-600 hover:underline">
                          <Paperclip className="w-3 h-3 text-slate-400 shrink-0" />
                          <span>{att.name}</span>
                        </span>
                        <span className="text-slate-400 font-mono text-[9px]">{att.size}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Sub-Replies Thread Section */}
                <div className="bg-slate-50/40 p-3 rounded-xl space-y-3 border border-slate-100">
                  {comment.replies.length > 0 && (
                    <div className="space-y-2.5">
                      {comment.replies.map((rep) => (
                        <div key={rep.id} className="text-[10px] space-y-0.5">
                          <div className="flex justify-between text-[9px] text-slate-400">
                            <span className="font-bold text-slate-700">{rep.author === 'BGrowth Auditor' ? 'Auditor BGrowth' : rep.author}</span>
                            <span>{new Date(rep.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                          <p className="text-slate-600 leading-normal">{rep.text}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Inline Form to add reply */}
                  <div className="flex items-center space-x-1.5 mt-2">
                    <input
                      id={`input-reply-${comment.id}`}
                      type="text"
                      placeholder="Digite uma resposta para a equipe..."
                      value={replyText[comment.id] || ''}
                      onChange={(e) => setReplyText((prev) => ({ ...prev, [comment.id]: e.target.value }))}
                      onClick={(e) => e.stopPropagation()}
                      className="flex-1 bg-white border border-slate-200/80 rounded-lg px-2.5 py-1 text-[10px] outline-none focus:border-blue-500"
                    />
                    <button
                      id={`btn-reply-send-${comment.id}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddReply(comment.id);
                      }}
                      className="p-1 hover:bg-blue-50 hover:text-blue-600 rounded-lg text-slate-400 transition"
                      title="Enviar Resposta"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>
                    {/* Attachment file selector */}
                    <label className="p-1 hover:bg-slate-100 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer transition">
                      <Paperclip className="w-3.5 h-3.5" />
                      <input
                        type="file"
                        className="hidden"
                        onChange={(e) => handleFileUpload(e, comment.id)}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </label>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
