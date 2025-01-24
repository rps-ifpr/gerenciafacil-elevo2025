import { useState } from 'react';
import { Task } from '../../types';
import { TaskList } from './TaskList';
import { TaskStatusTracker } from './TaskStatusTracker';

interface TaskGroupsProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: Task['status']) => void;
}

export function TaskGroups({ tasks, onEdit, onDelete, onStatusChange }: TaskGroupsProps) {
  // Inicializa com 'in_progress' como status selecionado
  const [selectedStatus, setSelectedStatus] = useState<Task['status']>('in_progress');

  const statusCounts = {
    not_started: tasks.filter(t => t.status === 'not_started').length,
    in_progress: tasks.filter(t => t.status === 'in_progress').length,
    in_review: tasks.filter(t => t.status === 'in_review').length,
    blocked: tasks.filter(t => t.status === 'blocked').length,
    completed: tasks.filter(t => t.status === 'completed').length,
    delayed: tasks.filter(t => t.status === 'delayed').length,
  };

  // Filtra as tarefas pelo status selecionado
  const filteredTasks = tasks.filter(task => task.status === selectedStatus);

  return (
    <div className="space-y-6">
      {/* Status Trackers */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <TaskStatusTracker
          status="not_started"
          count={statusCounts.not_started}
          onStatusClick={setSelectedStatus}
          isSelected={selectedStatus === 'not_started'}
        />
        <TaskStatusTracker
          status="in_progress"
          count={statusCounts.in_progress}
          onStatusClick={setSelectedStatus}
          isSelected={selectedStatus === 'in_progress'}
        />
        <TaskStatusTracker
          status="in_review"
          count={statusCounts.in_review}
          onStatusClick={setSelectedStatus}
          isSelected={selectedStatus === 'in_review'}
        />
        <TaskStatusTracker
          status="blocked"
          count={statusCounts.blocked}
          onStatusClick={setSelectedStatus}
          isSelected={selectedStatus === 'blocked'}
        />
        <TaskStatusTracker
          status="completed"
          count={statusCounts.completed}
          onStatusClick={setSelectedStatus}
          isSelected={selectedStatus === 'completed'}
        />
        <TaskStatusTracker
          status="delayed"
          count={statusCounts.delayed}
          onStatusClick={setSelectedStatus}
          isSelected={selectedStatus === 'delayed'}
        />
      </div>

      {/* Lista de Tarefas */}
      <div className="bg-white rounded-lg">
        <TaskList
          tasks={filteredTasks}
          onEdit={onEdit}
          onDelete={onDelete}
          onStatusChange={onStatusChange}
        />
      </div>
    </div>
  );
}