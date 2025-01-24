import { useState, useEffect } from 'react';
import { Company } from '../../types';
import { companyService } from '../../services/companyService';
import { CompanyForm } from '../companies/CompanyForm';
import { CompanyList } from '../companies/CompanyList';
import { CompanyTest } from '../companies/CompanyTest';
import { PageContainer } from '../common/PageContainer';
import { AddButton } from '../ui/AddButton';
import { LoadingSpinner } from '../ui/LoadingSpinner';

export function CompaniesTab() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showTest, setShowTest] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadCompanies();
  }, []);

  const loadCompanies = async () => {
    try {
      setLoading(true);
      const comps = await companyService.getAllCompanies();
      setCompanies(comps);
      setError(null);
    } catch (err) {
      console.error('Erro ao carregar empresas:', err);
      setError('Erro ao carregar empresas. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (companyData: Omit<Company, 'id' | 'active'>) => {
    try {
      if (editingCompany) {
        await companyService.updateCompany(editingCompany.id, companyData);
      } else {
        await companyService.createCompany(companyData);
      }
      setShowForm(false);
      setEditingCompany(null);
      await loadCompanies();
    } catch (error) {
      console.error('Erro ao salvar empresa:', error);
      setError('Erro ao salvar empresa. Tente novamente.');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta empresa?')) {
      try {
        await companyService.deleteCompany(id);
        await loadCompanies();
      } catch (error) {
        console.error('Erro ao deletar empresa:', error);
        setError('Erro ao deletar empresa. Tente novamente.');
      }
    }
  };

  const handleToggleStatus = async (id: string) => {
    try {
      await companyService.toggleCompanyStatus(id);
      await loadCompanies();
    } catch (error) {
      console.error('Erro ao alternar status da empresa:', error);
      setError('Erro ao alternar status da empresa. Tente novamente.');
    }
  };

  return (
    <PageContainer
      title="Empresas"
      action={
        !showForm && (
          <div className="flex gap-4">
            <button
              onClick={() => setShowTest(!showTest)}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              {showTest ? 'Ocultar Testes' : 'Mostrar Testes'}
            </button>
            <AddButton
              onClick={() => setShowForm(true)}
              label="Nova Empresa"
            />
          </div>
        )
      }
    >
      {error && (
        <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-md">
          {error}
        </div>
      )}

      {showTest && (
        <div className="mb-8">
          <CompanyTest />
        </div>
      )}

      {showForm || editingCompany ? (
        <>
          <div className="mb-4 flex justify-between items-center">
            <h3 className="text-lg font-semibold">
              {editingCompany ? 'Editar Empresa' : 'Nova Empresa'}
            </h3>
            <button
              onClick={() => {
                setShowForm(false);
                setEditingCompany(null);
              }}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Cancelar
            </button>
          </div>
          <CompanyForm
            onSubmit={handleSubmit}
            initialData={editingCompany || undefined}
            isEditing={!!editingCompany}
          />
        </>
      ) : (
        <>
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <LoadingSpinner />
            </div>
          ) : (
            <CompanyList
              companies={companies}
              onEdit={setEditingCompany}
              onDelete={handleDelete}
              onToggleStatus={handleToggleStatus}
            />
          )}
        </>
      )}
    </PageContainer>
  );
}