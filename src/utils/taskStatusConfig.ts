import { Task } from '../types';

export const statusLabels: Record<Task['status'], string> = {
  not_started: 'Não Iniciado',
  in_progress: 'Em Andamento',
  in_review: 'Em Revisão',
  blocked: 'Bloqueado',
  completed: 'Concluído',
  delayed: 'Atrasado'
};

export const statusColors: Record<Task['status'], { bg: string; text: string }> = {
  not_started: { bg: 'bg-gray-100', text: 'text-gray-800' },
  in_progress: { bg: 'bg-blue-100', text: 'text-blue-800' },
  in_review: { bg: 'bg-yellow-100', text: 'text-yellow-800' },
  blocked: { bg: 'bg-red-100', text: 'text-red-800' },
  completed: { bg: 'bg-green-100', text: 'text-green-800' },
  delayed: { bg: 'bg-orange-100', text: 'text-orange-800' }
};

// Transições permitidas para cada status
const statusTransitions: Record<Task['status'], Task['status'][]> = {
  not_started: ['in_progress', 'blocked'],
  in_progress: ['in_review', 'blocked', 'completed', 'delayed'],
  in_review: ['completed', 'in_progress', 'blocked'],
  blocked: ['in_progress', 'not_started'],
  completed: [], // Não permite mudança após concluído
  delayed: ['completed', 'in_progress', 'blocked']
};

export function getAvailableStatuses(currentStatus: Task['status']): Task['status'][] {
  return statusTransitions[currentStatus] || [];
}

export function validateStatusChange(
  currentStatus: Task['status'],
  newStatus: Task['status'],
  startDate: string,
  endDate: string
): { valid: boolean; message?: string; automatic?: boolean } {
  const now = new Date();
  const start = new Date(startDate);
  const end = new Date(endDate);

  // Verifica se está dentro do período previsto
  if (now < start && newStatus !== 'blocked') {
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
          message: 'Tarefa concluída após o prazo'
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
      if (currentStatus !== 'blocked') {
        return {
          valid: false,
          message: 'Não é possível voltar para não iniciado depois de começar'
        };
      }
      break;
  }

  return { valid: true };
}