export interface StatusLog {
  id: string;
  taskId: string;
  fromStatus: string;
  toStatus: string;
  justification?: string;
  timestamp: string;
  automatic: boolean;
  systemNotes?: string;
  userId?: string; // Para identificar quem fez a mudança
}

export interface StatusChange {
  status: string;
  timestamp: string;
  justification?: string;
  automatic: boolean;
}