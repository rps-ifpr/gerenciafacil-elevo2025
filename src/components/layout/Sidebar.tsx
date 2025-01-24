import { useState, useEffect } from 'react';
import { 
  Home, Users, UserCircle, Briefcase, CheckSquare, 
  Calendar, BarChart, ListTodo, Settings, Tv,
  ChevronLeft, ChevronRight, Menu
} from 'lucide-react';
import { cn } from '../../lib/utils/styles';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { useNavigate } from '@/hooks/useNavigate';
import { usePermissions } from '@/hooks/usePermissions';

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const isMobile = useMediaQuery('(max-width: 768px)');
  const { navigateToTab } = useNavigate();
  const { canView } = usePermissions();
  
  useEffect(() => {
    if (isMobile) {
      setIsCollapsed(true);
    }
  }, [isMobile]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    navigateToTab(tab);
    if (isMobile) {
      setIsMobileMenuOpen(false);
    }
  };

  const menuItems = [
    canView('dashboard') && { 
      icon: <Home className="w-5 h-5" />, 
      label: "Dashboard", 
      value: "dashboard" 
    },
    canView('collaborators') && { 
      icon: <UserCircle className="w-5 h-5" />, 
      label: "Prestador Serviço", 
      value: "colaboradores" 
    },
    canView('teams') && { 
      icon: <Users className="w-5 h-5" />, 
      label: "Grupos Trabalho", 
      value: "equipes" 
    },
    canView('projects') && { 
      icon: <Briefcase className="w-5 h-5" />, 
      label: "Ações/Planos", 
      value: "projetos" 
    },
    canView('tasks') && { 
      icon: <CheckSquare className="w-5 h-5" />, 
      label: "Atividades/Tarefas", 
      value: "tarefas" 
    },
    canView('myTasks') && { 
      icon: <ListTodo className="w-5 h-5" />, 
      label: "Minhas Tarefas", 
      value: "minhas_tarefas" 
    },
    canView('meetings') && { 
      icon: <Calendar className="w-5 h-5" />, 
      label: "Reuniões", 
      value: "reunioes" 
    },
    canView('calendar') && { 
      icon: <BarChart className="w-5 h-5" />, 
      label: "Calendário", 
      value: "calendario" 
    },
    canView('settings') && { 
      icon: <Settings className="w-5 h-5" />, 
      label: "Configurações", 
      value: "settings" 
    },
    canView('tv') && { 
      icon: <Tv className="w-5 h-5" />, 
      label: "Modo TV", 
      value: "tv" 
    }
  ].filter(Boolean);

  return (
    <>
      {/* Mobile Menu Button */}
      {isMobile && (
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-white dark:bg-gray-800 shadow-lg"
        >
          <Menu className="w-6 h-6" />
        </button>
      )}

      {/* Sidebar */}
      <div 
        className={cn(
          "fixed inset-y-0 left-0 z-40 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300",
          isMobile ? (isMobileMenuOpen ? "translate-x-0" : "-translate-x-full") : "",
          !isMobile && (isCollapsed ? "w-16" : "w-64")
        )}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className={cn(
            "font-semibold text-gray-800 dark:text-white transition-opacity duration-300",
            (isCollapsed || isMobile) && "opacity-0"
          )}>
            Menu
          </h2>
          {!isMobile && (
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              aria-label={isCollapsed ? "Expandir menu" : "Recolher menu"}
            >
              {isCollapsed ? 
                <ChevronRight className="w-5 h-5" /> : 
                <ChevronLeft className="w-5 h-5" />
              }
            </button>
          )}
        </div>

        <nav className="p-2 overflow-y-auto h-[calc(100vh-4rem)]">
          {menuItems.map((item) => item && (
            <button
              key={item.value}
              onClick={() => handleTabChange(item.value)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2 rounded-lg mb-1 transition-all duration-200",
                activeTab === item.value 
                  ? "bg-orange-50 dark:bg-orange-900/50 text-orange-600 dark:text-orange-400" 
                  : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50",
                isCollapsed && !isMobile && "justify-center"
              )}
            >
              <span className="flex-shrink-0">{item.icon}</span>
              <span className={cn(
                "whitespace-nowrap transition-all duration-300",
                (isCollapsed && !isMobile) && "hidden"
              )}>
                {item.label}
              </span>
            </button>
          ))}
        </nav>
      </div>
      
      {/* Mobile Overlay */}
      {isMobile && isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
}