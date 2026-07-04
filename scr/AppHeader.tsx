import { Project, Screen, Comment, HistoryEntry, ChecklistItem } from '../types';

export const DEFAULT_PROJECTS: Project[] = [
  {
    id: 'proj-1',
    name: 'Suíte de Admin BGrowth',
    module: 'Console de Analytics',
    description: 'Painel corporativo que rastreia métricas de crescimento SaaS, contagem de testes ativos, taxas de conversão e faturas de clientes.',
    version: 'v2.1.0',
    createdDate: '2026-06-28T09:00:00Z',
    updatedDate: '2026-07-03T11:00:00Z',
    status: 'In Progress',
  },
  {
    id: 'proj-2',
    name: 'Portal de Crescimento do Consumidor',
    module: 'Autenticação e Integração',
    description: 'Portal de login voltado ao cliente com login único corporativo (SSO), formulários de inscrição e questionário de integração.',
    version: 'v1.4.2',
    createdDate: '2026-06-30T14:30:00Z',
    updatedDate: '2026-07-02T16:45:00Z',
    status: 'Reviewed',
  },
];

export const DEFAULT_CHECKLISTS: { [key: string]: ChecklistItem[] } = {
  header: [
    { id: 'ch-1', task: 'Verificar alinhamento do logotipo BGrowth e cores da marca', checked: true, category: 'Header' },
    { id: 'ch-2', task: 'Validar responsividade da barra de pesquisa e marcador de posição', checked: true, category: 'Header' },
    { id: 'ch-3', task: 'Confirmar se o indicador de status do sistema está piscando', checked: false, category: 'Header' },
  ],
  content: [
    { id: 'ch-4', task: 'Verificar se o espaçamento dos cartões do bento-grid é estritamente consistente', checked: true, category: 'Spacing' },
    { id: 'ch-5', task: 'Confirmar se a cor da linha do gráfico de receita é #1061EC', checked: false, category: 'Colors' },
    { id: 'ch-6', task: 'Testar tooltips interativos para o indicador de taxa de conversão', checked: false, category: 'Functionality' },
    { id: 'ch-7', task: 'Revisar taxa de contraste tipográfico em fundos escuros', checked: true, category: 'Accessibility' },
  ],
  forms: [
    { id: 'ch-8', task: 'Validar regras de regex do formato de entrada de e-mail', checked: true, category: 'Forms' },
    { id: 'ch-9', task: 'Verificar se o tamanho do ícone do Google SSO corresponde às especificações', checked: false, category: 'Icons' },
    { id: 'ch-10', task: 'Testar colunas divididas responsivas em telas móveis', checked: true, category: 'Responsive' },
  ],
};

export const DEFAULT_SCREENS: Screen[] = [
  {
    id: 'scr-1',
    projectId: 'proj-1',
    title: 'Painel Executivo de Crescimento',
    description: 'Painel principal de métricas, acompanhando projeções de receita, listas de testes ativos e cartões de estatísticas rápidas.',
    version: 'v2.1.0',
    screenshot: 'dashboard', // template name
    reviewStatus: 'In Progress',
    checklist: [
      ...DEFAULT_CHECKLISTS.header,
      ...DEFAULT_CHECKLISTS.content,
    ],
  },
  {
    id: 'scr-2',
    projectId: 'proj-2',
    title: 'Login do Portal de Marca',
    description: 'Tela de login dividida de alto contraste com protocolos de segurança corporativa, SSO do Google e textos de marketing.',
    version: 'v1.4.2',
    screenshot: 'login', // template name
    reviewStatus: 'Open',
    checklist: [
      ...DEFAULT_CHECKLISTS.header,
      ...DEFAULT_CHECKLISTS.forms,
    ],
  },
  {
    id: 'scr-3',
    projectId: 'proj-1',
    title: 'Diretório de Leads no CRM',
    description: 'Layout detalhado de grade para gerentes de vendas com filtros avançados, valores de contato e tags de nutrição de leads.',
    version: 'v2.0.8',
    screenshot: 'crm', // template name
    reviewStatus: 'Waiting',
    checklist: [
      { id: 'ch-11', task: 'Garantir que as linhas da tabela acomodem textos longos com elegância', checked: true, category: 'Layout' },
      { id: 'ch-12', task: 'Verificar contraste nos emblemas Qualificado, Em Nutrição e Paralisado', checked: true, category: 'Colors' },
      { id: 'ch-13', task: 'Adicionar estilos visuais de hover aos links de ação padrão', checked: false, category: 'UI' },
    ],
  },
];

