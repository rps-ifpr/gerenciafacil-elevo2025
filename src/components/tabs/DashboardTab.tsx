import { DashboardStats } from '../dashboard/DashboardStats';
import { OngoingActionsTable } from '../dashboard/OngoingActionsTable';
import { WeeklyTasksTable } from '../dashboard/WeeklyTasksTable';
import { TasksByStatusCard } from '../dashboard/TasksByStatusCard';
import { PageContainer } from '../common/PageContainer';

export function DashboardTab() {
  return (
    <PageContainer title="Dashboard">
      <div className="space-y-6">
        <DashboardStats />
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="p-6">
            <h2 className="text-lg font-semibold mb-4">Ações em Andamento</h2>
            <OngoingActionsTable />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="p-6">
            <h2 className="text-lg font-semibold mb-4">Atividades por Status</h2>
            <TasksByStatusCard />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="p-6">
            <h2 className="text-lg font-semibold mb-4">Tarefas da Semana</h2>
            <WeeklyTasksTable />
          </div>
        </div>
      </div>
    </PageContainer>
  );
}