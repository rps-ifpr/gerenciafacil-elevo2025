import { useEffect, useState } from 'react';
import { Collaborator } from '../../types';
import { ListItem } from '../common/ListItem';
import { ActionButtons } from '../common/ActionButtons';
import { companyService } from '../../services/companyService';
import { departmentService } from '../../services/departmentService';
import { serviceTypeService } from '../../services/serviceTypeService';
import { LoadingSpinner } from '../ui/LoadingSpinner';

interface CollaboratorListProps {
  collaborators: Collaborator[];
  onEdit: (collaborator: Collaborator) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string) => void;
}

export function CollaboratorList({ collaborators, onEdit, onDelete, onToggleStatus }: CollaboratorListProps) {
  const [relatedData, setRelatedData] = useState<{
    companies: Record<string, string>;
    departments: Record<string, string>;
    serviceTypes: Record<string, string>;
  }>({
    companies: {},
    departments: {},
    serviceTypes: {}
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadRelatedData();
  }, []);

  const loadRelatedData = async () => {
    try {
      setLoading(true);
      const [companies, departments, serviceTypes] = await Promise.all([
        companyService.getAllCompanies(),
        departmentService.getAllDepartments(),
        serviceTypeService.getAllServiceTypes()
      ]);

      setRelatedData({
        companies: companies.reduce((acc, company) => ({ ...acc, [company.id]: company.name }), {}),
        departments: departments.reduce((acc, dept) => ({ ...acc, [dept.id]: dept.name }), {}),
        serviceTypes: serviceTypes.reduce((acc, type) => ({ ...acc, [type.id]: type.name }), {})
      });
      setError(null);
    } catch (err) {
      console.error('Erro ao carregar dados relacionados:', err);
      setError('Erro ao carregar dados relacionados. Por favor, recarregue a página.');
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
          onClick={loadRelatedData}
          className="ml-2 text-red-700 underline hover:no-underline"
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  if (collaborators.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        Nenhum prestador cadastrado. Clique em "Novo Prestador" para começar.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {collaborators.map((collaborator) => (
        <ListItem
          key={collaborator.id}
          title={collaborator.name}
          subtitle={`Email: ${collaborator.email}`}
          status={collaborator.active}
          actions={
            <ActionButtons
              onEdit={() => onEdit(collaborator)}
              onDelete={() => onDelete(collaborator.id)}
              onToggleStatus={() => onToggleStatus(collaborator.id)}
              isActive={collaborator.active}
            />
          }
        >
          <div className="text-sm text-gray-500 space-y-1">
            <p>Cargo: {collaborator.role}</p>
            <p>Departamento: {relatedData.departments[collaborator.department] || 'Não definido'}</p>
            <p>Tipo de Serviço: {relatedData.serviceTypes[collaborator.serviceType] || 'Não definido'}</p>
            <p>Empresa: {relatedData.companies[collaborator.companyId] || 'Não definida'}</p>
          </div>
        </ListItem>
      ))}
    </div>
  );
}