import React, { forwardRef } from 'react';
import { ds } from '../../features/adherencia/ui/ds';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  className?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  fullWidth = true,
  className = '',
  ...props
}, ref) => {
  const hasError = !!error;
  
  const inputClasses = `
    ${ds.input}
    ${leftIcon ? 'pl-12' : ''}
    ${rightIcon ? 'pr-12' : ''}
    ${hasError ? 'border-[#EF4444] focus:ring-[#EF4444]' : ''}
    ${fullWidth ? 'w-full' : ''}
    ${className}
  `.trim();

  return (
    <div className={`space-y-2 ${fullWidth ? 'w-full' : ''}`}>
      {label && (
        <label className={`block ${ds.typography.bodySmall} font-semibold ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
          {label}
        </label>
      )}
      
      <div className="relative">
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <div className="text-[#64748B] dark:text-[#94A3B8]">
              {leftIcon}
            </div>
          </div>
        )}
        
        <input
          ref={ref}
          className={inputClasses}
          {...props}
        />
        
        {rightIcon && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <div className="text-[#64748B] dark:text-[#94A3B8]">
              {rightIcon}
            </div>
          </div>
        )}
      </div>
      
      {error && (
        <p className={`${ds.typography.caption} ${ds.color.error}`}>
          {error}
        </p>
      )}
      
      {helperText && !error && (
        <p className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark}`}>
          {helperText}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';
