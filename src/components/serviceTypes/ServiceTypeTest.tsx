import { useState, useEffect } from 'react';
import { serviceTypeService } from '../../services/serviceTypeService';
import { ServiceType } from '../../types';

export function ServiceTypeTest() {
  const [serviceTypes, setServiceTypes] = useState<ServiceType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [testResults, setTestResults] = useState<string[]>([]);

  useEffect(() => {
    loadServiceTypes();
  }, []);

  const loadServiceTypes = async () => {
    try {
      const types = await serviceTypeService.getAllServiceTypes();
      setServiceTypes(types);
      addTestResult('✅ Busca de tipos de serviço realizada com sucesso');
    } catch (err) {
      setError('Erro ao carregar tipos de serviço');
      addTestResult('❌ Erro na busca de tipos de serviço');
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
      // Teste 1: Criar tipo de serviço
      const newType = await serviceTypeService.createServiceType({
        name: `Teste Serviço ${Date.now()}`,
        active: true
      });
      addTestResult(`✅ Tipo de serviço criado com ID: ${newType.id}`);

      // Teste 2: Buscar tipo de serviço por ID
      const foundType = await serviceTypeService.getServiceTypeById(newType.id);
      if (foundType) {
        addTestResult('✅ Tipo de serviço encontrado por ID');
      }

      // Teste 3: Atualizar tipo de serviço
      await serviceTypeService.updateServiceType(newType.id, {
        name: `${newType.name} (Atualizado)`
      });
      addTestResult('✅ Tipo de serviço atualizado');

      // Teste 4: Alternar status
      await serviceTypeService.toggleServiceTypeStatus(newType.id);
      addTestResult('✅ Status do tipo de serviço alternado');

      // Teste 5: Deletar tipo de serviço
      await serviceTypeService.deleteServiceType(newType.id);
      addTestResult('✅ Tipo de serviço deletado');

      // Recarrega a lista para confirmar as alterações
      await loadServiceTypes();
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
        <h2 className="text-xl font-bold">Teste de Integração Firebase - Tipos de Serviço</h2>
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
        <h3 className="font-semibold mb-2">Tipos de Serviço Atuais:</h3>
        {serviceTypes.length === 0 ? (
          <p className="text-gray-500">Nenhum tipo de serviço encontrado</p>
        ) : (
          <ul className="space-y-2">
            {serviceTypes.map(type => (
              <li key={type.id} className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${type.active ? 'bg-green-500' : 'bg-red-500'}`} />
                <span>{type.name}</span>
                <span className="text-gray-400 text-sm">({type.id})</span>
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