import { useState, useEffect } from 'react';
import { Plus, Edit2 } from 'lucide-react';
import { Task } from '../../types';
import { useActionPlanStore } from '../../store/actionPlanStore';
import { FormField } from '../common/FormField';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { collaboratorService } from '../../services/collaboratorService';
import { teamService } from '../../services/teamService';
import { statusLabels } from '../../utils/taskStatusConfig';

interface TaskFormProps {
  onSubmit: (task: Omit<Task, 'id' | 'active' | 'createdAt' | 'updatedAt'>) => void;
  initialData?: Task;
  isEditing?: boolean;
}

export function TaskForm({ onSubmit, initialData, isEditing }: TaskFormProps) {
  const { actionPlans } = useActionPlanStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [availableAssignees, setAvailableAssignees] = useState<any[]>([]);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    actionPlanId: '',
    assigneeId: '',
    startDate: '',
    endDate: '',
    status: 'not_started' as Task['status']
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        description: initialData.description || '',
        actionPlanId: initialData.actionPlanId,
        assigneeId: initialData.assigneeId,
        startDate: initialData.startDate.split('T')[0],
        endDate: initialData.endDate.split('T')[0],
        status: initialData.status
      });
    }
  }, [initialData]);

  // Carrega os prestadores disponíveis quando uma ação é selecionada
  useEffect(() => {
    if (formData.actionPlanId) {
      loadAssignees();
    }
  }, [formData.actionPlanId]);

  const loadAssignees = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Busca a ação selecionada
      const selectedPlan = actionPlans.find(plan => plan.id === formData.actionPlanId);
      if (!selectedPlan) {
        throw new Error('Ação não encontrada');
      }

      // Busca os grupos da ação
      const teams = await teamService.getAllTeams();
      const planTeams = teams.filter(team => selectedPlan.teamIds.includes(team.id));
      
      // Coleta todos os IDs de membros dos grupos
      const memberIds = new Set<string>();
      planTeams.forEach(team => {
        team.members.forEach(memberId => memberIds.add(memberId));
      });

      // Busca os detalhes dos prestadores
      const collaborators = await collaboratorService.getAllCollaborators();
      const assignees = collaborators
        .filter(c => c.active && memberIds.has(c.id))
        .sort((a, b) => a.name.localeCompare(b.name));

      setAvailableAssignees(assignees);

      // Se o prestador selecionado não está mais disponível, limpa a seleção
      if (formData.assigneeId && !assignees.find(a => a.id === formData.assigneeId)) {
        setFormData(prev => ({ ...prev, assigneeId: '' }));
      }

    } catch (err) {
      console.error('Erro ao carregar prestadores:', err);
      setError('Erro ao carregar prestadores. Por favor, tente novamente.');
      setAvailableAssignees([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validações básicas
    if (!formData.name.trim()) {
      setError('Nome da atividade é obrigatório');
      return;
    }

    if (!formData.actionPlanId) {
      setError('Selecione uma ação');
      return;
    }

    if (!formData.assigneeId) {
      setError('Selecione um prestador responsável');
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
    };
    
    onSubmit(data);
    
    if (!isEditing) {
      setFormData({
        name: '',
        description: '',
        actionPlanId: '',
        assigneeId: '',
        startDate: '',
        endDate: '',
        status: 'not_started'
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-md">
          {error}
        </div>
      )}

      <FormField label="Nome da Atividade" required>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value.toUpperCase() }))}
          placeholder="Digite o nome da atividade"
          className="w-full rounded-md border border-gray-300 px-3 py-2"
          required
        />
      </FormField>

      <FormField label="Descrição">
        <textarea
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          placeholder="Descrição da atividade (opcional)"
          className="w-full rounded-md border border-gray-300 px-3 py-2 h-24"
        />
      </FormField>

      {isEditing && (
        <FormField label="Status" required>
          <select
            value={formData.status}
            onChange={(e) => setFormData(prev => ({ 
              ...prev, 
              status: e.target.value as Task['status'] 
            }))}
            className="w-full rounded-md border border-gray-300 px-3 py-2"
            required
          >
            {Object.entries(statusLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </FormField>
      )}

      <FormField label="Ação" required>
        <select
          value={formData.actionPlanId}
          onChange={(e) => {
            const planId = e.target.value;
            setFormData(prev => ({
              ...prev,
              actionPlanId: planId,
              assigneeId: '' // Limpa o responsável ao mudar de ação
            }));
          }}
          className="w-full rounded-md border border-gray-300 px-3 py-2"
          required
        >
          <option value="">Selecione uma Ação</option>
          {actionPlans
            .filter(plan => plan.active)
            .map(plan => (
              <option key={plan.id} value={plan.id}>
                {plan.name}
              </option>
            ))}
        </select>
      </FormField>

      {formData.actionPlanId && (
        <FormField label="Responsável" required>
          {loading ? (
            <div className="flex justify-center py-2">
              <LoadingSpinner />
            </div>
          ) : (
            <>
              <select
                value={formData.assigneeId}
                onChange={(e) => setFormData(prev => ({ ...prev, assigneeId: e.target.value }))}
                className="w-full rounded-md border border-gray-300 px-3 py-2"
                required
              >
                <option value="">Selecione um responsável</option>
                {availableAssignees.map(assignee => (
                  <option key={assignee.id} value={assignee.id}>
                    {assignee.name} - {assignee.role}
                  </option>
                ))}
              </select>
              {availableAssignees.length === 0 && (
                <p className="mt-2 text-sm text-gray-500">
                  Nenhum prestador disponível nos grupos desta ação.
                </p>
              )}
            </>
          )}
        </FormField>
      )}

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

      <button
        type="submit"
        className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500"
      >
        {isEditing ? <Edit2 className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
        {isEditing ? "Atualizar Atividade" : "Adicionar Atividade"}
      </button>
    </form>
  );
}