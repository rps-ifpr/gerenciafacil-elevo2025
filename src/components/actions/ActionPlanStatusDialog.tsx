import { useState } from 'react';
import { ActionPlan } from '../../types';
import { statusLabels } from '../../utils/actionPlanStatusConfig';

interface ActionPlanStatusDialogProps {
  isOpen: boolean;
  onClose: () => void;
  currentStatus: ActionPlan['status'];
  newStatus: ActionPlan['status'];
  onConfirm: (status: ActionPlan['status'], justification: string) => void;
}

export function ActionPlanStatusDialog({
  isOpen,
  onClose,
  currentStatus,
  newStatus,
  onConfirm,
}: ActionPlanStatusDialogProps) {
  const [justification, setJustification] = useState('');

  if (!isOpen) return null;

  const isCompletingAction = newStatus === 'completed';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h3 className="text-lg font-medium mb-4">
          {isCompletingAction ? 'Confirmar Conclusão' : 'Alterar Status da Ação'}
        </h3>
        
        <p className="text-sm text-gray-600 mb-4">
          Alterar de <strong>{statusLabels[currentStatus]}</strong> para{' '}
          <strong>{statusLabels[newStatus]}</strong>
        </p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Justificativa
            </label>
            <textarea
              value={justification}
              onChange={(e) => setJustification(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 h-24"
              placeholder="Descreva o motivo da mudança de status"
              required
            />
          </div>

          {isCompletingAction && (
            <p className="text-sm text-red-600 font-medium">
              Atenção: Após concluída, não será possível alterar o status da ação.
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
              onClick={() => onConfirm(newStatus, justification)}
              className={`px-4 py-2 text-white rounded-md ${
                isCompletingAction ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-500'
              }`}
            >
              Confirmar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}