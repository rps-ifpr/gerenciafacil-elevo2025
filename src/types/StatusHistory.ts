export interface StatusHistoryEntry {
  id: string;
  entityId: string; // ID da tarefa ou ação/plano
  entityType: 'task' | 'action_plan';
  fromStatus: string;
  toStatus: string;
  timestamp: string;
  automatic: boolean;
  message?: string;
  systemNotes?: string;
  userId?: string;
}

export interface StatusTrackable {
  id: string;
  status: string;
  statusHistory: StatusHistoryEntry[];
}