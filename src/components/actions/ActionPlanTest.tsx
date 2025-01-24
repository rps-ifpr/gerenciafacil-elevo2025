import { useState, useEffect } from 'react';
import { actionPlanService } from '../../services/actionPlanService';
import { ActionPlan } from '../../types';
import { LoadingSpinner } from '../ui/LoadingSpinner';

export function ActionPlanTest() {
  const [actionPlans, setActionPlans] = useState<ActionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [testResults, setTestResults] = useState<string[]>([]);

  useEffect(() => {
    loadActionPlans();
  }, []);

  const loadActionPlans = async () => {
    try {
      const plans = await actionPlanService.getAllActionPlans();
      setActionPlans(plans);
      addTestResult('✅ Busca de ações realizada com sucesso');
      setError(null);
    } catch (err) {
      console.error('Erro ao carregar ações:', err);
      setError('Erro ao carregar ações. Tente novamente.');
      addTestResult('❌ Erro na busca de ações');
    } finally {
      setLoading(false);
    }
  };

  const addTestResult = (result: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()} - ${result}`]);
  };

  const createTestData = () => {
    // Cria dados temporários para teste
    const testCoordinatorId = crypto.randomUUID();
    const testTeamId = crypto.randomUUID();

    // Datas: hoje até 30 dias depois
    const startDate = new Date().toISOString().split('T')[0];
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 30);

    return {
      name: `Ação Teste ${Date.now()}`,
      startDate: `${startDate}T00:00`,
      endDate: `${endDate.toISOString().split('T')[0]}T23:59`,
      coordinatorId: testCoordinatorId,
      teamIds: [testTeamId],
      active: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  };

  const runTests = async () => {
    setTestResults([]);
    setLoading(true);
    setError(null);
    
    let testPlanId: string | null = null;
    let testSuccessful = false;
    
    try {
      // Teste 1: Criar ação com dados de teste
      const testData = createTestData();
      const newPlan = await actionPlanService.createActionPlan(testData);
      testPlanId = newPlan.id;
      addTestResult(`✅ Ação criada com ID: ${newPlan.id}`);

      // Teste 2: Buscar ação por ID
      const foundPlan = await actionPlanService.getActionPlanById(newPlan.id);
      if (foundPlan) {
        addTestResult('✅ Ação encontrada por ID');
      } else {
        throw new Error('Ação não encontrada após criação');
      }

      // Teste 3: Atualizar ação
      await actionPlanService.updateActionPlan(newPlan.id, {
        name: `${newPlan.name} (Atualizada)`,
      });
      addTestResult('✅ Ação atualizada');

      // Teste 4: Alternar status
      await actionPlanService.toggleActionPlanStatus(newPlan.id);
      addTestResult('✅ Status da ação alternado');

      // Teste 5: Deletar ação
      await actionPlanService.deleteActionPlan(newPlan.id);
      addTestResult('✅ Ação deletada');
      testPlanId = null; // Marca como já deletado
      testSuccessful = true;

      // Recarrega a lista para confirmar as alterações
      await loadActionPlans();
      addTestResult('✅ Todos os testes concluídos com sucesso');

    } catch (err) {
      console.error('Erro nos testes:', err);
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      addTestResult(`❌ Erro durante os testes: ${errorMessage}`);
      setError('Erro ao executar testes. Verifique o console para mais detalhes.');
    } finally {
      // Limpeza dos dados de teste apenas se necessário
      try {
        if (testPlanId && !testSuccessful) {
          await actionPlanService.deleteActionPlan(testPlanId);
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
        <h2 className="text-xl font-bold">Teste de Integração Firebase - Ações</h2>
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
            onClick={loadActionPlans}
            className="ml-2 text-red-700 underline hover:no-underline"
          >
            Tentar novamente
          </button>
        </div>
      )}

      <div className="mb-6">
        <h3 className="font-semibold mb-2">Ações Atuais:</h3>
        {actionPlans.length === 0 ? (
          <p className="text-gray-500">Nenhuma ação encontrada</p>
        ) : (
          <ul className="space-y-2">
            {actionPlans.map(plan => (
              <li key={plan.id} className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${plan.active ? 'bg-green-500' : 'bg-red-500'}`} />
                <span>{plan.name}</span>
                <span className="text-gray-400 text-sm">({plan.id})</span>
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