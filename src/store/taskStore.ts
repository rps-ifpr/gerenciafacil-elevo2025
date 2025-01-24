import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Task, StatusLog } from '../types';

interface TaskStore {
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
  addTask: (task: Task) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  updateTaskStatus: (taskId: string, newStatus: Task['status'], userName: string, justification?: string) => void;
}

export const useTaskStore = create<TaskStore>()(
  persist(
    (set) => ({
      tasks: [],
      
      setTasks: (tasks) =>
        set({ tasks }),

      addTask: (task) =>
        set((state) => ({
          tasks: [...state.tasks, {
            ...task,
            statusLogs: [],
          }],
        })),

      updateTask: (id, updates) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id
              ? {
                  ...task,
                  ...updates,
                  updatedAt: new Date().toISOString(),
                }
              : task
          ),
        })),

      updateTaskStatus: (taskId, newStatus, userName, justification) =>
        set((state) => {
          const task = state.tasks.find(t => t.id === taskId);
          if (!task) return state;

          const statusLog: StatusLog = {
            id: crypto.randomUUID(),
            taskId,
            fromStatus: task.status,
            toStatus: newStatus,
            userName,
            justification,
            timestamp: new Date().toISOString(),
            automatic: false,
          };

          return {
            tasks: state.tasks.map((t) =>
              t.id === taskId
                ? {
                    ...t,
                    status: newStatus,
                    statusLogs: [...t.statusLogs, statusLog],
                    updatedAt: new Date().toISOString(),
                  }
                : t
            ),
          };
        }),

      deleteTask: (id) =>
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== id),
        })),
    }),
    {
      name: 'task-storage',
    }
  )
);