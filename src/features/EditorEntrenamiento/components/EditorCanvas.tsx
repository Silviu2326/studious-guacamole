import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Plus, Flame, Package, LayoutGrid, FileSpreadsheet, BarChart3 } from 'lucide-react';
import { List, ListImperativeAPI } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';

import { GlobalFilterBar } from './GlobalFilterBar';
import { CollaboratorsIndicator } from './canvas/CollaboratorsIndicator';
import { DayCard } from './canvas/DayCard';
import { EmptyWeekState } from './canvas/EmptyWeekState';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { MobileDayView } from './MobileDayView';
import { useProgramContext } from '../context/ProgramContext';
import { useUIContext } from '../context/UIContext';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';
import { WeeklySummaryFooter } from './canvas/WeeklySummaryFooter';
import { Day, Week } from '../types/training';
import { useUserPreferences } from '../context/UserPreferencesContext';
import { useEditorToast } from './feedback/ToastSystem';
import { ExcelView } from './views/ExcelView';
import { TimelineView } from './views/TimelineView';

const COLLAPSED_HEIGHT = 200;
const COLLAPSED_HEIGHT_COMPACT = 150;
const EXPANDED_HEIGHT = 600;

interface WeekRowData {
  weeks: Week[];
  expandedDayIndex: number | null;
  onToggleExpand: (index: number) => void;
  onUpdateDay: (dayId: string, newDay: Day) => void;
  shouldDimDay: (day: Day) => boolean;
  onCopyFromMonday: (targetDayId: string, mondayDay: Day) => void;
  onUseAI: () => void;
}

const WeekRow = ({ index, style, weeks, expandedDayIndex, onToggleExpand, onUpdateDay, shouldDimDay, onCopyFromMonday, onUseAI }: WeekRowData & { index: number; style: React.CSSProperties }) => {
  const week = weeks[index];
  const weekDays = week.days;
  const startIndex = index * 7;
  const mondayDay = weekDays[0];

  return (
    <div style={style} className="px-1">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4 h-full pb-4">
        {weekDays.map((day, dayIndex) => {
          const globalIndex = startIndex + dayIndex;
          return (
            <DayCard
              key={day.id}
              day={day}
              isExpanded={expandedDayIndex === globalIndex}
              onToggleExpand={() => onToggleExpand(globalIndex)}
              onUpdateDay={onUpdateDay}
              isDimmed={shouldDimDay(day)}
              onCopyFromMonday={dayIndex > 0 ? () => onCopyFromMonday(day.id, mondayDay) : undefined}
              onUseAI={onUseAI}
            />
          );
        })}
      </div>
    </div>
  );
};

