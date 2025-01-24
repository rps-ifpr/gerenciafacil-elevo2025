import { AccessLevel } from '@/types';

export interface Permission {
  view: boolean;
  create: boolean;
  edit: boolean;
  delete: boolean;
}

export interface ModulePermissions {
  dashboard: Permission;
  collaborators: Permission;
  teams: Permission;
  projects: Permission;
  tasks: Permission;
  myTasks: Permission;
  meetings: Permission;
  calendar: Permission;
  settings: Permission;
  tv: Permission;
}

export const ACCESS_LEVELS: Record<AccessLevel, ModulePermissions> = {
  admin: {
    dashboard: { view: true, create: true, edit: true, delete: true },
    collaborators: { view: true, create: true, edit: true, delete: true },
    teams: { view: true, create: true, edit: true, delete: true },
    projects: { view: true, create: true, edit: true, delete: true },
    tasks: { view: true, create: true, edit: true, delete: true },
    myTasks: { view: true, create: true, edit: true, delete: true },
    meetings: { view: true, create: true, edit: true, delete: true },
    calendar: { view: true, create: true, edit: true, delete: true },
    settings: { view: true, create: true, edit: true, delete: true },
    tv: { view: true, create: false, edit: false, delete: false },
  },
  manager: {
    dashboard: { view: true, create: true, edit: true, delete: false },
    collaborators: { view: true, create: true, edit: true, delete: false },
    teams: { view: true, create: true, edit: true, delete: false },
    projects: { view: true, create: true, edit: true, delete: false },
    tasks: { view: true, create: true, edit: true, delete: false },
    myTasks: { view: true, create: true, edit: true, delete: false },
    meetings: { view: true, create: true, edit: true, delete: true },
    calendar: { view: true, create: true, edit: true, delete: false },
    settings: { view: false, create: false, edit: false, delete: false },
    tv: { view: true, create: false, edit: false, delete: false },
  },
  user: {
    dashboard: { view: false, create: false, edit: false, delete: false },
    collaborators: { view: false, create: false, edit: false, delete: false },
    teams: { view: false, create: false, edit: false, delete: false },
    projects: { view: false, create: false, edit: false, delete: false },
    tasks: { view: false, create: false, edit: false, delete: false },
    myTasks: { view: true, create: false, edit: true, delete: false }, // Usuário pode ver e editar suas próprias tarefas
    meetings: { view: true, create: false, edit: false, delete: false },
    calendar: { view: true, create: false, edit: false, delete: false },
    settings: { view: false, create: false, edit: false, delete: false },
    tv: { view: true, create: false, edit: false, delete: false },
  },
};