import { ActionPlan } from '../types/ActionPlan';
import { timeService } from './TimeService';

class ActionPlanMonitoringService {
  private static instance: ActionPlanMonitoringService;
  private checkInterval: number = 5 * 60 * 1000; // 5 minutos
  private intervalId?: number;

  private constructor() {}

  static getInstance(): ActionPlanMonitoringService {
    if (!ActionPlanMonitoringService.instance) {
      ActionPlanMonitoringService.instance = new ActionPlanMonitoringService();
    }
    return ActionPlanMonitoringService.instance;
  }

  startMonitoring(
    getActionPlans: () => ActionPlan[],
    updateActionPlan: (id: string, updates: Partial<ActionPlan>) => void
  ) {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }

    const checkActionPlans = () => {
      const now = new Date();
      const plans = getActionPlans();

      plans.forEach(plan => {
        const endDate = new Date(plan.endDate);
        
        if (now > endDate && plan.status !== 'completed' && plan.status !== 'delayed') {
          updateActionPlan(plan.id, {
            status: 'delayed',
            statusLogs: [
              ...(plan.statusLogs || []),
              {
                id: crypto.randomUUID(),
                taskId: plan.id,
                fromStatus: plan.status,
                toStatus: 'delayed',
                timestamp: timeService.getCurrentTimestamp(),
                automatic: true,
                systemNotes: 'Status alterado automaticamente - Prazo excedido'
              }
            ],
            updatedAt: timeService.getCurrentTimestamp()
          });
        }
      });
    };

    checkActionPlans();
    this.intervalId = setInterval(checkActionPlans, this.checkInterval);
  }

  stopMonitoring() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
}

export const actionPlanMonitoringService = ActionPlanMonitoringService.getInstance();