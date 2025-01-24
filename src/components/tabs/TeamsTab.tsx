import { useState, useEffect } from 'react';
import { Team } from '../../types';
import { teamService } from '../../services/teamService';
import { TeamForm } from '../teams/TeamForm';
import { TeamList } from '../teams/TeamList';
import { TeamTest } from '../teams/TeamTest';
import { PageContainer } from '../common/PageContainer';
import { AddButton } from '../ui/AddButton';
import { LoadingSpinner } from '../ui/LoadingSpinner';

export function TeamsTab() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showTest, setShowTest] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadTeams();
  }, []);

  const loadTeams = async () => {
    try {
      setLoading(true);
      const loadedTeams = await teamService.getAllTeams();
      setTeams(loadedTeams);
      setError(null);
    } catch (err) {
      console.error('Erro ao carregar grupos:', err);
      setError('Erro ao carregar grupos. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (teamData: Omit<Team, 'id' | 'active'>) => {
    try {
      if (editingTeam) {
        await teamService.updateTeam(editingTeam.id, teamData);
      } else {
        await teamService.createTeam(teamData);
      }
      setShowForm(false);
      setEditingTeam(null);
      await loadTeams();
    } catch (error) {
      console.error('Erro ao salvar grupo:', error);
      setError('Erro ao salvar grupo. Tente novamente.');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este grupo?')) {
      try {
        await teamService.deleteTeam(id);
        await loadTeams();
      } catch (error) {
        console.error('Erro ao deletar grupo:', error);
        setError('Erro ao deletar grupo. Tente novamente.');
      }
    }
  };

  const handleToggleStatus = async (id: string) => {
    try {
      await teamService.toggleTeamStatus(id);
      await loadTeams();
    } catch (error) {
      console.error('Erro ao alternar status do grupo:', error);
      setError('Erro ao alternar status do grupo. Tente novamente.');
    }
  };

  return (
    <PageContainer
      title="Grupos"
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
              label="Novo Grupo"
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
          <TeamTest />
        </div>
      )}

      {showForm || editingTeam ? (
        <>
          <div className="mb-4 flex justify-between items-center">
            <h3 className="text-lg font-semibold">
              {editingTeam ? 'Editar Grupo' : 'Novo Grupo'}
            </h3>
            <button
              onClick={() => {
                setShowForm(false);
                setEditingTeam(null);
              }}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Cancelar
            </button>
          </div>
          <TeamForm
            onSubmit={handleSubmit}
            initialData={editingTeam || undefined}
            isEditing={!!editingTeam}
          />
        </>
      ) : (
        <>
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <LoadingSpinner />
            </div>
          ) : (
            <TeamList
              teams={teams}
              onEdit={setEditingTeam}
              onDelete={handleDelete}
              onToggleStatus={handleToggleStatus}
            />
          )}
        </>
      )}
    </PageContainer>
  );
}