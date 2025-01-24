import { ReactNode } from 'react';

interface ListItemProps {
  title: string;
  subtitle?: string;
  status?: boolean;
  actions: ReactNode;
  children?: ReactNode;
}

export function ListItem({ title, subtitle, status, actions, children }: ListItemProps) {
  return (
    <div className="flex items-center justify-between p-4 border rounded-md hover:bg-gray-50">
      <div>
        <div className="flex items-center gap-2">
          <span className="font-medium">{title}</span>
          {status !== undefined && (
            <span className={`px-2 py-0.5 text-xs rounded-full ${
              status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {status ? 'Ativo' : 'Inativo'}
            </span>
          )}
        </div>
        {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
        {children}
      </div>
      <div className="flex gap-2">
        {actions}
      </div>
    </div>
  );
}