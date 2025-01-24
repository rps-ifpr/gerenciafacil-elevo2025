import { useTaskStore } from '../../store/taskStore';
import { useNavigate } from '../../hooks/useNavigate';
import { StatusTracker } from '../status/StatusTracker';
import { Task } from '../../types';

export function TaskStatusOverview() {
  const { tasks } = useTaskStore();
  const { navigateToTab } = useNavigate();

  const statusCounts = {
    not_started: tasks.filter(t => t.status === 'not_started').length,
    in_progress: tasks.filter(t => t.status === 'in_progress').length,
    in_review: tasks.filter(t => t.status === 'in_review').length,
    blocked: tasks.filter(t => t.status === 'blocked').length,
    completed: tasks.filter(t => t.status === 'completed').length,
    delayed: tasks.filter(t => t.status === 'delayed').length,
  };

  const handleStatusClick = (status: Task['status']) => {
    // Navigate to tasks tab with status filter
    navigateToTab('tarefas');
    // You can also store the selected status in a global state if needed
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      <StatusTracker
        status="not_started"
        count={statusCounts.not_started}
        onClick={handleStatusClick}
      />
      <StatusTracker
        status="in_progress"
        count={statusCounts.in_progress}
        onClick={handleStatusClick}
      />
      <StatusTracker
        status="in_review"
        count={statusCounts.in_review}
        onClick={handleStatusClick}
      />
      <StatusTracker
        status="blocked"
        count={statusCounts.blocked}
        onClick={handleStatusClick}
      />
      <StatusTracker
        status="completed"
        count={statusCounts.completed}
        onClick={handleStatusClick}
      />
      <StatusTracker
        status="delayed"
        count={statusCounts.delayed}
        onClick={handleStatusClick}
      />
    </div>
  );
}