import { ReactNode } from 'react';
import { usePermissions } from '../../hooks/usePermissions';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from '../../hooks/useNavigate';
import { ArrowRight, Briefcase, CheckSquare } from 'lucide-react';

interface ProtectedModuleProps {
  module: string;
  action?: 'view' | 'create' | 'edit' | 'delete';
  children: ReactNode;
}

export function ProtectedModule({ module, action = 'view', children }: ProtectedModuleProps) {
  const { hasPermission } = usePermissions();
  const { user } = useAuth();
  const { navigateToTab } = useNavigate();

  if (!hasPermission(module, action)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] p-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Bem-vindo ao Sistema de Gerenciamento Elevo Energy
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Olá, {user?.name}! Aqui você pode gerenciar suas atividades e acompanhar seu progresso.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl w-full mb-8">
          <button
            onClick={() => navigateToTab('minhas_tarefas')}
            className="flex items-center gap-4 p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-all group"
          >
            <div className="p-3 bg-blue-100 rounded-full group-hover:bg-blue-200 transition-colors">
              <CheckSquare className="w-6 h-6 text-blue-600" />
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-gray-900">Minhas Tarefas</h3>
              <p className="text-sm text-gray-600">Visualize e gerencie suas atividades</p>
            </div>
            <ArrowRight className="w-5 h-5 ml-auto text-gray-400 group-hover:text-blue-500 transition-colors" />
          </button>

          <button
            onClick={() => navigateToTab('calendario')}
            className="flex items-center gap-4 p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-all group"
          >
            <div className="p-3 bg-green-100 rounded-full group-hover:bg-green-200 transition-colors">
              <Briefcase className="w-6 h-6 text-green-600" />
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-gray-900">Calendário</h3>
              <p className="text-sm text-gray-600">Acompanhe eventos e prazos</p>
            </div>
            <ArrowRight className="w-5 h-5 ml-auto text-gray-400 group-hover:text-green-500 transition-colors" />
          </button>
        </div>

        <p className="text-sm text-gray-500">
          Para começar, clique em uma das opções acima ou use o menu lateral para navegar.
        </p>
      </div>
    );
  }

  return <>{children}</>;
}