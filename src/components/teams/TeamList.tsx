import { useState, useEffect } from 'react';
import { Team, Collaborator } from '../../types';
import { collaboratorService } from '../../services/collaboratorService';
import { ListItem } from '../common/ListItem';
import { ActionButtons } from '../common/ActionButtons';
import { LoadingSpinner } from '../ui/LoadingSpinner';

interface TeamListProps {
  teams: Team[];
  onEdit: (team: Team) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string) => void;
}

export function TeamList({ teams, onEdit, onDelete, onToggleStatus }: TeamListProps) {
  const [memberDetails, setMemberDetails] = useState<Record<string, Collaborator>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadMemberDetails();
  }, [teams]);

  const loadMemberDetails = async () => {
    try {
      setLoading(true);
      // Coleta todos os IDs de membros únicos de todos os grupos
      const memberIds = Array.from(new Set(teams.flatMap(team => team.members)));
      
      // Busca os detalhes de todos os colaboradores
      const collaborators = await collaboratorService.getAllCollaborators();
      
      // Cria um mapa de id -> detalhes do colaborador
      const detailsMap = collaborators.reduce((acc, collaborator) => {
        acc[collaborator.id] = collaborator;
        return acc;
      }, {} as Record<string, Collaborator>);

      setMemberDetails(detailsMap);
      setError(null);
    } catch (err) {
      console.error('Erro ao carregar detalhes dos membros:', err);
      setError('Erro ao carregar detalhes dos membros. Por favor, recarregue a página.');
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
          onClick={loadMemberDetails}
          className="ml-2 text-red-700 underline hover:no-underline"
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  if (teams.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        Nenhum grupo cadastrado. Clique em "Novo Grupo" para começar.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {teams.map((team) => (
        <ListItem
          key={team.id}
          title={team.name}
          status={team.active}
          actions={
            <ActionButtons
              onEdit={() => onEdit(team)}
              onDelete={() => onDelete(team.id)}
              onToggleStatus={() => onToggleStatus(team.id)}
              isActive={team.active}
            />
          }
        >
          <div className="mt-2">
            <h4 className="text-sm font-medium text-gray-700 mb-2">
              Membros ({team.members.length}):
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {team.members.map((memberId) => {
                const member = memberDetails[memberId];
                if (!member) return null;

                return (
                  <div 
                    key={memberId}
                    className="flex items-center gap-2 p-2 bg-gray-50 rounded-md"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {member.name}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {member.role}
                      </p>
                    </div>
                    <span 
                      className={`flex-shrink-0 w-2 h-2 rounded-full ${
                        member.active ? 'bg-green-500' : 'bg-red-500'
                      }`}
                      title={member.active ? 'Ativo' : 'Inativo'}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </ListItem>
      ))}
    </div>
  );
}