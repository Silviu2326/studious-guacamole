import React, { useState, useRef, useEffect } from 'react';
import { Clock, Flame, Package, Plus, MoreHorizontal, Zap, Copy, Clipboard, Trash2, ArrowRight, Lock, Star, MessageSquare, AlertCircle, ThumbsUp, Activity, TrendingUp } from 'lucide-react';
import { useDroppable } from '@dnd-kit/core';
import { Day, Tag, Block } from '../../types/training';
import { TrainingBlock } from './TrainingBlock';
import { SmartFillModal } from '../modals/SmartFillModal';
import { SmartFillSolver, Restricciones } from '../../utils/SmartFill';
import { TagInput } from '../common/TagInput';
import { ContextMenu, ContextMenuItem } from '../common/ContextMenu';
import { useCollaboration, Collaborator } from '../../context/CollaborationContext';
import { useUserPreferences } from '../../context/UserPreferencesContext';
import { EmptyDayState } from './EmptyDayState';
import { useValidation } from '../../hooks/useValidation';
import { useUIContext } from '../../context/UIContext';

export interface DayCardProps {
  day: Day;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onUpdateDay?: (dayId: string, newDay: Day) => void;
  isDimmed?: boolean;
  isLockedBy?: Collaborator | null;
  onCopyFromMonday?: () => void;
  onUseAI?: () => void;
}

