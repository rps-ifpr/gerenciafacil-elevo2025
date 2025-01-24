export type AccessLevel = 'admin' | 'manager' | 'user';

export interface User {
  id: string;
  name: string;
  email: string;
  accessLevel: AccessLevel;
}

export interface Module {
  id: string;
  name: string;
  path: string;
  permissions: {
    view: boolean;
    create: boolean;
    edit: boolean;
    delete: boolean;
  };
}