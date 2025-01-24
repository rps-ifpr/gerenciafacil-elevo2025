import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { History } from 'lucide-react';
import { ReschedulingEntry } from '../../types/Meeting';

interface ReschedulingHistoryProps {
  history?: ReschedulingEntry[];
}

export function ReschedulingHistory({ history }: ReschedulingHistoryProps) {
  if (!history?.length) return null;

  return (
    <div className="mt-4 space-y-2">
      <div className="flex items-center gap-2 text-gray-700">
        <History className="w-4 h-4" />
        <h4 className="text-sm font-medium">Histórico de Reagendamentos</h4>
      </div>
      <div className="space-y-3">
        {history.map((entry) => (
          <div key={entry.id} className="text-sm border-l-2 border-gray-200 pl-3">
            <div className="text-gray-500">
              <p>
                De: {format(new Date(entry.previousDate), "dd/MM/yyyy", { locale: ptBR })} {' '}
                ({entry.previousStartTime} - {entry.previousEndTime})
              </p>
              <p>
                Para: {format(new Date(entry.newDate), "dd/MM/yyyy", { locale: ptBR })} {' '}
                ({entry.newStartTime} - {entry.newEndTime})
              </p>
              <p className="text-xs mt-1">
                Alterado por {entry.changedBy} em {' '}
                {format(new Date(entry.changedAt), "dd/MM/yyyy HH:mm", { locale: ptBR })}
              </p>
            </div>
            <p className="text-gray-600 mt-1 text-sm">
              Motivo: {entry.reason}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}