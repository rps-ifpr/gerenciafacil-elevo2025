import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { PaymentInfo, WorkSchedule, Collaborator } from '../types';

interface Store {
  collaborators: Collaborator[];
  setCollaborators: (collaborators: Collaborator[]) => void;
  addCollaborator: (collaborator: Collaborator) => void;
  updateCollaborator: (id: string, collaborator: Partial<Collaborator>) => void;
  deleteCollaborator: (id: string) => void;
}

export const useStore = create<Store>()(
  persist(
    (set) => ({
      collaborators: [],

      setCollaborators: (collaborators) =>
        set({ collaborators }),

      addCollaborator: (collaborator) =>
        set((state) => ({
          collaborators: [...state.collaborators, collaborator],
        })),

      updateCollaborator: (id, updates) =>
        set((state) => ({
          collaborators: state.collaborators.map((c) =>
            c.id === id ? { ...c, ...updates } : c
          ),
        })),

      deleteCollaborator: (id) =>
        set((state) => ({
          collaborators: state.collaborators.filter((c) => c.id !== id),
        })),
    }),
    {
      name: 'project-management-storage',
    }
  )
);