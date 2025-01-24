import { Company } from '../../types';
import { ListItem } from '../common/ListItem';
import { ActionButtons } from '../common/ActionButtons';

interface CompanyListProps {
  companies: Company[];
  onEdit: (company: Company) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string) => void;
}

export function CompanyList({ companies, onEdit, onDelete, onToggleStatus }: CompanyListProps) {
  if (companies.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        Nenhuma empresa cadastrada. Clique em "Nova Empresa" para começar.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {companies.map((company) => (
        <ListItem
          key={company.id}
          title={company.name}
          subtitle={`CNPJ: ${company.cnpj}`}
          status={company.active}
          actions={
            <ActionButtons
              onEdit={() => onEdit(company)}
              onDelete={() => onDelete(company.id)}
              onToggleStatus={() => onToggleStatus(company.id)}
            />
          }
        >
          <div className="text-sm text-gray-500 space-y-1">
            {company.email && <p>Email: {company.email}</p>}
            {company.phone && <p>Telefone: {company.phone}</p>}
            <p>Contrato: {new Date(company.contractStart).toLocaleDateString()} - {new Date(company.contractEnd).toLocaleDateString()}</p>
          </div>
        </ListItem>
      ))}
    </div>
  );
}