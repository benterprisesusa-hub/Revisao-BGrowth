import React, { createContext, useContext, useState, useEffect } from 'react';
import { Project, Screen, Comment, HistoryEntry, ChecklistItem, AnnotationTool, AnnotationShape, Reply, Attachment } from '../types';
import { DEFAULT_PROJECTS, DEFAULT_SCREENS, DEFAULT_COMMENTS, DEFAULT_HISTORY } from './defaultData';
import { db, OperationType, handleFirestoreError } from '../lib/firebase';
import { collection, doc, getDocs, setDoc, deleteDoc } from 'firebase/firestore';

export interface FilterState {
  category: string;
  status: string;
  priority: string;
  reviewer: string;
  version: string;
  date: string;
}

export interface ReviewContextType {
  // Core Data
  projects: Project[];
  screens: Screen[];
  comments: Comment[];
  history: HistoryEntry[];
  
  // Selection
  activeProjectId: string;
  activeScreenId: string;
  setActiveProjectId: (id: string) => void;
  setActiveScreenId: (id: string) => void;
  
  // UI Controls
  zoom: number;
  setZoom: React.Dispatch<React.SetStateAction<number>>;
  panX: number;
  setPanX: React.Dispatch<React.SetStateAction<number>>;
  panY: number;
  setPanY: React.Dispatch<React.SetStateAction<number>>;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  
  // Annotation Tools
  currentTool: AnnotationTool;
  setCurrentTool: (t: AnnotationTool) => void;
  currentColor: string;
  setCurrentColor: (c: string) => void;
  currentThickness: number;
  setCurrentThickness: (th: number) => void;
  
  // Version Comparison
  comparisonMode: 'single' | 'side-by-side' | 'overlay' | 'slider';
  setComparisonMode: (mode: 'single' | 'side-by-side' | 'overlay' | 'slider') => void;
  compareScreenIdA: string;
  compareScreenIdB: string;
  setCompareScreenIdA: (id: string) => void;
  setCompareScreenIdB: (id: string) => void;
  overlayOpacity: number;
  setOverlayOpacity: (op: number) => void;
  sliderPosition: number;
  setSliderPosition: (pos: number) => void;
  syncZoom: boolean;
  setSyncZoom: (sz: boolean) => void;

  // Actions
  addProject: (name: string, module: string, description: string, version: string) => Project;
  updateProjectStatus: (id: string, status: Project['status']) => void;
  addScreen: (title: string, description: string, version: string, screenshotData: string) => Screen;
  updateScreenStatus: (id: string, status: Screen['reviewStatus']) => void;
  deleteScreen: (id: string) => void;
  addComment: (title: string, description: string, category: string, priority: Comment['priority'], pinX: number, pinY: number, shapes: AnnotationShape[]) => Comment;
  updateCommentStatus: (id: string, status: Comment['status']) => void;
  resolveComment: (id: string) => void;
  reopenComment: (id: string) => void;
  addReply: (commentId: string, author: string, text: string) => void;
  addAttachment: (commentId: string, name: string, size: string, type: string, data: string) => void;
  toggleChecklistItem: (screenId: string, itemId: string) => void;
  addChecklistItem: (screenId: string, task: string, category: string) => void;
  deleteChecklistItem: (screenId: string, itemId: string) => void;
  clearAllData: () => void;
  isCloudSyncing: boolean;
}

const ReviewContext = createContext<ReviewContextType | undefined>(undefined);

export const useReviewStore = () => {
  const context = useContext(ReviewContext);
  if (!context) {
    throw new Error('useReviewStore must be used within a ReviewStoreProvider');
  }
  return context;
};

