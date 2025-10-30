import React, { forwardRef } from 'react';
import { ds } from '../../features/adherencia/ui/ds';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options: SelectOption[];
  placeholder?: string;
  fullWidth?: boolean;
  className?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(({
  label,
  error,
  helperText,
  options,
  placeholder,
  fullWidth = true,
  className = '',
  ...props
}, ref) => {
  const hasError = !!error;
  
  const selectClasses = `
    ${ds.select}
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
      
      <select
        ref={ref}
        className={selectClasses}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            disabled={option.disabled}
          >
            {option.label}
          </option>
        ))}
      </select>
      
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

Select.displayName = 'Select';
