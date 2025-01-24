import { Clock } from 'lucide-react';

interface TVHeaderProps {
  lastUpdate: Date;
}

export function TVHeader({ lastUpdate }: TVHeaderProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 text-center">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
        ELEVO - Painel de Controle
      </h1>
      <div className="flex items-center justify-center gap-2 text-gray-500 dark:text-gray-400">
        <Clock className="w-5 h-5" />
        <p>Atualizado em: {lastUpdate.toLocaleTimeString()}</p>
      </div>
    </div>
  );
}