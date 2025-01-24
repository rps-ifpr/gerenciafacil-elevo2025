import { Edit2, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';

interface ActionButtonsProps {
  onEdit?: () => void;
  onDelete?: () => void;
  onToggleStatus?: () => void;
  isActive?: boolean;
  disabledMessage?: string;
  isCompleted?: boolean;
}

export function ActionButtons({ 
  onEdit, 
  onDelete, 
  onToggleStatus, 
  isActive,
  disabledMessage,
  isCompleted
}: ActionButtonsProps) {
  if (isCompleted) {
    return (
      <div className="flex gap-2" title="Não é possível editar ou excluir um item concluído">
        <button
          disabled
          className="p-2 text-gray-400 cursor-not-allowed"
        >
          <Edit2 className="w-4 h-4" />
        </button>
        <button
          disabled
          className="p-2 text-gray-400 cursor-not-allowed"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="flex gap-2" title={disabledMessage}>
      {onEdit && (
        <button
          onClick={onEdit}
          className="p-2 text-gray-600 hover:bg-gray-100 rounded-md"
          title="Editar"
        >
          <Edit2 className="w-4 h-4" />
        </button>
      )}
      
      {onToggleStatus && (
        <button
          onClick={onToggleStatus}
          className={`p-2 rounded-md ${
            isActive ? 'text-green-600' : 'text-gray-400'
          } hover:bg-gray-100`}
          title={isActive ? 'Desativar' : 'Ativar'}
        >
          {isActive ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
        </button>
      )}

      {onDelete && (
        <button
          onClick={onDelete}
          className="p-2 text-red-600 hover:bg-red-50 rounded-md"
          title="Excluir"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}