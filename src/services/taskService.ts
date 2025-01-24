import { Task } from '../types';
import { db } from '../config/firebase';
import { 
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';

class TaskService {
  private static instance: TaskService | null = null;
  private readonly collectionName = 'tasks';
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
  private cache: {
    data: Task[];
    timestamp: number;
  } | null = null;

  private constructor() {}

  public static getInstance(): TaskService {
    if (!TaskService.instance) {
      TaskService.instance = new TaskService();
    }
    return TaskService.instance;
  }

  async getAllTasks(): Promise<Task[]> {
    try {
      // Check cache
      if (this.cache && (Date.now() - this.cache.timestamp) < this.CACHE_DURATION) {
        return this.cache.data;
      }

      const querySnapshot = await getDocs(collection(db, this.collectionName));
      const tasks = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        status: doc.data().status || 'not_started',
        statusLogs: doc.data().statusLogs || []
      } as Task));

      // Update cache
      this.cache = {
        data: tasks,
        timestamp: Date.now()
      };

      return tasks;
    } catch (error) {
      console.error('Error fetching tasks:', error);
      if (this.cache) {
        return this.cache.data;
      }
      throw error;
    }
  }

  async getTaskById(id: string): Promise<Task | null> {
    try {
      const docRef = doc(db, this.collectionName, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data()
        } as Task;
      }
      return null;
    } catch (error) {
      console.error('Error fetching task:', error);
      throw error;
    }
  }

  async createTask(task: Omit<Task, 'id'>): Promise<Task> {
    try {
      const taskData = {
        ...task,
        status: task.status || 'not_started',
        statusLogs: task.statusLogs || [],
        active: true,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      const docRef = await addDoc(collection(db, this.collectionName), taskData);
      
      const newTask = {
        id: docRef.id,
        ...taskData,
        active: true
      };

      // Update cache
      if (this.cache) {
        this.cache.data.push(newTask);
      }

      return newTask;
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  }

  async updateTaskStatus(
    taskId: string, 
    newStatus: Task['status'], 
    statusLog: any
  ): Promise<void> {
    try {
      const docRef = doc(db, this.collectionName, taskId);
      const taskDoc = await getDoc(docRef);

      if (!taskDoc.exists()) {
        throw new Error('Task not found');
      }

      const task = taskDoc.data() as Task;
      const updatedStatusLogs = [...(task.statusLogs || []), {
        ...statusLog,
        timestamp: Timestamp.fromDate(new Date(statusLog.timestamp))
      }];

      await updateDoc(docRef, {
        status: newStatus,
        statusLogs: updatedStatusLogs,
        updatedAt: serverTimestamp()
      });

      // Update cache
      if (this.cache) {
        this.cache.data = this.cache.data.map(t => 
          t.id === taskId 
            ? { 
                ...t, 
                status: newStatus, 
                statusLogs: updatedStatusLogs,
                updatedAt: new Date().toISOString()
              }
            : t
        );
      }

      // Notify status change
      this.notifyStatusChange();

    } catch (error) {
      console.error('Error updating task status:', error);
      throw error;
    }
  }

  async deleteTask(id: string): Promise<void> {
    try {
      const docRef = doc(db, this.collectionName, id);
      await deleteDoc(docRef);

      // Update cache
      if (this.cache) {
        this.cache.data = this.cache.data.filter(task => task.id !== id);
      }
    } catch (error) {
      console.error('Error deleting task:', error);
      throw error;
    }
  }

  private notifyStatusChange() {
    const event = new CustomEvent('taskStatusChanged', {
      detail: { timestamp: Date.now() }
    });
    window.dispatchEvent(event);
  }

  clearCache(): void {
    this.cache = null;
  }
}

export const taskService = TaskService.getInstance();