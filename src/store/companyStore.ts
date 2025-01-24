import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Company } from '../types';

interface CompanyStore {
  companies: Company[];
  addCompany: (company: Company) => void;
  updateCompany: (id: string, updates: Partial<Company>) => void;
  deleteCompany: (id: string) => void;
  toggleCompanyStatus: (id: string) => void;
  validateCompany: (company: Partial<Company>, id?: string) => { valid: boolean; message?: string };
}

export const useCompanyStore = create<CompanyStore>()(
  persist(
    (set, get) => ({
      companies: [],
      
      addCompany: (company) =>
        set((state) => ({
          companies: [...state.companies, company],
        })),

      updateCompany: (id, updates) =>
        set((state) => ({
          companies: state.companies.map((comp) =>
            comp.id === id ? { ...comp, ...updates } : comp
          ),
        })),

      deleteCompany: (id) =>
        set((state) => ({
          companies: state.companies.filter((comp) => comp.id !== id),
        })),

      toggleCompanyStatus: (id) =>
        set((state) => ({
          companies: state.companies.map((comp) =>
            comp.id === id ? { ...comp, active: !comp.active } : comp
          ),
        })),

      validateCompany: (company, id) => {
        // Validações básicas
        if (!company.name?.trim()) {
          return { valid: false, message: 'Nome da empresa é obrigatório' };
        }

        if (!company.cnpj?.trim()) {
          return { valid: false, message: 'CNPJ é obrigatório' };
        }

        if (!company.email?.trim()) {
          return { valid: false, message: 'Email é obrigatório' };
        }

        if (!company.phone?.trim()) {
          return { valid: false, message: 'Telefone é obrigatório' };
        }

        if (!company.address?.trim()) {
          return { valid: false, message: 'Endereço é obrigatório' };
        }

        // Validação de CNPJ duplicado
        const companies = get().companies;
        const exists = companies.some(
          comp => comp.cnpj === company.cnpj && comp.id !== id
        );

        if (exists) {
          return { valid: false, message: 'Já existe uma empresa com este CNPJ' };
        }

        return { valid: true };
      }
    }),
    {
      name: 'company-storage',
    }
  )
);