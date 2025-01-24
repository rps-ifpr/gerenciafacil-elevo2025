import { Task } from '../../types';
import { statusLabels, statusColors, getAvailableStatuses, validateStatusChange } from '../../utils/taskStatusConfig';
import { Clock, CheckCircle2, AlertTriangle, Shield, RefreshCcw, Search } from 'lucide-react';

interface TaskStatusDialogProps {
  task: Task;
  isOpen: boolean;
  onClose: () => void;
  onStatusChange: (taskId: string, newStatus: Task['status'], automatic?: boolean) => void;
}

export function TaskStatusDialog({
  task,
  isOpen,
  onClose,
  onStatusChange,
}: TaskStatusDialogProps) {
  if (!isOpen) return null;

  const StatusIcon = {
    not_started: Clock,
    in_progress: RefreshCcw,
    in_review: Search,
    blocked: Shield,
    completed: CheckCircle2,
    delayed: AlertTriangle
  }[task.status];

  const availableStatuses = getAvailableStatuses(task.status);

  const handleStatusChange = (newStatus: Task['status']) => {
    // Validate status change
    const validation = validateStatusChange(task.status, newStatus, task.startDate, task.endDate);
    if (!validation.valid) {
      alert(validation.message);
      return;
    }

    onStatusChange(task.id, newStatus, validation.automatic);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h3 className="text-lg font-medium mb-4">
          Alterar Status da Tarefa
        </h3>

        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-600 mb-2">Status Atual:</p>
            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${statusColors[task.status].bg} ${statusColors[task.status].text}`}>
              <StatusIcon className="w-4 h-4" />
              <span className="font-medium">{statusLabels[task.status]}</span>
            </div>
          </div>

          <div>
            <p className="text-sm text-gray-600 mb-2">Novo Status:</p>
            <div className="grid grid-cols-2 gap-2">
              {availableStatuses.map(status => {
                const NewStatusIcon = {
                  not_started: Clock,
                  in_progress: RefreshCcw,
                  in_review: Search,
                  blocked: Shield,
                  completed: CheckCircle2,
                  delayed: AlertTriangle
                }[status];

                return (
                  <button
                    key={status}
                    onClick={() => handleStatusChange(status)}
                    className={`flex items-center gap-2 p-2 rounded-lg ${statusColors[status].bg} ${statusColors[status].text} hover:shadow-md transition-all`}
                  >
                    <NewStatusIcon className="w-4 h-4" />
                    <span>{statusLabels[status]}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex justify-end gap-4 mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}