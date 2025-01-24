import { StatusLog } from '../../types/StatusLog';
import { timeService } from '../../services/TimeService';
import { statusLabels } from '../../utils/taskStatusConfig';

interface StatusHistoryProps {
  logs: StatusLog[];
}

export function StatusHistory({ logs }: StatusHistoryProps) {
  if (!logs?.length) return null;

  return (
    <div className="mt-4 space-y-2">
      <h4 className="text-sm font-medium text-gray-700">Histórico de Status</h4>
      <div className="space-y-3">
        {logs.map((log) => (
          <div key={log.id} className="text-sm border-l-2 border-gray-200 pl-3">
            <div className="flex items-center justify-between text-gray-500">
              <span>
                {statusLabels[log.fromStatus]} → {statusLabels[log.toStatus]}
                {log.automatic && (
                  <span className="ml-2 text-xs bg-gray-100 px-2 py-0.5 rounded">
                    Automático
                  </span>
                )}
              </span>
              <span className="text-xs">
                {timeService.formatDateTime(log.timestamp)}
              </span>
            </div>
            <div className="text-gray-600 mt-1 text-xs">
              {log.automatic ? (
                <span className="italic">{log.systemNotes}</span>
              ) : (
                <>
                  <span className="font-medium">Alterado por: </span>
                  {log.userName || 'Sistema'}
                </>
              )}
              {log.justification && (
                <p className="mt-1">
                  <span className="font-medium">Justificativa: </span>
                  {log.justification}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}