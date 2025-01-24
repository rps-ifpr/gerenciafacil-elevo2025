import { useState, useCallback } from 'react';
import { StatusHistoryEntry, StatusTrackable } from '../types/StatusHistory';

export function useStatusHistory() {
  const [error, setError] = useState<string | null>(null);

  const addHistoryEntry = useCallback((
    entity: StatusTrackable,
    newStatus: string,
    options?: {
      automatic?: boolean;
      message?: string;
      systemNotes?: string;
      userId?: string;
    }
  ): StatusHistoryEntry => {
    const now = new Date();
    
    const entry: StatusHistoryEntry = {
      id: crypto.randomUUID(),
      entityId: entity.id,
      entityType: 'task', // ou 'action_plan' dependendo do contexto
      fromStatus: entity.status,
      toStatus: newStatus,
      timestamp: now.toISOString(),
      automatic: options?.automatic || false,
      message: options?.message,
      systemNotes: options?.systemNotes,
      userId: options?.userId
    };

    return entry;
  }, []);

  const formatHistoryEntry = useCallback((entry: StatusHistoryEntry): string => {
    const date = new Date(entry.timestamp);
    const formattedDate = date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });

    let message = `${formattedDate} - ${entry.fromStatus} → ${entry.toStatus}`;
    if (entry.automatic) message += ' [Automático]';
    if (entry.message) message += `: ${entry.message}`;
    
    return message;
  }, []);

  return {
    addHistoryEntry,
    formatHistoryEntry,
    error,
    clearError: () => setError(null)
  };
}