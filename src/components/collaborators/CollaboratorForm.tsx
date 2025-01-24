import { useState, useEffect } from 'react';
import { Plus, Edit2 } from 'lucide-react';
import { Collaborator } from '../../types';
import { useCompanyStore } from '../../store/companyStore';
import { useDepartmentStore } from '../../store/departmentStore';
import { useServiceTypeStore } from '../../store/serviceTypeStore';
import { FormField } from '../common/FormField';
import { WorkScheduleSection } from './WorkScheduleSection';
import { BasicInfoSection } from './BasicInfoSection';
import { CompanyInfoSection } from './CompanyInfoSection';

interface CollaboratorFormProps {
  onSubmit: (collaborator: Omit<Collaborator, 'id'>) => void;
  initialData?: Collaborator;
  isEditing?: boolean;
}

export function CollaboratorForm({ onSubmit, initialData, isEditing }: CollaboratorFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    companyId: '',
    department: '',
    serviceType: '',
    role: '',
    document: '',
    phone: '',
    accessLevel: 'user' as 'admin' | 'manager' | 'user',
    workSchedule: [{
      type: 'presential' as const,
      days: [],
      startTime: '08:00',
      endTime: '17:00',
    }],
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        email: initialData.email,
        password: initialData.password,
        companyId: initialData.companyId,
        department: initialData.department,
        serviceType: initialData.serviceType,
        role: initialData.role,
        document: initialData.document,
        phone: initialData.phone,
        accessLevel: initialData.accessLevel || 'user',
        workSchedule: initialData.workSchedule,
      });
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    if (!isEditing) {
      setFormData({
        name: '',
        email: '',
        password: '',
        companyId: '',
        department: '',
        serviceType: '',
        role: '',
        document: '',
        phone: '',
        accessLevel: 'user',
        workSchedule: [{
          type: 'presential',
          days: [],
          startTime: '08:00',
          endTime: '17:00',
        }],
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <BasicInfoSection
        formData={formData}
        onChange={(updates) => setFormData(prev => ({ ...prev, ...updates }))}
      />

      <CompanyInfoSection
        formData={formData}
        onChange={(updates) => setFormData(prev => ({ ...prev, ...updates }))}
      />

      <WorkScheduleSection
        schedules={formData.workSchedule}
        onChange={(workSchedule) => setFormData(prev => ({ ...prev, workSchedule }))}
      />

      <button
        type="submit"
        className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500"
      >
        {isEditing ? <Edit2 className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
        {isEditing ? "Atualizar Prestador" : "Adicionar Prestador"}
      </button>
    </form>
  );
}