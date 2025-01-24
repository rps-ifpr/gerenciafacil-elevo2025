import { useState, useEffect } from 'react';
import { Plus, Edit2 } from 'lucide-react';
import { ServiceType } from '../../types';
import { FormField } from '../common/FormField';

interface ServiceTypeFormProps {
  onSubmit: (serviceType: Omit<ServiceType, 'id'>) => void;
  initialData?: ServiceType;
  isEditing?: boolean;
}

export function ServiceTypeForm({ onSubmit, initialData, isEditing }: ServiceTypeFormProps) {
  const [name, setName] = useState('');

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ name });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FormField label="Nome do Tipo de Serviço" required>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value.toUpperCase())}
          className="w-full rounded-md border border-gray-300 px-3 py-2"
          required
        />
      </FormField>

      <button
        type="submit"
        className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500"
      >
        {isEditing ? <Edit2 className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
        {isEditing ? "Atualizar Tipo de Serviço" : "Adicionar Tipo de Serviço"}
      </button>
    </form>
  );
}