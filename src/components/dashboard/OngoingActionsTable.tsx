import { useState, useEffect } from 'react';
import { useActionPlanStore } from '../../store/actionPlanStore';
import { useTeamStore } from '../../store/teamStore';
import { useTaskStore } from '../../store/taskStore';
import { useStore } from '../../store/useStore';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { actionPlanService } from '../../services/actionPlanService';
import { teamService } from '../../services/teamService';
import { taskService } from '../../services/taskService';

export function OngoingActionsTable() {
  const { actionPlans, setActionPlans } = useActionPlanStore();
  const { teams, setTeams } = useTeamStore();
  const { tasks, setTasks } = useTaskStore();
  const { collaborators } = useStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Atualiza os dados periodicamente
  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      try {
        setLoading(true);
        const [plans, teamsList, tasksList] = await Promise.all([
          actionPlanService.getAllActionPlans(),
          teamService.getAllTeams(),
          taskService.getAllTasks()
        ]);

        if (isMounted) {
          setActionPlans(plans);
          setTeams(teamsList);
          setTasks(tasksList);
          setError(null);
        }
      } catch (err) {
        console.error('Erro ao carregar dados:', err);
        if (isMounted) {
          setError('Erro ao carregar dados. Atualizando...');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    // Carrega dados iniciais
    loadData();

    // Atualiza a cada 30 segundos
    const interval = setInterval(loadData, 30000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [setActionPlans, setTeams, setTasks]);

  // Remove duplicatas dos times usando Set
  const uniqueTeams = Array.from(new Set(teams.map(t => t.id)))
    .map(id => teams.find(t => t.id === id))
    .filter(team => team && team.active) as typeof teams;

  // Filtra apenas ações ativas e ordena por data de entrega
  const ongoingActions = actionPlans
    .filter(plan => plan.active)
    .sort((a, b) => new Date(a.endDate).getTime() - new Date(b.endDate).getTime());

  // Função para calcular o progresso das atividades de uma ação
  const calculateProgress = (actionPlanId: string) => {
    const actionTasks = tasks.filter(task => task.actionPlanId === actionPlanId);
    const totalTasks = actionTasks.length;
    
    if (totalTasks === 0) {
      return {
        total: 0,
        completed: 0,
        percentage: 0
      };
    }

    const completedTasks = actionTasks.filter(task => task.active).length;
    const percentage = Math.round((completedTasks / totalTasks) * 100);

    return {
      total: totalTasks,
      completed: completedTasks,
      percentage
    };
  };

  const handleRowClick = () => {
    const event = new CustomEvent('tabChange', { detail: 'projetos' });
    window.dispatchEvent(event);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-gray-500 py-8">
        {error}
      </div>
    );
  }

  if (ongoingActions.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        Nenhuma ação em andamento no momento.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200 dark:border-gray-700">
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Ação</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Grupo</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Responsável</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Data Início</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Data Entrega</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Status</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Progresso</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          {ongoingActions.map(action => {
            const coordinator = collaborators.find(c => c.id === action.coordinatorId);
            const actionTeams = uniqueTeams.filter(t => action.teamIds.includes(t.id));
            const isDelayed = new Date() > new Date(action.endDate);
            const progress = calculateProgress(action.id);

            return (
              <tr 
                key={action.id} 
                onClick={handleRowClick}
                className="hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
              >
                <td className="px-4 py-3 text-sm">{action.name}</td>
                <td className="px-4 py-3 text-sm">
                  {actionTeams.map(team => team.name).join(', ')}
                </td>
                <td className="px-4 py-3 text-sm">
                  {coordinator ? coordinator.name : 'Não definido'}
                </td>
                <td className="px-4 py-3 text-sm">
                  {format(new Date(action.startDate), "dd/MM/yyyy", { locale: ptBR })}
                </td>
                <td className="px-4 py-3 text-sm">
                  <span className={isDelayed ? 'text-red-600 font-medium flex items-center gap-1' : ''}>
                    {isDelayed && <AlertTriangle className="w-4 h-4" />}
                    {format(new Date(action.endDate), "dd/MM/yyyy", { locale: ptBR })}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                    Em Andamento
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2 w-24">
                      <div 
                        className={`h-full rounded-full ${
                          progress.percentage >= 70 ? 'bg-green-500' :
                          progress.percentage >= 30 ? 'bg-yellow-500' :
                          'bg-red-500'
                        }`}
                        style={{ width: `${progress.percentage}%` }}
                      />
                    </div>
                    <div className="flex items-center gap-1 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      <span>{progress.completed}/{progress.total}</span>
                      <span className="text-gray-500">({progress.percentage}%)</span>
                    </div>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}