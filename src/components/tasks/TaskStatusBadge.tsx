import { Clock, CheckCircle2, AlertTriangle, Shield, RefreshCcw, Search } from 'lucide-react';
import { Task } from '../../types/Task';
import { statusLabels, statusColors } from '../../utils/taskStatusConfig';

interface TaskStatusBadgeProps {
  task: Task;
  onStatusChange?: (status: Task['status']) => void;
}

export function TaskStatusBadge({ task, onStatusChange }: TaskStatusBadgeProps) {
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

  if (!statusColor) {
    console.warn(`Status color not found for status: ${task.status}`);
    return null;
  }

  return (
    <div className="flex items-center gap-4">
      <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${statusColor.bg} ${statusColor.text}`}>
        <Icon className="w-4 h-4" />
        <span className="text-sm font-medium">{statusLabels[task.status]}</span>
      </div>
    </div>
  );
}