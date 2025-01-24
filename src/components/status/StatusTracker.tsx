import { Clock, CheckCircle2, AlertTriangle, Shield, RefreshCcw, Search } from 'lucide-react';
import { Task } from '../../types';
import { statusLabels, statusColors } from '../../utils/taskStatusConfig';

interface StatusTrackerProps {
  status: Task['status'];
  onClick?: (status: Task['status']) => void;
  count: number;
  isClickable?: boolean;
}

export function StatusTracker({ status, onClick, count, isClickable = true }: StatusTrackerProps) {
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
      onClick={() => isClickable && onClick?.(status)}
      disabled={!isClickable}
      className={`
        flex items-center gap-3 p-4 rounded-lg transition-all
        ${color.bg} ${color.text}
        ${isClickable ? 'hover:shadow-md cursor-pointer' : 'cursor-default'}
      `}
    >
      <div className="p-2 bg-white bg-opacity-20 rounded-full">
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className="font-medium">{statusLabels[status]}</p>
        <p className="text-2xl font-bold">{count}</p>
      </div>
    </button>
  );
}