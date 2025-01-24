import { useState, useEffect } from 'react';
import { useTaskStore } from '../../store/taskStore';
import { useStore } from '../../store/useStore';
import { format, startOfWeek, endOfWeek } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { taskService } from '../../services/taskService';
import { LoadingSpinner } from '../ui/LoadingSpinner';

export function WeeklyTasksTable() {
  const { tasks, setTasks } = useTaskStore();
  const { collaborators } = useStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
  const weekEnd = endOfWeek(new Date(), { weekStartsOn: 1 });

  // Atualiza os dados periodicamente
  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      try {
        setLoading(true);
        const loadedTasks = await taskService.getAllTasks();
        
        if (isMounted) {
          setTasks(loadedTasks);
          setError(null);
        }
      } catch (err) {
        console.error('Erro ao carregar atividades:', err);
        if (isMounted) {
          setError('Erro ao carregar atividades. Atualizando...');
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
  }, [setTasks]);

  const weeklyTasks = tasks
    .filter(task => {
      const taskDate = new Date(task.startDate);
      return taskDate >= weekStart && taskDate <= weekEnd;
    })
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());

  const handleRowClick = () => {
    const event = new CustomEvent('tabChange', { detail: 'tarefas' });
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

  if (weeklyTasks.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        Nenhuma tarefa programada para esta semana.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200 dark:border-gray-700">
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Tarefa</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Responsável</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Início</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Término</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          {weeklyTasks.map(task => {
            const assignee = collaborators.find(c => c.id === task.assigneeId);
            
            return (
              <tr 
                key={task.id}
                onClick={handleRowClick}
                className="hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
              >
                <td className="px-4 py-3 text-sm">{task.name}</td>
                <td className="px-4 py-3 text-sm">{assignee?.name}</td>
                <td className="px-4 py-3 text-sm">
                  {format(new Date(task.startDate), "dd/MM/yyyy", { locale: ptBR })}
                </td>
                <td className="px-4 py-3 text-sm">
                  {format(new Date(task.endDate), "dd/MM/yyyy", { locale: ptBR })}
                </td>
                <td className="px-4 py-3">
                  <div className={`inline-flex items-center gap-2 px-2 py-1 rounded-full text-sm ${
                    task.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    <span>{task.active ? 'Ativo' : 'Inativo'}</span>
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