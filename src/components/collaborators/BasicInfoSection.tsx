import { FormField } from '../common/FormField';

interface BasicInfoSectionProps {
  formData: {
    name: string;
    email: string;
    password: string;
    document: string;
    phone: string;
    accessLevel: 'admin' | 'manager' | 'user';
  };
  onChange: (updates: Partial<BasicInfoSectionProps['formData']>) => void;
}

export function BasicInfoSection({ formData, onChange }: BasicInfoSectionProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField label="Nome do Prestador" required>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => onChange({ name: e.target.value.toUpperCase() })}
            placeholder="Nome do prestador"
            className="w-full rounded-md border border-gray-300 px-3 py-2"
            required
          />
        </FormField>

        <FormField label="Email" required>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => onChange({ email: e.target.value })}
            placeholder="Email"
            className="w-full rounded-md border border-gray-300 px-3 py-2"
            required
          />
        </FormField>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormField label="Senha" required>
          <input
            type="password"
            value={formData.password}
            onChange={(e) => onChange({ password: e.target.value })}
            placeholder="Senha"
            className="w-full rounded-md border border-gray-300 px-3 py-2"
            required
          />
        </FormField>

        <FormField label="CPF/CNPJ" required>
          <input
            type="text"
            value={formData.document}
            onChange={(e) => onChange({ document: e.target.value })}
            placeholder="CPF/CNPJ"
            className="w-full rounded-md border border-gray-300 px-3 py-2"
            required
          />
        </FormField>

        <FormField label="Telefone">
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => onChange({ phone: e.target.value })}
            placeholder="Telefone"
            className="w-full rounded-md border border-gray-300 px-3 py-2"
          />
        </FormField>
      </div>

      <FormField label="Nível de Acesso" required>
        <select
          value={formData.accessLevel}
          onChange={(e) => onChange({ accessLevel: e.target.value as 'admin' | 'manager' | 'user' })}
          className="w-full rounded-md border border-gray-300 px-3 py-2"
          required
        >
          <option value="">Selecione o nível de acesso</option>
          <option value="admin">Administrador</option>
          <option value="manager">Gestor</option>
          <option value="user">Usuário</option>
        </select>
      </FormField>
    </div>
  );
}