import { useStore } from '../store/useStore';

export function initializeSystem() {
  const { collaborators, addCollaborator } = useStore.getState();

  // Verifica se já existe um administrador
  const hasAdmin = collaborators.some(c => c.accessLevel === 'admin');

  if (!hasAdmin) {
    // Cria conta de administrador padrão
    addCollaborator({
      id: crypto.randomUUID(),
      name: 'Administrador',
      email: 'admin@admin.com',
      password: 'admin',
      department: '',
      role: 'Administrador do Sistema',
      active: true,
      accessLevel: 'admin',
      companyId: '',
      serviceType: '',
      document: '',
      phone: '',
      workSchedule: [{
        type: 'presential',
        days: ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta'],
        startTime: '08:00',
        endTime: '17:00',
      }],
    });

    console.log('Sistema inicializado com conta admin padrão');
  }
}