export const DayCard: React.FC<DayCardProps> = ({
  day,
  isExpanded,
  onToggleExpand,
  onUpdateDay,
  isDimmed = false,
  isLockedBy: propIsLockedBy,
  onCopyFromMonday,
  onUseAI
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id: `day-${day.id}`,
    data: { type: 'day', dayId: day.id, dayName: day.name }
  });

  const { activeUsers, currentUser } = useCollaboration();
  const { density } = useUserPreferences();
  const isCompact = density === 'compact';

  // Validation
  const { getDayAlerts } = useValidation();
  const { openFitCoach } = useUIContext();
  const alerts = getDayAlerts(day.id);
  const hasAlerts = alerts.length > 0;

  // Determine if the day is locked (either by prop or by context)
  const isLockedBy = propIsLockedBy || activeUsers.find(
    u => u.focusedElementId === day.id && u.id !== currentUser?.id
  );

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSmartFillOpen, setIsSmartFillOpen] = useState(false);
  const [isEditingTags, setIsEditingTags] = useState(false);
  const [contextMenu, setContextMenu] = useState<{ isOpen: boolean; x: number; y: number } | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSmartFillConfirm = (restricciones: Restricciones) => {
    if (!onUpdateDay || isLockedBy) return;
    const result = SmartFillSolver.resolver(day, restricciones);
    // Here we could notify user about changes: result.cambios
    onUpdateDay(day.id, result.day);
    setIsMenuOpen(false);
  };

  const handleTagAdd = (tag: Tag) => {
    if (!onUpdateDay || isLockedBy) return;
    // Check for duplicates
    if (day.tags.find(t => t.id === tag.id)) return;

    const newTags = [...day.tags, tag];
    onUpdateDay(day.id, { ...day, tags: newTags });
  };

  const handleTagRemove = (tagId: string) => {
    if (!onUpdateDay || isLockedBy) return;
    const newTags = day.tags.filter(t => t.id !== tagId);
    onUpdateDay(day.id, { ...day, tags: newTags });
  };

  const handleUpdateBlock = (blockId: string, newBlock: Block) => {
    if (!onUpdateDay) return;
    // Note: Block locking is handled inside TrainingBlock, but we check here too
    const newBlocks = day.blocks.map(b => b.id === blockId ? newBlock : b);
    onUpdateDay(day.id, { ...day, blocks: newBlocks });
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    if (isLockedBy) return;
    e.preventDefault();
    setContextMenu({
      isOpen: true,
      x: e.clientX,
      y: e.clientY
    });
  };

  const handleCopyDay = () => {
    localStorage.setItem('copiedDay', JSON.stringify(day));
    // Optional: Add toast notification here
  };

  const handlePasteDay = () => {
    if (!onUpdateDay || isLockedBy) return;
    try {
      const copiedDayStr = localStorage.getItem('copiedDay');
      if (copiedDayStr) {
        const copiedDay = JSON.parse(copiedDayStr);
        // Maintain current day ID and name, replace content
        onUpdateDay(day.id, {
          ...day,
          blocks: copiedDay.blocks || [],
          tags: copiedDay.tags || []
        });
      }
    } catch (error) {
      console.error('Error pasting day:', error);
    }
  };

  const handleClearDay = () => {
    if (!onUpdateDay || isLockedBy) return;
    if (window.confirm('¿Estás seguro de que quieres limpiar este día?')) {
      onUpdateDay(day.id, { ...day, blocks: [], tags: [] });
    }
  };

  const handleDuplicateBlock = (blockId: string) => {
    if (!onUpdateDay || isLockedBy) return;
    const blockIndex = day.blocks.findIndex(b => b.id === blockId);
    if (blockIndex === -1) return;

    const blockToDuplicate = day.blocks[blockIndex];
    const newBlock = {
      ...blockToDuplicate,
      id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2),
      exercises: blockToDuplicate.exercises.map(e => ({
        ...e,
        id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2)
      }))
    };

    const newBlocks = [...day.blocks];
    newBlocks.splice(blockIndex + 1, 0, newBlock);
    onUpdateDay(day.id, { ...day, blocks: newBlocks });
  };

  const handleRemoveBlock = (blockId: string) => {
    if (!onUpdateDay || isLockedBy) return;
    if (window.confirm('¿Estás seguro de eliminar este bloque?')) {
      const newBlocks = day.blocks.filter(b => b.id !== blockId);
      onUpdateDay(day.id, { ...day, blocks: newBlocks });
    }
  };

  const handleDuplicateNext = () => {
    if (isLockedBy) return;
    // This would require access to parent state or a callback prop for duplication
    alert('Función "Duplicar al siguiente" requiere integración con el contexto del programa.');
  };

  const contextMenuItems: ContextMenuItem[] = [
    {
      label: 'Copiar Día',
      icon: <Copy size={14} />,
      onClick: handleCopyDay
    },
    {
      label: 'Pegar',
      icon: <Clipboard size={14} />,
      onClick: handlePasteDay
    },
    {
      label: 'Duplicar al siguiente',
      icon: <ArrowRight size={14} />,
      onClick: handleDuplicateNext,
      separator: true
    },
    {
      label: 'Limpiar Día',
      icon: <Trash2 size={14} />,
      onClick: handleClearDay,
      danger: true
    }
  ];

  const cardClasses = `day-card group bg-white shadow-sm rounded-xl ${isCompact ? 'p-2' : 'p-4'} flex flex-col h-full transition-all duration-300 ease-in-out relative border ${isOver
    ? 'border-blue-500 border-dashed bg-blue-50 ring-2 ring-blue-200'
    : 'border-transparent hover:border-gray-200'
    } ${isExpanded ? 'col-span-full ring-1 ring-blue-500/20 shadow-md' : ''
    } ${isDimmed ? 'opacity-40 grayscale-[0.5] pointer-events-none' : ''
    } ${isLockedBy ? 'opacity-90' : ''
    }`;

  return (
    <>
      <div
        ref={setNodeRef}
        className={cardClasses}
      >
        {/* Quick Actions Overlay */}
        {!isLockedBy && (
          <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
            <button
              onClick={(e) => { e.stopPropagation(); handleCopyDay(); }}
              className="p-1.5 bg-white text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md shadow-sm border border-gray-100 transition-colors"
              title="Copiar día"
            >
              <Copy size={14} />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); handleClearDay(); }}
              className="p-1.5 bg-white text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md shadow-sm border border-gray-100 transition-colors"
              title="Limpiar día"
            >
              <Trash2 size={14} />
            </button>
          </div>
        )}

        {/* Locking Overlay for Day */}
        {isLockedBy && (
          <div className="absolute inset-0 z-20 bg-white/50 backdrop-blur-[1px] rounded-xl flex items-center justify-center cursor-not-allowed">
            <div className="bg-white px-3 py-2 rounded-full shadow-lg border border-gray-200 flex items-center gap-2 animate-in fade-in zoom-in duration-200">
              <Lock size={14} className="text-gray-500" />
              <div className="flex items-center gap-1.5">
                {isLockedBy.avatar && (
                  <img src={isLockedBy.avatar} alt="" className="w-4 h-4 rounded-full" />
                )}
                <span className="text-xs font-medium text-gray-600">
                  Editado por {isLockedBy.name}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Header with Context Menu Trigger */}
        <div
          className={`flex justify-between items-center mb-2 ${!isLockedBy ? 'cursor-context-menu' : ''}`}
          onContextMenu={handleContextMenu}
        >
          <div className="flex items-center gap-2">
            <h3 className={`font-bold ${isCompact ? 'text-xs' : 'text-sm'} text-gray-800`}>{day.name}</h3>
            {hasAlerts && (
              <div
                className="cursor-pointer text-yellow-500 hover:text-yellow-600 animate-pulse"
                onClick={(e) => {
                  e.stopPropagation();
                  openFitCoach('Alertas');
                }}
                title={alerts.map(a => a.message).join('\n')}
              >
                <AlertCircle size={16} />
              </div>
            )}
          </div>
          {isEditingTags && !isLockedBy ? (
            <div className="max-w-[180px]">
              <TagInput
                tags={day.tags}
                onAddTag={handleTagAdd}
                onRemoveTag={handleTagRemove}
                autoFocus
                onBlur={() => setIsEditingTags(false)}
              />
            </div>
          ) : (
            <div
              className={`flex gap-1 rounded px-1 -mx-1 py-0.5 transition-colors min-h-[24px] items-center ${!isLockedBy ? 'cursor-pointer hover:bg-gray-50 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none' : ''}`}
              role="button"
              tabIndex={isLockedBy ? -1 : 0}
              aria-label="Editar etiquetas"
              onClick={(e) => {
                if (isLockedBy) return;
                e.stopPropagation();
                setIsEditingTags(true);
              }}
              onKeyDown={(e) => {
                if (isLockedBy) return;
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsEditingTags(true);
                }
              }}
            >
              {day.tags.length > 0 ? (
                <>
                  {day.tags.slice(0, 2).map((tag, index) => (
                    <span key={tag.id || index} className="text-xs bg-gray-100 text-gray-600 rounded-full px-2 py-0.5">
                      #{tag.label}
                    </span>
                  ))}
                  {day.tags.length > 2 && (
                    <span className="text-xs text-gray-400">
                      +{day.tags.length - 2}
                    </span>
                  )}
                </>
              ) : null}
            </div>
          )}
        </div>

        {/* Content: Blocks or Empty State */}
        <div className="flex-1 overflow-y-auto min-h-0">
          {day.blocks.length === 0 ? (
            <EmptyDayState
              onUseAI={onUseAI}
              onCopyFromMonday={onCopyFromMonday}
            />
          ) : (
            <div className="space-y-2">
              {day.blocks.map((block) => (
                <TrainingBlock
                  key={block.id}
                  block={block}
                  onUpdateBlock={(newBlock) => handleUpdateBlock(block.id, newBlock)}
                  isLockedBy={isLockedBy}
                  onDuplicate={() => handleDuplicateBlock(block.id)}
                  onRemove={() => handleRemoveBlock(block.id)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
      <div className="flex justify-between items-center mt-auto pt-2 border-t border-transparent relative no-print">
        <button
          className="text-sm text-blue-600 font-medium hover:text-blue-800 flex items-center gap-1 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none rounded px-1"
          onClick={onToggleExpand}
          aria-label={isExpanded ? "Colapsar detalles del día" : "Ver más información del día"}
        >
          {isExpanded ? 'Colapsar' : '+ Info'}
        </button>

        <div ref={menuRef} className="relative">
          <button
            disabled={!!isLockedBy}
            className="text-gray-400 hover:text-gray-700 p-1 rounded-md hover:bg-gray-100 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none disabled:opacity-50"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Opciones del día"
            aria-haspopup="true"
            aria-expanded={isMenuOpen}
          >
            <MoreHorizontal size={16} aria-hidden="true" />
          </button>

          {isMenuOpen && !isLockedBy && (
            <div className="absolute right-0 bottom-full mb-2 w-40 bg-white rounded-md shadow-lg border border-gray-100 z-10 overflow-hidden">
              <button
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 flex items-center gap-2 transition-colors focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none"
                onClick={() => {
                  setIsSmartFillOpen(true);
                  setIsMenuOpen(false);
                }}
                aria-label="Smart Fill: Rellenar entrenamiento automáticamente"
              >
                <Zap size={14} className="text-yellow-500" aria-hidden="true" />
                Smart Fill
              </button>
              {/* Add more options here later */}
            </div>
          )}
        </div>
      </div>
    </div >

      <SmartFillModal
        isOpen={isSmartFillOpen}
        onClose={() => setIsSmartFillOpen(false)}
        onConfirm={handleSmartFillConfirm}
      />

  {
    contextMenu && !isLockedBy && (
      <ContextMenu
        x={contextMenu.x}
        y={contextMenu.y}
        items={contextMenuItems}
        onClose={() => setContextMenu(null)}
      />
    )
  }
    </>
  );
};