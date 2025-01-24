import { ReactNode } from 'react';
import { cn } from '../../lib/utils/styles';

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export function Card({ children, className, onClick }: CardProps) {
  return (
    <div 
      onClick={onClick}
      className={cn(
        "bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6",
        "hover:shadow-lg transition-all duration-200",
        "border border-gray-200 dark:border-gray-700",
        onClick && "cursor-pointer hover:-translate-y-1",
        className
      )}
    >
      {children}
    </div>
  );
}