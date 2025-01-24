import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Building2, Briefcase, LayoutGrid } from 'lucide-react';
import { CompaniesTab } from './CompaniesTab';
import { DepartmentsTab } from './DepartmentsTab';
import { ServiceTypesTab } from './ServiceTypesTab';
import { PageContainer } from '../common/PageContainer';

export function SettingsTab() {
  const [activeTab, setActiveTab] = useState('companies');

  return (
    <PageContainer title="Configurações">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="w-full flex justify-start overflow-x-auto">
          <TabsTrigger value="companies" className="flex items-center gap-2">
            <Building2 className="w-4 h-4" />
            <span>Empresas</span>
          </TabsTrigger>
          <TabsTrigger value="departments" className="flex items-center gap-2">
            <LayoutGrid className="w-4 h-4" />
            <span>Departamentos</span>
          </TabsTrigger>
          <TabsTrigger value="service-types" className="flex items-center gap-2">
            <Briefcase className="w-4 h-4" />
            <span>Tipos de Serviço</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="companies">
          <CompaniesTab />
        </TabsContent>

        <TabsContent value="departments">
          <DepartmentsTab />
        </TabsContent>

        <TabsContent value="service-types">
          <ServiceTypesTab />
        </TabsContent>
      </Tabs>
    </PageContainer>
  );
}