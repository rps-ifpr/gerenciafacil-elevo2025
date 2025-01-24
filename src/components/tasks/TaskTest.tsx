import { useState, useEffect } from 'react';
import { taskService } from '../../services/taskService';
import { Task } from '../../types';
import { LoadingSpinner } from '../ui/LoadingSpinner';

export function TaskTest() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [testResults, setTestResults] = useState<string[]>([]);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const loadedTasks = await taskService.getAllTasks();
      setTasks(loadedTasks);
      addTestResult('✅ Busca de atividades realizada com sucesso');
      setError(null);
    } catch (err) {
      console.error('Erro ao carregar atividades:', err);
      setError('Erro ao carregar atividades. Tente novamente.');
      addTestResult('❌ Erro na busca de atividades');
    } finally {
      setLoading(false);
    }
  };

  const addTestResult = (result: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()} - ${result}`]);
  };

  const createTestData = () => {
    // Cria dados temporários para teste
    const testActionPlanId = crypto.randomUUID();
    const testAssigneeId = crypto.randomUUID();

    // Datas: hoje até 7 dias depois
    const startDate = new Date().toISOString().split('T')[0];
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 7);

    return {
      name: `Atividade Teste ${Date.now()}`,
      description: 'Descrição da atividade de teste',
      startDate: `${startDate}T00:00`,
      endDate: `${endDate.toISOString().split('T')[0]}T23:59`,
      actionPlanId: testActionPlanId,
      assigneeId: testAssigneeId,
      status: 'not_started' as const,
      statusLogs: [],
      active: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  };

  const runTests = async () => {
    setTestResults([]);
    setLoading(true);
    setError(null);
    
    let testTaskId: string | null = null;
    let testSuccessful = false;
    
    try {
      // Teste 1: Criar atividade com dados de teste
      const testData = createTestData();
      const newTask = await taskService.createTask(testData);
      testTaskId = newTask.id;
      addTestResult(`✅ Atividade criada com ID: ${newTask.id}`);

      // Teste 2: Buscar atividade por ID
      const foundTask = await taskService.getTaskById(newTask.id);
      if (foundTask) {
        addTestResult('✅ Atividade encontrada por ID');
      } else {
        throw new Error('Atividade não encontrada após criação');
      }

      // Teste 3: Atualizar atividade
      await taskService.updateTask(newTask.id, {
        name: `${newTask.name} (Atualizada)`,
        description: 'Descrição atualizada para teste'
      });
      addTestResult('✅ Atividade atualizada');

      // Teste 4: Atualizar status
      await taskService.updateTask(newTask.id, {
        status: 'in_progress',
        statusLogs: [
          ...newTask.statusLogs,
          {
            id: crypto.randomUUID(),
            taskId: newTask.id,
            fromStatus: 'not_started',
            toStatus: 'in_progress',
            timestamp: new Date().toISOString(),
            automatic: false
          }
        ]
      });
      addTestResult('✅ Status da atividade alterado');

      // Teste 5: Deletar atividade
      await taskService.deleteTask(newTask.id);
      addTestResult('✅ Atividade deletada');
      testTaskId = null; // Marca como já deletado
      testSuccessful = true;

      // Recarrega a lista para confirmar as alterações
      await loadTasks();
      addTestResult('✅ Todos os testes concluídos com sucesso');

    } catch (err) {
      console.error('Erro nos testes:', err);
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      addTestResult(`❌ Erro durante os testes: ${errorMessage}`);
      setError('Erro ao executar testes. Verifique o console para mais detalhes.');
    } finally {
      // Limpeza dos dados de teste apenas se necessário
      try {
        if (testTaskId && !testSuccessful) {
          await taskService.deleteTask(testTaskId);
          addTestResult('🧹 Dados de teste limpos com sucesso');
        }
      } catch (cleanupError) {
        console.error('Erro ao limpar dados de teste:', cleanupError);
        addTestResult('⚠️ Aviso: Não foi possível limpar alguns dados de teste');
      }
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Teste de Integração Firebase - Atividades</h2>
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
          <button 
            onClick={loadTasks}
            className="ml-2 text-red-700 underline hover:no-underline"
          >
            Tentar novamente
          </button>
        </div>
      )}

      <div className="mb-6">
        <h3 className="font-semibold mb-2">Atividades Atuais:</h3>
        {tasks.length === 0 ? (
          <p className="text-gray-500">Nenhuma atividade encontrada</p>
        ) : (
          <ul className="space-y-2">
            {tasks.map(task => (
              <li key={task.id} className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${task.active ? 'bg-green-500' : 'bg-red-500'}`} />
                <span>{task.name}</span>
                <span className="text-gray-400 text-sm">({task.status})</span>
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