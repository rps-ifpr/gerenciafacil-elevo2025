import { Task } from '../types/Task';
import { timeService } from './TimeService';

class TaskMonitoringService {
  private static instance: TaskMonitoringService;
  private checkInterval: number = 5 * 60 * 1000; // 5 minutos
  private intervalId?: number;

  private constructor() {}

  static getInstance(): TaskMonitoringService {
    if (!TaskMonitoringService.instance) {
      TaskMonitoringService.instance = new TaskMonitoringService();
    }
    return TaskMonitoringService.instance;
  }

  startMonitoring(
    getTasks: () => Task[],
    updateTask: (id: string, updates: Partial<Task>) => void
  ) {
    // Limpa intervalo anterior se existir
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }

    // Função de verificação
    const checkTasks = () => {
      const now = new Date();
      const tasks = getTasks();

      tasks.forEach(task => {
        const endDate = new Date(task.endDate);
        
        // Verifica se a tarefa está atrasada
        if (now > endDate && task.status !== 'completed' && task.status !== 'delayed') {
          updateTask(task.id, {
            status: 'delayed',
            statusLogs: [
              ...task.statusLogs,
              {
                id: crypto.randomUUID(),
                taskId: task.id,
                fromStatus: task.status,
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

    // Executa imediatamente e depois no intervalo
    checkTasks();
    this.intervalId = setInterval(checkTasks, this.checkInterval);
  }

  stopMonitoring() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
}

export const taskMonitoringService = TaskMonitoringService.getInstance();