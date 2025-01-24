import { useState, useEffect } from 'react';
import { Plus, Edit2 } from 'lucide-react';
import { Department } from '../../types';
import { FormField } from '../common/FormField';

interface DepartmentFormProps {
  onSubmit: (department: Omit<Department, 'id' | 'active'>) => void;
  initialData?: Department;
  isEditing?: boolean;
}

export function DepartmentForm({ onSubmit, initialData, isEditing }: DepartmentFormProps) {
  const [formData, setFormData] = useState({
    name: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData({ name: initialData.name });
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    if (!isEditing) {
      setFormData({ name: '' });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FormField label="Nome do Departamento" required>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ name: e.target.value.toUpperCase() })}
          placeholder="Digite o nome do departamento"
          className="w-full rounded-md border border-gray-300 px-3 py-2"
          required
        />
      </FormField>

      <button
        type="submit"
        className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500"
      >
        {isEditing ? <Edit2 className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
        {isEditing ? "Atualizar Departamento" : "Adicionar Departamento"}
      </button>
    </form>
  );
}