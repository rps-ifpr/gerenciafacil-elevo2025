import { useState } from 'react';
import { Task } from '../../types';
import { statusLabels, statusColors, getAvailableStatuses, validateStatusChange } from '../../utils/taskStatusConfig';
import { Clock, CheckCircle2, AlertTriangle, Shield, RefreshCcw, Search } from 'lucide-react';
import { FormField } from '../common/FormField';

interface TaskStatusFormProps {
  task: Task;
  onSubmit: (taskId: string, newStatus: Task['status'], justification: string) => void;
  onCancel: () => void;
}

export function TaskStatusForm({ task, onSubmit, onCancel }: TaskStatusFormProps) {
  const [selectedStatus, setSelectedStatus] = useState<Task['status']>(task.status);
  const [justification, setJustification] = useState('');
  const [error, setError] = useState<string | null>(null);

  const availableStatuses = getAvailableStatuses(task.status);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validação do status
    const validation = validateStatusChange(task.status, selectedStatus, task.startDate, task.endDate);
    if (!validation.valid) {
      setError(validation.message);
      return;
    }

    // Validação da justificativa
    if (!justification.trim()) {
      setError('A justificativa é obrigatória para alteração de status');
      return;
    }

    onSubmit(task.id, selectedStatus, justification);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h3 className="text-lg font-medium">Alterar Status da Tarefa</h3>
      
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-medium text-gray-700 mb-2">Informações da Tarefa</h4>
        <p className="text-gray-600">{task.name}</p>
        <div className="mt-2 text-sm text-gray-500">
          Status atual: <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full ${statusColors[task.status].bg} ${statusColors[task.status].text}`}>
            {statusLabels[task.status]}
          </span>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-md">
          {error}
        </div>
      )}

      <FormField label="Novo Status" required>
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value as Task['status'])}
          className="w-full rounded-md border border-gray-300 px-3 py-2"
          required
        >
          <option value={task.status}>{statusLabels[task.status]} (Atual)</option>
          {availableStatuses.map(status => (
            <option key={status} value={status}>
              {statusLabels[status]}
            </option>
          ))}
        </select>
      </FormField>

      <FormField label="Justificativa da Alteração" required>
        <textarea
          value={justification}
          onChange={(e) => setJustification(e.target.value)}
          placeholder="Descreva o motivo da alteração de status"
          className="w-full rounded-md border border-gray-300 px-3 py-2 h-24"
          required
        />
      </FormField>

      <div className="flex justify-end gap-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-gray-600 hover:text-gray-800"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500"
        >
          Salvar Alteração
        </button>
      </div>
    </form>
  );
}