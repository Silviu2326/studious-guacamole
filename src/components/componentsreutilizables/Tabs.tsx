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
  const baseClasses = ds.tabs.container;
  
  const variantClasses = {
    default: '',
    pills: 'bg-[#F1F5F9] dark:bg-[#2A2A3A] p-1 rounded-xl',
    underline: 'border-b-2 border-[#E2E8F0] dark:border-[#334155]',
  };
  
  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-3 text-base',
    lg: 'px-6 py-4 text-lg',
  };
  
  const fullWidthClasses = fullWidth ? 'flex-1' : '';
  
  const tabItemClasses = (isActive: boolean, isDisabled: boolean) => `
    ${ds.tabs.item}
    ${sizeClasses[size]}
    ${isActive ? ds.tabs.itemActive : ''}
    ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}
    ${fullWidthClasses}
    ${ds.animation.normal}
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
