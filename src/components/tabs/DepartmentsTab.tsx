import { useState, useEffect } from 'react';
import { Department } from '../../types';
import { departmentService } from '../../services/departmentService';
import { DepartmentForm } from '../departments/DepartmentForm';
import { DepartmentList } from '../departments/DepartmentList';
import { DepartmentTest } from '../departments/DepartmentTest';
import { PageContainer } from '../common/PageContainer';
import { AddButton } from '../ui/AddButton';
import { LoadingSpinner } from '../ui/LoadingSpinner';

export function DepartmentsTab() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showTest, setShowTest] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Carrega os departamentos ao montar o componente
  useEffect(() => {
    loadDepartments();
  }, []);

  const loadDepartments = async () => {
    try {
      setLoading(true);
      const deps = await departmentService.getAllDepartments();
      setDepartments(deps);
      setError(null);
    } catch (err) {
      console.error('Erro ao carregar departamentos:', err);
      setError('Erro ao carregar departamentos. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (departmentData: Omit<Department, 'id' | 'active'>) => {
    try {
      if (editingDepartment) {
        await departmentService.updateDepartment(editingDepartment.id, departmentData);
      } else {
        await departmentService.createDepartment(departmentData);
      }
      setShowForm(false);
      setEditingDepartment(null);
      // Recarrega a lista após o cadastro/edição
      await loadDepartments();
    } catch (error) {
      console.error('Erro ao salvar departamento:', error);
      setError('Erro ao salvar departamento. Tente novamente.');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este departamento?')) {
      try {
        await departmentService.deleteDepartment(id);
        // Recarrega a lista após a exclusão
        await loadDepartments();
      } catch (error) {
        console.error('Erro ao deletar departamento:', error);
        setError('Erro ao deletar departamento. Tente novamente.');
      }
    }
  };

  const handleToggleStatus = async (id: string) => {
    try {
      await departmentService.toggleDepartmentStatus(id);
      // Recarrega a lista após alternar o status
      await loadDepartments();
    } catch (error) {
      console.error('Erro ao alternar status do departamento:', error);
      setError('Erro ao alternar status do departamento. Tente novamente.');
    }
  };

  return (
    <PageContainer
      title="Departamentos"
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
              label="Novo Departamento"
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
          <DepartmentTest />
        </div>
      )}

      {showForm || editingDepartment ? (
        <>
          <div className="mb-4 flex justify-between items-center">
            <h3 className="text-lg font-semibold">
              {editingDepartment ? 'Editar Departamento' : 'Novo Departamento'}
            </h3>
            <button
              onClick={() => {
                setShowForm(false);
                setEditingDepartment(null);
              }}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Cancelar
            </button>
          </div>
          <DepartmentForm
            onSubmit={handleSubmit}
            initialData={editingDepartment || undefined}
            isEditing={!!editingDepartment}
          />
        </>
      ) : (
        <>
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <LoadingSpinner />
            </div>
          ) : (
            <DepartmentList
              departments={departments}
              onEdit={setEditingDepartment}
              onDelete={handleDelete}
              onToggleStatus={handleToggleStatus}
            />
          )}
        </>
      )}
    </PageContainer>
  );
}