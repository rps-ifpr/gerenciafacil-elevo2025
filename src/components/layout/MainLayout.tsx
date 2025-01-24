import { ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Sidebar } from './Sidebar';
import { TabContent } from './TabContent';
import { ThemeToggle } from '../ui/ThemeToggle';
import { UserMenu } from './UserMenu';

interface MainLayoutProps {
  children?: ReactNode;
}

export function MainLayout() {
  const { user } = useAuth();

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <Sidebar />
      
      <div className="flex-1">
        <header className="sticky top-0 z-20 backdrop-blur-lg bg-white/80 dark:bg-gray-800/80 border-b border-gray-200 dark:border-gray-700">
          <div className="h-16 px-4 md:px-6 flex items-center justify-between max-w-7xl mx-auto relative">
            {/* Título centralizado */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <h1 className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-white whitespace-nowrap">
                ELEVO - Gerenciamento de Atividades
              </h1>
            </div>
            
            {/* Espaço vazio à esquerda para manter o equilíbrio */}
            <div className="w-[200px]"></div>
            
            {/* Menu do usuário à direita */}
            <UserMenu user={user} />
          </div>
        </header>

        <main className="p-4 md:p-6 max-w-7xl mx-auto w-full">
          <div className="w-full h-full animate-fadeIn">
            <TabContent />
          </div>
        </main>
      </div>

      <ThemeToggle />
    </div>
  );
}