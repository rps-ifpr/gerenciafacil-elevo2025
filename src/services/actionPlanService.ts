import { ActionPlan } from '../types';
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
  Timestamp
} from 'firebase/firestore';

class ActionPlanService {
  private static instance: ActionPlanService;
  private readonly collectionName = 'actionPlans';
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutos
  private cache: {
    data: ActionPlan[];
    timestamp: number;
  } | null = null;

  private constructor() {}

  static getInstance(): ActionPlanService {
    if (!ActionPlanService.instance) {
      ActionPlanService.instance = new ActionPlanService();
    }
    return ActionPlanService.instance;
  }

  async getAllActionPlans(): Promise<ActionPlan[]> {
    try {
      // Verifica cache
      if (this.cache && (Date.now() - this.cache.timestamp) < this.CACHE_DURATION) {
        return this.cache.data;
      }

      const querySnapshot = await getDocs(collection(db, this.collectionName));
      const plans = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as ActionPlan));

      // Atualiza cache
      this.cache = {
        data: plans,
        timestamp: Date.now()
      };

      return plans;
    } catch (error) {
      console.error('Erro ao buscar ações:', error);
      // Se tiver cache, retorna mesmo expirado em caso de erro
      if (this.cache) {
        return this.cache.data;
      }
      throw error;
    }
  }

  async getActionPlansByDateRange(startDate: string, endDate: string): Promise<ActionPlan[]> {
    try {
      // Tenta usar dados em cache primeiro
      if (this.cache) {
        const cachedPlans = this.cache.data.filter(plan => {
          const planStart = new Date(plan.startDate);
          const planEnd = new Date(plan.endDate);
          const rangeStart = new Date(startDate);
          const rangeEnd = new Date(endDate);
          return planStart <= rangeEnd && planEnd >= rangeStart;
        });

        if (cachedPlans.length > 0) {
          return cachedPlans;
        }
      }

      // Se não tem cache ou não encontrou planos, busca no servidor
      const q = query(
        collection(db, this.collectionName),
        where('startDate', '<=', endDate),
        where('endDate', '>=', startDate)
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as ActionPlan));
    } catch (error) {
      console.error('Erro ao buscar ações por período:', error);
      // Em caso de erro, retorna array vazio para não quebrar a UI
      return [];
    }
  }

  async getActionPlanById(id: string): Promise<ActionPlan | null> {
    try {
      // Verifica cache primeiro
      if (this.cache) {
        const cachedPlan = this.cache.data.find(p => p.id === id);
        if (cachedPlan) {
          return cachedPlan;
        }
      }

      const docRef = doc(db, this.collectionName, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data()
        } as ActionPlan;
      }
      return null;
    } catch (error) {
      console.error('Erro ao buscar ação:', error);
      throw error;
    }
  }

  async createActionPlan(actionPlan: Omit<ActionPlan, 'id'>): Promise<ActionPlan> {
    try {
      const validation = await this.validateActionPlan(actionPlan);
      if (!validation.valid) {
        throw new Error(validation.message);
      }

      const docRef = await addDoc(collection(db, this.collectionName), {
        ...actionPlan,
        status: actionPlan.status || 'not_started', // Garante que sempre tenha um status
        active: true,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      const newPlan = {
        id: docRef.id,
        ...actionPlan,
        status: actionPlan.status || 'not_started',
        active: true
      };

      // Atualiza cache
      if (this.cache) {
        this.cache.data.push(newPlan);
      }

      return newPlan;
    } catch (error) {
      console.error('Erro ao criar ação:', error);
      throw error;
    }
  }

  async updateActionPlan(id: string, updates: Partial<ActionPlan>): Promise<void> {
    try {
      const docRef = doc(db, this.collectionName, id);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });

      // Atualiza cache
      if (this.cache) {
        this.cache.data = this.cache.data.map(plan =>
          plan.id === id ? { ...plan, ...updates } : plan
        );
      }
    } catch (error) {
      console.error('Erro ao atualizar ação:', error);
      throw error;
    }
  }

  async deleteActionPlan(id: string): Promise<void> {
    try {
      const docRef = doc(db, this.collectionName, id);
      await deleteDoc(docRef);

      // Atualiza cache
      if (this.cache) {
        this.cache.data = this.cache.data.filter(plan => plan.id !== id);
      }
    } catch (error) {
      console.error('Erro ao deletar ação:', error);
      throw error;
    }
  }

  async toggleActionPlanStatus(id: string): Promise<void> {
    try {
      const plan = await this.getActionPlanById(id);
      if (plan) {
        await this.updateActionPlan(id, {
          active: !plan.active
        });
      }
    } catch (error) {
      console.error('Erro ao alternar status da ação:', error);
      throw error;
    }
  }

  // Limpa o cache forçadamente
  clearCache(): void {
    this.cache = null;
  }

  private async validateActionPlan(actionPlan: Partial<ActionPlan>): Promise<{ valid: boolean; message?: string }> {
    try {
      if (!actionPlan.name?.trim()) {
        return { valid: false, message: 'Nome da ação é obrigatório' };
      }

      if (!actionPlan.coordinatorId) {
        return { valid: false, message: 'Responsável é obrigatório' };
      }

      if (!actionPlan.teamIds?.length) {
        return { valid: false, message: 'Selecione pelo menos um grupo' };
      }

      if (!actionPlan.startDate || !actionPlan.endDate) {
        return { valid: false, message: 'Datas de início e término são obrigatórias' };
      }

      const startDate = new Date(actionPlan.startDate);
      const endDate = new Date(actionPlan.endDate);
      if (endDate < startDate) {
        return { valid: false, message: 'Data de término deve ser posterior à data de início' };
      }

      // Verifica nome duplicado
      const q = query(
        collection(db, this.collectionName),
        where('name', '==', actionPlan.name)
      );
      
      const querySnapshot = await getDocs(q);
      const exists = querySnapshot.docs.some(doc => doc.id !== actionPlan.id);

      if (exists) {
        return { valid: false, message: 'Já existe uma ação com este nome' };
      }

      return { valid: true };
    } catch (error) {
      console.error('Erro ao validar ação:', error);
      throw error;
    }
  }
}

export const actionPlanService = ActionPlanService.getInstance();