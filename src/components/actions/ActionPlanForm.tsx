import { useState, useEffect } from 'react';
import { Plus, Edit2 } from 'lucide-react';
import { ActionPlan } from '../../types';
import { FormField } from '../common/FormField';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { collaboratorService } from '../../services/collaboratorService';
import { teamService } from '../../services/teamService';

interface ActionPlanFormProps {
  onSubmit: (actionPlan: Omit<ActionPlan, 'id'>) => void;
  initialData?: ActionPlan;
  isEditing?: boolean;
}

export function ActionPlanForm({ onSubmit, initialData, isEditing }: ActionPlanFormProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [availableCoordinators, setAvailableCoordinators] = useState<any[]>([]);
  const [availableTeams, setAvailableTeams] = useState<any[]>([]);
  
  const [formData, setFormData] = useState({
    name: '',
    startDate: '',
    endDate: '',
    coordinatorId: '',
    teamIds: [] as string[],
    status: 'not_started' as ActionPlanStatus
  });

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        startDate: initialData.startDate.split('T')[0],
        endDate: initialData.endDate.split('T')[0],
        coordinatorId: initialData.coordinatorId,
        teamIds: initialData.teamIds,
        status: initialData.status
      });
    }
  }, [initialData]);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Carrega prestadores e grupos em paralelo
      const [collaborators, teams] = await Promise.all([
        collaboratorService.getAllCollaborators(),
        teamService.getAllTeams()
      ]);

      // Filtra apenas coordenadores e gerentes ativos
      const coordinators = collaborators.filter(c => {
        if (!c.active) return false;
        const role = c.role.toLowerCase();
        return role.includes('coordenador') || role.includes('gerente');
      }).sort((a, b) => a.name.localeCompare(b.name));

      // Filtra apenas grupos ativos
      const activeTeams = teams
        .filter(t => t.active)
        .sort((a, b) => a.name.localeCompare(b.name));

      setAvailableCoordinators(coordinators);
      setAvailableTeams(activeTeams);
      setError(null);

      if (coordinators.length === 0) {
        setError('Nenhum coordenador/gerente ativo encontrado. Cadastre um prestador com cargo de coordenador ou gerente.');
      }

    } catch (err) {
      console.error('Erro ao carregar dados:', err);
      setError('Erro ao carregar dados. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validações básicas
    if (!formData.name.trim()) {
      setError('Nome da ação é obrigatório');
      return;
    }

    if (!formData.coordinatorId) {
      setError('Selecione um responsável');
      return;
    }

    if (formData.teamIds.length === 0) {
      setError('Selecione pelo menos um grupo');
      return;
    }

    if (!formData.startDate || !formData.endDate) {
      setError('Datas de início e término são obrigatórias');
      return;
    }

    const startDate = new Date(formData.startDate);
    const endDate = new Date(formData.endDate);
    if (endDate < startDate) {
      setError('Data de término deve ser posterior à data de início');
      return;
    }

    // Adiciona horário às datas
    const data = {
      ...formData,
      startDate: `${formData.startDate}T00:00`,
      endDate: `${formData.endDate}T23:59`,
      status: formData.status
    };
    
    onSubmit(data);
    
    if (!isEditing) {
      setFormData({
        name: '',
        startDate: '',
        endDate: '',
        coordinatorId: '',
        teamIds: [],
        status: 'not_started'
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-md">
          {error}
        </div>
      )}

      <FormField label="Nome da Ação" required>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value.toUpperCase() }))}
          placeholder="Digite o nome da ação"
          className="w-full rounded-md border border-gray-300 px-3 py-2"
          required
        />
      </FormField>

      <FormField label="Responsável" required>
        <select
          value={formData.coordinatorId}
          onChange={(e) => setFormData(prev => ({ ...prev, coordinatorId: e.target.value }))}
          className="w-full rounded-md border border-gray-300 px-3 py-2"
          required
        >
          <option value="">Selecione um responsável</option>
          {availableCoordinators.map(coordinator => (
            <option key={coordinator.id} value={coordinator.id}>
              {coordinator.name} ({coordinator.role})
            </option>
          ))}
        </select>
      </FormField>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField label="Data de Início" required>
          <input
            type="date"
            value={formData.startDate}
            onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
            className="w-full rounded-md border border-gray-300 px-3 py-2"
            required
          />
        </FormField>

        <FormField label="Data de Término" required>
          <input
            type="date"
            value={formData.endDate}
            min={formData.startDate}
            onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
            className="w-full rounded-md border border-gray-300 px-3 py-2"
            required
          />
        </FormField>
      </div>

      <FormField label="Grupos Envolvidos" required>
        <div className="border rounded-lg p-4 space-y-2">
          {availableTeams.length === 0 ? (
            <p className="text-gray-500 text-sm">
              Nenhum grupo ativo encontrado. Cadastre grupos antes de criar uma ação.
            </p>
          ) : (
            availableTeams.map(team => (
              <label key={team.id} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.teamIds.includes(team.id)}
                  onChange={(e) => {
                    const newTeamIds = e.target.checked
                      ? [...formData.teamIds, team.id]
                      : formData.teamIds.filter(id => id !== team.id);
                    setFormData(prev => ({ ...prev, teamIds: newTeamIds }));
                  }}
                  className="rounded border-gray-300"
                />
                <div>
                  <span className="font-medium">{team.name}</span>
                  <span className="text-sm text-gray-500 ml-2">
                    ({team.members.length} membros)
                  </span>
                </div>
              </label>
            ))
          )}
        </div>
      </FormField>

      <button
        type="submit"
        className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500"
      >
        {isEditing ? <Edit2 className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
        {isEditing ? "Atualizar Ação" : "Adicionar Ação"}
      </button>
    </form>
  );
}