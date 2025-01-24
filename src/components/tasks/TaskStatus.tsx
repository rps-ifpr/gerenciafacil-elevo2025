import { useState } from 'react';
import { Clock, CheckCircle2, AlertTriangle, Shield, RefreshCcw, Search } from 'lucide-react';
import { Task } from '../../types';
import { statusLabels, statusColors, getAvailableStatuses } from '../../utils/taskStatusConfig';

interface TaskStatusProps {
  task: Task;
  onStatusChange?: (newStatus: Task['status']) => void;
}

export function TaskStatus({ task, onStatusChange }: TaskStatusProps) {
  const [showDropdown, setShowDropdown] = useState(false);

  const statusIcons = {
    not_started: Clock,
    in_progress: RefreshCcw,
    in_review: Search,
    blocked: Shield,
    completed: CheckCircle2,
    delayed: AlertTriangle
  };

  const Icon = statusIcons[task.status];
  const statusColor = statusColors[task.status];
  const availableStatuses = getAvailableStatuses(task.status);

  return (
    <div className="relative">
      <div 
        className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${statusColor.bg} ${statusColor.text}`}
        onClick={() => onStatusChange && setShowDropdown(!showDropdown)}
      >
        <Icon className="w-4 h-4" />
        <span className="text-sm font-medium">{statusLabels[task.status]}</span>
      </div>

      {showDropdown && onStatusChange && (
        <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-10">
          {availableStatuses.map(status => {
            const StatusIcon = statusIcons[status];
            const color = statusColors[status];
            return (
              <button
                key={status}
                onClick={() => {
                  onStatusChange(status);
                  setShowDropdown(false);
                }}
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