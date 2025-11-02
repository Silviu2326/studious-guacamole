import React from 'react';
import { Circle } from 'lucide-react';

interface SemáforoSerieProps {
  estado: 'rojo' | 'amarillo' | 'verde';
  serie?: number;
  onClick?: () => void;
  size?: 'sm' | 'md' | 'lg';
}

export const SemáforoSerie: React.FC<SemáforoSerieProps> = ({
  estado,
  serie,
  onClick,
  size = 'md',
}) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  const estadoClasses = {
    rojo: 'bg-red-500 hover:bg-red-600 border-red-600',
    amarillo: 'bg-yellow-500 hover:bg-yellow-600 border-yellow-600',
    verde: 'bg-green-500 hover:bg-green-600 border-green-600',
  };

  return (
    <div className="flex flex-col items-center gap-1">
      {serie !== undefined && (
        <span className="text-xs font-medium text-gray-600">Serie {serie}</span>
      )}
      <button
        onClick={onClick}
        className={`
          ${sizeClasses[size]}
          ${estadoClasses[estado]}
          rounded-full border-2
          ${onClick ? 'cursor-pointer transition-all hover:scale-110' : 'cursor-default'}
          flex items-center justify-center
          shadow-md
        `}
        title={`Estado: ${estado}`}
      >
        <Circle className={`${size === 'lg' ? 'w-6 h-6' : size === 'md' ? 'w-4 h-4' : 'w-3 h-3'} text-white`} fill="currentColor" />
      </button>
    </div>
  );
};

