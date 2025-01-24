import { TimeExtension } from '../../types/TimeExtension';
import { timeService } from '../../services/TimeService';

interface TimeExtensionHistoryProps {
  extensions: TimeExtension[];
}

export function TimeExtensionHistory({ extensions }: TimeExtensionHistoryProps) {
  if (!extensions?.length) return null;

  return (
    <div className="mt-4 space-y-2">
      <h4 className="text-sm font-medium text-gray-700">Histórico de Aditivos</h4>
      <div className="space-y-3">
        {extensions.map((extension) => (
          <div key={extension.id} className="text-sm border-l-2 border-gray-200 pl-3">
            <div className="flex items-center justify-between text-gray-500">
              <div className="flex items-center gap-2">
                <span className={`text-xs px-2 py-0.5 rounded ${
                  extension.status === 'approved' 
                    ? 'bg-green-100 text-green-800'
                    : extension.status === 'rejected'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {extension.status === 'approved' 
                    ? 'Aprovado'
                    : extension.status === 'rejected'
                    ? 'Rejeitado'
                    : 'Pendente'}
                </span>
                <span>
                  De {timeService.formatDate(extension.originalEndDate)} para{' '}
                  {timeService.formatDate(extension.newEndDate)}
                </span>
              </div>
              <span className="text-xs">
                {timeService.formatDateTime(extension.requestedAt)}
              </span>
            </div>
            <p className="text-gray-600 mt-1">
              <strong>Motivo:</strong> {extension.reason}
            </p>
            {extension.comments && (
              <p className="text-gray-500 mt-1 text-xs">
                <strong>Observações:</strong> {extension.comments}
              </p>
            )}
            {extension.approvedBy && (
              <p className="text-gray-500 mt-1 text-xs">
                {extension.status === 'approved' ? 'Aprovado' : 'Rejeitado'} por{' '}
                {extension.approvedBy} em {timeService.formatDateTime(extension.approvedAt!)}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}