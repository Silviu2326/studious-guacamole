import React from 'react';
import { Info, Plus, Box, Dumbbell, LayoutTemplate } from 'lucide-react';

interface LibraryCardProps {
  title: string;
  subtitle: string;
  type: 'block' | 'exercise' | 'template';
  onInfoClick?: () => void;
  onAddClick?: () => void;
}

export const LibraryCard: React.FC<LibraryCardProps> = ({
  title,
  subtitle,
  type,
  onInfoClick,
  onAddClick,
}) => {
  const getIcon = () => {
    switch (type) {
      case 'block':
        return <Box size={16} />;
      case 'exercise':
        return <Dumbbell size={16} />;
      case 'template':
        return <LayoutTemplate size={16} />;
      default:
        return <Dumbbell size={16} />;
    }
  };

  return (
    <div className="group flex items-center justify-between p-3 rounded-lg border border-transparent hover:border-blue-200 hover:bg-blue-50 cursor-grab active:cursor-grabbing transition-all">
      <div className="flex items-center gap-3 overflow-hidden">
        <div className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded flex items-center justify-center text-gray-500">
          {getIcon()}
        </div>
        <div className="min-w-0">
          <h4 className="text-sm font-medium text-gray-900 truncate" title={title}>
            {title}
          </h4>
          <p className="text-xs text-gray-500 truncate" title={subtitle}>
            {subtitle}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onInfoClick?.();
          }}
          className="p-1 text-gray-400 hover:text-blue-600 rounded hover:bg-blue-100"
          aria-label="Ver información"
        >
          <Info size={14} />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onAddClick?.();
          }}
          className="p-1 text-gray-400 hover:text-blue-600 rounded hover:bg-blue-100"
          aria-label="Agregar"
        >
          <Plus size={14} />
        </button>
      </div>
    </div>
  );
};
