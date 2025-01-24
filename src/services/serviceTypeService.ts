import { ServiceType } from '../types';
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

class ServiceTypeService {
  private static instance: ServiceTypeService;
  private readonly collectionName = 'serviceTypes';

  private constructor() {}

  static getInstance(): ServiceTypeService {
    if (!ServiceTypeService.instance) {
      ServiceTypeService.instance = new ServiceTypeService();
    }
    return ServiceTypeService.instance;
  }

  async getAllServiceTypes(): Promise<ServiceType[]> {
    try {
      const querySnapshot = await getDocs(collection(db, this.collectionName));
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as ServiceType));
    } catch (error) {
      console.error('Erro ao buscar tipos de serviço:', error);
      throw error;
    }
  }

  async getServiceTypeById(id: string): Promise<ServiceType | null> {
    try {
      const docRef = doc(db, this.collectionName, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data()
        } as ServiceType;
      }
      return null;
    } catch (error) {
      console.error('Erro ao buscar tipo de serviço:', error);
      throw error;
    }
  }

  async createServiceType(serviceType: Omit<ServiceType, 'id'>): Promise<ServiceType> {
    try {
      const docRef = await addDoc(collection(db, this.collectionName), {
        ...serviceType,
        active: true,
        createdAt: new Date().toISOString()
      });

      return {
        id: docRef.id,
        ...serviceType,
        active: true
      };
    } catch (error) {
      console.error('Erro ao criar tipo de serviço:', error);
      throw error;
    }
  }

  async updateServiceType(id: string, updates: Partial<ServiceType>): Promise<void> {
    try {
      const docRef = doc(db, this.collectionName, id);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Erro ao atualizar tipo de serviço:', error);
      throw error;
    }
  }

  async deleteServiceType(id: string): Promise<void> {
    try {
      const docRef = doc(db, this.collectionName, id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Erro ao deletar tipo de serviço:', error);
      throw error;
    }
  }

  async toggleServiceTypeStatus(id: string): Promise<void> {
    try {
      const serviceType = await this.getServiceTypeById(id);
      if (serviceType) {
        await this.updateServiceType(id, {
          active: !serviceType.active
        });
      }
    } catch (error) {
      console.error('Erro ao alternar status do tipo de serviço:', error);
      throw error;
    }
  }

  async validateServiceType(serviceType: Partial<ServiceType>): Promise<{ valid: boolean; message?: string }> {
    try {
      if (!serviceType.name?.trim()) {
        return { valid: false, message: 'Nome do tipo de serviço é obrigatório' };
      }

      const q = query(
        collection(db, this.collectionName),
        where('name', '==', serviceType.name)
      );
      
      const querySnapshot = await getDocs(q);
      const exists = querySnapshot.docs.some(doc => doc.id !== serviceType.id);

      if (exists) {
        return { valid: false, message: 'Já existe um tipo de serviço com este nome' };
      }

      return { valid: true };
    } catch (error) {
      console.error('Erro ao validar tipo de serviço:', error);
      throw error;
    }
  }

  async exportToJSON(): Promise<string> {
    try {
      const serviceTypes = await this.getAllServiceTypes();
      return JSON.stringify(serviceTypes, null, 2);
    } catch (error) {
      console.error('Erro ao exportar dados:', error);
      throw error;
    }
  }

  async importFromJSON(jsonData: string): Promise<void> {
    try {
      const serviceTypes = JSON.parse(jsonData) as ServiceType[];
      
      for (const type of serviceTypes) {
        const { id, ...typeData } = type;
        await this.createServiceType(typeData);
      }
    } catch (error) {
      console.error('Erro ao importar dados:', error);
      throw error;
    }
  }
}

export const serviceTypeService = ServiceTypeService.getInstance();