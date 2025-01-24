import { Edit2, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';
import { Collaborator } from '../../types';
import { useCompanyStore } from '../../store/companyStore';
import { useDepartmentStore } from '../../store/departmentStore';
import { useServiceTypeStore } from '../../store/serviceTypeStore';

interface CollaboratorListItemProps {
  collaborator: Collaborator;
  onEdit: () => void;
  onDelete: () => void;
  onToggleStatus: () => void;
}

export function CollaboratorListItem({
  collaborator,
  onEdit,
  onDelete,
  onToggleStatus,
}: CollaboratorListItemProps) {
  const { companies } = useCompanyStore();
  const { departments } = useDepartmentStore();
  const { serviceTypes } = useServiceTypeStore();

  const company = companies.find(c => c.id === collaborator.companyId);
  const department = departments.find(d => d.id === collaborator.department);
  const serviceType = serviceTypes.find(s => s.id === collaborator.serviceType);

  return (
    <div className="flex items-center justify-between p-4 border rounded-md hover:bg-gray-50">
      <div>
        <div className="flex items-center gap-2">
          <span className="font-medium">{collaborator.name}</span>
          <span className={`px-2 py-0.5 text-xs rounded-full ${
            collaborator.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {collaborator.active ? 'Ativo' : 'Inativo'}
          </span>
        </div>
        <p className="text-sm text-gray-500">Email: {collaborator.email}</p>
        {company && <p className="text-sm text-gray-500">Empresa: {company.name}</p>}
        {department && <p className="text-sm text-gray-500">Departamento: {department.name}</p>}
        {serviceType && <p className="text-sm text-gray-500">Tipo de Serviço: {serviceType.name}</p>}
      </div>
      
      <div className="flex gap-2">
        <button
          onClick={onEdit}
          className="p-2 text-gray-600 hover:bg-gray-100 rounded-md"
          title="Editar"
        >
          <Edit2 className="w-4 h-4" />
        </button>
        <button
          onClick={onToggleStatus}
          className={`p-2 rounded-md ${
            collaborator.active ? 'text-green-600' : 'text-gray-400'
          } hover:bg-gray-100`}
          title={collaborator.active ? 'Desativar' : 'Ativar'}
        >
          {collaborator.active ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
        </button>
        <button
          onClick={onDelete}
          className="p-2 text-red-600 hover:bg-red-50 rounded-md"
          title="Excluir"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}