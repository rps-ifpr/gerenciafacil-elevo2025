import { ChangeEvent } from 'react';

interface InputMaskProps {
  value: string;
  onChange: (value: string) => void;
  mask: 'phone' | 'cpf' | 'cnpj';
  placeholder?: string;
  className?: string;
  required?: boolean;
}

export function InputMask({ value, onChange, mask, ...props }: InputMaskProps) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    let newValue = e.target.value.replace(/\D/g, '');
    
    switch (mask) {
      case 'phone':
        if (newValue.length <= 11) {
          newValue = newValue.replace(/^(\d{2})(\d)/g, '($1) $2');
          newValue = newValue.replace(/(\d)(\d{4})$/, '$1-$2');
        }
        break;
      case 'cpf':
        if (newValue.length <= 11) {
          newValue = newValue.replace(/(\d{3})(\d)/, '$1.$2');
          newValue = newValue.replace(/(\d{3})(\d)/, '$1.$2');
          newValue = newValue.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
        }
        break;
      case 'cnpj':
        if (newValue.length <= 14) {
          newValue = newValue.replace(/^(\d{2})(\d)/, '$1.$2');
          newValue = newValue.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
          newValue = newValue.replace(/\.(\d{3})(\d)/, '.$1/$2');
          newValue = newValue.replace(/(\d{4})(\d)/, '$1-$2');
        }
        break;
    }

    onChange(newValue);
  };

  return (
    <input
      type="text"
      value={value}
      onChange={handleChange}
      {...props}
    />
  );
}