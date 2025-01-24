import { useState, useEffect } from 'react';
import { meetingService } from '../../services/meetingService';
import { Meeting } from '../../types';
import { LoadingSpinner } from '../ui/LoadingSpinner';

export function MeetingTest() {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [testResults, setTestResults] = useState<string[]>([]);

  useEffect(() => {
    loadMeetings();
  }, []);

  const loadMeetings = async () => {
    try {
      const loadedMeetings = await meetingService.getAllMeetings();
      setMeetings(loadedMeetings);
      addTestResult('✅ Busca de reuniões realizada com sucesso');
    } catch (err) {
      setError('Erro ao carregar reuniões');
      addTestResult('❌ Erro na busca de reuniões');
    } finally {
      setLoading(false);
    }
  };

  const addTestResult = (result: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()} - ${result}`]);
  };

  const createTestData = () => {
    // Cria dados temporários para teste
    const testCollaboratorId = crypto.randomUUID();
    const testTeamId = crypto.randomUUID();
    const testActionPlanId = crypto.randomUUID();

    // Data da reunião (amanhã às 10h)
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const meetingDate = tomorrow.toISOString().split('T')[0];

    return {
      title: `Reunião Teste ${Date.now()}`,
      description: 'Descrição da reunião de teste',
      date: meetingDate,
      startTime: '10:00',
      endTime: '11:00',
      type: 'online' as const,
      meetingLink: 'https://meet.test.com/test-meeting',
      status: 'scheduled' as const,
      participants: {
        collaboratorIds: [testCollaboratorId],
        teamIds: [testTeamId],
        actionPlanIds: [testActionPlanId]
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  };

  const runTests = async () => {
    setTestResults([]);
    setLoading(true);
    setError(null);
    
    let testMeetingId: string | null = null;
    let testSuccessful = false;
    
    try {
      // Teste 1: Criar reunião com dados de teste
      const testData = createTestData();
      const newMeeting = await meetingService.createMeeting(testData);
      testMeetingId = newMeeting.id;
      addTestResult(`✅ Reunião criada com ID: ${newMeeting.id}`);

      // Teste 2: Buscar reunião por ID
      const foundMeeting = await meetingService.getMeetingById(newMeeting.id);
      if (foundMeeting) {
        addTestResult('✅ Reunião encontrada por ID');
      } else {
        throw new Error('Reunião não encontrada após criação');
      }

      // Teste 3: Atualizar reunião
      await meetingService.updateMeeting(newMeeting.id, {
        title: `${newMeeting.title} (Atualizada)`,
        description: 'Descrição atualizada para teste'
      });
      addTestResult('✅ Reunião atualizada');

      // Teste 4: Atualizar status
      await meetingService.updateMeetingStatus(newMeeting.id, 'rescheduled');
      addTestResult('✅ Status da reunião atualizado');

      // Teste 5: Deletar reunião
      await meetingService.deleteMeeting(newMeeting.id);
      addTestResult('✅ Reunião deletada');
      testMeetingId = null; // Marca como já deletado
      testSuccessful = true;

      // Recarrega a lista para confirmar as alterações
      await loadMeetings();
      addTestResult('✅ Todos os testes concluídos com sucesso');

    } catch (err) {
      console.error('Erro nos testes:', err);
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      addTestResult(`❌ Erro durante os testes: ${errorMessage}`);
      setError('Erro ao executar testes. Verifique o console para mais detalhes.');
    } finally {
      // Limpeza dos dados de teste apenas se necessário
      try {
        if (testMeetingId && !testSuccessful) {
          await meetingService.deleteMeeting(testMeetingId);
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
        <h2 className="text-xl font-bold">Teste de Integração Firebase - Reuniões</h2>
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
            onClick={loadMeetings}
            className="ml-2 text-red-700 underline hover:no-underline"
          >
            Tentar novamente
          </button>
        </div>
      )}

      <div className="mb-6">
        <h3 className="font-semibold mb-2">Reuniões Atuais:</h3>
        {meetings.length === 0 ? (
          <p className="text-gray-500">Nenhuma reunião encontrada</p>
        ) : (
          <ul className="space-y-2">
            {meetings.map(meeting => (
              <li key={meeting.id} className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${
                  meeting.status === 'completed' ? 'bg-green-500' :
                  meeting.status === 'scheduled' ? 'bg-blue-500' :
                  meeting.status === 'cancelled' ? 'bg-red-500' :
                  'bg-gray-500'
                }`} />
                <span>{meeting.title}</span>
                <span className="text-gray-400 text-sm">({meeting.status})</span>
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