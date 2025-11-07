import React from 'react';
import { ds } from '../../features/adherencia/ui/ds';

export interface TabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export interface TabsProps {
  items: TabItem[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  variant?: 'default' | 'pills' | 'underline';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({
  items,
  activeTab,
  onTabChange,
  variant = 'default',
  size = 'md',
  fullWidth = false,
  className = '',
}) => {
  const baseClasses = `flex gap-2 border-b border-gray-200 dark:border-[#334155]`;
  
  const variantClasses = {
    default: '',
    pills: 'bg-slate-100 dark:bg-[#2A2A3A] p-1 rounded-xl',
    underline: 'border-b-2 border-gray-200 dark:border-[#334155]',
  };
  
  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-3 text-base',
    lg: 'px-6 py-4 text-lg',
  };
  
  const fullWidthClasses = fullWidth ? 'flex-1' : '';
  
  const tabItemClasses = (isActive: boolean, isDisabled: boolean) => `
    flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium text-gray-600 dark:text-[#94A3B8] hover:bg-gray-50 dark:hover:bg-[#2A2A3A] transition-all duration-200
    ${sizeClasses[size]}
    ${isActive ? 'bg-blue-50 dark:bg-[#312E81] text-blue-600 dark:text-[#818CF8] border border-blue-100 dark:border-[#312E81]' : ''}
    ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}
    ${fullWidthClasses}
  `.trim();

  return (
    <nav className={`${baseClasses} ${variantClasses[variant]} ${className}`} aria-label="Tabs">
      {items.map((item) => (
        <button
          key={item.id}
          onClick={() => !item.disabled && onTabChange(item.id)}
          className={tabItemClasses(item.id === activeTab, item.disabled || false)}
          disabled={item.disabled}
          aria-selected={item.id === activeTab}
          role="tab"
        >
          {item.icon && (
            <span className="mr-2">
              {item.icon}
            </span>
          )}
          <span className="font-medium">{item.label}</span>
        </button>
      ))}
    </nav>
  );
};
