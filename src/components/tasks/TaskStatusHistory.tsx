import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Task } from '../../types';
import { statusLabels } from '../../utils/taskStatusConfig';

interface TaskStatusHistoryProps {
  tasks: Task[];
}

export function TaskStatusHistory({ tasks }: TaskStatusHistoryProps) {
  // Collect all status logs from all tasks
  const allStatusLogs = tasks.flatMap(task => 
    (task.statusLogs || []).map(log => ({
      ...log,
      taskName: task.name,
      // Ensure timestamp is a valid date string
      timestamp: log.timestamp instanceof Date ? log.timestamp.toISOString() : log.timestamp
    }))
  ).sort((a, b) => {
    const dateA = new Date(a.timestamp);
    const dateB = new Date(b.timestamp);
    return dateB.getTime() - dateA.getTime();
  });

  if (allStatusLogs.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        Nenhuma alteração de status registrada.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {allStatusLogs.map((log) => {
        // Safely parse the timestamp
        const timestamp = new Date(log.timestamp);
        const isValidDate = !isNaN(timestamp.getTime());

        return (
          <div 
            key={log.id} 
            className="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md transition-all"
          >
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-gray-900">{log.taskName}</h4>
              <span className="text-sm text-gray-500">
                {isValidDate ? format(timestamp, "dd 'de' MMMM 'às' HH:mm", { locale: ptBR }) : 'Data inválida'}
              </span>
            </div>
            
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-600">
                {statusLabels[log.fromStatus]} → {statusLabels[log.toStatus]}
              </span>
              {log.automatic && (
                <span className="px-2 py-0.5 bg-yellow-100 text-yellow-800 rounded-full text-xs">
                  Automático
                </span>
              )}
            </div>

            {log.justification && (
              <p className="mt-2 text-sm text-gray-600">
                <span className="font-medium">Justificativa:</span> {log.justification}
              </p>
            )}

            {log.systemNotes && (
              <p className="mt-1 text-xs text-gray-500 italic">
                {log.systemNotes}
              </p>
            )}

            {log.userName && (
              <p className="mt-1 text-xs text-gray-500">
                <span className="font-medium">Alterado por:</span> {log.userName}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}