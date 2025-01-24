import { useState, useEffect } from 'react';
import { 
  Users, UserCircle, Briefcase, CheckSquare,
  Calendar, CalendarClock, UserCheck, Clock,
  AlertCircle, RefreshCcw
} from 'lucide-react';
import { useTeamStore } from '../../store/teamStore';
import { useTaskStore } from '../../store/taskStore';
import { useActionPlanStore } from '../../store/actionPlanStore';
import { useMeetingStore } from '../../store/meetingStore';
import { useStore } from '../../store/useStore';
import { useNavigate } from '../../hooks/useNavigate';
import { Card } from '../ui/Card';
import { collaboratorService } from '../../services/collaboratorService';
import { teamService } from '../../services/teamService';
import { actionPlanService } from '../../services/actionPlanService';
import { taskService } from '../../services/taskService';
import { meetingService } from '../../services/meetingService';

export function DashboardStats() {
  const { navigateToTab } = useNavigate();
  const { teams, setTeams } = useTeamStore();
  const { tasks, setTasks } = useTaskStore();
  const { actionPlans, setActionPlans } = useActionPlanStore();
  const { meetings, setMeetings } = useMeetingStore();
  const { collaborators, setCollaborators } = useStore();
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Função para atualizar todos os dados
  const updateAllData = async () => {
    try {
      const [
        colabs,
        teamsList,
        actionsList,
        tasksList,
        meetingsList
      ] = await Promise.all([
        collaboratorService.getAllCollaborators(),
        teamService.getAllTeams(),
        actionPlanService.getAllActionPlans(),
        taskService.getAllTasks(),
        meetingService.getAllMeetings()
      ]);

      setCollaborators(colabs);
      setTeams(teamsList);
      setActionPlans(actionsList);
      setTasks(tasksList);
      setMeetings(meetingsList);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Erro ao atualizar dados:', error);
    }
  };

  // Atualiza quando houver mudança de status
  useEffect(() => {
    const handleStatusChange = () => {
      updateAllData();
    };

    window.addEventListener('taskStatusChanged', handleStatusChange);
    return () => {
      window.removeEventListener('taskStatusChanged', handleStatusChange);
    };
  }, []);

  // Atualização periódica
  useEffect(() => {
    const interval = setInterval(() => {
      updateAllData();
    }, 30000); // Atualiza a cada 30 segundos

    return () => clearInterval(interval);
  }, []);

  // Calcula estatísticas
  const stats = {
    tasks: {
      notStarted: tasks.filter(t => t.status === 'not_started').length,
      inProgress: tasks.filter(t => t.status === 'in_progress').length,
      inReview: tasks.filter(t => t.status === 'in_review').length,
      blocked: tasks.filter(t => t.status === 'blocked').length,
      completed: tasks.filter(t => t.status === 'completed').length,
      delayed: tasks.filter(t => t.status === 'delayed').length
    },
    actions: {
      ongoing: actionPlans.filter(p => p.status === 'in_progress').length,
      delayed: actionPlans.filter(p => p.status === 'delayed').length,
      completed: actionPlans.filter(p => p.status === 'completed').length
    },
    activeTeams: teams.filter(t => t.active).length,
    activeCollaborators: collaborators.filter(c => c.active).length,
    meetings: {
      today: meetings.filter(m => m.date === new Date().toISOString().split('T')[0]).length,
      upcoming: meetings.filter(m => 
        m.status === 'scheduled' && 
        new Date(m.date) > new Date()
      ).length
    }
  };

  return (
    <div className="space-y-8">
      {/* Última atualização */}
      <div className="flex items-center justify-end gap-2 text-sm text-gray-500">
        <Clock className="w-4 h-4" />
        <span>Atualizado em: {lastUpdate.toLocaleTimeString()}</span>
      </div>

      {/* Primeira Linha - Equipe e Ações/Planos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card de Equipe */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-700">Equipe</h3>
          <div className="grid grid-cols-2 gap-4">
            <Card 
              className="bg-blue-50 cursor-pointer hover:shadow-lg transition-all"
              onClick={() => handleCardClick('equipes')}
            >
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Grupos Ativos</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.activeTeams}</p>
                </div>
              </div>
            </Card>

            <Card 
              className="bg-green-50 cursor-pointer hover:shadow-lg transition-all"
              onClick={() => handleCardClick('colaboradores')}
            >
              <div className="flex items-center gap-3">
                <div className="p-3 bg-green-100 rounded-lg">
                  <UserCheck className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Prestadores</p>
                  <p className="text-2xl font-bold text-green-600">{stats.activeCollaborators}</p>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Card de Ações/Planos */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-700">Ações/Planos</h3>
          <div className="grid grid-cols-2 gap-4">
            <Card 
              className="bg-indigo-50 cursor-pointer hover:shadow-lg transition-all"
              onClick={() => handleCardClick('projetos')}
            >
              <div className="flex items-center gap-3">
                <div className="p-3 bg-indigo-100 rounded-lg">
                  <CheckSquare className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Em Andamento</p>
                  <p className="text-2xl font-bold text-indigo-600">{stats.actions.ongoing}</p>
                </div>
              </div>
            </Card>

            <Card 
              className="bg-red-50 cursor-pointer hover:shadow-lg transition-all"
              onClick={() => handleCardClick('projetos')}
            >
              <div className="flex items-center gap-3">
                <div className="p-3 bg-red-100 rounded-lg">
                  <AlertCircle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Atrasados</p>
                  <p className="text-2xl font-bold text-red-600">{stats.actions.delayed}</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Segunda Linha - Atividades e Reuniões */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card de Atividades */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-700">Atividades</h3>
          <div className="grid grid-cols-2 gap-4">
            <Card 
              className="bg-gray-50 cursor-pointer hover:shadow-lg transition-all"
              onClick={() => handleCardClick('tarefas')}
            >
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gray-100 rounded-lg">
                  <Clock className="w-6 h-6 text-gray-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Não Iniciadas</p>
                  <p className="text-2xl font-bold text-gray-600">{stats.tasks.notStarted}</p>
                </div>
              </div>
            </Card>
            
            <Card 
              className="bg-yellow-50 cursor-pointer hover:shadow-lg transition-all"
              onClick={() => handleCardClick('tarefas')}
            >
              <div className="flex items-center gap-3">
                <div className="p-3 bg-yellow-100 rounded-lg">
                  <RefreshCcw className="w-6 h-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Em Andamento</p>
                  <p className="text-2xl font-bold text-yellow-600">{stats.tasks.inProgress}</p>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Card de Reuniões */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-700">Reuniões</h3>
          <div className="grid grid-cols-2 gap-4">
            <Card 
              className="bg-purple-50 cursor-pointer hover:shadow-lg transition-all"
              onClick={() => handleCardClick('reunioes')}
            >
              <div className="flex items-center gap-3">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <CalendarClock className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Hoje</p>
                  <p className="text-2xl font-bold text-purple-600">{stats.meetings.today}</p>
                </div>
              </div>
            </Card>

            <Card 
              className="bg-orange-50 cursor-pointer hover:shadow-lg transition-all"
              onClick={() => handleCardClick('reunioes')}
            >
              <div className="flex items-center gap-3">
                <div className="p-3 bg-orange-100 rounded-lg">
                  <Calendar className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Agendadas</p>
                  <p className="text-2xl font-bold text-orange-600">{stats.meetings.upcoming}</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}