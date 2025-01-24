import { useContext } from 'react';
import { PermissionsContext } from '../contexts/PermissionsContext';

export function usePermissions() {
  const context = useContext(PermissionsContext);
  if (!context) {
    throw new Error('usePermissions must be used within a PermissionsProvider');
  }

  const { hasPermission } = context;

  return {
    hasPermission,
    canView: (module: string) => hasPermission(module, 'view'),
    canCreate: (module: string) => hasPermission(module, 'create'),
    canEdit: (module: string) => hasPermission(module, 'edit'),
    canDelete: (module: string) => hasPermission(module, 'delete'),
  };
}