import { OngoingActionsTable } from '../dashboard/OngoingActionsTable';

export function TVMainContent() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
        Ações em Andamento
      </h2>
      <OngoingActionsTable />
    </div>
  );
}