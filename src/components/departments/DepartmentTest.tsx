import { useState, useEffect } from 'react';
import { departmentService } from '../../services/departmentService';
import { Department } from '../../types';

export function DepartmentTest() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [testResults, setTestResults] = useState<string[]>([]);

  useEffect(() => {
    loadDepartments();
  }, []);

  const loadDepartments = async () => {
    try {
      const deps = await departmentService.getAllDepartments();
      setDepartments(deps);
      addTestResult('✅ Busca de departamentos realizada com sucesso');
    } catch (err) {
      setError('Erro ao carregar departamentos');
      addTestResult('❌ Erro na busca de departamentos');
    } finally {
      setLoading(false);
    }
  };

  const addTestResult = (result: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()} - ${result}`]);
  };

  const runTests = async () => {
    setTestResults([]);
    setLoading(true);
    
    try {
      // Teste 1: Criar departamento
      const newDept = await departmentService.createDepartment({
        name: `Teste Dept ${Date.now()}`,
        active: true
      });
      addTestResult(`✅ Departamento criado com ID: ${newDept.id}`);

      // Teste 2: Buscar departamento por ID
      const foundDept = await departmentService.getDepartmentById(newDept.id);
      if (foundDept) {
        addTestResult('✅ Departamento encontrado por ID');
      }

      // Teste 3: Atualizar departamento
      await departmentService.updateDepartment(newDept.id, {
        name: `${newDept.name} (Atualizado)`
      });
      addTestResult('✅ Departamento atualizado');

      // Teste 4: Alternar status
      await departmentService.toggleDepartmentStatus(newDept.id);
      addTestResult('✅ Status do departamento alternado');

      // Teste 5: Deletar departamento
      await departmentService.deleteDepartment(newDept.id);
      addTestResult('✅ Departamento deletado');

      // Recarrega a lista para confirmar as alterações
      await loadDepartments();
      addTestResult('✅ Todos os testes concluídos com sucesso');

    } catch (err) {
      console.error('Erro nos testes:', err);
      addTestResult(`❌ Erro durante os testes: ${err}`);
      setError('Erro ao executar testes');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Teste de Integração Firebase</h2>
        <button
          onClick={runTests}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Executando...' : 'Executar Testes'}
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 text-red-600 rounded">
          {error}
        </div>
      )}

      <div className="mb-6">
        <h3 className="font-semibold mb-2">Departamentos Atuais:</h3>
        {departments.length === 0 ? (
          <p className="text-gray-500">Nenhum departamento encontrado</p>
        ) : (
          <ul className="space-y-2">
            {departments.map(dept => (
              <li key={dept.id} className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${dept.active ? 'bg-green-500' : 'bg-red-500'}`} />
                <span>{dept.name}</span>
                <span className="text-gray-400 text-sm">({dept.id})</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div>
        <h3 className="font-semibold mb-2">Resultados dos Testes:</h3>
        <div className="bg-gray-50 p-4 rounded max-h-60 overflow-y-auto">
          {testResults.length === 0 ? (
            <p className="text-gray-500">Nenhum teste executado ainda</p>
          ) : (
            <ul className="space-y-1">
              {testResults.map((result, index) => (
                <li key={index} className="text-sm font-mono">
                  {result}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}