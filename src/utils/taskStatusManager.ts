import { Task, StatusLog } from '../types';
import { timeService } from '../services/TimeService';

export function validateStatusChange(task: Task, newStatus: Task['status']): {
  valid: boolean;
  message?: string;
  automatic?: boolean;
} {
  const now = timeService.getCurrentTimestamp();
  const startDate = new Date(task.startDate);
  const endDate = new Date(task.endDate);

  if (newStatus === 'in_progress' && new Date(now) < startDate) {
    return {
      valid: false,
      message: 'Não é possível iniciar uma tarefa antes da data de início prevista'
    };
  }

  if (task.status === 'in_progress' && new Date(now) > endDate) {
    return {
      valid: true,
      message: 'Tarefa marcada como atrasada automaticamente',
      automatic: true
    };
  }

  return { valid: true };
}

export function createStatusLog(
  task: Task,
  newStatus: Task['status'],
  automatic: boolean = false
): StatusLog {
  return {
    id: crypto.randomUUID(),
    taskId: task.id,
    fromStatus: task.status,
    toStatus: newStatus,
    timestamp: timeService.getCurrentTimestamp(),
    automatic,
    systemNotes: automatic ? '[Alteração automática pelo sistema]' : undefined
  };
}