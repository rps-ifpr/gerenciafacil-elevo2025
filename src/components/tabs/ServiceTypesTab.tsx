import { useState, useEffect } from 'react';
import { ServiceType } from '../../types';
import { serviceTypeService } from '../../services/serviceTypeService';
import { ServiceTypeForm } from '../serviceTypes/ServiceTypeForm';
import { ServiceTypeList } from '../serviceTypes/ServiceTypeList';
import { ServiceTypeTest } from '../serviceTypes/ServiceTypeTest';
import { PageContainer } from '../common/PageContainer';
import { AddButton } from '../ui/AddButton';
import { LoadingSpinner } from '../ui/LoadingSpinner';

export function ServiceTypesTab() {
  const [serviceTypes, setServiceTypes] = useState<ServiceType[]>([]);
  const [editingType, setEditingType] = useState<ServiceType | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showTest, setShowTest] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadServiceTypes();
  }, []);

  const loadServiceTypes = async () => {
    try {
      setLoading(true);
      const types = await serviceTypeService.getAllServiceTypes();
      setServiceTypes(types);
      setError(null);
    } catch (err) {
      console.error('Erro ao carregar tipos de serviço:', err);
      setError('Erro ao carregar tipos de serviço. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (typeData: Omit<ServiceType, 'id' | 'active'>) => {
    try {
      if (editingType) {
        await serviceTypeService.updateServiceType(editingType.id, typeData);
      } else {
        await serviceTypeService.createServiceType(typeData);
      }
      setShowForm(false);
      setEditingType(null);
      await loadServiceTypes();
    } catch (error) {
      console.error('Erro ao salvar tipo de serviço:', error);
      setError('Erro ao salvar tipo de serviço. Tente novamente.');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este tipo de serviço?')) {
      try {
        await serviceTypeService.deleteServiceType(id);
        await loadServiceTypes();
      } catch (error) {
        console.error('Erro ao deletar tipo de serviço:', error);
        setError('Erro ao deletar tipo de serviço. Tente novamente.');
      }
    }
  };

  const handleToggleStatus = async (id: string) => {
    try {
      await serviceTypeService.toggleServiceTypeStatus(id);
      await loadServiceTypes();
    } catch (error) {
      console.error('Erro ao alternar status do tipo de serviço:', error);
      setError('Erro ao alternar status do tipo de serviço. Tente novamente.');
    }
  };

  return (
    <PageContainer
      title="Tipos de Serviço"
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
              label="Novo Tipo de Serviço"
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
          <ServiceTypeTest />
        </div>
      )}

      {showForm || editingType ? (
        <>
          <div className="mb-4 flex justify-between items-center">
            <h3 className="text-lg font-semibold">
              {editingType ? 'Editar Tipo de Serviço' : 'Novo Tipo de Serviço'}
            </h3>
            <button
              onClick={() => {
                setShowForm(false);
                setEditingType(null);
              }}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Cancelar
            </button>
          </div>
          <ServiceTypeForm
            onSubmit={handleSubmit}
            initialData={editingType || undefined}
            isEditing={!!editingType}
          />
        </>
      ) : (
        <>
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <LoadingSpinner />
            </div>
          ) : (
            <ServiceTypeList
              serviceTypes={serviceTypes}
              onEdit={setEditingType}
              onDelete={handleDelete}
              onToggleStatus={handleToggleStatus}
            />
          )}
        </>
      )}
    </PageContainer>
  );
}