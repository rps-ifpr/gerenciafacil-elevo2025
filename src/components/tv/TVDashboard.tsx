import { useState, useEffect } from 'react';
import { OngoingActionsTable } from './OngoingActionsTable';
import { TasksByStatusCard } from './TasksByStatusCard';
import { Clock } from 'lucide-react';
import { taskService } from '../../services/taskService';
import { actionPlanService } from '../../services/actionPlanService';
import { useTaskStore } from '../../store/taskStore';
import { useActionPlanStore } from '../../store/actionPlanStore';

export function TVDashboard() {
  const { setTasks } = useTaskStore();
  const { setActionPlans } = useActionPlanStore();
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [loading, setLoading] = useState(false);

  // Função para atualizar dados
  const updateData = async () => {
    try {
      setLoading(true);
      const [tasks, actions] = await Promise.all([
        taskService.getAllTasks(),
        actionPlanService.getAllActionPlans()
      ]);

      setTasks(tasks);
      setActionPlans(actions);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Erro ao atualizar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  // Atualiza quando houver mudança de status
  useEffect(() => {
    const handleStatusChange = () => {
      updateData();
    };

    window.addEventListener('taskStatusChanged', handleStatusChange);
    return () => {
      window.removeEventListener('taskStatusChanged', handleStatusChange);
    };
  }, []);

  // Atualização periódica
  useEffect(() => {
    updateData(); // Carrega dados iniciais
    const interval = setInterval(updateData, 30000); // Atualiza a cada 30 segundos
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header com última atualização */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            ELEVO - Painel de Controle
          </h1>
          <div className="flex items-center justify-center gap-2 text-gray-500 dark:text-gray-400">
            <Clock className="w-5 h-5" />
            <p>Atualizado em: {lastUpdate.toLocaleTimeString()}</p>
          </div>
        </div>

        {/* Conteúdo principal */}
        <div className="space-y-8">
          {/* Ações em Andamento */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
              Ações em Andamento
            </h2>
            <OngoingActionsTable />
          </div>

          {/* Status das Atividades */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
              Status das Atividades
            </h2>
            <TasksByStatusCard />
          </div>
        </div>
      </div>
    </div>
  );
}