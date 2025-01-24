import { Team } from '../types';
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
  where
} from 'firebase/firestore';

class TeamService {
  private static instance: TeamService;
  private readonly collectionName = 'teams';

  private constructor() {}

  static getInstance(): TeamService {
    if (!TeamService.instance) {
      TeamService.instance = new TeamService();
    }
    return TeamService.instance;
  }

  async getAllTeams(): Promise<Team[]> {
    try {
      const querySnapshot = await getDocs(collection(db, this.collectionName));
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Team));
    } catch (error) {
      console.error('Erro ao buscar grupos:', error);
      throw error;
    }
  }

  async getTeamById(id: string): Promise<Team | null> {
    try {
      const docRef = doc(db, this.collectionName, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data()
        } as Team;
      }
      return null;
    } catch (error) {
      console.error('Erro ao buscar grupo:', error);
      throw error;
    }
  }

  async createTeam(team: Omit<Team, 'id'>): Promise<Team> {
    try {
      const docRef = await addDoc(collection(db, this.collectionName), {
        ...team,
        active: true,
        createdAt: new Date().toISOString()
      });

      return {
        id: docRef.id,
        ...team,
        active: true
      };
    } catch (error) {
      console.error('Erro ao criar grupo:', error);
      throw error;
    }
  }

  async updateTeam(id: string, updates: Partial<Team>): Promise<void> {
    try {
      const docRef = doc(db, this.collectionName, id);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Erro ao atualizar grupo:', error);
      throw error;
    }
  }

  async deleteTeam(id: string): Promise<void> {
    try {
      const docRef = doc(db, this.collectionName, id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Erro ao deletar grupo:', error);
      throw error;
    }
  }

  async toggleTeamStatus(id: string): Promise<void> {
    try {
      const team = await this.getTeamById(id);
      if (team) {
        await this.updateTeam(id, {
          active: !team.active
        });
      }
    } catch (error) {
      console.error('Erro ao alternar status do grupo:', error);
      throw error;
    }
  }

  async validateTeam(team: Partial<Team>): Promise<{ valid: boolean; message?: string }> {
    try {
      if (!team.name?.trim()) {
        return { valid: false, message: 'Nome do grupo é obrigatório' };
      }

      if (!team.members?.length) {
        return { valid: false, message: 'Selecione pelo menos um membro para o grupo' };
      }

      const q = query(
        collection(db, this.collectionName),
        where('name', '==', team.name)
      );
      
      const querySnapshot = await getDocs(q);
      const exists = querySnapshot.docs.some(doc => doc.id !== team.id);

      if (exists) {
        return { valid: false, message: 'Já existe um grupo com este nome' };
      }

      return { valid: true };
    } catch (error) {
      console.error('Erro ao validar grupo:', error);
      throw error;
    }
  }

  async exportToJSON(): Promise<string> {
    try {
      const teams = await this.getAllTeams();
      return JSON.stringify(teams, null, 2);
    } catch (error) {
      console.error('Erro ao exportar dados:', error);
      throw error;
    }
  }

  async importFromJSON(jsonData: string): Promise<void> {
    try {
      const teams = JSON.parse(jsonData) as Team[];
      
      for (const team of teams) {
        const { id, ...teamData } = team;
        await this.createTeam(teamData);
      }
    } catch (error) {
      console.error('Erro ao importar dados:', error);
      throw error;
    }
  }
}

export const teamService = TeamService.getInstance();