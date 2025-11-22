import React from 'react';
import { 
  DndContext, 
  closestCorners, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors, 
  DragOverlay,
  defaultDropAnimationSideEffects,
  DropAnimation,
  DragStartEvent,
  DragEndEvent,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { useProgramContext } from './ProgramContext';
import { useCanvasDnd } from '../hooks/useCanvasDnd';
import { DragPreview } from '../components/DragPreview';

export const GlobalDnDContext: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const { daysData, setProgramData } = useProgramContext();
  const { handleDragEnd: handleLibraryDrop } = useCanvasDnd(daysData, setProgramData);

  const sensors = useSensors(
    useSensor(PointerSensor, {
        activationConstraint: {
            distance: 8,
        },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    // Debug log or state tracking if needed
  };

  const handleDragEnd = (event: DragEndEvent) => {
    // 1. Handle Library Drop
    handleLibraryDrop(event);

    // 2. Handle Reordering (Future implementation)
    // const { active, over } = event;
    // if (active.id !== over?.id) { ... }
  };

  const dropAnimation: DropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: {
        active: {
          opacity: '0.5',
        },
      },
    }),
  };

  return (
    <DndContext 
      sensors={sensors} 
      collisionDetection={closestCorners} 
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      {children}
      <DragOverlay dropAnimation={dropAnimation} zIndex={1000}>
         <DragPreview />
      </DragOverlay>
    </DndContext>
  );
};
