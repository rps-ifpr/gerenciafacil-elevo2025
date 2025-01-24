import { useEffect } from 'react';
import { useTaskStore } from '../store/taskStore';
import { taskMonitoringService } from '../services/TaskMonitoringService';

export function useTaskMonitoring() {
  const { tasks, updateTask } = useTaskStore();

  useEffect(() => {
    taskMonitoringService.startMonitoring(
      () => tasks,
      updateTask
    );

    return () => {
      taskMonitoringService.stopMonitoring();
    };
  }, [tasks, updateTask]);
}