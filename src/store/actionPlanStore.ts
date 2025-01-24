import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ActionPlan } from '../types';

interface ActionPlanStore {
  actionPlans: ActionPlan[];
  setActionPlans: (plans: ActionPlan[]) => void;
  addActionPlan: (actionPlan: ActionPlan) => void;
  updateActionPlan: (id: string, updates: Partial<ActionPlan>) => void;
  deleteActionPlan: (id: string) => void;
  toggleActionPlanStatus: (id: string) => void;
}

export const useActionPlanStore = create<ActionPlanStore>()(
  persist(
    (set) => ({
      actionPlans: [],
      
      setActionPlans: (plans) =>
        set({ actionPlans: plans }),

      addActionPlan: (actionPlan) =>
        set((state) => ({
          actionPlans: [...state.actionPlans, actionPlan],
        })),

      updateActionPlan: (id, updates) =>
        set((state) => ({
          actionPlans: state.actionPlans.map((plan) =>
            plan.id === id ? { ...plan, ...updates } : plan
          ),
        })),

      deleteActionPlan: (id) =>
        set((state) => ({
          actionPlans: state.actionPlans.filter((plan) => plan.id !== id),
        })),

      toggleActionPlanStatus: (id) =>
        set((state) => ({
          actionPlans: state.actionPlans.map((plan) =>
            plan.id === id ? { ...plan, active: !plan.active } : plan
          ),
        })),
    }),
    {
      name: 'action-plan-storage',
    }
  )
);