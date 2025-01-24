import { useState } from 'react';
import { Task } from '../types';
import { validateStatusChange, createStatusLog } from '../utils/taskStatusManager';
import { useTaskStore } from '../store/taskStore';

export function useTaskStatus(task: Task) {
  const { updateTask } = useTaskStore();
  const [error, setError] = useState<string | null>(null);

  const changeStatus = (newStatus: Task['status'], justification?: string) => {
    const validation = validateStatusChange(task, newStatus);
    
    if (!validation.valid) {
      setError(validation.message || 'Mudança de status não permitida');
      return false;
    }

    const statusLog = createStatusLog(task, newStatus, justification);
    
    updateTask(task.id, {
      status: newStatus,
      statusLogs: [...task.statusLogs, statusLog],
      updatedAt: new Date().toISOString()
    });

    setError(null);
    return true;
  };

  return {
    changeStatus,
    error,
    clearError: () => setError(null)
  };
}