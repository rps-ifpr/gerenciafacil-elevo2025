import { Clock, CheckCircle2, AlertTriangle, XCircle, RefreshCcw } from 'lucide-react';
import { ActionPlan } from '../../types';
import { statusLabels, statusColors } from '../../utils/actionPlanStatusConfig';

interface ActionPlanStatusTrackerProps {
  status: ActionPlan['status'];
  count: number;
  onStatusClick: (status: ActionPlan['status']) => void;
  isSelected?: boolean;
}

export function ActionPlanStatusTracker({ 
  status, 
  count, 
  onStatusClick, 
  isSelected 
}: ActionPlanStatusTrackerProps) {
  const statusInfo = {
    not_started: {
      icon: Clock,
      description: 'Ações que ainda não foram iniciadas'
    },
    in_progress: {
      icon: RefreshCcw,
      description: 'Ações em andamento dentro do prazo'
    },
    completed: {
      icon: CheckCircle2,
      description: 'Ações finalizadas com sucesso'
    },
    delayed: {
      icon: AlertTriangle,
      description: 'Ações com prazo excedido'
    },
    cancelled: {
      icon: XCircle,
      description: 'Ações canceladas'
    }
  };

  const Icon = statusInfo[status].icon;
  const color = statusColors[status];

  return (
    <button
      onClick={() => onStatusClick(status)}
      className={`
        relative flex items-center gap-3 p-4 rounded-lg transition-all w-full
        ${color.bg} ${color.text}
        hover:shadow-md group
        ${isSelected ? 'ring-2 ring-blue-500 ring-offset-2' : ''}
      `}
    >
      <div className="p-2 bg-white bg-opacity-20 rounded-full">
        <Icon className="w-5 h-5" />
      </div>
      <div className="text-left">
        <p className="font-medium">{statusLabels[status]}</p>
        <p className="text-2xl font-bold">{count}</p>
      </div>

      {/* Tooltip com descrição */}
      <div className="absolute invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-200 bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg whitespace-nowrap">
        {statusInfo[status].description}
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
      </div>
    </button>
  );
}