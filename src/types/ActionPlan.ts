export type ActionPlanStatus = 
  | 'not_started'
  | 'in_progress'
  | 'completed'
  | 'delayed'
  | 'cancelled';

export interface ActionPlan {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  coordinatorId: string;
  teamIds: string[];
  status: ActionPlanStatus;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}