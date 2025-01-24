import { useState, useEffect } from 'react';
import { collaboratorService } from '../../services/collaboratorService';
import { Collaborator } from '../../types';

export function CollaboratorTest() {
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [testResults, setTestResults] = useState<string[]>([]);

  useEffect(() => {
    loadCollaborators();
  }, []);

  const loadCollaborators = async () => {
    try {
      const colabs = await collaboratorService.getAllCollaborators();
      setCollaborators(colabs);
      addTestResult('✅ Busca de prestadores realizada com sucesso');
    } catch (err) {
      setError('Erro ao carregar prestadores');
      addTestResult('❌ Erro na busca de prestadores');
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
      // Teste 1: Criar prestador
      const newCollaborator = await collaboratorService.createCollaborator({
        name: `Prestador Teste ${Date.now()}`,
        email: `teste${Date.now()}@teste.com`,
        password: '123456',
        document: `${Date.now()}`,
        phone: '(11) 99999-9999',
        department: '',
        role: 'Desenvolvedor',
        active: true,
        accessLevel: 'user',
        companyId: '',
        serviceType: '',
        workSchedule: [{
          type: 'presential',
          days: ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta'],
          startTime: '09:00',
          endTime: '18:00'
        }]
      });
      addTestResult(`✅ Prestador criado com ID: ${newCollaborator.id}`);

      // Teste 2: Buscar prestador por ID
      const foundCollaborator = await collaboratorService.getCollaboratorById(newCollaborator.id);
      if (foundCollaborator) {
        addTestResult('✅ Prestador encontrado por ID');
      }

      // Teste 3: Atualizar prestador
      await collaboratorService.updateCollaborator(newCollaborator.id, {
        name: `${newCollaborator.name} (Atualizado)`
      });
      addTestResult('✅ Prestador atualizado');

      // Teste 4: Alternar status
      await collaboratorService.toggleCollaboratorStatus(newCollaborator.id);
      addTestResult('✅ Status do prestador alternado');

      // Teste 5: Deletar prestador
      await collaboratorService.deleteCollaborator(newCollaborator.id);
      addTestResult('✅ Prestador deletado');

      // Recarrega a lista para confirmar as alterações
      await loadCollaborators();
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
        <h2 className="text-xl font-bold">Teste de Integração Firebase - Prestadores</h2>
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
        <h3 className="font-semibold mb-2">Prestadores Atuais:</h3>
        {collaborators.length === 0 ? (
          <p className="text-gray-500">Nenhum prestador encontrado</p>
        ) : (
          <ul className="space-y-2">
            {collaborators.map(collaborator => (
              <li key={collaborator.id} className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${collaborator.active ? 'bg-green-500' : 'bg-red-500'}`} />
                <span>{collaborator.name}</span>
                <span className="text-gray-400 text-sm">({collaborator.email})</span>
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