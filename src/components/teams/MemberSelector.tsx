import { useState, useEffect } from 'react';
import { collaboratorService } from '../../services/collaboratorService';
import { departmentService } from '../../services/departmentService';
import { FormField } from '../common/FormField';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { Collaborator, Department } from '../../types';

interface MemberSelectorProps {
  selectedMembers: string[];
  onMemberToggle: (memberId: string) => void;
}

export function MemberSelector({ selectedMembers, onMemberToggle }: MemberSelectorProps) {
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [colabs, deps] = await Promise.all([
        collaboratorService.getAllCollaborators(),
        departmentService.getAllDepartments()
      ]);
      
      // Filtra apenas colaboradores ativos
      setCollaborators(colabs.filter(c => c.active));
      setDepartments(deps);
      setError(null);
    } catch (err) {
      console.error('Erro ao carregar dados:', err);
      setError('Erro ao carregar prestadores. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-600 rounded-md">
        {error}
        <button 
          onClick={loadData}
          className="ml-2 text-red-700 underline hover:no-underline"
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  // Agrupa colaboradores por departamento
  const collaboratorsByDepartment = departments.reduce((acc, dept) => {
    acc[dept.id] = collaborators.filter(c => c.department === dept.id);
    return acc;
  }, {} as Record<string, Collaborator[]>);

  return (
    <FormField label="Selecione os Prestadores" required>
      <div className="border rounded-lg divide-y">
        {departments.map(department => {
          const deptCollaborators = collaboratorsByDepartment[department.id] || [];
          if (deptCollaborators.length === 0) return null;

          return (
            <div key={department.id} className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="font-medium text-gray-700">
                  {department.name}
                </div>
                <div className="text-sm text-gray-500">
                  {deptCollaborators.filter(c => selectedMembers.includes(c.id)).length} / {deptCollaborators.length} selecionados
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {deptCollaborators.map(collaborator => (
                  <label
                    key={collaborator.id}
                    className="flex items-center gap-2 p-2 rounded hover:bg-gray-50 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedMembers.includes(collaborator.id)}
                      onChange={() => onMemberToggle(collaborator.id)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">{collaborator.name}</span>
                      <span className="text-xs text-gray-500">{collaborator.role}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </FormField>
  );
}