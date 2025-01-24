import { useState, useEffect } from 'react';
import { Users, UserCircle } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { useTeamStore } from '../../store/teamStore';
import { FormField } from '../common/FormField';
import { LoadingSpinner } from '../ui/LoadingSpinner';

interface ParticipantSelectorProps {
  selected: {
    collaboratorIds: string[];
    teamIds: string[];
  };
  onChange: (selected: ParticipantSelectorProps['selected']) => void;
}

export function ParticipantSelector({ selected, onChange }: ParticipantSelectorProps) {
  const { collaborators } = useStore();
  const { teams } = useTeamStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedTeams, setExpandedTeams] = useState<Record<string, boolean>>({});

  // Filtra e remove duplicatas dos prestadores ativos
  const activeCollaborators = collaborators
    .filter(c => c.active)
    .reduce((unique, collaborator) => {
      if (!unique.some(u => u.id === collaborator.id)) {
        unique.push(collaborator);
      }
      return unique;
    }, [] as typeof collaborators)
    .sort((a, b) => a.name.localeCompare(b.name));

  // Filtra e remove duplicatas dos grupos ativos
  const activeTeams = teams
    .filter(t => t.active)
    .reduce((unique, team) => {
      if (!unique.some(u => u.id === team.id)) {
        unique.push(team);
      }
      return unique;
    }, [] as typeof teams)
    .sort((a, b) => a.name.localeCompare(b.name));

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        if (activeCollaborators.length > 0 || activeTeams.length > 0) {
          setError(null);
        } else {
          setError('Nenhum participante disponível. Cadastre prestadores ou grupos primeiro.');
        }
      } catch (err) {
        console.error('Erro ao carregar dados:', err);
        setError('Erro ao carregar dados. Por favor, tente novamente.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [activeCollaborators.length, activeTeams.length]);

  const toggleTeamExpansion = (teamId: string) => {
    setExpandedTeams(prev => ({
      ...prev,
      [teamId]: !prev[teamId]
    }));
  };

  const handleTeamMemberToggle = (teamId: string, memberId: string) => {
    const newCollaboratorIds = selected.collaboratorIds.includes(memberId)
      ? selected.collaboratorIds.filter(id => id !== memberId)
      : [...selected.collaboratorIds, memberId];

    onChange({
      ...selected,
      collaboratorIds: newCollaboratorIds
    });
  };

  const handleTeamToggle = (teamId: string) => {
    const team = teams.find(t => t.id === teamId);
    if (!team) return;

    const isTeamSelected = selected.teamIds.includes(teamId);
    let newTeamIds = [...selected.teamIds];
    let newCollaboratorIds = [...selected.collaboratorIds];

    if (isTeamSelected) {
      // Remove o grupo e seus membros
      newTeamIds = newTeamIds.filter(id => id !== teamId);
      newCollaboratorIds = newCollaboratorIds.filter(id => !team.members.includes(id));
    } else {
      // Adiciona o grupo e seus membros
      newTeamIds.push(teamId);
      team.members.forEach(memberId => {
        if (!newCollaboratorIds.includes(memberId)) {
          newCollaboratorIds.push(memberId);
        }
      });
    }

    onChange({
      teamIds: newTeamIds,
      collaboratorIds: newCollaboratorIds
    });
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
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium flex items-center gap-2">
        <Users className="w-5 h-5" />
        Participantes
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Prestadores Individuais */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-gray-700">
            <UserCircle className="w-4 h-4" />
            <h4 className="font-medium">Prestadores</h4>
          </div>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {activeCollaborators.length === 0 ? (
              <p className="text-sm text-gray-500">Nenhum prestador disponível</p>
            ) : (
              activeCollaborators.map(collaborator => (
                <label key={`collaborator-${collaborator.id}`} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selected.collaboratorIds.includes(collaborator.id)}
                    onChange={() => {
                      const newIds = selected.collaboratorIds.includes(collaborator.id)
                        ? selected.collaboratorIds.filter(id => id !== collaborator.id)
                        : [...selected.collaboratorIds, collaborator.id];
                      onChange({ ...selected, collaboratorIds: newIds });
                    }}
                    className="rounded border-gray-300"
                  />
                  <div className="text-sm">
                    <span className="font-medium">{collaborator.name}</span>
                    <span className="text-gray-500 text-xs block">{collaborator.role}</span>
                  </div>
                </label>
              ))
            )}
          </div>
        </div>

        {/* Grupos e seus Membros */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-gray-700">
            <Users className="w-4 h-4" />
            <h4 className="font-medium">Grupos</h4>
          </div>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {activeTeams.length === 0 ? (
              <p className="text-sm text-gray-500">Nenhum grupo disponível</p>
            ) : (
              activeTeams.map(team => (
                <div key={`team-${team.id}`} className="border rounded-lg p-2">
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={selected.teamIds.includes(team.id)}
                        onChange={() => handleTeamToggle(team.id)}
                        className="rounded border-gray-300"
                      />
                      <div className="text-sm">
                        <span className="font-medium">{team.name}</span>
                        <span className="text-gray-500 text-xs block">
                          {team.members.length} membros
                        </span>
                      </div>
                    </label>
                    <button
                      type="button"
                      onClick={() => toggleTeamExpansion(team.id)}
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      {expandedTeams[team.id] ? 'Ocultar' : 'Ver membros'}
                    </button>
                  </div>

                  {expandedTeams[team.id] && (
                    <div className="mt-2 pl-6 space-y-2 border-t pt-2">
                      {team.members.map(memberId => {
                        const member = collaborators.find(c => c.id === memberId);
                        if (!member) return null;

                        return (
                          <label
                            key={`team-${team.id}-member-${memberId}`}
                            className="flex items-center gap-2"
                          >
                            <input
                              type="checkbox"
                              checked={selected.collaboratorIds.includes(memberId)}
                              onChange={() => handleTeamMemberToggle(team.id, memberId)}
                              className="rounded border-gray-300"
                            />
                            <div className="text-sm">
                              <span className="font-medium">{member.name}</span>
                              <span className="text-gray-500 text-xs block">{member.role}</span>
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}