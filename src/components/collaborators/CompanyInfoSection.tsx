import { useState, useEffect } from 'react';
import { companyService } from '../../services/companyService';
import { departmentService } from '../../services/departmentService';
import { serviceTypeService } from '../../services/serviceTypeService';
import { FormField } from '../common/FormField';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { Company, Department, ServiceType } from '../../types';

interface CompanyInfoSectionProps {
  formData: {
    companyId: string;
    department: string;
    serviceType: string;
    role: string;
  };
  onChange: (updates: Partial<CompanyInfoSectionProps['formData']>) => void;
}

export function CompanyInfoSection({ formData, onChange }: CompanyInfoSectionProps) {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [serviceTypes, setServiceTypes] = useState<ServiceType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [comps, deps, types] = await Promise.all([
        companyService.getAllCompanies(),
        departmentService.getAllDepartments(),
        serviceTypeService.getAllServiceTypes()
      ]);
      
      setCompanies(comps);
      setDepartments(deps);
      setServiceTypes(types);
      setError(null);
    } catch (err) {
      console.error('Erro ao carregar dados:', err);
      setError('Erro ao carregar dados. Por favor, tente novamente.');
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

  const activeCompanies = companies.filter(c => c.active);
  const activeDepartments = departments.filter(d => d.active);
  const activeServiceTypes = serviceTypes.filter(t => t.active);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <FormField label="Empresa" required>
        <select
          value={formData.companyId}
          onChange={(e) => onChange({ companyId: e.target.value })}
          className="w-full rounded-md border border-gray-300 px-3 py-2"
          required
        >
          <option value="">Selecione a Empresa</option>
          {activeCompanies.map((company) => (
            <option key={company.id} value={company.id}>
              {company.name}
            </option>
          ))}
        </select>
      </FormField>

      <FormField label="Departamento" required>
        <select
          value={formData.department}
          onChange={(e) => onChange({ department: e.target.value })}
          className="w-full rounded-md border border-gray-300 px-3 py-2"
          required
        >
          <option value="">Selecione o Departamento</option>
          {activeDepartments.map((department) => (
            <option key={department.id} value={department.id}>
              {department.name}
            </option>
          ))}
        </select>
      </FormField>

      <FormField label="Tipo de Serviço" required>
        <select
          value={formData.serviceType}
          onChange={(e) => onChange({ serviceType: e.target.value })}
          className="w-full rounded-md border border-gray-300 px-3 py-2"
          required
        >
          <option value="">Selecione o Tipo de Serviço</option>
          {activeServiceTypes.map((type) => (
            <option key={type.id} value={type.id}>
              {type.name}
            </option>
          ))}
        </select>
      </FormField>

      <FormField label="Cargo/Função" required>
        <input
          type="text"
          value={formData.role}
          onChange={(e) => onChange({ role: e.target.value.toUpperCase() })}
          placeholder="Cargo/Função"
          className="w-full rounded-md border border-gray-300 px-3 py-2"
          required
        />
      </FormField>
    </div>
  );
}