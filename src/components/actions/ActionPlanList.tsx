import { ActionButtons } from '../common/ActionButtons';
import { ActionPlan } from '../../types';
import { useStore } from '../../store/useStore';
import { useTeamStore } from '../../store/teamStore';
import { ListItem } from '../common/ListItem';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Clock, CheckCircle2, AlertTriangle, XCircle, RefreshCcw } from 'lucide-react';

interface ActionPlanListProps {
  actionPlans: ActionPlan[];
  onEdit: (plan: ActionPlan) => void;
  onDelete: (id: string) => void;
}

export function ActionPlanList({ actionPlans, onEdit, onDelete }: ActionPlanListProps) {
  const { collaborators } = useStore();
  const { teams } = useTeamStore();

  // Configuração de status com fallback para 'not_started'
  const statusConfig = {
    not_started: {
      icon: Clock,
      label: 'Não Iniciado',
      color: 'bg-gray-100 text-gray-800'
    },
    in_progress: {
      icon: RefreshCcw,
      label: 'Em Andamento',
      color: 'bg-blue-100 text-blue-800'
    },
    completed: {
      icon: CheckCircle2,
      label: 'Concluído',
      color: 'bg-green-100 text-green-800'
    },
    delayed: {
      icon: AlertTriangle,
      label: 'Atrasado',
      color: 'bg-orange-100 text-orange-800'
    },
    cancelled: {
      icon: XCircle,
      label: 'Cancelado',
      color: 'bg-red-100 text-red-800'
    }
  };

  if (!actionPlans?.length) {
    return (
      <div className="text-center text-gray-500 py-8">
        Nenhuma ação/plano cadastrado. Clique em "Nova Ação/Plano" para começar.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {actionPlans.map((plan) => {
        const coordinator = collaborators.find(c => c.id === plan.coordinatorId);
        const planTeams = teams.filter(t => plan.teamIds.includes(t.id));
        
        // Garante que sempre teremos uma configuração válida de status
        const status = plan.status || 'not_started';
        const currentStatusConfig = statusConfig[status] || statusConfig.not_started;
        const StatusIcon = currentStatusConfig.icon;
        
        return (
          <div key={`plan-${plan.id}`} className="flex items-start justify-between p-4 border rounded-lg shadow-sm hover:shadow-md transition-all">
            <div className="space-y-3 flex-1">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-semibold text-gray-900">{plan.name}</h3>
                  <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${currentStatusConfig.color}`}>
                    <StatusIcon className="w-4 h-4" />
                    <span className="text-sm font-medium">{currentStatusConfig.label}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                <div>
                  <p className="font-medium text-gray-700">Responsável</p>
                  <p>{coordinator ? coordinator.name : 'Não definido'}</p>
                </div>

                <div>
                  <p className="font-medium text-gray-700">Período</p>
                  <p>
                    {format(new Date(plan.startDate), "dd 'de' MMMM", { locale: ptBR })} - {' '}
                    {format(new Date(plan.endDate), "dd 'de' MMMM", { locale: ptBR })}
                  </p>
                </div>

                <div className="md:col-span-2">
                  <p className="font-medium text-gray-700">Grupos Envolvidos</p>
                  {planTeams.length > 0 ? (
                    <div className="flex flex-wrap gap-2 mt-1">
                      {planTeams.map(team => (
                        <span 
                          key={`team-${team.id}-${plan.id}`}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                        >
                          {team.name}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 italic">Nenhum grupo selecionado</p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex gap-2 ml-4">
              <ActionButtons
                onEdit={() => onEdit(plan)}
                onDelete={() => onDelete(plan.id)}
                isActive={plan.active}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}