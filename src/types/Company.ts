export interface Company {
  id: string;
  name: string;
  cnpj: string;
  email: string;
  phone: string;
  address: string;
  active: boolean;
  contractStart?: string; // Agora opcional
  contractEnd?: string; // Agora opcional
  website?: string;
  description?: string;
  paymentInfo?: {
    bankName: string;
    bankBranch: string;
    bankAccount: string;
    pixKey: string;
  };
  contactInfo?: {
    name: string;
    email: string;
    phone: string;
    position: string;
  };
}