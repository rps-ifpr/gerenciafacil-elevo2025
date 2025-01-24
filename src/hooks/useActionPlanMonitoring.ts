import { useEffect } from 'react';
import { useActionPlanStore } from '../store/actionPlanStore';
import { actionPlanMonitoringService } from '../services/ActionPlanMonitoringService';

export function useActionPlanMonitoring() {
  const { actionPlans, updateActionPlan } = useActionPlanStore();

  useEffect(() => {
    actionPlanMonitoringService.startMonitoring(
      () => actionPlans,
      updateActionPlan
    );

    return () => {
      actionPlanMonitoringService.stopMonitoring();
    };
  }, [actionPlans, updateActionPlan]);
}