import { ReactNode } from 'react';

interface FormContainerProps {
  onSubmit: (e: React.FormEvent) => void;
  children: ReactNode;
  actions: ReactNode;
}

export function FormContainer({ onSubmit, children, actions }: FormContainerProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4 mb-6">
      {children}
      <div className="flex gap-2">
        {actions}
      </div>
    </form>
  );
}