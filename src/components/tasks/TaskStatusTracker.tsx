import { Clock, CheckCircle2, AlertTriangle, Shield, RefreshCcw, Search } from 'lucide-react';
import { Task } from '../../types';
import { statusLabels, statusColors } from '../../utils/taskStatusConfig';

interface TaskStatusTrackerProps {
  status: Task['status'];
  count: number;
  onStatusClick: (status: Task['status']) => void;
  isSelected?: boolean;
}

export function TaskStatusTracker({ status, count, onStatusClick, isSelected }: TaskStatusTrackerProps) {
  const statusIcons = {
    not_started: Clock,
    in_progress: RefreshCcw,
    in_review: Search,
    blocked: Shield,
    completed: CheckCircle2,
    delayed: AlertTriangle
  };

  const Icon = statusIcons[status];
  const color = statusColors[status];

  return (
    <button
      onClick={() => onStatusClick(status)}
      className={`
        flex items-center gap-3 p-4 rounded-lg transition-all w-full
        ${color.bg} ${color.text}
        hover:shadow-md
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
    </button>
  );
}