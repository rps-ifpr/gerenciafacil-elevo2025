import { useState } from 'react';
import { Plus } from 'lucide-react';
import { TimeExtension } from '../../types/TimeExtension';
import { FormField } from '../common/FormField';

interface TimeExtensionFormProps {
  actionPlanId: string;
  currentEndDate: string;
  onSubmit: (extension: Omit<TimeExtension, 'id' | 'status' | 'approvedBy' | 'approvedAt'>) => void;
  onCancel: () => void;
}

export function TimeExtensionForm({ 
  actionPlanId, 
  currentEndDate,
  onSubmit,
  onCancel 
}: TimeExtensionFormProps) {
  const [formData, setFormData] = useState({
    newEndDate: '',
    reason: '',
    comments: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    onSubmit({
      actionPlanId,
      originalEndDate: currentEndDate,
      newEndDate: `${formData.newEndDate}T23:59:59`,
      reason: formData.reason,
      comments: formData.comments,
      requestedBy: 'current-user-id', // Substituir pelo ID do usuário atual
      requestedAt: new Date().toISOString(),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="text-lg font-medium">Solicitar Aditivo de Prazo</h3>
      
      <div className="grid grid-cols-2 gap-4">
        <FormField label="Data Atual de Término" required>
          <input
            type="date"
            value={currentEndDate.split('T')[0]}
            disabled
            className="w-full rounded-md border border-gray-300 px-3 py-2 bg-gray-50"
          />
        </FormField>

        <FormField label="Nova Data de Término" required>
          <input
            type="date"
            value={formData.newEndDate}
            onChange={(e) => setFormData(prev => ({ ...prev, newEndDate: e.target.value }))}
            min={new Date().toISOString().split('T')[0]}
            className="w-full rounded-md border border-gray-300 px-3 py-2"
            required
          />
        </FormField>
      </div>

      <FormField label="Motivo do Aditivo" required>
        <textarea
          value={formData.reason}
          onChange={(e) => setFormData(prev => ({ ...prev, reason: e.target.value }))}
          placeholder="Descreva o motivo da solicitação do aditivo de prazo"
          className="w-full rounded-md border border-gray-300 px-3 py-2 h-24"
          required
        />
      </FormField>

      <FormField label="Observações Adicionais">
        <textarea
          value={formData.comments}
          onChange={(e) => setFormData(prev => ({ ...prev, comments: e.target.value }))}
          placeholder="Observações adicionais (opcional)"
          className="w-full rounded-md border border-gray-300 px-3 py-2 h-24"
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
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500"
        >
          <Plus className="w-4 h-4" />
          Solicitar Aditivo
        </button>
      </div>
    </form>
  );
}