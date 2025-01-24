import { Collaborator } from '../types';
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
  serverTimestamp
} from 'firebase/firestore';

class CollaboratorService {
  private static instance: CollaboratorService;
  private readonly collectionName = 'collaborators';
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutos
  private cache: {
    data: Collaborator[];
    timestamp: number;
  } | null = null;

  private constructor() {}

  static getInstance(): CollaboratorService {
    if (!CollaboratorService.instance) {
      CollaboratorService.instance = new CollaboratorService();
    }
    return CollaboratorService.instance;
  }

  async getAllCollaborators(): Promise<Collaborator[]> {
    try {
      // Verifica cache
      if (this.cache && (Date.now() - this.cache.timestamp) < this.CACHE_DURATION) {
        return this.cache.data;
      }

      const querySnapshot = await getDocs(collection(db, this.collectionName));
      const collaborators = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Collaborator));

      // Atualiza cache
      this.cache = {
        data: collaborators,
        timestamp: Date.now()
      };

      return collaborators;
    } catch (error) {
      console.error('Erro ao buscar prestadores:', error);
      // Retorna cache mesmo expirado em caso de erro
      if (this.cache) {
        return this.cache.data;
      }
      throw error;
    }
  }

  async getCollaboratorById(id: string): Promise<Collaborator | null> {
    try {
      // Verifica cache primeiro
      if (this.cache) {
        const cachedCollaborator = this.cache.data.find(c => c.id === id);
        if (cachedCollaborator) {
          return cachedCollaborator;
        }
      }

      const docRef = doc(db, this.collectionName, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data()
        } as Collaborator;
      }
      return null;
    } catch (error) {
      console.error('Erro ao buscar prestador:', error);
      throw error;
    }
  }

  async createCollaborator(collaborator: Omit<Collaborator, 'id'>): Promise<Collaborator> {
    try {
      const validation = await this.validateCollaborator(collaborator);
      if (!validation.valid) {
        throw new Error(validation.message);
      }

      const docRef = await addDoc(collection(db, this.collectionName), {
        ...collaborator,
        active: true,
        createdAt: serverTimestamp()
      });

      const newCollaborator = {
        id: docRef.id,
        ...collaborator,
        active: true
      };

      // Atualiza cache
      if (this.cache) {
        this.cache.data.push(newCollaborator);
      }

      return newCollaborator;
    } catch (error) {
      console.error('Erro ao criar prestador:', error);
      throw error;
    }
  }

  async updateCollaborator(id: string, updates: Partial<Collaborator>): Promise<void> {
    try {
      const docRef = doc(db, this.collectionName, id);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });

      // Atualiza cache
      if (this.cache) {
        this.cache.data = this.cache.data.map(collaborator =>
          collaborator.id === id ? { ...collaborator, ...updates } : collaborator
        );
      }
    } catch (error) {
      console.error('Erro ao atualizar prestador:', error);
      throw error;
    }
  }

  async deleteCollaborator(id: string): Promise<void> {
    try {
      const docRef = doc(db, this.collectionName, id);
      await deleteDoc(docRef);

      // Atualiza cache
      if (this.cache) {
        this.cache.data = this.cache.data.filter(collaborator => collaborator.id !== id);
      }
    } catch (error) {
      console.error('Erro ao deletar prestador:', error);
      throw error;
    }
  }

  clearCache(): void {
    this.cache = null;
  }

  private async validateCollaborator(collaborator: Partial<Collaborator>): Promise<{ valid: boolean; message?: string }> {
    try {
      if (!collaborator.name?.trim()) {
        return { valid: false, message: 'Nome do prestador é obrigatório' };
      }

      if (!collaborator.email?.trim()) {
        return { valid: false, message: 'Email é obrigatório' };
      }

      if (!collaborator.document?.trim()) {
        return { valid: false, message: 'Documento é obrigatório' };
      }

      // Verifica email duplicado
      const emailQuery = query(
        collection(db, this.collectionName),
        where('email', '==', collaborator.email)
      );
      
      const emailSnapshot = await getDocs(emailQuery);
      const emailExists = emailSnapshot.docs.some(doc => doc.id !== collaborator.id);

      if (emailExists) {
        return { valid: false, message: 'Já existe um prestador com este email' };
      }

      // Verifica documento duplicado
      const documentQuery = query(
        collection(db, this.collectionName),
        where('document', '==', collaborator.document)
      );
      
      const documentSnapshot = await getDocs(documentQuery);
      const documentExists = documentSnapshot.docs.some(doc => doc.id !== collaborator.id);

      if (documentExists) {
        return { valid: false, message: 'Já existe um prestador com este documento' };
      }

      return { valid: true };
    } catch (error) {
      console.error('Erro ao validar prestador:', error);
      throw error;
    }
  }
}

export const collaboratorService = CollaboratorService.getInstance();