export const ReviewStoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load initial data from local storage or defaults
  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem('bg_projects');
    return saved ? JSON.parse(saved) : DEFAULT_PROJECTS;
  });

  const [screens, setScreens] = useState<Screen[]>(() => {
    const saved = localStorage.getItem('bg_screens');
    return saved ? JSON.parse(saved) : DEFAULT_SCREENS;
  });

  const [comments, setComments] = useState<Comment[]>(() => {
    const saved = localStorage.getItem('bg_comments');
    return saved ? JSON.parse(saved) : DEFAULT_COMMENTS;
  });

  const [history, setHistory] = useState<HistoryEntry[]>(() => {
    const saved = localStorage.getItem('bg_history');
    return saved ? JSON.parse(saved) : DEFAULT_HISTORY;
  });

  // Active Selections
  const [activeProjectId, setActiveProjectId] = useState<string>(() => {
    const saved = localStorage.getItem('bg_active_project_id');
    return saved || 'proj-1';
  });

  const [activeScreenId, setActiveScreenId] = useState<string>(() => {
    const saved = localStorage.getItem('bg_active_screen_id');
    return saved || 'scr-1';
  });

  const [isCloudSyncing, setIsCloudSyncing] = useState<boolean>(true);

  // Firestore Write Helpers
  const writeProjectToCloud = async (proj: Project) => {
    const path = `projects/${proj.id}`;
    try {
      await setDoc(doc(db, 'projects', proj.id), proj);
    } catch (e: any) {
      console.error("Firestore write project error:", e);
      handleFirestoreError(e, OperationType.WRITE, path);
    }
  };

  const writeScreenToCloud = async (scr: Screen) => {
    const path = `screens/${scr.id}`;
    try {
      await setDoc(doc(db, 'screens', scr.id), scr);
    } catch (e: any) {
      console.error("Firestore write screen error:", e);
      handleFirestoreError(e, OperationType.WRITE, path);
    }
  };

  const deleteScreenFromCloud = async (scrId: string) => {
    const path = `screens/${scrId}`;
    try {
      await deleteDoc(doc(db, 'screens', scrId));
    } catch (e: any) {
      console.error("Firestore delete screen error:", e);
      handleFirestoreError(e, OperationType.DELETE, path);
    }
  };

  const writeCommentToCloud = async (com: Comment) => {
    const path = `comments/${com.id}`;
    try {
      await setDoc(doc(db, 'comments', com.id), com);
    } catch (e: any) {
      console.error("Firestore write comment error:", e);
      handleFirestoreError(e, OperationType.WRITE, path);
    }
  };

  const deleteCommentFromCloud = async (comId: string) => {
    const path = `comments/${comId}`;
    try {
      await deleteDoc(doc(db, 'comments', comId));
    } catch (e: any) {
      console.error("Firestore delete comment error:", e);
      handleFirestoreError(e, OperationType.DELETE, path);
    }
  };

  const writeHistoryToCloud = async (entry: HistoryEntry) => {
    const path = `history/${entry.id}`;
    try {
      await setDoc(doc(db, 'history', entry.id), entry);
    } catch (e: any) {
      console.error("Firestore write history error:", e);
      handleFirestoreError(e, OperationType.WRITE, path);
    }
  };

  // Load from Firestore on Mount
  useEffect(() => {
    const loadFromFirestore = async () => {
      try {
        setIsCloudSyncing(true);
        
        // Fetch projects
        let cloudProjects: Project[] = [];
        try {
          const projSnap = await getDocs(collection(db, 'projects'));
          projSnap.forEach((docSnap) => {
            cloudProjects.push(docSnap.data() as Project);
          });
        } catch (e: any) {
          handleFirestoreError(e, OperationType.GET, 'projects');
        }

        // Fetch screens
        let cloudScreens: Screen[] = [];
        try {
          const scrSnap = await getDocs(collection(db, 'screens'));
          scrSnap.forEach((docSnap) => {
            cloudScreens.push(docSnap.data() as Screen);
          });
        } catch (e: any) {
          handleFirestoreError(e, OperationType.GET, 'screens');
        }

        // Fetch comments
        let cloudComments: Comment[] = [];
        try {
          const comSnap = await getDocs(collection(db, 'comments'));
          comSnap.forEach((docSnap) => {
            cloudComments.push(docSnap.data() as Comment);
          });
        } catch (e: any) {
          handleFirestoreError(e, OperationType.GET, 'comments');
        }

        // Fetch history
        let cloudHistory: HistoryEntry[] = [];
        try {
          const histSnap = await getDocs(collection(db, 'history'));
          histSnap.forEach((docSnap) => {
            cloudHistory.push(docSnap.data() as HistoryEntry);
          });
        } catch (e: any) {
          handleFirestoreError(e, OperationType.GET, 'history');
        }

        // Seed with defaults if empty
        if (cloudProjects.length === 0) {
          console.log("Seeding Firestore with default templates...");
          for (const proj of DEFAULT_PROJECTS) {
            try {
              await setDoc(doc(db, 'projects', proj.id), proj);
            } catch (e: any) {
              handleFirestoreError(e, OperationType.WRITE, `projects/${proj.id}`);
            }
          }
          for (const scr of DEFAULT_SCREENS) {
            try {
              await setDoc(doc(db, 'screens', scr.id), scr);
            } catch (e: any) {
              handleFirestoreError(e, OperationType.WRITE, `screens/${scr.id}`);
            }
          }
          for (const com of DEFAULT_COMMENTS) {
            try {
              await setDoc(doc(db, 'comments', com.id), com);
            } catch (e: any) {
              handleFirestoreError(e, OperationType.WRITE, `comments/${com.id}`);
            }
          }
          for (const hist of DEFAULT_HISTORY) {
            try {
              await setDoc(doc(db, 'history', hist.id), hist);
            } catch (e: any) {
              console.warn(`History seed for ${hist.id} skipped (history collection is append-only):`, e);
            }
          }
          setProjects(DEFAULT_PROJECTS);
          setScreens(DEFAULT_SCREENS);
          setComments(DEFAULT_COMMENTS);
          setHistory(DEFAULT_HISTORY);
        } else {
          // Sort history by timestamp desc
          cloudHistory.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
          
          setProjects(cloudProjects);
          setScreens(cloudScreens);
          setComments(cloudComments);
          setHistory(cloudHistory);
        }
      } catch (err: any) {
        console.error("Error loading Firestore collections:", err);
      } finally {
        setIsCloudSyncing(false);
      }
    };

    loadFromFirestore();
  }, []);

  // UI State Controls
  const [zoom, setZoom] = useState<number>(1);
  const [panX, setPanX] = useState<number>(0);
  const [panY, setPanY] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filters, setFilters] = useState<FilterState>({
    category: 'all',
    status: 'all',
    priority: 'all',
    reviewer: 'all',
    version: 'all',
    date: 'all',
  });

  // Tool Controls
  const [currentTool, setCurrentTool] = useState<AnnotationTool>('marker');
  const [currentColor, setCurrentColor] = useState<string>('#EF4444'); // Red marker default
  const [currentThickness, setCurrentThickness] = useState<number>(3);

  // Version Comparison Controls
  const [comparisonMode, setComparisonMode] = useState<'single' | 'side-by-side' | 'overlay' | 'slider'>('single');
  const [compareScreenIdA, setCompareScreenIdA] = useState<string>('');
  const [compareScreenIdB, setCompareScreenIdB] = useState<string>('');
  const [overlayOpacity, setOverlayOpacity] = useState<number>(50);
  const [sliderPosition, setSliderPosition] = useState<number>(50);
  const [syncZoom, setSyncZoom] = useState<boolean>(true);

  // Sync to Local Storage on updates
  useEffect(() => {
    localStorage.setItem('bg_projects', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem('bg_screens', JSON.stringify(screens));
  }, [screens]);

  useEffect(() => {
    localStorage.setItem('bg_comments', JSON.stringify(comments));
  }, [comments]);

  useEffect(() => {
    localStorage.setItem('bg_history', JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    localStorage.setItem('bg_active_project_id', activeProjectId);
  }, [activeProjectId]);

  useEffect(() => {
    localStorage.setItem('bg_active_screen_id', activeScreenId);
  }, [activeScreenId]);

  // Actions
  const addHistory = (action: string, details: string, screenId?: string) => {
    const entry: HistoryEntry = {
      id: `hist-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      projectId: activeProjectId,
      screenId: screenId || activeScreenId,
      action,
      details,
      timestamp: new Date().toISOString(),
    };
    setHistory((prev) => [entry, ...prev]);
    writeHistoryToCloud(entry);
  };

  const addProject = (name: string, module: string, description: string, version: string) => {
    const id = `proj-${Date.now()}`;
    const newProj: Project = {
      id,
      name,
      module,
      description,
      version: version || 'v1.0.0',
      createdDate: new Date().toISOString(),
      updatedDate: new Date().toISOString(),
      status: 'Draft',
    };
    setProjects((prev) => [...prev, newProj]);
    setActiveProjectId(id);
    writeProjectToCloud(newProj);
    
    // Add default screen automatically
    const defaultScreenId = `scr-${Date.now()}`;
    const newScr: Screen = {
      id: defaultScreenId,
      projectId: id,
      title: 'Layout de Interface em Branco',
      description: 'Configuração de tela padrão. Arraste ou cole o mockup da sua interface aqui.',
      version: version || 'v1.0.0',
      screenshot: 'dashboard', // default template
      reviewStatus: 'Open',
      checklist: [
        { id: `ch-${Date.now()}-1`, task: 'Revisar o layout da interface e estruturas de grade responsivas', checked: false, category: 'Layout' },
        { id: `ch-${Date.now()}-2`, task: 'Verificar se os principais botões de ação têm estados configurados', checked: false, category: 'Buttons' },
        { id: `ch-${Date.now()}-3`, task: 'Check font sizes and typography scale values', checked: false, category: 'Typography' },
      ],
    };
    setScreens((prev) => [...prev, newScr]);
    setActiveScreenId(defaultScreenId);
    writeScreenToCloud(newScr);

    // Save history
    const logDetails = `O projeto "${name}" foi criado. A configuração de tela padrão foi inicializada com sucesso.`;
    const entry: HistoryEntry = {
      id: `hist-${Date.now()}`,
      projectId: id,
      screenId: defaultScreenId,
      action: 'Configuração do projeto concluída',
      details: logDetails,
      timestamp: new Date().toISOString(),
    };
    setHistory((prev) => [entry, ...prev]);
    writeHistoryToCloud(entry);

    return newProj;
  };

  const updateProjectStatus = (id: string, status: Project['status']) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const updated = { ...p, status, updatedDate: new Date().toISOString() };
          addHistory('Projeto atualizado', `O status do projeto "${p.name}" foi atualizado para: ${status}`);
          writeProjectToCloud(updated);
          return updated;
        }
        return p;
      })
    );
  };

  const addScreen = (title: string, description: string, version: string, screenshotData: string) => {
    const id = `scr-${Date.now()}`;
    const newScr: Screen = {
      id,
      projectId: activeProjectId,
      title,
      description,
      version: version || 'v1.0.0',
      screenshot: screenshotData || 'login',
      reviewStatus: 'Open',
      checklist: [
        { id: `ch-${Date.now()}-1`, task: 'Validar escalas dos elementos do cabeçalho/rodapé', checked: false, category: 'Header' },
        { id: `ch-${Date.now()}-2`, task: 'Verificar padrões de espaçamento (padding e margin) dos botões', checked: false, category: 'Spacing' },
        { id: `ch-${Date.now()}-3`, task: 'Verificar hierarquias de tamanho tipográfico', checked: false, category: 'Typography' },
      ],
    };
    setScreens((prev) => [...prev, newScr]);
    setActiveScreenId(id);
    writeScreenToCloud(newScr);
    addHistory('Imagem enviada', `Nova tela "${title}" versão ${version} enviada com sucesso.`, id);
    return newScr;
  };

  const updateScreenStatus = (id: string, status: Screen['reviewStatus']) => {
    setScreens((prev) =>
      prev.map((s) => {
        if (s.id === id) {
          const updated = { ...s, reviewStatus: status };
          addHistory('Revisão atualizada', `O status de revisão da tela "${s.title}" mudou para: ${status}`, id);
          writeScreenToCloud(updated);
          return updated;
        }
        return s;
      })
    );
  };

  const deleteScreen = (id: string) => {
    const s = screens.find((scr) => scr.id === id);
    if (!s) return;
    setScreens((prev) => prev.filter((scr) => scr.id !== id));
    deleteScreenFromCloud(id);
    
    comments.filter((c) => c.screenId === id).forEach((c) => {
      deleteCommentFromCloud(c.id);
    });
    setComments((prev) => prev.filter((c) => c.screenId !== id));
    
    addHistory('Tela excluída', `A tela "${s.title}" foi removida do workspace.`);
    
    // Auto shift active screen
    const remaining = screens.filter((scr) => scr.id !== id && scr.projectId === activeProjectId);
    if (remaining.length > 0) {
      setActiveScreenId(remaining[0].id);
    }
  };

  const addComment = (
    title: string,
    description: string,
    category: string,
    priority: Comment['priority'],
    pinX: number,
    pinY: number,
    shapes: AnnotationShape[]
  ) => {
    // Get next pin number
    const screenComments = comments.filter((c) => c.screenId === activeScreenId);
    const pinNumber = screenComments.length + 1;

    const id = `com-${Date.now()}`;
    const newComment: Comment = {
      id,
      screenId: activeScreenId,
      title,
      description,
      category,
      priority,
      status: 'Open',
      created: new Date().toISOString(),
      updated: new Date().toISOString(),
      assignedTo: 'Alex Mercer (Lead Coder)',
      resolved: false,
      pinNumber,
      pinX,
      pinY,
      shapes,
      replies: [],
      attachments: [],
    };

    setComments((prev) => [...prev, newComment]);
    writeCommentToCloud(newComment);
    addHistory('Comentário criado', `Comentário do Pin #${pinNumber} adicionado: "${title}" [Categoria: ${category}]`, activeScreenId);
    return newComment;
  };

  const updateCommentStatus = (id: string, status: Comment['status']) => {
    setComments((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          const updated = { ...c, status, updated: new Date().toISOString() };
          addHistory('Comentário atualizado', `O status do comentário do Pin #${c.pinNumber} foi atualizado para: ${status}`, c.screenId);
          writeCommentToCloud(updated);
          return updated;
        }
        return c;
      })
    );
  };

  const resolveComment = (id: string) => {
    setComments((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          const updated: Comment = { ...c, resolved: true, status: 'Completed', updated: new Date().toISOString() };
          addHistory('Comentário resolvido', `O comentário do Pin #${c.pinNumber} foi marcado como resolvido.`, c.screenId);
          writeCommentToCloud(updated);
          return updated;
        }
        return c;
      })
    );
  };

  const reopenComment = (id: string) => {
    setComments((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          const updated: Comment = { ...c, resolved: false, status: 'Open', updated: new Date().toISOString() };
          addHistory('Comentário reaberto', `O comentário do Pin #${c.pinNumber} foi reaberto.`, c.screenId);
          writeCommentToCloud(updated);
          return updated;
        }
        return c;
      })
    );
  };

  const addReply = (commentId: string, author: string, text: string) => {
    const id = `rep-${Date.now()}`;
    const newReply: Reply = {
      id,
      author,
      text,
      timestamp: new Date().toISOString(),
    };

    setComments((prev) =>
      prev.map((c) => {
        if (c.id === commentId) {
          const updated = { ...c, replies: [...c.replies, newReply], updated: new Date().toISOString() };
          addHistory('Resposta adicionada', `Usuário respondeu ao Pin #${c.pinNumber}: "${text.substring(0, 30)}..."`, c.screenId);
          writeCommentToCloud(updated);
          return updated;
        }
        return c;
      })
    );
  };

  const addAttachment = (commentId: string, name: string, size: string, type: string, data: string) => {
    const id = `att-${Date.now()}`;
    const newAtt: Attachment = {
      id,
      name,
      size,
      type,
      data,
    };

    setComments((prev) =>
      prev.map((c) => {
        if (c.id === commentId) {
          const updated = { ...c, attachments: [...c.attachments, newAtt], updated: new Date().toISOString() };
          addHistory('Anexo enviado', `Arquivo "${name}" anexado ao Pin #${c.pinNumber}`, c.screenId);
          writeCommentToCloud(updated);
          return updated;
        }
        return c;
      })
    );
  };

  const toggleChecklistItem = (screenId: string, itemId: string) => {
    setScreens((prev) =>
      prev.map((s) => {
        if (s.id === screenId) {
          const updatedChecklist = s.checklist.map((item) => {
            if (item.id === itemId) {
              const newCheckState = !item.checked;
              addHistory('Checklist atualizado', `${newCheckState ? 'Marcada' : 'Desmarcada'} a tarefa do checklist: "${item.task}"`, screenId);
              return { ...item, checked: newCheckState };
            }
            return item;
          });
          const updated = { ...s, checklist: updatedChecklist };
          writeScreenToCloud(updated);
          return updated;
        }
        return s;
      })
    );
  };

  const addChecklistItem = (screenId: string, task: string, category: string) => {
    const newItem: ChecklistItem = {
      id: `ch-${Date.now()}`,
      task,
      checked: false,
      category: category || 'General',
    };

    setScreens((prev) =>
      prev.map((s) => {
        if (s.id === screenId) {
          addHistory('Checklist atualizado', `Tarefa adicionada ao checklist: "${task}"`, screenId);
          const updated = { ...s, checklist: [...s.checklist, newItem] };
          writeScreenToCloud(updated);
          return updated;
        }
        return s;
      })
    );
  };

  const deleteChecklistItem = (screenId: string, itemId: string) => {
    setScreens((prev) =>
      prev.map((s) => {
        if (s.id === screenId) {
          const taskObj = s.checklist.find((i) => i.id === itemId);
          addHistory('Checklist atualizado', `Tarefa excluída do checklist: "${taskObj?.task}"`, screenId);
          const updated = { ...s, checklist: s.checklist.filter((i) => i.id !== itemId) };
          writeScreenToCloud(updated);
          return updated;
        }
        return s;
      })
    );
  };

  const clearAllData = async () => {
    localStorage.removeItem('bg_projects');
    localStorage.removeItem('bg_screens');
    localStorage.removeItem('bg_comments');
    localStorage.removeItem('bg_history');
    localStorage.removeItem('bg_active_project_id');
    localStorage.removeItem('bg_active_screen_id');
    
    setIsCloudSyncing(true);
    try {
      const projSnap = await getDocs(collection(db, 'projects'));
      for (const d of projSnap.docs) {
        await deleteDoc(doc(db, 'projects', d.id));
      }
      const scrSnap = await getDocs(collection(db, 'screens'));
      for (const d of scrSnap.docs) {
        await deleteDoc(doc(db, 'screens', d.id));
      }
      const comSnap = await getDocs(collection(db, 'comments'));
      for (const d of comSnap.docs) {
        await deleteDoc(doc(db, 'comments', d.id));
      }
      const histSnap = await getDocs(collection(db, 'history'));
      for (const d of histSnap.docs) {
        try {
          await deleteDoc(doc(db, 'history', d.id));
        } catch (e: any) {
          console.warn(`Skipped deleting history entry ${d.id} (history collection is append-only)`);
        }
      }

      for (const proj of DEFAULT_PROJECTS) {
        await setDoc(doc(db, 'projects', proj.id), proj);
      }
      for (const scr of DEFAULT_SCREENS) {
        await setDoc(doc(db, 'screens', scr.id), scr);
      }
      for (const com of DEFAULT_COMMENTS) {
        await setDoc(doc(db, 'comments', com.id), com);
      }
      for (const hist of DEFAULT_HISTORY) {
        try {
          await setDoc(doc(db, 'history', hist.id), hist);
        } catch (e: any) {
          console.warn(`Skipped seeding history entry ${hist.id} (might already exist)`);
        }
      }
    } catch (e) {
      console.error("Error resetting Firestore:", e);
    } finally {
      setIsCloudSyncing(false);
    }

    setProjects(DEFAULT_PROJECTS);
    setScreens(DEFAULT_SCREENS);
    setComments(DEFAULT_COMMENTS);
    setHistory(DEFAULT_HISTORY);
    setActiveProjectId('proj-1');
    setActiveScreenId('scr-1');
    setZoom(1);
    setPanX(0);
    setPanY(0);
  };

  return (
    <ReviewContext.Provider
      value={{
        projects,
        screens,
        comments,
        history,
        activeProjectId,
        activeScreenId,
        setActiveProjectId,
        setActiveScreenId,
        zoom,
        setZoom,
        panX,
        setPanX,
        panY,
        setPanY,
        searchQuery,
        setSearchQuery,
        filters,
        setFilters,
        currentTool,
        setCurrentTool,
        currentColor,
        setCurrentColor,
        currentThickness,
        setCurrentThickness,
        
        comparisonMode,
        setComparisonMode,
        compareScreenIdA,
        compareScreenIdB,
        setCompareScreenIdA,
        setCompareScreenIdB,
        overlayOpacity,
        setOverlayOpacity,
        sliderPosition,
        setSliderPosition,
        syncZoom,
        setSyncZoom,

        addProject,
        updateProjectStatus,
        addScreen,
        updateScreenStatus,
        deleteScreen,
        addComment,
        updateCommentStatus,
        resolveComment,
        reopenComment,
        addReply,
        addAttachment,
        toggleChecklistItem,
        addChecklistItem,
        deleteChecklistItem,
        clearAllData,
        isCloudSyncing,
      }}
    >
      {children}
    </ReviewContext.Provider>
  );
};
