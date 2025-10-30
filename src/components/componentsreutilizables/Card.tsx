import React from 'react';
import { ds } from '../../features/adherencia/ui/ds';

export interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'hover' | 'elevated';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  padding = 'md',
  className = '',
  onClick,
}) => {
  const baseClasses = ds.card;
  
  const variantClasses = {
    default: '',
    hover: ds.cardHover,
    elevated: 'shadow-xl hover:shadow-2xl',
  };
  
  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: ds.cardPad,
    lg: 'p-8',
    xl: 'p-10',
  };
  
  const interactiveClasses = onClick ? 'cursor-pointer' : '';
  
  const cardClasses = `
    ${baseClasses}
    ${variantClasses[variant]}
    ${paddingClasses[padding]}
    ${interactiveClasses}
    ${className}
  `.trim();

  const Component = onClick ? 'button' : 'div';
  
  return (
    <Component
      className={cardClasses}
      onClick={onClick}
    >
      {children}
    </Component>
  );
};
