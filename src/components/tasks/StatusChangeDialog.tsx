import { Task } from '../../types';
import { statusLabels } from '../../utils/taskStatusConfig';

interface StatusChangeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  currentStatus: Task['status'];
  newStatus: Task['status'];
  onConfirm: (status: Task['status']) => void;
}

export function StatusChangeDialog({
  isOpen,
  onClose,
  currentStatus,
  newStatus,
  onConfirm,
}: StatusChangeDialogProps) {
  if (!isOpen) return null;

  const isCompletingTask = newStatus === 'completed';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h3 className="text-lg font-medium mb-4">
          {isCompletingTask ? 'Confirmar Conclusão' : 'Alterar Status da Atividade'}
        </h3>
        
        {isCompletingTask ? (
          <>
            <p className="text-sm text-gray-600 mb-4">
              Tem certeza que deseja concluir esta atividade? 
              <br /><br />
              <strong className="text-red-600">
                Atenção: Após concluída, não será possível alterar o status da atividade.
              </strong>
            </p>
          </>
        ) : (
          <p className="text-sm text-gray-600 mb-4">
            Alterar de <strong>{statusLabels[currentStatus]}</strong> para{' '}
            <strong>{statusLabels[newStatus]}</strong>
          </p>
        )}

        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Cancelar
          </button>
          <button
            onClick={() => onConfirm(newStatus)}
            className={`px-4 py-2 text-white rounded-md ${
              isCompletingTask ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-500'
            }`}
          >
            {isCompletingTask ? 'Sim, Concluir' : 'Confirmar'}
          </button>
        </div>
      </div>
    </div>
  );
}