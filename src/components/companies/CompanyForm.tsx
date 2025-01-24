import { useState, useEffect } from 'react';
import { Plus, Edit2 } from 'lucide-react';
import { Company } from '../../types';
import { FormField } from '../common/FormField';
import { InputMask } from '../common/InputMask';

interface CompanyFormProps {
  onSubmit: (company: Omit<Company, 'id'>) => void;
  initialData?: Company;
  isEditing?: boolean;
}

export function CompanyForm({ onSubmit, initialData, isEditing }: CompanyFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    cnpj: '',
    address: '',
    phone: '',
    email: '',
    contractStart: '',
    contractEnd: '',
    website: '',
    description: '',
    paymentInfo: {
      bankName: '',
      bankBranch: '',
      bankAccount: '',
      pixKey: '',
    },
    contactInfo: {
      name: '',
      email: '',
      phone: '',
      position: '',
    },
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        paymentInfo: initialData.paymentInfo || {
          bankName: '',
          bankBranch: '',
          bankAccount: '',
          pixKey: '',
        },
        contactInfo: initialData.contactInfo || {
          name: '',
          email: '',
          phone: '',
          position: '',
        },
      });
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    if (!isEditing) {
      setFormData({
        name: '',
        cnpj: '',
        address: '',
        phone: '',
        email: '',
        contractStart: '',
        contractEnd: '',
        website: '',
        description: '',
        paymentInfo: {
          bankName: '',
          bankBranch: '',
          bankAccount: '',
          pixKey: '',
        },
        contactInfo: {
          name: '',
          email: '',
          phone: '',
          position: '',
        },
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField label="Nome da Empresa" required>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value.toUpperCase() }))}
            className="w-full rounded-md border border-gray-300 px-3 py-2"
            required
          />
        </FormField>

        <FormField label="CNPJ" required>
          <InputMask
            value={formData.cnpj}
            onChange={(value) => setFormData(prev => ({ ...prev, cnpj: value }))}
            mask="cnpj"
            className="w-full rounded-md border border-gray-300 px-3 py-2"
            placeholder="00.000.000/0000-00"
            required
          />
        </FormField>
      </div>

      <FormField label="Endereço" required>
        <input
          type="text"
          value={formData.address}
          onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
          className="w-full rounded-md border border-gray-300 px-3 py-2"
          required
        />
      </FormField>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField label="Telefone" required>
          <InputMask
            value={formData.phone}
            onChange={(value) => setFormData(prev => ({ ...prev, phone: value }))}
            mask="phone"
            className="w-full rounded-md border border-gray-300 px-3 py-2"
            placeholder="(00) 00000-0000"
            required
          />
        </FormField>

        <FormField label="Email" required>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            className="w-full rounded-md border border-gray-300 px-3 py-2"
            required
          />
        </FormField>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField label="Website">
          <input
            type="url"
            value={formData.website}
            onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
            className="w-full rounded-md border border-gray-300 px-3 py-2"
            placeholder="https://..."
          />
        </FormField>

        <FormField label="Descrição">
          <input
            type="text"
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            className="w-full rounded-md border border-gray-300 px-3 py-2"
          />
        </FormField>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField label="Início do Contrato">
          <input
            type="date"
            value={formData.contractStart}
            onChange={(e) => setFormData(prev => ({ ...prev, contractStart: e.target.value }))}
            className="w-full rounded-md border border-gray-300 px-3 py-2"
          />
        </FormField>

        <FormField label="Fim do Contrato">
          <input
            type="date"
            value={formData.contractEnd}
            min={formData.contractStart}
            onChange={(e) => setFormData(prev => ({ ...prev, contractEnd: e.target.value }))}
            className="w-full rounded-md border border-gray-300 px-3 py-2"
          />
        </FormField>
      </div>

      <div className="border-t pt-6">
        <h3 className="text-lg font-medium mb-4">Informações de Pagamento</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Banco">
            <input
              type="text"
              value={formData.paymentInfo.bankName}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                paymentInfo: { ...prev.paymentInfo, bankName: e.target.value }
              }))}
              className="w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </FormField>

          <FormField label="Agência">
            <input
              type="text"
              value={formData.paymentInfo.bankBranch}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                paymentInfo: { ...prev.paymentInfo, bankBranch: e.target.value }
              }))}
              className="w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </FormField>

          <FormField label="Conta">
            <input
              type="text"
              value={formData.paymentInfo.bankAccount}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                paymentInfo: { ...prev.paymentInfo, bankAccount: e.target.value }
              }))}
              className="w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </FormField>

          <FormField label="Chave PIX">
            <input
              type="text"
              value={formData.paymentInfo.pixKey}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                paymentInfo: { ...prev.paymentInfo, pixKey: e.target.value }
              }))}
              className="w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </FormField>
        </div>
      </div>

      <div className="border-t pt-6">
        <h3 className="text-lg font-medium mb-4">Contato Principal</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Nome">
            <input
              type="text"
              value={formData.contactInfo.name}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                contactInfo: { ...prev.contactInfo, name: e.target.value }
              }))}
              className="w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </FormField>

          <FormField label="Cargo">
            <input
              type="text"
              value={formData.contactInfo.position}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                contactInfo: { ...prev.contactInfo, position: e.target.value }
              }))}
              className="w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </FormField>

          <FormField label="Email">
            <input
              type="email"
              value={formData.contactInfo.email}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                contactInfo: { ...prev.contactInfo, email: e.target.value }
              }))}
              className="w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </FormField>

          <FormField label="Telefone">
            <InputMask
              value={formData.contactInfo.phone}
              onChange={(value) => setFormData(prev => ({
                ...prev,
                contactInfo: { ...prev.contactInfo, phone: value }
              }))}
              mask="phone"
              className="w-full rounded-md border border-gray-300 px-3 py-2"
              placeholder="(00) 00000-0000"
            />
          </FormField>
        </div>
      </div>

      <button
        type="submit"
        className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500"
      >
        {isEditing ? <Edit2 className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
        {isEditing ? "Atualizar Empresa" : "Adicionar Empresa"}
      </button>
    </form>
  );
}