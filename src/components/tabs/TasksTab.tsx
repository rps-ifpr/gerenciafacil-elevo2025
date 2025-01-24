import { useState, useEffect } from "react";
import { useTaskStore } from "../../store/taskStore";
import { TaskForm } from "../tasks/TaskForm";
import { TaskList } from "../tasks/TaskList";
import { TaskTest } from "../tasks/TaskTest";
import { PageContainer } from "../common/PageContainer";
import { AddButton } from "../ui/AddButton";
import { LoadingSpinner } from "../ui/LoadingSpinner";
import { taskService } from "../../services/taskService";
import { Task } from "../../types";

export function TasksTab() {
  const { tasks, setTasks } = useTaskStore();
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showTest, setShowTest] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const loadedTasks = await taskService.getAllTasks();
      setTasks(loadedTasks);
      setError(null);
    } catch (err) {
      console.error('Erro ao carregar atividades:', err);
      setError('Erro ao carregar atividades. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (taskData: Omit<Task, 'id' | 'active' | 'createdAt' | 'updatedAt'>) => {
    try {
      if (editingTask) {
        await taskService.updateTask(editingTask.id, taskData);
        await loadTasks();
        setEditingTask(null);
      } else {
        const newTask = await taskService.createTask(taskData);
        setTasks([...tasks, newTask]);
      }
      setShowForm(false);
    } catch (error) {
      console.error('Erro ao salvar atividade:', error);
      setError('Erro ao salvar atividade. Tente novamente.');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta atividade?')) {
      try {
        await taskService.deleteTask(id);
        setTasks(tasks.filter(task => task.id !== id));
      } catch (error) {
        console.error('Erro ao deletar atividade:', error);
        setError('Erro ao deletar atividade. Tente novamente.');
      }
    }
  };

  return (
    <PageContainer
      title="Atividades"
      action={
        !showForm && (
          <div className="flex gap-4">
            <button
              onClick={() => setShowTest(!showTest)}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              {showTest ? 'Ocultar Testes' : 'Mostrar Testes'}
            </button>
            <AddButton
              onClick={() => setShowForm(true)}
              label="Nova Atividade"
            />
          </div>
        )
      }
    >
      {error && (
        <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-md">
          {error}
          <button 
            onClick={loadTasks}
            className="ml-2 text-red-700 underline hover:no-underline"
          >
            Tentar novamente
          </button>
        </div>
      )}

      {showTest && (
        <div className="mb-8">
          <TaskTest />
        </div>
      )}

      {showForm || editingTask ? (
        <>
          <div className="mb-4 flex justify-between items-center">
            <h3 className="text-lg font-semibold">
              {editingTask ? 'Editar Atividade' : 'Nova Atividade'}
            </h3>
            <button
              onClick={() => {
                setShowForm(false);
                setEditingTask(null);
              }}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Cancelar
            </button>
          </div>
          <TaskForm
            onSubmit={handleSubmit}
            initialData={editingTask || undefined}
            isEditing={!!editingTask}
          />
        </>
      ) : (
        <>
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <LoadingSpinner />
            </div>
          ) : (
            <TaskList
              tasks={tasks}
              onEdit={(task) => {
                setEditingTask(task);
                setShowForm(true);
              }}
              onDelete={handleDelete}
            />
          )}
        </>
      )}
    </PageContainer>
  );
}