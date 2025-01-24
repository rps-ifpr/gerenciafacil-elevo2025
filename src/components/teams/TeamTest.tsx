import { useState, useEffect } from 'react';
import { teamService } from '../../services/teamService';
import { Team } from '../../types';

export function TeamTest() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [testResults, setTestResults] = useState<string[]>([]);

  useEffect(() => {
    loadTeams();
  }, []);

  const loadTeams = async () => {
    try {
      const loadedTeams = await teamService.getAllTeams();
      setTeams(loadedTeams);
      addTestResult('✅ Busca de grupos realizada com sucesso');
    } catch (err) {
      setError('Erro ao carregar grupos');
      addTestResult('❌ Erro na busca de grupos');
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
      // Teste 1: Criar grupo
      const newTeam = await teamService.createTeam({
        name: `Grupo Teste ${Date.now()}`,
        members: ['member1', 'member2'],
        active: true
      });
      addTestResult(`✅ Grupo criado com ID: ${newTeam.id}`);

      // Teste 2: Buscar grupo por ID
      const foundTeam = await teamService.getTeamById(newTeam.id);
      if (foundTeam) {
        addTestResult('✅ Grupo encontrado por ID');
      }

      // Teste 3: Atualizar grupo
      await teamService.updateTeam(newTeam.id, {
        name: `${newTeam.name} (Atualizado)`
      });
      addTestResult('✅ Grupo atualizado');

      // Teste 4: Alternar status
      await teamService.toggleTeamStatus(newTeam.id);
      addTestResult('✅ Status do grupo alternado');

      // Teste 5: Deletar grupo
      await teamService.deleteTeam(newTeam.id);
      addTestResult('✅ Grupo deletado');

      // Recarrega a lista para confirmar as alterações
      await loadTeams();
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
        <h2 className="text-xl font-bold">Teste de Integração Firebase - Grupos</h2>
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
        <h3 className="font-semibold mb-2">Grupos Atuais:</h3>
        {teams.length === 0 ? (
          <p className="text-gray-500">Nenhum grupo encontrado</p>
        ) : (
          <ul className="space-y-2">
            {teams.map(team => (
              <li key={team.id} className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${team.active ? 'bg-green-500' : 'bg-red-500'}`} />
                <span>{team.name}</span>
                <span className="text-gray-400 text-sm">({team.members.length} membros)</span>
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