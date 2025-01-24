import { useState } from 'react';
import { Collaborator } from '../../types';
import { useStore } from '../../store/useStore';
import { CollaboratorForm } from './CollaboratorForm';
import { CollaboratorListItem } from './CollaboratorListItem';

export function CollaboratorsList() {
  const { collaborators, addCollaborator, updateCollaborator, deleteCollaborator } = useStore();
  const [editingCollaborator, setEditingCollaborator] = useState<Collaborator | null>(null);

  const handleSubmit = (collaboratorData: Omit<Collaborator, 'id'>) => {
    if (editingCollaborator) {
      updateCollaborator(editingCollaborator.id, collaboratorData);
      setEditingCollaborator(null);
    } else {
      addCollaborator({
        id: crypto.randomUUID(),
        ...collaboratorData,
      });
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este prestador?')) {
      deleteCollaborator(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white shadow-sm rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">
          {editingCollaborator ? 'Editar Prestador' : 'Novo Prestador'}
        </h2>

        <CollaboratorForm
          onSubmit={handleSubmit}
          initialData={editingCollaborator || undefined}
          isEditing={!!editingCollaborator}
        />

        {collaborators.length > 0 && (
          <div className="mt-8 space-y-4">
            <h3 className="text-lg font-semibold">Prestadores Cadastrados</h3>
            <div className="space-y-2">
              {collaborators.map((collaborator) => (
                <CollaboratorListItem
                  key={collaborator.id}
                  collaborator={collaborator}
                  onEdit={() => setEditingCollaborator(collaborator)}
                  onDelete={() => handleDelete(collaborator.id)}
                  onToggleStatus={() => updateCollaborator(collaborator.id, { active: !collaborator.active })}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}