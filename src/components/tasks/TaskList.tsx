import { Task } from '../../types';
import { useStore } from '../../store/useStore';
import { useActionPlanStore } from '../../store/actionPlanStore';
import { ActionButtons } from '../common/ActionButtons';
import { TaskStatus } from './TaskStatus';

interface TaskListProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onStatusChange?: (task: Task) => void;
  showStatusButton?: boolean;
}

export function TaskList({ tasks, onEdit, onDelete, onStatusChange, showStatusButton = false }: TaskListProps) {
  const { collaborators } = useStore();
  const { actionPlans } = useActionPlanStore();

  if (tasks.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        Nenhuma tarefa encontrada.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {tasks.map((task) => {
        const assignee = collaborators.find(c => c.id === task.assigneeId);
        const actionPlan = actionPlans.find(p => p.id === task.actionPlanId);
        
        return (
          <div key={task.id} className="flex items-start justify-between p-4 border rounded-md hover:bg-gray-50">
            <div className="space-y-3 flex-1">
              <div className="flex items-center justify-between gap-4">
                <span className="font-medium">{task.name}</span>
                <TaskStatus task={task} />
              </div>
              
              <div className="text-sm text-gray-500 space-y-1">
                {task.description && <p>{task.description}</p>}
                <p>Responsável: {assignee?.name || 'Não atribuído'}</p>
                <p>Ação/Plano: {actionPlan?.name || 'Não vinculado'}</p>
                <p>
                  Período: {new Date(task.startDate).toLocaleDateString()} - {new Date(task.endDate).toLocaleDateString()}
                </p>
              </div>
            </div>
            
            <div className="flex gap-2 ml-4">
              {showStatusButton && (
                <button
                  onClick={() => onStatusChange?.(task)}
                  className="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-md hover:bg-blue-200 transition-colors"
                >
                  Alterar Status
                </button>
              )}
              <ActionButtons
                onEdit={() => onEdit(task)}
                onDelete={() => onDelete(task.id)}
                isCompleted={task.status === 'completed'}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}