export const EditorCanvas: React.FC = () => {
  const [expandedDayIndex, setExpandedDayIndex] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<'weekly' | 'excel' | 'timeline'>('weekly');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const isMobile = useMediaQuery('(max-width: 768px)');
  const listRef = useRef<ListImperativeAPI>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const { weeks, daysData, updateDay, addWeek } = useProgramContext();
  const { setAIProgramGeneratorOpen, setBatchTrainingOpen } = useUIContext();
  const { density } = useUserPreferences();
  const { addToast } = useEditorToast();
  const isCompact = density === 'compact';

  const prevWeeksLength = useRef(weeks.length);

  useEffect(() => {
    if (weeks.length > prevWeeksLength.current) {
      if (viewMode === 'weekly') {
        if (containerRef.current) {
          containerRef.current.scrollTo({ top: containerRef.current.scrollHeight, behavior: 'smooth' });
        }
      }
    }
    prevWeeksLength.current = weeks.length;
  }, [weeks.length, viewMode]);

  const handleToggleFilter = (filterId: string) => {
    setActiveFilters(prev => 
      prev.includes(filterId) 
        ? prev.filter(f => f !== filterId)
        : [...prev, filterId]
    );
  };

  const shouldDimDay = (day: Day) => {
    if (!searchTerm && activeFilters.length === 0) return false;

    let isMatch = true;

    // 1. Filter Logic
    if (activeFilters.includes('fuerza')) {
       const hasFuerza = day.tags?.some(t => t.label.toLowerCase() === 'fuerza');
       if (!hasFuerza) isMatch = false;
    }
    
    if (activeFilters.includes('descanso')) {
       const isRest = day.tags?.some(t => t.label.toLowerCase() === 'descanso') || day.blocks.length === 0;
       if (isRest) isMatch = false;
    }

    // 2. Search Logic
    if (searchTerm && isMatch) {
       const lowerTerm = searchTerm.toLowerCase();
       const nameMatch = day.name.toLowerCase().includes(lowerTerm);
       const exerciseMatch = day.blocks.some(b => 
         b.exercises.some(e => e.name.toLowerCase().includes(lowerTerm))
       );
       if (!nameMatch && !exerciseMatch) isMatch = false;
    }

    return !isMatch;
  };

  // Keyboard Shortcuts
  const activeDayId = expandedDayIndex !== null ? daysData[expandedDayIndex]?.id : null;
  useKeyboardShortcuts({ activeDayId });

  const handleToggleExpand = (index: number) => {
    const newIndex = expandedDayIndex === index ? null : index;
    setExpandedDayIndex(newIndex);
  };

  const getRowHeight = (index: number) => {
    if (expandedDayIndex !== null && Math.floor(expandedDayIndex / 7) === index) {
      return EXPANDED_HEIGHT;
    }
    return isCompact ? COLLAPSED_HEIGHT_COMPACT : COLLAPSED_HEIGHT;
  };

  const handleCopyFromMonday = (targetDayId: string, mondayDay: Day) => {
     if (!mondayDay.blocks.length) return;
     const blocksCopy = JSON.parse(JSON.stringify(mondayDay.blocks)).map((b: any) => ({
         ...b,
         id: crypto.randomUUID(),
         exercises: b.exercises.map((e: any) => ({ ...e, id: crypto.randomUUID() }))
     }));
     
     const targetDay = daysData.find(d => d.id === targetDayId);
     if (targetDay) {
         updateDay(targetDayId, { ...targetDay, blocks: blocksCopy });
     }
  };
  
  const handleUseAI = () => {
    setAIProgramGeneratorOpen(true);
  };

  const handleCopyProgram = async () => {
      try {
          const programJson = JSON.stringify(weeks, null, 2);
          await navigator.clipboard.writeText(programJson);
          addToast({
              type: 'success',
              title: 'Programa Copiado',
              message: 'El JSON del programa se ha copiado al portapapeles.',
              duration: 3000
          });
      } catch (err) {
          console.error('Error copying program:', err);
          addToast({
              type: 'error',
              title: 'Error al copiar',
              message: 'No se pudo copiar el programa al portapapeles.',
              duration: 3000
          });
      }
  };

  const renderContent = () => {
    switch (viewMode) {
      case 'excel':
        return <ExcelView weeks={weeks} />;
      case 'timeline':
        return <TimelineView weeks={weeks} />;
      case 'weekly':
      default:
        return (
          <div className="flex flex-col gap-8">
            {weeks.map((week, weekIndex) => {
              const weekDays = week.days;
              const isWeekEmpty = weekDays.every(d => d.blocks.length === 0);
              return (
                <div key={week.id}>
                  {isWeekEmpty && (
                    <EmptyWeekState 
                      weekNumber={weekIndex + 1}
                      onCopyPreviousWeek={weekIndex > 0 ? () => {
                        if (confirm(`¿Copiar semana ${weekIndex} a la semana ${weekIndex + 1}?`)) {
                            alert("Funcionalidad de copiar semana completa pendiente.");
                        }
                      } : undefined}
                      onUseAI={handleUseAI}
                      onLoadTemplate={() => alert("Abrir gestor de plantillas")}
                    />
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4">
                    {weekDays.map((day, dayIndex) => {
                      const globalIndex = weekIndex * 7 + dayIndex;
                      const mondayDay = weekDays[0];
                      return (
                        <DayCard
                          key={day.id}
                          day={day}
                          isExpanded={expandedDayIndex === globalIndex}
                          onToggleExpand={() => handleToggleExpand(globalIndex)}
                          onUpdateDay={updateDay}
                          isDimmed={shouldDimDay(day)}
                          onCopyFromMonday={dayIndex > 0 ? () => handleCopyFromMonday(day.id, mondayDay) : undefined}
                          onUseAI={handleUseAI}
                        />
                      );
                    })}
                  </div>
                  <WeeklySummaryFooter days={weekDays} weekIndex={weekIndex} />
                </div>
              );
            })}
          </div>
        );
    }
  };

  return (
    <div id="tour-editor-canvas" ref={containerRef} className="flex-1 w-full min-w-0 p-4 pb-20 h-full flex flex-col overflow-y-auto">
      <div className="no-print">
        {viewMode === 'weekly' && (
          <GlobalFilterBar
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            activeFilters={activeFilters}
            onToggleFilter={handleToggleFilter}
            onClearFilters={() => {
              setSearchTerm('');
              setActiveFilters([]);
            }}
            resultCount={daysData.filter(d => !shouldDimDay(d)).length}
            totalCount={daysData.length}
          />
        )}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-semibold">
              {viewMode === 'weekly' ? 'Vista Semanal' : viewMode === 'excel' ? 'Vista Excel' : 'Vista Timeline'}
            </h2>
            <CollaboratorsIndicator />
          </div>
          <div className="flex bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setViewMode('weekly')}
              className={`p-2 rounded-md transition-colors ${viewMode === 'weekly' ? 'bg-white shadow text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
              title="Vista Semanal"
            >
              <LayoutGrid size={20} />
            </button>
            <button
              onClick={() => setViewMode('excel')}
              className={`p-2 rounded-md transition-colors ${viewMode === 'excel' ? 'bg-white shadow text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
              title="Vista Excel"
            >
              <FileSpreadsheet size={20} />
            </button>
            <button
              onClick={() => setViewMode('timeline')}
              className={`p-2 rounded-md transition-colors ${viewMode === 'timeline' ? 'bg-white shadow text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
              title="Vista Timeline"
            >
              <BarChart3 size={20} />
            </button>
          </div>
        </div>
      </div>

      {isMobile ? (
        <MobileDayView days={daysData} onUpdateDay={updateDay} />
      ) : (
        <div className="flex-grow h-full">
          {renderContent()}
        </div>
      )}

      <div className="fixed bottom-0 left-0 right-0 bg-white p-4 shadow-lg z-50 flex justify-center gap-4 border-t border-gray-100 no-print">
        <button 
          onClick={addWeek}
          className="bg-blue-800 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-colors flex items-center gap-2"
        >
          <Plus size={18} />
          <span>Agregar Semana</span>
        </button>
        <button 
          onClick={() => setBatchTrainingOpen(true)}
          className="bg-white hover:bg-gray-50 text-gray-800 font-semibold py-2 px-4 rounded-lg shadow-md border border-gray-300 transition-colors flex items-center gap-2"
        >
          <Flame size={18} />
          <span>BatchTraining</span>
        </button>
        <button 
            onClick={handleCopyProgram}
            className="bg-white hover:bg-gray-50 text-gray-800 font-semibold py-2 px-4 rounded-lg shadow-md border border-gray-300 transition-colors flex items-center gap-2"
        >
          <Package size={18} />
          <span>Copiar Programa</span>
        </button>
      </div>
    </div>
  );
};