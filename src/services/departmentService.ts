import { Department } from '../types/Department';
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

class DepartmentService {
  private static instance: DepartmentService;
  private readonly collectionName = 'departments';

  private constructor() {}

  static getInstance(): DepartmentService {
    if (!DepartmentService.instance) {
      DepartmentService.instance = new DepartmentService();
    }
    return DepartmentService.instance;
  }

  async getAllDepartments(): Promise<Department[]> {
    try {
      const querySnapshot = await getDocs(collection(db, this.collectionName));
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Department));
    } catch (error) {
      console.error('Erro ao buscar departamentos:', error);
      throw error;
    }
  }

  async getDepartmentById(id: string): Promise<Department | null> {
    try {
      const docRef = doc(db, this.collectionName, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data()
        } as Department;
      }
      return null;
    } catch (error) {
      console.error('Erro ao buscar departamento:', error);
      throw error;
    }
  }

  async createDepartment(department: Omit<Department, 'id'>): Promise<Department> {
    try {
      const docRef = await addDoc(collection(db, this.collectionName), {
        ...department,
        active: true,
        createdAt: new Date().toISOString()
      });

      return {
        id: docRef.id,
        ...department,
        active: true
      };
    } catch (error) {
      console.error('Erro ao criar departamento:', error);
      throw error;
    }
  }

  async updateDepartment(id: string, updates: Partial<Department>): Promise<void> {
    try {
      const docRef = doc(db, this.collectionName, id);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Erro ao atualizar departamento:', error);
      throw error;
    }
  }

  async deleteDepartment(id: string): Promise<void> {
    try {
      const docRef = doc(db, this.collectionName, id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Erro ao deletar departamento:', error);
      throw error;
    }
  }

  async toggleDepartmentStatus(id: string): Promise<void> {
    try {
      const department = await this.getDepartmentById(id);
      if (department) {
        await this.updateDepartment(id, {
          active: !department.active
        });
      }
    } catch (error) {
      console.error('Erro ao alternar status do departamento:', error);
      throw error;
    }
  }

  async validateDepartment(department: Partial<Department>): Promise<{ valid: boolean; message?: string }> {
    try {
      if (!department.name?.trim()) {
        return { valid: false, message: 'Nome do departamento é obrigatório' };
      }

      const q = query(
        collection(db, this.collectionName),
        where('name', '==', department.name)
      );
      
      const querySnapshot = await getDocs(q);
      const exists = querySnapshot.docs.some(doc => doc.id !== department.id);

      if (exists) {
        return { valid: false, message: 'Já existe um departamento com este nome' };
      }

      return { valid: true };
    } catch (error) {
      console.error('Erro ao validar departamento:', error);
      throw error;
    }
  }

  async exportToJSON(): Promise<string> {
    try {
      const departments = await this.getAllDepartments();
      return JSON.stringify(departments, null, 2);
    } catch (error) {
      console.error('Erro ao exportar dados:', error);
      throw error;
    }
  }

  async importFromJSON(jsonData: string): Promise<void> {
    try {
      const departments = JSON.parse(jsonData) as Department[];
      
      // Cria um batch de operações
      for (const dept of departments) {
        const { id, ...departmentData } = dept;
        await this.createDepartment(departmentData);
      }
    } catch (error) {
      console.error('Erro ao importar dados:', error);
      throw error;
    }
  }
}

export const departmentService = DepartmentService.getInstance();