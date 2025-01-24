import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useStore } from '@/store/useStore';
import { Collaborator } from '@/types';
import { initializeSystem } from '@/utils/initializeSystem';
import { collaboratorService } from '@/services/collaboratorService';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

interface AuthContextType {
  user: Collaborator | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthorized: (requiredLevel: 'admin' | 'manager' | 'user') => boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

const ACCESS_LEVELS = {
  admin: 3,
  manager: 2,
  user: 1,
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const { collaborators, setCollaborators } = useStore();
  const [user, setUser] = useState<Collaborator | null>(() => {
    const stored = localStorage.getItem('auth_user');
    return stored ? JSON.parse(stored) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        // Inicializa o sistema (cria admin se necessário)
        await initializeSystem();
        
        // Carrega todos os prestadores
        const allCollaborators = await collaboratorService.getAllCollaborators();
        setCollaborators(allCollaborators);
      } catch (error) {
        console.error('Erro ao carregar dados iniciais:', error);
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, [setCollaborators]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('auth_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('auth_user');
    }
  }, [user]);

  const login = async (username: string, password: string) => {
    // Admin padrão
    if (username.toLowerCase() === 'admin' && password === 'admin') {
      const adminUser = collaborators.find(c => c.accessLevel === 'admin');
      if (adminUser) {
        setUser(adminUser);
        return true;
      }
    }

    // Busca usuário pelo primeiro nome
    const firstName = username.split(' ')[0].toLowerCase();
    const user = collaborators.find(c => {
      const collaboratorFirstName = c.name.split(' ')[0].toLowerCase();
      return collaboratorFirstName === firstName && 
             c.password === password && 
             c.active;
    });

    if (user) {
      setUser(user);
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
  };

  const isAuthorized = (requiredLevel: 'admin' | 'manager' | 'user') => {
    if (!user) return false;
    return ACCESS_LEVELS[user.accessLevel] >= ACCESS_LEVELS[requiredLevel];
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      login,
      logout,
      isAuthorized,
    }}>
      {children}
    </AuthContext.Provider>
  );
}