import React from 'react';

export interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const Switch: React.FC<SwitchProps> = ({
  checked,
  onChange,
  disabled = false,
  label,
  size = 'md',
}) => {
  const sizeClasses = {
    sm: 'w-8 h-4',
    md: 'w-11 h-6',
    lg: 'w-14 h-7',
  };

  const thumbSizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const translateClasses = {
    sm: checked ? 'translate-x-4' : 'translate-x-0',
    md: checked ? 'translate-x-5' : 'translate-x-0',
    lg: checked ? 'translate-x-7' : 'translate-x-0',
  };

  return (
    <label className="inline-flex items-center gap-2 cursor-pointer">
      {label && (
        <span className="text-sm text-gray-700">{label}</span>
      )}
      <div className="relative inline-block">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
          className="sr-only"
        />
        <div
          className={`
            ${sizeClasses[size]}
            ${checked ? 'bg-blue-600' : 'bg-gray-300'}
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            rounded-full transition-colors duration-200 ease-in-out
          `}
          onClick={() => !disabled && onChange(!checked)}
        >
          <div
            className={`
              ${thumbSizeClasses[size]}
              ${translateClasses[size]}
              bg-white rounded-full shadow-md
              transform transition-transform duration-200 ease-in-out
              absolute top-0.5 left-0.5
            `}
          />
        </div>
      </div>
    </label>
  );
};


