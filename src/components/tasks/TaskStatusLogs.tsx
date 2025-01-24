import { format } from 'date-fns';
import { Task } from '../../types';
import { statusLabels } from '../../utils/taskStatusConfig';

interface TaskStatusLogsProps {
  logs?: Task['statusLogs']; // Make logs optional
}

export function TaskStatusLogs({ logs = [] }: TaskStatusLogsProps) { // Provide default empty array
  if (!logs || logs.length === 0) return null;

  return (
    <div className="mt-4 space-y-2">
      <h4 className="text-sm font-medium text-gray-700">Histórico de Status</h4>
      <div className="space-y-2">
        {logs.map((log) => (
          <div key={log.id} className="text-sm">
            <div className="flex items-center justify-between text-gray-500">
              <span>
                {statusLabels[log.fromStatus]} → {statusLabels[log.toStatus]}
              </span>
              <span>
                {format(new Date(log.timestamp), "dd/MM/yyyy HH:mm:ss")}
              </span>
            </div>
            {log.justification && (
              <p className="text-gray-600 mt-1">
                Justificativa: {log.justification}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}