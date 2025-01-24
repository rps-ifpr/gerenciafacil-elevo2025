import { StatusHistoryEntry } from '../../types/StatusHistory';
import { useStatusHistory } from '../../hooks/useStatusHistory';

interface StatusHistoryListProps {
  history: StatusHistoryEntry[];
  showEntityType?: boolean;
}

export function StatusHistoryList({ history, showEntityType = false }: StatusHistoryListProps) {
  const { formatHistoryEntry } = useStatusHistory();

  if (!history?.length) return null;

  return (
    <div className="mt-4 space-y-2">
      <h4 className="text-sm font-medium text-gray-700">Histórico de Status</h4>
      <div className="space-y-3">
        {history.map((entry) => (
          <div key={entry.id} className="text-sm border-l-2 border-gray-200 pl-3">
            <div className="flex items-center justify-between text-gray-500">
              <div className="flex items-center gap-2">
                {showEntityType && (
                  <span className="text-xs bg-gray-100 px-2 py-0.5 rounded">
                    {entry.entityType === 'task' ? 'Tarefa' : 'Ação/Plano'}
                  </span>
                )}
                <span>{formatHistoryEntry(entry)}</span>
              </div>
            </div>
            {entry.systemNotes && (
              <p className="text-gray-600 mt-1 text-xs italic">
                {entry.systemNotes}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}