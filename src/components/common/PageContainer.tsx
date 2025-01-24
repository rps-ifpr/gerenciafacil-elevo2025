import { ReactNode } from 'react';
import { PageHeader } from '../layout/PageHeader';

interface PageContainerProps {
  title: string;
  action?: ReactNode;
  children: ReactNode;
}

export function PageContainer({ title, action, children }: PageContainerProps) {
  return (
    <div className="space-y-6">
      <div className="bg-white shadow-sm rounded-lg p-6">
        <PageHeader title={title} action={action} />
        {children}
      </div>
    </div>
  );
}