import { useState, useEffect } from 'react';
import { Collaborator } from '../../types';
import { collaboratorService } from '../../services/collaboratorService';
import { CollaboratorForm } from '../collaborators/CollaboratorForm';
import { CollaboratorList } from '../collaborators/CollaboratorList';
import { CollaboratorTest } from '../collaborators/CollaboratorTest';
import { PageContainer } from '../common/PageContainer';
import { AddButton } from '../ui/AddButton';
import { LoadingSpinner } from '../ui/LoadingSpinner';

export function CollaboratorsTab() {
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [editingCollaborator, setEditingCollaborator] = useState<Collaborator | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showTest, setShowTest] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadCollaborators();
  }, []);

  const loadCollaborators = async () => {
    try {
      setLoading(true);
      const colabs = await collaboratorService.getAllCollaborators();
      setCollaborators(colabs);
      setError(null);
    } catch (err) {
      console.error('Erro ao carregar prestadores:', err);
      setError('Erro ao carregar prestadores. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (collaboratorData: Omit<Collaborator, 'id' | 'active'>) => {
    try {
      if (editingCollaborator) {
        await collaboratorService.updateCollaborator(editingCollaborator.id, collaboratorData);
      } else {
        await collaboratorService.createCollaborator(collaboratorData);
      }
      setShowForm(false);
      setEditingCollaborator(null);
      await loadCollaborators();
    } catch (error) {
      console.error('Erro ao salvar prestador:', error);
      setError('Erro ao salvar prestador. Tente novamente.');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este prestador?')) {
      try {
        await collaboratorService.deleteCollaborator(id);
        await loadCollaborators();
      } catch (error) {
        console.error('Erro ao deletar prestador:', error);
        setError('Erro ao deletar prestador. Tente novamente.');
      }
    }
  };

  const handleToggleStatus = async (id: string) => {
    try {
      await collaboratorService.toggleCollaboratorStatus(id);
      await loadCollaborators();
    } catch (error) {
      console.error('Erro ao alternar status do prestador:', error);
      setError('Erro ao alternar status do prestador. Tente novamente.');
    }
  };

  return (
    <PageContainer
      title="Prestadores"
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
              label="Novo Prestador"
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
          <CollaboratorTest />
        </div>
      )}

      {showForm || editingCollaborator ? (
        <>
          <div className="mb-4 flex justify-between items-center">
            <h3 className="text-lg font-semibold">
              {editingCollaborator ? 'Editar Prestador' : 'Novo Prestador'}
            </h3>
            <button
              onClick={() => {
                setShowForm(false);
                setEditingCollaborator(null);
              }}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Cancelar
            </button>
          </div>
          <CollaboratorForm
            onSubmit={handleSubmit}
            initialData={editingCollaborator || undefined}
            isEditing={!!editingCollaborator}
          />
        </>
      ) : (
        <>
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <LoadingSpinner />
            </div>
          ) : (
            <CollaboratorList
              collaborators={collaborators}
              onEdit={setEditingCollaborator}
              onDelete={handleDelete}
              onToggleStatus={handleToggleStatus}
            />
          )}
        </>
      )}
    </PageContainer>
  );
}