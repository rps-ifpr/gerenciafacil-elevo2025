export interface Collaborator {
  id: string;
  name: string;
  email: string;
  password: string;
  department: string;
  role: string;
  active: boolean;
  accessLevel: 'admin' | 'manager' | 'user';
  companyId: string;
  serviceType: string;
  document: string;
  phone: string;
  workSchedule: WorkSchedule[];
}

export interface WorkSchedule {
  type: 'presential' | 'remote';
  days: string[];
  startTime: string;
  endTime: string;
}