export const DEFAULT_COMMENTS: Comment[] = [
  {
    id: 'com-1',
    screenId: 'scr-1',
    title: 'Curva do gráfico de receita ligeiramente serrilhada',
    description: 'A curva de Bézier cúbica no gráfico de linha parece um pouco áspera nas coordenadas (30, 15). Devemos ajustar os pontos de controle para suavizar a transição.',
    category: 'UI',
    priority: 'Medium',
    status: 'Open',
    created: '2026-07-02T10:15:00Z',
    updated: '2026-07-02T10:15:00Z',
    assignedTo: 'Alex Mercer (Dev Principal)',
    resolved: false,
    pinNumber: 1,
    pinX: 42,
    pinY: 65,
    shapes: [
      {
        id: 'shp-1',
        type: 'freehand',
        color: '#EF4444',
        thickness: 3,
        points: [35, 60, 38, 62, 42, 65, 45, 63, 48, 60],
      },
      {
        id: 'shp-2',
        type: 'text',
        color: '#EF4444',
        thickness: 2,
        points: [35, 55],
        text: 'Suavizar esta curva',
      },
    ],
    replies: [
      {
        id: 'rep-1',
        author: 'Alex Mercer',
        text: 'Acordado, vou ajustar os valores do caminho d para aumentar a tensão da curva.',
        timestamp: '2026-07-02T11:22:00Z',
      },
    ],
    attachments: [],
  },
  {
    id: 'com-2',
    screenId: 'scr-1',
    title: 'Falta definição de tooltip na contagem de testes ativos',
    description: 'O cartão de Testes Ativos possui um subtítulo "82 ativos agora", mas ao passar o mouse não explica como a métrica é agregada. Vamos adicionar um popover padrão.',
    category: 'UX',
    priority: 'Low',
    status: 'In Progress',
    created: '2026-07-02T14:00:00Z',
    updated: '2026-07-03T09:30:00Z',
    assignedTo: 'Sarah Connor (Designer de UX)',
    resolved: false,
    pinNumber: 2,
    pinX: 52,
    pinY: 25,
    shapes: [
      {
        id: 'shp-3',
        type: 'rect',
        color: '#3B82F6',
        thickness: 2,
        points: [48, 20, 56, 30],
      },
    ],
    replies: [],
    attachments: [],
  },
  {
    id: 'com-3',
    screenId: 'scr-1',
    title: 'Ícone de marca do Google no portal de login tem tamanho incorreto',
    description: 'O vetor SVG do logotipo do Google no botão SSO está maior do que as regras oficiais da marca. Precisa ser reduzido para 16px de largura e centralizado com precisão dentro do padding do container.',
    category: 'Icons',
    priority: 'High',
    status: 'Open',
    created: '2026-07-03T08:00:00Z',
    updated: '2026-07-03T08:00:00Z',
    assignedTo: 'Alex Mercer (Dev Principal)',
    resolved: false,
    pinNumber: 3,
    pinX: 75,
    pinY: 76,
    shapes: [
      {
        id: 'shp-4',
        type: 'circle',
        color: '#EF4444',
        thickness: 2,
        points: [75, 76, 5], // center_x, center_y, radius
      },
    ],
    replies: [],
    attachments: [],
  },
];

export const DEFAULT_HISTORY: HistoryEntry[] = [
  {
    id: 'hist-1',
    projectId: 'proj-1',
    screenId: 'scr-1',
    action: 'Projeto inicializado',
    details: 'Configuração do projeto "Suíte de Admin BGrowth" com modelos de Painel Executivo.',
    timestamp: '2026-06-28T09:00:00Z',
  },
  {
    id: 'hist-2',
    projectId: 'proj-1',
    screenId: 'scr-1',
    action: 'Comentário criado',
    details: 'Pin #1 adicionado sobre a curva serrilhada no gráfico de projeção de crescimento de receita.',
    timestamp: '2026-07-02T10:15:00Z',
  },
  {
    id: 'hist-3',
    projectId: 'proj-1',
    screenId: 'scr-1',
    action: 'Resposta adicionada',
    details: 'Alex Mercer respondeu ao Pin #1 sobre ajustes no caminho da curva.',
    timestamp: '2026-07-02T11:22:00Z',
  },
];
