import { Clock, CheckCircle2, AlertTriangle, Shield, RefreshCcw, Search } from 'lucide-react';
import { useTaskStore } from '../../store/taskStore';

export function TVFooter() {
  const { tasks } = useTaskStore();

  const statusCards = [
    {
      icon: <Clock className="w-5 h-5" />,
      label: "Não Iniciadas",
      value: tasks.filter(t => t.status === 'not_started').length,
      color: "bg-gray-100 text-gray-800"
    },
    {
      icon: <RefreshCcw className="w-5 h-5" />,
      label: "Em Andamento",
      value: tasks.filter(t => t.status === 'in_progress').length,
      color: "bg-blue-100 text-blue-800"
    },
    {
      icon: <Search className="w-5 h-5" />,
      label: "Em Revisão",
      value: tasks.filter(t => t.status === 'in_review').length,
      color: "bg-yellow-100 text-yellow-800"
    },
    {
      icon: <Shield className="w-5 h-5" />,
      label: "Bloqueadas",
      value: tasks.filter(t => t.status === 'blocked').length,
      color: "bg-red-100 text-red-800"
    },
    {
      icon: <CheckCircle2 className="w-5 h-5" />,
      label: "Concluídas",
      value: tasks.filter(t => t.status === 'completed').length,
      color: "bg-green-100 text-green-800"
    },
    {
      icon: <AlertTriangle className="w-5 h-5" />,
      label: "Atrasadas",
      value: tasks.filter(t => t.status === 'delayed').length,
      color: "bg-orange-100 text-orange-800"
    }
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">
        Status das Atividades
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {statusCards.map((card, index) => (
          <div 
            key={index} 
            className={`${card.color} p-4 rounded-lg flex flex-col items-center justify-center`}
          >
            {card.icon}
            <p className="text-sm font-medium mt-2">{card.label}</p>
            <p className="text-2xl font-bold mt-1">{card.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}