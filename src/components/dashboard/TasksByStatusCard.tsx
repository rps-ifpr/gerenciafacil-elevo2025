import { useTaskStore } from '../../store/taskStore';
import { Clock, CheckCircle2, AlertTriangle, Shield, RefreshCcw, Search } from 'lucide-react';

export function TasksByStatusCard() {
  const { tasks } = useTaskStore();

  const statusCounts = {
    not_started: tasks.filter(t => t.status === 'not_started').length,
    in_progress: tasks.filter(t => t.status === 'in_progress').length,
    in_review: tasks.filter(t => t.status === 'in_review').length,
    blocked: tasks.filter(t => t.status === 'blocked').length,
    completed: tasks.filter(t => t.status === 'completed').length,
    delayed: tasks.filter(t => t.status === 'delayed').length,
  };

  const handleClick = () => {
    const event = new CustomEvent('tabChange', { detail: 'tarefas' });
    window.dispatchEvent(event);
  };

  const cards = [
    {
      label: 'Não Iniciadas',
      value: statusCounts.not_started,
      icon: Clock,
      color: 'bg-gray-100 text-gray-800',
    },
    {
      label: 'Em Andamento',
      value: statusCounts.in_progress,
      icon: RefreshCcw,
      color: 'bg-blue-100 text-blue-800',
    },
    {
      label: 'Em Revisão',
      value: statusCounts.in_review,
      icon: Search,
      color: 'bg-yellow-100 text-yellow-800',
    },
    {
      label: 'Bloqueadas',
      value: statusCounts.blocked,
      icon: Shield,
      color: 'bg-red-100 text-red-800',
    },
    {
      label: 'Concluídas',
      value: statusCounts.completed,
      icon: CheckCircle2,
      color: 'bg-green-100 text-green-800',
    },
    {
      label: 'Atrasadas',
      value: statusCounts.delayed,
      icon: AlertTriangle,
      color: 'bg-orange-100 text-orange-800',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {cards.map(({ label, value, icon: Icon, color }) => (
        <div
          key={label}
          onClick={handleClick}
          className="p-4 rounded-lg bg-white dark:bg-gray-800 shadow hover:shadow-md transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
              <p className="text-2xl font-semibold mt-1">{value}</p>
            </div>
            <div className={`p-2 rounded-full ${color}`}>
              <Icon className="w-5 h-5" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}