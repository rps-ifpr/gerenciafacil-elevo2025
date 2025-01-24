import { Calendar as CalendarIcon } from 'lucide-react';

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-full mb-4">
        <CalendarIcon className="w-8 h-8 text-gray-400 dark:text-gray-500" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
        Nenhum evento encontrado
      </h3>
      <p className="text-gray-500 dark:text-gray-400 text-center max-w-sm">
        Cadastre reuniões e atividades para visualizá-las no calendário.
      </p>
    </div>
  );
}