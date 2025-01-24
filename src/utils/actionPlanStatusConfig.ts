import { ActionPlanStatus } from '../types/ActionPlan';

export const statusLabels: Record<ActionPlanStatus, string> = {
  not_started: 'Não Iniciado',
  in_progress: 'Em Andamento',
  completed: 'Concluído',
  delayed: 'Atrasado',
  cancelled: 'Cancelado',
  rescheduled: 'Remarcado'
};

export const statusColors: Record<ActionPlanStatus, { bg: string; text: string }> = {
  not_started: { bg: 'bg-gray-100', text: 'text-gray-800' },
  in_progress: { bg: 'bg-blue-100', text: 'text-blue-800' },
  completed: { bg: 'bg-green-100', text: 'text-green-800' },
  delayed: { bg: 'bg-orange-100', text: 'text-orange-800' },
  cancelled: { bg: 'bg-red-100', text: 'text-red-800' },
  rescheduled: { bg: 'bg-yellow-100', text: 'text-yellow-800' }
};

// Transições permitidas para cada status
export const statusTransitions: Record<ActionPlanStatus, ActionPlanStatus[]> = {
  not_started: ['in_progress', 'cancelled'],
  in_progress: ['completed', 'delayed', 'cancelled'],
  completed: ['in_progress'], // Permite reabrir
  delayed: ['completed', 'cancelled'],
  cancelled: ['not_started'], // Permite reativar
  rescheduled: ['completed', 'delayed', 'cancelled']
};

export function getAvailableStatuses(currentStatus: ActionPlanStatus): ActionPlanStatus[] {
  return statusTransitions[currentStatus] || [];
}

export function validateStatusChange(
  currentStatus: ActionPlanStatus,
  newStatus: ActionPlanStatus,
  startDate: string,
  endDate: string
): {
  valid: boolean;
  message?: string;
} {
  const now = new Date();
  const start = new Date(startDate);
  const end = new Date(endDate);

  // Verifica se está dentro do período previsto
  if (now < start && newStatus !== 'cancelled') {
    return {
      valid: false,
      message: 'Não é possível alterar o status antes da data de início prevista'
    };
  }

  // Verifica se a transição é permitida
  const allowedTransitions = statusTransitions[currentStatus];
  if (!allowedTransitions?.includes(newStatus)) {
    return {
      valid: false,
      message: 'Esta transição de status não é permitida'
    };
  }

  // Regras específicas para cada status
  switch (newStatus) {
    case 'completed':
      if (now > end) {
        return {
          valid: true,
          message: 'Ação/Plano concluído após o prazo'
        };
      }
      break;
    case 'delayed':
      if (now <= end) {
        return {
          valid: false,
          message: 'Só é possível marcar como atrasada após a data de término'
        };
      }
      break;
    case 'not_started':
      if (currentStatus !== 'cancelled') {
        return {
          valid: false,
          message: 'Não é possível voltar para não iniciado depois de começar'
        };
      }
      break;
  }

  return { valid: true };
}