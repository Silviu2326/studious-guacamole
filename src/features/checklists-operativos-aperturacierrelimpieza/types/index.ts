// Tipos para Checklists Operativos (Apertura/Cierre/Limpieza)

export type UserRole = 'manager' | 'staff';

export type TaskStatus = 'pending' | 'completed' | 'skipped' | 'issue_reported';

export type ChecklistStatus = 'pending' | 'in_progress' | 'completed' | 'overdue';

export interface ChecklistTemplateTask {
  id: string;
  text: string;
  isCritical: boolean;
}

export interface ChecklistTemplate {
  id: string;
  name: string;
  description: string;
  taskCount: number;
  tasks: ChecklistTemplateTask[];
  createdAt: string;
}

export interface ChecklistInstance {
  id: string;
  templateId: string;
  templateName: string;
  assignedTo: {
    id: string;
    name: string;
  };
  dueDate: string;
  status: ChecklistStatus;
  completionPercentage: number;
  items?: ChecklistItem[];
  startedAt?: string;
  completedAt?: string;
}

export interface ChecklistItem {
  id: string;
  text: string;
  status: TaskStatus;
  completedAt?: string;
  notes?: string;
  attachments?: string[];
}

export interface ChecklistFilters {
  date?: string;
  assignedTo?: string;
  status?: ChecklistStatus;
}

export interface ChecklistStats {
  totalChecklists: number;
  completedChecklists: number;
  pendingChecklists: number;
  overdueChecklists: number;
  averageCompletionTime: number;
  incidentRate: number;
}

