import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Department } from '../types';

interface DepartmentStore {
  departments: Department[];
  addDepartment: (department: Department) => void;
  updateDepartment: (id: string, updates: Partial<Department>) => void;
  deleteDepartment: (id: string) => void;
  toggleDepartmentStatus: (id: string) => void;
}

export const useDepartmentStore = create<DepartmentStore>()(
  persist(
    (set) => ({
      departments: [],
      
      addDepartment: (department) =>
        set((state) => ({
          departments: [...state.departments, department],
        })),

      updateDepartment: (id, updates) =>
        set((state) => ({
          departments: state.departments.map((dept) =>
            dept.id === id ? { ...dept, ...updates } : dept
          ),
        })),

      deleteDepartment: (id) =>
        set((state) => ({
          departments: state.departments.filter((dept) => dept.id !== id),
        })),

      toggleDepartmentStatus: (id) =>
        set((state) => ({
          departments: state.departments.map((dept) =>
            dept.id === id ? { ...dept, active: !dept.active } : dept
          ),
        })),
    }),
    {
      name: 'department-storage',
    }
  )
);