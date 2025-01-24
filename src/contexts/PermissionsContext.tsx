import { createContext, useContext, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { ACCESS_LEVELS } from '../config/accessControl';

interface PermissionsContextType {
  hasPermission: (module: string, action: 'view' | 'create' | 'edit' | 'delete') => boolean;
}

export const PermissionsContext = createContext<PermissionsContextType | null>(null);

export function PermissionsProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();

  const hasPermission = (module: string, action: 'view' | 'create' | 'edit' | 'delete'): boolean => {
    if (!user) return false;
    
    const modulePermissions = ACCESS_LEVELS[user.accessLevel][module as keyof typeof ACCESS_LEVELS.admin];
    if (!modulePermissions) return false;
    
    return modulePermissions[action];
  };

  return (
    <PermissionsContext.Provider value={{ hasPermission }}>
      {children}
    </PermissionsContext.Provider>
  );
}

export function usePermissions() {
  const context = useContext(PermissionsContext);
  if (!context) {
    throw new Error('usePermissions must be used within a PermissionsProvider');
  }
  return context;
}