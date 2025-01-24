import { useState, useEffect } from 'react';
import { companyService } from '../../services/companyService';
import { Company } from '../../types';

export function CompanyTest() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [testResults, setTestResults] = useState<string[]>([]);

  useEffect(() => {
    loadCompanies();
  }, []);

  const loadCompanies = async () => {
    try {
      const comps = await companyService.getAllCompanies();
      setCompanies(comps);
      addTestResult('✅ Busca de empresas realizada com sucesso');
    } catch (err) {
      setError('Erro ao carregar empresas');
      addTestResult('❌ Erro na busca de empresas');
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
      // Teste 1: Criar empresa
      const newCompany = await companyService.createCompany({
        name: `Empresa Teste ${Date.now()}`,
        cnpj: '12.345.678/0001-99',
        email: 'teste@empresa.com',
        phone: '(11) 99999-9999',
        address: 'Endereço Teste',
        active: true,
        contractStart: new Date().toISOString(),
        contractEnd: new Date(Date.now() + 31536000000).toISOString(), // 1 ano
        paymentInfo: {
          bankName: 'Banco Teste',
          bankBranch: '0001',
          bankAccount: '12345-6',
          pixKey: 'teste@empresa.com'
        },
        contactInfo: {
          name: 'Contato Teste',
          email: 'contato@empresa.com',
          phone: '(11) 88888-8888',
          position: 'Gerente'
        }
      });
      addTestResult(`✅ Empresa criada com ID: ${newCompany.id}`);

      // Teste 2: Buscar empresa por ID
      const foundCompany = await companyService.getCompanyById(newCompany.id);
      if (foundCompany) {
        addTestResult('✅ Empresa encontrada por ID');
      }

      // Teste 3: Atualizar empresa
      await companyService.updateCompany(newCompany.id, {
        name: `${newCompany.name} (Atualizada)`
      });
      addTestResult('✅ Empresa atualizada');

      // Teste 4: Alternar status
      await companyService.toggleCompanyStatus(newCompany.id);
      addTestResult('✅ Status da empresa alternado');

      // Teste 5: Deletar empresa
      await companyService.deleteCompany(newCompany.id);
      addTestResult('✅ Empresa deletada');

      // Recarrega a lista para confirmar as alterações
      await loadCompanies();
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
        <h2 className="text-xl font-bold">Teste de Integração Firebase - Empresas</h2>
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
        <h3 className="font-semibold mb-2">Empresas Atuais:</h3>
        {companies.length === 0 ? (
          <p className="text-gray-500">Nenhuma empresa encontrada</p>
        ) : (
          <ul className="space-y-2">
            {companies.map(company => (
              <li key={company.id} className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${company.active ? 'bg-green-500' : 'bg-red-500'}`} />
                <span>{company.name}</span>
                <span className="text-gray-400 text-sm">({company.cnpj})</span>
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