import { useState, useEffect } from 'react';
import { Plus, Edit2, Users } from 'lucide-react';
import { Team } from '../../types';
import { useStore } from '../../store/useStore';
import { useDepartmentStore } from '../../store/departmentStore';
import { FormField } from '../common/FormField';
import { MemberSelector } from './MemberSelector';
import { SelectedMembers } from './SelectedMembers';

interface TeamFormProps {
  onSubmit: (team: Omit<Team, 'id'>) => void;
  initialData?: Team;
  isEditing?: boolean;
}

export function TeamForm({ onSubmit, initialData, isEditing }: TeamFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    members: [] as string[],
  });

  // Update form data when initialData changes
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        members: initialData.members,
      });
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    if (!isEditing) {
      setFormData({
        name: '',
        members: [],
      });
    }
  };

  const handleMemberToggle = (memberId: string) => {
    setFormData(prev => ({
      ...prev,
      members: prev.members.includes(memberId)
        ? prev.members.filter(id => id !== memberId)
        : [...prev.members, memberId]
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <FormField label="Nome do Grupo" required>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value.toUpperCase() }))}
          placeholder="Digite o nome do grupo"
          className="w-full rounded-md border border-gray-300 px-3 py-2"
          required
        />
      </FormField>

      <MemberSelector
        selectedMembers={formData.members}
        onMemberToggle={handleMemberToggle}
      />

      <SelectedMembers memberIds={formData.members} />

      <button
        type="submit"
        className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500"
      >
        {isEditing ? <Edit2 className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
        {isEditing ? "Atualizar Grupo" : "Adicionar Grupo"}
      </button>
    </form>
  );
}