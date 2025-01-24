import { useState } from 'react';
import { Clock, CheckCircle2, AlertTriangle, XCircle, RefreshCcw } from 'lucide-react';
import { ActionPlan } from '../../types';
import { statusLabels, statusColors, getAvailableStatuses } from '../../utils/actionPlanStatusConfig';

interface ActionPlanStatusProps {
  plan: ActionPlan;
  onStatusChange?: (newStatus: ActionPlan['status'], justification: string) => void;
}

export function ActionPlanStatus({ plan, onStatusChange }: ActionPlanStatusProps) {
  const [showDropdown, setShowDropdown] = useState(false);

  const statusIcons = {
    not_started: Clock,
    in_progress: RefreshCcw,
    completed: CheckCircle2,
    delayed: AlertTriangle,
    cancelled: XCircle
  };

  const Icon = statusIcons[plan.status];
  const statusColor = statusColors[plan.status];
  const availableStatuses = getAvailableStatuses(plan.status);

  const handleStatusSelect = (newStatus: ActionPlan['status']) => {
    if (onStatusChange) {
      const justification = prompt('Por favor, justifique a mudança de status:');
      if (justification) {
        onStatusChange(newStatus, justification);
      }
    }
    setShowDropdown(false);
  };

  return (
    <div className="relative">
      <div 
        className={`flex items-center gap-2 px-4 py-2 rounded-full cursor-pointer ${statusColor.bg} ${statusColor.text} hover:shadow-md transition-all`}
        onClick={() => setShowDropdown(!showDropdown)}
      >
        <Icon className="w-4 h-4" />
        <span className="font-medium">{statusLabels[plan.status]}</span>
        {availableStatuses.length > 0 && (
          <span className="text-xs ml-2">(Clique para alterar)</span>
        )}
      </div>

      {showDropdown && availableStatuses.length > 0 && (
        <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-10">
          {availableStatuses.map(status => {
            const StatusIcon = statusIcons[status];
            const color = statusColors[status];
            return (
              <button
                key={status}
                onClick={() => handleStatusSelect(status)}
                className={`w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-50 ${color.text}`}
              >
                <StatusIcon className="w-4 h-4" />
                <span>{statusLabels[status]}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}