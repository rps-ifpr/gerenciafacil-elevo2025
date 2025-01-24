import { useState, useEffect } from 'react';
import { taskService } from '../../services/taskService';
import { Task } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { statusLabels } from '../../utils/taskStatusConfig';
import { timeService } from '../../services/TimeService';

export function MyTasksTest() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [testResults, setTestResults] = useState<string[]>([]);

  useEffect(() => {
    if (user) {
      loadTasks();
    } else {
      setLoading(false);
      setError('Usuário não autenticado');
    }
  }, [user]);

  const loadTasks = async () => {
    try {
      const allTasks = await taskService.getAllTasks();
      const myTasks = allTasks.filter(task => task.assigneeId === user?.id);
      setTasks(myTasks);
      addTestResult('✅ Busca de tarefas realizada com sucesso');
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      console.error('Erro ao carregar tarefas:', errorMessage);
      setError('Erro ao carregar tarefas. Tente novamente.');
      addTestResult('❌ Erro na busca de tarefas');
    } finally {
      setLoading(false);
    }
  };

  const addTestResult = (result: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setTestResults(prev => [...prev, `${timestamp} - ${result}`]);
  };

  const runTests = async () => {
    if (!user) {
      setError('Usuário não autenticado');
      return;
    }

    setTestResults([]);
    setLoading(true);
    setError(null);
    
    let testTaskId: string | null = null;
    
    try {
      // Teste 1: Criar tarefa de teste
      const testTask = {
        name: `Tarefa Teste ${Date.now()}`,
        description: 'Tarefa para teste de alteração de status',
        startDate: timeService.getCurrentTimestamp(),
        endDate: new Date(Date.now() + 86400000).toISOString(), // +1 dia
        assigneeId: user.id,
        actionPlanId: 'test-action-plan',
        status: 'not_started' as const,
        statusLogs: [],
        active: true
      };

      const createdTask = await taskService.createTask(testTask);
      testTaskId = createdTask.id;
      addTestResult(`✅ Tarefa criada com ID: ${createdTask.id}`);

      // Teste 2: Alterar status para "em andamento"
      const statusLog1 = {
        id: crypto.randomUUID(),
        taskId: createdTask.id,
        fromStatus: 'not_started',
        toStatus: 'in_progress',
        timestamp: timeService.getCurrentTimestamp(),
        userName: user.name,
        justification: 'Iniciando a tarefa',
        automatic: false
      };

      await taskService.updateTaskStatus(createdTask.id, 'in_progress', statusLog1);
      addTestResult('✅ Status alterado para Em Andamento');

      // Teste 3: Verificar histórico de status
      const updatedTask = await taskService.getTaskById(createdTask.id);
      if (updatedTask && updatedTask.statusLogs?.length > 0) {
        addTestResult('✅ Histórico de status registrado corretamente');
      }

      // Teste 4: Deletar tarefa de teste
      await taskService.deleteTask(createdTask.id);
      testTaskId = null;
      addTestResult('✅ Tarefa de teste removida');

      // Recarrega a lista para confirmar alterações
      await loadTasks();
      addTestResult('✅ Todos os testes concluídos com sucesso');

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      console.error('Erro nos testes:', errorMessage);
      addTestResult(`❌ Erro durante os testes: ${errorMessage}`);
      setError(`Erro ao executar testes: ${errorMessage}`);

      // Limpeza em caso de erro
      if (testTaskId) {
        try {
          await taskService.deleteTask(testTaskId);
          addTestResult('🧹 Dados de teste limpos');
        } catch (cleanupError) {
          console.error('Erro ao limpar dados de teste:', cleanupError);
          addTestResult('⚠️ Não foi possível limpar todos os dados de teste');
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Teste de Integração - Minhas Tarefas</h2>
        <button
          onClick={runTests}
          disabled={loading || !user}
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
        <h3 className="font-semibold mb-2">Minhas Tarefas Atuais:</h3>
        {tasks.length === 0 ? (
          <p className="text-gray-500">Nenhuma tarefa encontrada</p>
        ) : (
          <ul className="space-y-2">
            {tasks.map(task => (
              <li key={task.id} className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${
                  task.status === 'completed' ? 'bg-green-500' :
                  task.status === 'delayed' ? 'bg-red-500' :
                  'bg-blue-500'
                }`} />
                <span>{task.name}</span>
                <span className="text-gray-400 text-sm">({statusLabels[task.status]})</span>
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