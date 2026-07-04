export interface Project {
  id: string;
  name: string;
  module: string;
  description: string;
  version: string;
  createdDate: string;
  updatedDate: string;
  status: 'Draft' | 'In Progress' | 'Reviewed' | 'Approved';
}

export interface ChecklistItem {
  id: string;
  task: string;
  checked: boolean;
  category: string;
}

export interface Screen {
  id: string;
  projectId: string;
  title: string;
  description: string;
  version: string;
  screenshot: string; // Base64 image data OR SVG template ID
  reviewStatus: 'Open' | 'In Progress' | 'Waiting' | 'Completed' | 'Ignored';
  checklist: ChecklistItem[];
}

export type AnnotationTool =
  | 'pointer'
  | 'arrow'
  | 'rect'
  | 'circle'
  | 'freehand'
  | 'highlighter'
  | 'text'
  | 'callout'
  | 'blur'
  | 'marker';

export interface AnnotationShape {
  id: string;
  type: AnnotationTool;
  color: string;
  thickness: number;
  points: number[]; // stored as percentage coordinates [x1, y1, x2, y2, ...] from 0 to 100
  text?: string;
}

export interface Reply {
  id: string;
  author: string;
  text: string;
  timestamp: string;
}

export interface Attachment {
  id: string;
  name: string;
  size: string;
  type: string;
  data: string; // base64 payload
}

export interface Comment {
  id: string;
  screenId: string;
  title: string;
  description: string;
  category: string;
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
  status: 'Open' | 'In Progress' | 'Waiting' | 'Completed' | 'Ignored';
  created: string;
  updated: string;
  assignedTo: string;
  resolved: boolean;
  pinNumber: number;
  pinX: number; // 0 - 100 percent of viewport width
  pinY: number; // 0 - 100 percent of viewport height
  shapes: AnnotationShape[];
  replies: Reply[];
  attachments: Attachment[];
}

export interface HistoryEntry {
  id: string;
  projectId: string;
  screenId?: string;
  action: string;
  details: string;
  timestamp: string;
}
