import { Company } from '../types';
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

class CompanyService {
  private static instance: CompanyService;
  private readonly collectionName = 'companies';

  private constructor() {}

  static getInstance(): CompanyService {
    if (!CompanyService.instance) {
      CompanyService.instance = new CompanyService();
    }
    return CompanyService.instance;
  }

  async getAllCompanies(): Promise<Company[]> {
    try {
      const querySnapshot = await getDocs(collection(db, this.collectionName));
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Company));
    } catch (error) {
      console.error('Erro ao buscar empresas:', error);
      throw error;
    }
  }

  async getCompanyById(id: string): Promise<Company | null> {
    try {
      const docRef = doc(db, this.collectionName, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data()
        } as Company;
      }
      return null;
    } catch (error) {
      console.error('Erro ao buscar empresa:', error);
      throw error;
    }
  }

  async createCompany(company: Omit<Company, 'id'>): Promise<Company> {
    try {
      const validation = await this.validateCompany(company);
      if (!validation.valid) {
        throw new Error(validation.message);
      }

      // Remove campos vazios de contrato antes de salvar
      const companyData = {
        ...company,
        active: true,
        createdAt: serverTimestamp(),
        contractStart: company.contractStart || null,
        contractEnd: company.contractEnd || null
      };

      const docRef = await addDoc(collection(db, this.collectionName), companyData);

      return {
        id: docRef.id,
        ...company,
        active: true
      };
    } catch (error) {
      console.error('Erro ao criar empresa:', error);
      throw error;
    }
  }

  async updateCompany(id: string, updates: Partial<Company>): Promise<void> {
    try {
      const docRef = doc(db, this.collectionName, id);
      
      // Remove campos vazios de contrato antes de atualizar
      const updateData = {
        ...updates,
        updatedAt: serverTimestamp(),
        contractStart: updates.contractStart || null,
        contractEnd: updates.contractEnd || null
      };

      await updateDoc(docRef, updateData);
    } catch (error) {
      console.error('Erro ao atualizar empresa:', error);
      throw error;
    }
  }

  async deleteCompany(id: string): Promise<void> {
    try {
      const docRef = doc(db, this.collectionName, id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Erro ao deletar empresa:', error);
      throw error;
    }
  }

  async toggleCompanyStatus(id: string): Promise<void> {
    try {
      const company = await this.getCompanyById(id);
      if (company) {
        await this.updateCompany(id, {
          active: !company.active
        });
      }
    } catch (error) {
      console.error('Erro ao alternar status da empresa:', error);
      throw error;
    }
  }

  async validateCompany(company: Partial<Company>): Promise<{ valid: boolean; message?: string }> {
    try {
      if (!company.name?.trim()) {
        return { valid: false, message: 'Nome da empresa é obrigatório' };
      }

      if (!company.cnpj?.trim()) {
        return { valid: false, message: 'CNPJ é obrigatório' };
      }

      if (!company.email?.trim()) {
        return { valid: false, message: 'Email é obrigatório' };
      }

      if (!company.phone?.trim()) {
        return { valid: false, message: 'Telefone é obrigatório' };
      }

      if (!company.address?.trim()) {
        return { valid: false, message: 'Endereço é obrigatório' };
      }

      // Validação de CNPJ duplicado
      const q = query(
        collection(db, this.collectionName),
        where('cnpj', '==', company.cnpj)
      );
      
      const querySnapshot = await getDocs(q);
      const exists = querySnapshot.docs.some(doc => doc.id !== company.id);

      if (exists) {
        return { valid: false, message: 'Já existe uma empresa com este CNPJ' };
      }

      return { valid: true };
    } catch (error) {
      console.error('Erro ao validar empresa:', error);
      throw error;
    }
  }
}

export const companyService = CompanyService.getInstance();