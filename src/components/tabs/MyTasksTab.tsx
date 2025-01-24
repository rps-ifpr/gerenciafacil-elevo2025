import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useTaskStore } from '@/store/taskStore';
import { useActionPlanStore } from '@/store/actionPlanStore';
import { TaskList } from '../tasks/TaskList';
import { ActionPlanList } from '../actions/ActionPlanList';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { CheckSquare, Briefcase, Clock, TestTube } from 'lucide-react';
import { Task } from '@/types';
import { TaskStatusForm } from '../tasks/TaskStatusForm';
import { TaskStatusHistory } from '../tasks/TaskStatusHistory';
import { taskService } from '@/services/taskService';
import { timeService } from '@/services/TimeService';
import { MyTasksTest } from '../tasks/MyTasksTest';

export function MyTasksTab() {
  const { user } = useAuth();
  const { tasks, updateTask } = useTaskStore();
  const { actionPlans } = useActionPlanStore();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showStatusForm, setShowStatusForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const myTasks = tasks.filter(task => task.assigneeId === user?.id);
  const myActionPlans = actionPlans.filter(plan => plan.coordinatorId === user?.id);

  useEffect(() => {
    const checkOverdueTasks = () => {
      const now = new Date();
      myTasks.forEach(task => {
        const endDate = new Date(task.endDate);
        if (now > endDate && task.status !== 'completed' && task.status !== 'delayed') {
          handleStatusChange(task.id, 'delayed', 'Status alterado automaticamente - Prazo excedido');
        }
      });
    };

    checkOverdueTasks();
    const interval = setInterval(checkOverdueTasks, 3600000);

    return () => clearInterval(interval);
  }, [myTasks]);

  const handleStatusChange = async (taskId: string, newStatus: Task['status'], justification: string) => {
    try {
      setLoading(true);
      const task = tasks.find(t => t.id === taskId);
      if (!task || !user) return;

      const statusLog = {
        id: crypto.randomUUID(),
        taskId,
        fromStatus: task.status,
        toStatus: newStatus,
        timestamp: timeService.getCurrentTimestamp(),
        userName: user.name,
        justification,
        automatic: false
      };

      await taskService.updateTaskStatus(taskId, newStatus, statusLog);
      
      updateTask(taskId, {
        status: newStatus,
        statusLogs: [...(task.statusLogs || []), statusLog],
        updatedAt: timeService.getCurrentTimestamp()
      });

      setShowStatusForm(false);
      setSelectedTask(null);
      setError(null);
    } catch (err) {
      console.error('Erro ao atualizar status:', err);
      setError('Erro ao atualizar status da tarefa. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const openStatusForm = (task: Task) => {
    setSelectedTask(task);
    setShowStatusForm(true);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white shadow-sm rounded-lg p-6">
        {error && (
          <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-md">
            {error}
          </div>
        )}

        {showStatusForm && selectedTask ? (
          <TaskStatusForm
            task={selectedTask}
            onSubmit={handleStatusChange}
            onCancel={() => {
              setShowStatusForm(false);
              setSelectedTask(null);
            }}
          />
        ) : (
          <Tabs defaultValue="tasks" className="space-y-6">
            <TabsList>
              <TabsTrigger value="tasks" className="flex items-center gap-2">
                <CheckSquare className="w-4 h-4" />
                <span>Minhas Tarefas ({myTasks.length})</span>
              </TabsTrigger>
              <TabsTrigger value="plans" className="flex items-center gap-2">
                <Briefcase className="w-4 h-4" />
                <span>Minhas Ações/Planos ({myActionPlans.length})</span>
              </TabsTrigger>
              <TabsTrigger value="history" className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>Histórico de Status</span>
              </TabsTrigger>
              <TabsTrigger value="test" className="flex items-center gap-2">
                <TestTube className="w-4 h-4" />
                <span>Testes</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="tasks">
              {myTasks.length > 0 ? (
                <TaskList
                  tasks={myTasks}
                  onEdit={openStatusForm}
                  onDelete={() => {}}
                  showStatusButton
                />
              ) : (
                <div className="text-center text-gray-500 py-8">
                  Você não possui tarefas atribuídas.
                </div>
              )}
            </TabsContent>

            <TabsContent value="plans">
              {myActionPlans.length > 0 ? (
                <ActionPlanList
                  actionPlans={myActionPlans}
                  onEdit={() => {}}
                  onDelete={() => {}}
                />
              ) : (
                <div className="text-center text-gray-500 py-8">
                  Você não possui ações/planos sob sua coordenação.
                </div>
              )}
            </TabsContent>

            <TabsContent value="history">
              <TaskStatusHistory tasks={myTasks} />
            </TabsContent>

            <TabsContent value="test">
              <MyTasksTest />
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
}