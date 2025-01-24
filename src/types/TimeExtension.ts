export interface TimeExtension {
  id: string;
  actionPlanId: string;
  originalEndDate: string;
  newEndDate: string;
  reason: string;
  requestedBy: string;
  requestedAt: string;
  status: 'pending' | 'approved' | 'rejected';
  approvedBy?: string;
  approvedAt?: string;
  comments?: string;
}

export interface ActionPlanWithExtensions extends ActionPlan {
  timeExtensions: TimeExtension[];
}