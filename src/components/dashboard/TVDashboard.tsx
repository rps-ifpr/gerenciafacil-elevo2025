import { OngoingActionsTable } from './OngoingActionsTable';
import { TasksByStatusCard } from './TasksByStatusCard';
import { Clock } from 'lucide-react';

export function TVDashboard() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            ELEVO - Painel de Controle
          </h1>
          <div className="flex items-center justify-center gap-2 text-gray-500 dark:text-gray-400">
            <Clock className="w-5 h-5" />
            <p>Atualizado em: {new Date().toLocaleTimeString()}</p>
          </div>
        </div>

        {/* Actions Table */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            Ações em Andamento
          </h2>
          <OngoingActionsTable />
        </div>

        {/* Task Status */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            Status das Atividades
          </h2>
          <TasksByStatusCard />
        </div>
      </div>
    </div>
  );
}