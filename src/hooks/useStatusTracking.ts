import { useCallback } from 'react';
import { timeService } from '../services/TimeService';
import { StatusLog } from '../types/StatusLog';

export function useStatusTracking() {
  const trackStatusChange = useCallback((
    entityId: string,
    fromStatus: string,
    toStatus: string,
    justification?: string,
    automatic: boolean = false
  ): StatusLog => {
    const log: StatusLog = {
      id: crypto.randomUUID(),
      taskId: entityId,
      fromStatus,
      toStatus,
      timestamp: timeService.getCurrentTimestamp(),
      justification,
      automatic,
      systemNotes: automatic ? '[Alteração automática pelo sistema]' : undefined
    };

    return log;
  }, []);

  return { trackStatusChange };
}