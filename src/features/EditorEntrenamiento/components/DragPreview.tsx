import React from 'react';
import { useDndContext } from '@dnd-kit/core';
import { LibraryCard } from './LibraryCard';
import { ExerciseRowItem } from './canvas/ExerciseRow';
import { Ban } from 'lucide-react';

export const DragPreview: React.FC = () => {
  const { active, over } = useDndContext();

  if (!active || !active.data.current) return null;

  const { itemType, ...data } = active.data.current;
  const overType = over?.data.current?.type;

  // Check for invalid drops
  // Block inside Exercise is invalid
  const isBlockToExercise = (itemType === 'block') && (overType === 'exercise');
  
  const isInvalidDrop = isBlockToExercise;

  const renderContent = () => {
    // Canvas Exercise (Reordering)
    // We distinguish library exercise (itemType='exercise' from library) vs canvas exercise (type='exercise' from Sortable)
    // Library uses 'itemType', Sortable uses 'type' (if we set it that way) or we check properties.
    // In ExerciseRow.tsx we set data: { type: 'exercise', exercise: ... }
    // Library items have itemType in data.
    
    if (data.type === 'exercise' && data.exercise) {
         return (
            <div className="w-[800px] bg-white rounded-lg shadow-xl opacity-95 cursor-grabbing ring-2 ring-blue-500/50">
                 <ExerciseRowItem 
                    exercise={data.exercise} 
                    isOverlay 
                    viewMode="edit"
                 />
            </div>
        );
    }

    // Library Items
    if (itemType === 'exercise' || itemType === 'block' || itemType === 'template') {
      const isOverDay = overType === 'day';
      const dayName = isOverDay ? over?.data.current?.dayName : null;

      return (
        <div className={`transform rotate-2 cursor-grabbing shadow-2xl rounded-lg overflow-hidden bg-white border-2 ${isInvalidDrop ? 'border-red-500' : 'border-blue-500'}`} style={{ width: 280 }}>
          <LibraryCard
            title={data.name || data.title}
            subtitle={
                itemType === 'block' 
                ? 'Bloque' 
                : itemType === 'template'
                ? 'Plantilla'
                : 'Ejercicio'
            }
            type={itemType}
          />
          {isOverDay && !isInvalidDrop && (
            <div className="bg-blue-600 text-white text-xs py-1 px-2 text-center font-medium">
              Añadir a {dayName || 'Día'}
            </div>
          )}
          {isInvalidDrop && (
            <div className="bg-red-600 text-white text-xs py-1 px-2 text-center font-medium flex items-center justify-center gap-1">
               <Ban size={12} /> No permitido
            </div>
          )}
        </div>
      );
    }

    // Day Card Preview (Compact/Opaque)
    if (itemType === 'day' || active.data.current.type === 'day') {
        const name = data.name || data.dayName || 'Día';
        return (
             <div className="w-64 bg-white/95 backdrop-blur-sm p-4 rounded-xl shadow-2xl border-2 border-blue-500 flex flex-col gap-3 cursor-grabbing">
                 <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                    <span className="font-bold text-gray-800">{name}</span>
                    <span className="text-[10px] uppercase font-bold bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full tracking-wider">Mover</span>
                 </div>
                 <div className="space-y-2">
                    <div className="h-10 bg-gray-50 rounded border border-gray-100 w-full flex items-center px-2">
                        <div className="w-8 h-2 bg-gray-200 rounded-full"></div>
                    </div>
                    <div className="h-10 bg-gray-50 rounded border border-gray-100 w-full flex items-center px-2 opacity-60">
                        <div className="w-6 h-2 bg-gray-200 rounded-full"></div>
                    </div>
                 </div>
             </div>
        );
    }
    
    return null;
  };

  return (
    <div className={isInvalidDrop ? 'cursor-not-allowed' : ''}>
        {renderContent()}
    </div>
  );
};
