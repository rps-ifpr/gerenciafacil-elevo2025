export type TaskStatus = 
  | 'not_started'
  | 'in_progress'
  | 'in_review'
  | 'blocked'
  | 'completed'
  | 'delayed';

export interface Task {
  id: string;
  name: string;
  description?: string;
  startDate: string;
  endDate: string;
  assigneeId: string;
  actionPlanId: string;
  status: TaskStatus; // Campo adicionado
  statusLogs: StatusLog[]; // Campo adicionado
  active: boolean;
  createdAt: string;
  updatedAt: string;
}