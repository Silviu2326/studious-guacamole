import React, { forwardRef } from 'react';
import { ds } from '../../features/adherencia/ui/ds';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
  className?: string;
  showCount?: boolean;
  maxLength?: number;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(({
  label,
  error,
  helperText,
  fullWidth = true,
  className = '',
  showCount = false,
  maxLength,
  ...props
}, ref) => {
  const hasError = !!error;
  const currentLength = (props.value as string)?.length || 0;
  
  const textareaClasses = `
    ${ds.input}
    ${hasError ? 'border-[#EF4444] focus:ring-[#EF4444]' : ''}
    ${fullWidth ? 'w-full' : ''}
    resize-none
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
        <textarea
          ref={ref}
          className={textareaClasses}
          maxLength={maxLength}
          {...props}
        />
        
        {showCount && maxLength && (
          <div className="absolute bottom-2 right-2 text-xs text-[#94A3B8] dark:text-[#64748B]">
            {currentLength}/{maxLength}
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

Textarea.displayName = 'Textarea';
