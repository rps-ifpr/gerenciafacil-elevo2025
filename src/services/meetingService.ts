import { Meeting } from '../types';
import { db } from '../config/firebase';
import { 
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  serverTimestamp,
  orderBy,
  runTransaction
} from 'firebase/firestore';

class MeetingService {
  private static instance: MeetingService;
  private readonly collectionName = 'meetings';
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutos
  private cache: {
    data: Meeting[];
    timestamp: number;
  } | null = null;

  private constructor() {}

  static getInstance(): MeetingService {
    if (!MeetingService.instance) {
      MeetingService.instance = new MeetingService();
    }
    return MeetingService.instance;
  }

  async getAllMeetings(): Promise<Meeting[]> {
    try {
      // Verifica cache
      if (this.cache && (Date.now() - this.cache.timestamp) < this.CACHE_DURATION) {
        return this.cache.data;
      }

      const q = query(
        collection(db, this.collectionName),
        orderBy('date', 'asc')
      );
      const querySnapshot = await getDocs(q);
      const meetings = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Meeting));

      // Atualiza cache
      this.cache = {
        data: meetings,
        timestamp: Date.now()
      };

      return meetings;
    } catch (error) {
      console.error('Erro ao buscar reuniões:', error);
      if (this.cache) {
        return this.cache.data;
      }
      throw error;
    }
  }

  async getMeetingById(id: string): Promise<Meeting | null> {
    try {
      // Verifica cache primeiro
      if (this.cache) {
        const cachedMeeting = this.cache.data.find(m => m.id === id);
        if (cachedMeeting) {
          return cachedMeeting;
        }
      }

      const docRef = doc(db, this.collectionName, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data()
        } as Meeting;
      }
      return null;
    } catch (error) {
      console.error('Erro ao buscar reunião:', error);
      throw error;
    }
  }

  async createMeeting(meeting: Omit<Meeting, 'id'>): Promise<Meeting> {
    try {
      const validation = await this.validateMeeting(meeting);
      if (!validation.valid) {
        throw new Error(validation.message);
      }

      const docRef = await addDoc(collection(db, this.collectionName), {
        ...meeting,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      const newMeeting = {
        id: docRef.id,
        ...meeting
      };

      // Atualiza cache
      if (this.cache) {
        this.cache.data.push(newMeeting);
      }

      return newMeeting;
    } catch (error) {
      console.error('Erro ao criar reunião:', error);
      throw error;
    }
  }

  async updateMeeting(id: string, updates: Partial<Meeting>): Promise<void> {
    try {
      const docRef = doc(db, this.collectionName, id);
      
      // Remove campos undefined/null antes de atualizar
      const cleanUpdates = Object.entries(updates).reduce((acc, [key, value]) => {
        if (value !== undefined && value !== null) {
          acc[key] = value;
        }
        return acc;
      }, {} as Record<string, any>);

      await updateDoc(docRef, {
        ...cleanUpdates,
        updatedAt: serverTimestamp()
      });

      // Atualiza cache
      if (this.cache) {
        this.cache.data = this.cache.data.map(meeting =>
          meeting.id === id ? { ...meeting, ...updates } : meeting
        );
      }
    } catch (error) {
      console.error('Erro ao atualizar reunião:', error);
      throw error;
    }
  }

  async updateMeetingStatus(id: string, newStatus: Meeting['status']): Promise<void> {
    try {
      const meeting = await this.getMeetingById(id);
      if (!meeting) {
        throw new Error('Reunião não encontrada');
      }

      const validation = await this.validateStatusChange(meeting.status, newStatus);
      if (!validation.valid) {
        throw new Error(validation.message);
      }

      await runTransaction(db, async (transaction) => {
        const docRef = doc(db, this.collectionName, id);
        
        transaction.update(docRef, {
          status: newStatus,
          updatedAt: serverTimestamp()
        });
      });

      // Atualiza cache
      if (this.cache) {
        this.cache.data = this.cache.data.map(meeting =>
          meeting.id === id ? { ...meeting, status: newStatus } : meeting
        );
      }
    } catch (error) {
      console.error('Erro ao atualizar status da reunião:', error);
      throw error;
    }
  }

  async deleteMeeting(id: string): Promise<void> {
    try {
      const meeting = await this.getMeetingById(id);
      if (!meeting) {
        throw new Error('Reunião não encontrada');
      }

      if (meeting.status === 'completed') {
        throw new Error('Não é possível excluir uma reunião concluída');
      }

      const docRef = doc(db, this.collectionName, id);
      await deleteDoc(docRef);

      // Atualiza cache
      if (this.cache) {
        this.cache.data = this.cache.data.filter(meeting => meeting.id !== id);
      }
    } catch (error) {
      console.error('Erro ao deletar reunião:', error);
      throw error;
    }
  }

  clearCache(): void {
    this.cache = null;
  }

  private async validateMeeting(meeting: Partial<Meeting>): Promise<{ valid: boolean; message?: string }> {
    try {
      if (!meeting.title?.trim()) {
        return { valid: false, message: 'Título da reunião é obrigatório' };
      }

      if (!meeting.date) {
        return { valid: false, message: 'Data da reunião é obrigatória' };
      }

      if (!meeting.startTime || !meeting.endTime) {
        return { valid: false, message: 'Horários de início e término são obrigatórios' };
      }

      if (meeting.startTime >= meeting.endTime) {
        return { valid: false, message: 'Horário de término deve ser posterior ao horário de início' };
      }

      if (meeting.type === 'presential' && !meeting.location) {
        return { valid: false, message: 'Local é obrigatório para reuniões presenciais' };
      }

      if (meeting.type === 'online' && !meeting.meetingLink) {
        return { valid: false, message: 'Link é obrigatório para reuniões online' };
      }

      const hasParticipants = 
        meeting.participants?.collaboratorIds?.length > 0 || 
        meeting.participants?.teamIds?.length > 0 || 
        meeting.participants?.actionPlanIds?.length > 0;

      if (!hasParticipants) {
        return { valid: false, message: 'Selecione pelo menos um participante, grupo ou ação/plano' };
      }

      return { valid: true };
    } catch (error) {
      console.error('Erro ao validar reunião:', error);
      throw error;
    }
  }

  private async validateStatusChange(
    currentStatus: Meeting['status'],
    newStatus: Meeting['status']
  ): Promise<{ valid: boolean; message?: string }> {
    const validTransitions = {
      'scheduled': ['rescheduled', 'in_progress', 'cancelled'],
      'rescheduled': ['in_progress', 'cancelled'],
      'in_progress': ['completed', 'cancelled'],
      'completed': [], // Não permite mudança após completado
      'cancelled': ['scheduled'] // Permite reativar
    };

    const allowedTransitions = validTransitions[currentStatus];
    if (!allowedTransitions?.includes(newStatus)) {
      return {
        valid: false,
        message: 'Esta transição de status não é permitida'
      };
    }

    return { valid: true };
  }
}

export const meetingService = MeetingService.getInstance();