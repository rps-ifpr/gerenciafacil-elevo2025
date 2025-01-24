import { ServiceType } from '../../types';
import { ListItem } from '../common/ListItem';
import { ActionButtons } from '../common/ActionButtons';

interface ServiceTypeListProps {
  serviceTypes: ServiceType[];
  onEdit: (serviceType: ServiceType) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string) => void;
}

export function ServiceTypeList({ serviceTypes, onEdit, onDelete, onToggleStatus }: ServiceTypeListProps) {
  if (serviceTypes.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        Nenhum tipo de serviço cadastrado. Clique em "Novo Tipo de Serviço" para começar.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {serviceTypes.map((serviceType) => (
        <ListItem
          key={serviceType.id}
          title={serviceType.name}
          status={serviceType.active}
          actions={
            <ActionButtons
              onEdit={() => onEdit(serviceType)}
              onDelete={() => onDelete(serviceType.id)}
              onToggleStatus={() => onToggleStatus(serviceType.id)}
            />
          }
        />
      ))}
    </div>
  );
}