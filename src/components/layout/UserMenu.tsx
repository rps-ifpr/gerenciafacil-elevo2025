import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { User, LogOut, Shield } from 'lucide-react';

interface UserMenuProps {
  user: any;
}

export function UserMenu({ user }: UserMenuProps) {
  const { logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const getAccessLevelLabel = (level: string) => {
    switch (level) {
      case 'admin': return 'Administrador';
      case 'manager': return 'Gestor';
      case 'user': return 'Usuário';
      default: return level;
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
      >
        <User className="w-5 h-5" />
        <span className="hidden md:inline">{user?.name}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-1 border border-gray-200 dark:border-gray-700">
          <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
            <p className="font-medium text-gray-900 dark:text-white">{user?.name}</p>
            <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
              <Shield className="w-3 h-3" />
              <span>{getAccessLevelLabel(user?.accessLevel)}</span>
            </div>
          </div>
          
          <button
            onClick={logout}
            className="w-full flex items-center gap-2 px-4 py-2 text-left text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
          >
            <LogOut className="w-4 h-4" />
            Sair
          </button>
        </div>
      )}
    </div>
  );
}