import { useState } from 'react';
import { Department } from '../../types';
import { ListItem } from '../common/ListItem';
import { ActionButtons } from '../common/ActionButtons';
import { departmentService } from '../../services/departmentService';
import { Download, Upload } from 'lucide-react';

interface DepartmentListProps {
  departments: Department[];
  onEdit: (department: Department) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string) => void;
}

export function DepartmentList({ departments, onEdit, onDelete, onToggleStatus }: DepartmentListProps) {
  const [error, setError] = useState<string | null>(null);

  const handleExport = async () => {
    try {
      const jsonData = await departmentService.exportToJSON();
      const blob = new Blob([jsonData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'departments.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      setError('Erro ao exportar dados');
    }
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = event.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const jsonData = e.target?.result as string;
          await departmentService.importFromJSON(jsonData);
          window.location.reload(); // Recarrega para atualizar a lista
        } catch (err) {
          setError('Erro ao importar dados');
        }
      };
      reader.readAsText(file);
    } catch (err) {
      setError('Erro ao ler arquivo');
    }
  };

  if (departments.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        Nenhum departamento cadastrado. Clique em "Novo Departamento" para começar.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-md mb-4">
          {error}
        </div>
      )}

      <div className="flex justify-end gap-4 mb-4">
        <button
          onClick={handleExport}
          className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
        >
          <Download className="w-4 h-4" />
          Exportar JSON
        </button>
        
        <label className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md cursor-pointer">
          <Upload className="w-4 h-4" />
          Importar JSON
          <input
            type="file"
            accept=".json"
            onChange={handleImport}
            className="hidden"
          />
        </label>
      </div>

      {departments.map((department) => (
        <ListItem
          key={department.id}
          title={department.name}
          status={department.active}
          actions={
            <ActionButtons
              onEdit={() => onEdit(department)}
              onDelete={() => onDelete(department.id)}
              onToggleStatus={() => onToggleStatus(department.id)}
              isActive={department.active}
            />
          }
        />
      ))}
    </div>
  );
}