import { useState, useEffect } from 'react';
import { DashboardTab } from '../tabs/DashboardTab';
import { CollaboratorsTab } from '../tabs/CollaboratorsTab';
import { TeamsTab } from '../tabs/TeamsTab';
import { ProjectsTab } from '../tabs/ProjectsTab';
import { TasksTab } from '../tabs/TasksTab';
import { MyTasksTab } from '../tabs/MyTasksTab';
import { ReportsTab } from '../tabs/ReportsTab';
import { CalendarTab } from '../tabs/CalendarTab';
import { SettingsTab } from '../tabs/SettingsTab';
import { TVDashboard } from '../dashboard/TVDashboard';
import { ProtectedModule } from '../auth/ProtectedModule';

export function TabContent() {
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    const handleTabChange = (event: CustomEvent<string>) => {
      setActiveTab(event.detail);
    };

    window.addEventListener('tabChange', handleTabChange as EventListener);
    return () => {
      window.removeEventListener('tabChange', handleTabChange as EventListener);
    };
  }, []);

  switch (activeTab) {
    case 'dashboard':
      return (
        <ProtectedModule module="dashboard">
          <DashboardTab />
        </ProtectedModule>
      );
    case 'colaboradores':
      return (
        <ProtectedModule module="collaborators">
          <CollaboratorsTab />
        </ProtectedModule>
      );
    case 'equipes':
      return (
        <ProtectedModule module="teams">
          <TeamsTab />
        </ProtectedModule>
      );
    case 'projetos':
      return (
        <ProtectedModule module="projects">
          <ProjectsTab />
        </ProtectedModule>
      );
    case 'tarefas':
      return (
        <ProtectedModule module="tasks">
          <TasksTab />
        </ProtectedModule>
      );
    case 'minhas_tarefas':
      return (
        <ProtectedModule module="myTasks">
          <MyTasksTab />
        </ProtectedModule>
      );
    case 'reunioes':
      return (
        <ProtectedModule module="meetings">
          <ReportsTab />
        </ProtectedModule>
      );
    case 'calendario':
      return (
        <ProtectedModule module="calendar">
          <CalendarTab />
        </ProtectedModule>
      );
    case 'settings':
      return (
        <ProtectedModule module="settings">
          <SettingsTab />
        </ProtectedModule>
      );
    case 'tv':
      return (
        <ProtectedModule module="tv">
          <TVDashboard />
        </ProtectedModule>
      );
    default:
      return (
        <ProtectedModule module="dashboard">
          <DashboardTab />
        </ProtectedModule>
      );
  }
}