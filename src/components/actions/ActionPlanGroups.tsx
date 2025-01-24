import { useState, useEffect } from 'react';
import { ActionPlan } from '../../types';
import { ActionPlanList } from './ActionPlanList';
import { ActionPlanStatusTracker } from './ActionPlanStatusTracker';

interface ActionPlanGroupsProps {
  actionPlans: ActionPlan[];
  onEdit: (plan: ActionPlan) => void;
  onDelete: (id: string) => void;
}

export function ActionPlanGroups({ actionPlans, onEdit, onDelete }: ActionPlanGroupsProps) {
  // Inicializa com 'in_progress' como status selecionado
  const [selectedStatus, setSelectedStatus] = useState<ActionPlan['status']>('in_progress');

  const statusCounts = {
    not_started: actionPlans.filter(p => p.status === 'not_started').length,
    in_progress: actionPlans.filter(p => p.status === 'in_progress').length,
    completed: actionPlans.filter(p => p.status === 'completed').length,
    delayed: actionPlans.filter(p => p.status === 'delayed').length,
    cancelled: actionPlans.filter(p => p.status === 'cancelled').length
  };

  const filteredPlans = actionPlans.filter(plan => plan.status === selectedStatus);

  return (
    <div className="space-y-6">
      {/* Status Trackers */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <ActionPlanStatusTracker
          status="not_started"
          count={statusCounts.not_started}
          onStatusClick={setSelectedStatus}
          isSelected={selectedStatus === 'not_started'}
        />
        <ActionPlanStatusTracker
          status="in_progress"
          count={statusCounts.in_progress}
          onStatusClick={setSelectedStatus}
          isSelected={selectedStatus === 'in_progress'}
        />
        <ActionPlanStatusTracker
          status="completed"
          count={statusCounts.completed}
          onStatusClick={setSelectedStatus}
          isSelected={selectedStatus === 'completed'}
        />
        <ActionPlanStatusTracker
          status="delayed"
          count={statusCounts.delayed}
          onStatusClick={setSelectedStatus}
          isSelected={selectedStatus === 'delayed'}
        />
        <ActionPlanStatusTracker
          status="cancelled"
          count={statusCounts.cancelled}
          onStatusClick={setSelectedStatus}
          isSelected={selectedStatus === 'cancelled'}
        />
      </div>

      {/* Botão para mostrar todas */}
      <div className="flex justify-end">
        <button
          onClick={() => setSelectedStatus('in_progress')}
          className={`text-sm ${
            selectedStatus === 'in_progress' 
              ? 'text-blue-600 font-medium' 
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Mostrar ações em andamento
        </button>
      </div>

      {/* Lista de Ações/Planos */}
      <div className="bg-white rounded-lg">
        <ActionPlanList
          actionPlans={filteredPlans}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      </div>
    </div>
  );
}