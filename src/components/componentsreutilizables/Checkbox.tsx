import React from 'react';
import { Check } from 'lucide-react';

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  description?: string;
  helperText?: string;
  inputClassName?: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  label,
  description,
  helperText,
  disabled,
  className = '',
  inputClassName = '',
  ...props
}) => {
  const baseLabelClasses = disabled
    ? 'opacity-60 cursor-not-allowed'
    : 'cursor-pointer';

  return (
    <label className={`flex items-start gap-3 ${baseLabelClasses} ${className}`}>
      <span className="relative flex h-5 w-5 items-center justify-center">
        <input
          type="checkbox"
          disabled={disabled}
          className={`peer absolute h-5 w-5 cursor-pointer appearance-none rounded border border-gray-300 bg-white transition-colors duration-150 checked:border-indigo-600 checked:bg-indigo-600 disabled:cursor-not-allowed ${inputClassName}`}
          {...props}
        />
        <span className="pointer-events-none flex h-5 w-5 items-center justify-center">
          <Check className="h-3.5 w-3.5 text-white opacity-0 transition-opacity duration-150 peer-checked:opacity-100" />
        </span>
      </span>

      {(label || description || helperText) && (
        <span className="flex flex-col text-sm text-gray-700">
          {label && <span className="font-medium text-gray-900">{label}</span>}
          {description && <span className="text-gray-600">{description}</span>}
          {helperText && <span className="text-xs text-gray-500">{helperText}</span>}
        </span>
      )}
    </label>
  );
};
