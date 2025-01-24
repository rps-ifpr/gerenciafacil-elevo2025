import { useState } from 'react';
import { ActionPlan, ActionPlanStatus } from '../types/ActionPlan';
import { validateStatusChange, getStatusMessage } from '../utils/actionPlanStatusConfig';
import { useStatusTracking } from './useStatusTracking';
import { useActionPlanStore } from '../store/actionPlanStore';

export function useActionPlanStatus(actionPlan: ActionPlan) {
  const { updateActionPlan } = useActionPlanStore();
  const { trackStatusChange } = useStatusTracking();
  const [error, setError] = useState<string | null>(null);

  const changeStatus = (newStatus: ActionPlanStatus) => {
    const validation = validateStatusChange(actionPlan.status, newStatus, actionPlan.endDate);
    
    if (!validation.valid) {
      setError(validation.message || 'Mudança de status não permitida');
      return false;
    }

    const statusLog = trackStatusChange(
      actionPlan.id,
      actionPlan.status,
      newStatus,
      getStatusMessage(newStatus, actionPlan.endDate),
      validation.automatic
    );

    updateActionPlan(actionPlan.id, {
      status: newStatus,
      statusLogs: [...(actionPlan.statusLogs || []), statusLog],
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