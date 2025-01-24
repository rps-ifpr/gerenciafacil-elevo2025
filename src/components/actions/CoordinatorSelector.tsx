import { useState, useEffect } from 'react';
import { collaboratorService } from '../../services/collaboratorService';
import { FormField } from '../common/FormField';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { Collaborator } from '../../types';

interface CoordinatorSelectorProps {
  value: string;
  onChange: (coordinatorId: string) => void;
}

export function CoordinatorSelector({ value, onChange }: CoordinatorSelectorProps) {
  const [coordinators, setCoordinators] = useState<Collaborator[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadCoordinators();
  }, []);

  const loadCoordinators = async () => {
    try {
      setLoading(true);
      const allCollaborators = await collaboratorService.getAllCollaborators();
      
      // Filtra apenas colaboradores ativos que são coordenadores ou gerentes
      const eligibleCoordinators = allCollaborators.filter(c => {
        if (!c.active) return false;
        
        const role = c.role.toLowerCase();
        const isManager = role.includes('gerente') || role.includes('gestor');
        const isCoordinator = role.includes('coordenador');
        
        return isManager || isCoordinator;
      });

      setCoordinators(eligibleCoordinators);
      setError(null);
    } catch (err) {
      console.error('Erro ao carregar coordenadores:', err);
      setError('Erro ao carregar coordenadores. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-4">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-600 rounded-md">
        {error}
        <button 
          onClick={loadCoordinators}
          className="ml-2 text-red-700 underline hover:no-underline"
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  return (
    <FormField label="Responsável" required>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-md border border-gray-300 px-3 py-2"
        required
      >
        <option value="">Selecione um responsável</option>
        {coordinators.map(coordinator => (
          <option key={coordinator.id} value={coordinator.id}>
            {coordinator.name} ({coordinator.role})
          </option>
        ))}
      </select>
      {coordinators.length === 0 && (
        <p className="mt-2 text-sm text-gray-500">
          Nenhum coordenador ou gerente disponível. Cadastre um prestador com cargo de coordenador ou gerente.
        </p>
      )}
    </FormField>
  );
}