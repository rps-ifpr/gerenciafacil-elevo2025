import { ReactNode } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { LoginForm } from './LoginForm';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredLevel?: 'admin' | 'manager' | 'user';
}

export function ProtectedRoute({ children, requiredLevel = 'user' }: ProtectedRouteProps) {
  const { isAuthenticated, isAuthorized } = useAuth();

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  if (!isAuthorized(requiredLevel)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Acesso Negado</h2>
          <p className="text-gray-600">
            Você não tem permissão para acessar esta página.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}