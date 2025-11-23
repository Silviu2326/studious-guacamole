import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { Box, Dumbbell, LayoutTemplate, Search, X, SlidersHorizontal, Sparkles, Lightbulb } from 'lucide-react';
import { useDraggable } from '@dnd-kit/core';
import { MOCK_EXERCISES, MOCK_BLOCKS } from '../../../data/libraryMocks';
import { LibraryCard } from './LibraryCard';
import { useTemplateManager } from '../hooks/useTemplateManager';
import { SaveTemplateModal } from './modals/SaveTemplateModal';
import { useProgramContext } from '../context/ProgramContext';

const normalizeText = (text: string) => {
  return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
};

interface DraggableLibraryCardProps extends React.ComponentProps<typeof LibraryCard> {
  id: string;
  data: any;
  className?: string;
}

const DraggableLibraryCard: React.FC<DraggableLibraryCardProps> = ({ id, data, className, ...props }) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id,
    data,
  });

  return (
    <div ref={setNodeRef} {...listeners} {...attributes} className={`${isDragging ? 'opacity-50' : ''} ${className || ''}`}>
      <LibraryCard {...props} />
    </div>
  );
};

const AI_TEMPLATES = [
  { id: 'ai-hypertrophy', name: 'Hipertrofia 4 días', goal: 'hypertrophy', days: 4, itemType: 'ai-template' },
  { id: 'ai-strength', name: 'Fuerza 3 días', goal: 'strength', days: 3, itemType: 'ai-template' },
  { id: 'ai-fat-loss', name: 'Pérdida de grasa 5 días', goal: 'fat-loss', days: 5, itemType: 'ai-template' },
];

export const LibraryPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'blocks' | 'exercises' | 'templates'>(() => {
    const storedTab = localStorage.getItem('libraryActiveTab');
    return (storedTab as 'blocks' | 'exercises' | 'templates') || 'exercises';
  });

  // Resizing Logic
  const sidebarRef = useRef<HTMLElement>(null);
  const [width, setWidth] = useState(280);
  const [isResizing, setIsResizing] = useState(false);

  const startResizing = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  }, []);

  const stopResizing = useCallback(() => setIsResizing(false), []);

  const resize = useCallback((mouseMoveEvent: MouseEvent) => {
      if (isResizing && sidebarRef.current) {
          const newWidth = mouseMoveEvent.clientX - sidebarRef.current.getBoundingClientRect().left;
          if (newWidth > 240 && newWidth < 600) {
              setWidth(newWidth);
          }
      }
  }, [isResizing]);

  useEffect(() => {
      if (isResizing) {
        window.addEventListener("mousemove", resize);
        window.addEventListener("mouseup", stopResizing);
      }
      return () => {
          window.removeEventListener("mousemove", resize);
          window.removeEventListener("mouseup", stopResizing);
      };
  }, [isResizing, resize, stopResizing]);

  const { templates, saveAsTemplate, deleteTemplate } = useTemplateManager();
  const { weeks } = useProgramContext();
  const [isSaveModalOpen, setSaveModalOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showFiltersPopover, setShowFiltersPopover] = useState<boolean>(false);
  
  // Filter states
  const [selectedMuscles, setSelectedMuscles] = useState<string[]>([]);
  const [selectedEquipment, setSelectedEquipment] = useState<string[]>([]);

  // Smart Suggestions Logic
  const smartSuggestions = useMemo(() => {
    const suggestions: any[] = [];
    const normalizedQuery = normalizeText(searchQuery);

    // 1. Search Based Suggestions (Specific Triggers)
    if (normalizedQuery.includes('tendinopatia') || normalizedQuery.includes('tendon')) {
        suggestions.push({
            id: 'sug-rehab-patellar',
            name: 'Rehab: Tendinopatía Rotuliana',
            type: 'warmup',
            estimatedDuration: 15,
            exercises: [] 
        });
        suggestions.push({
            id: 'sug-iso-knee',
            name: 'Isométricos Rodilla',
            type: 'warmup',
            estimatedDuration: 10,
            exercises: []
        });
    }

    // 2. Context Based Suggestions (if no specific search trigger found so far)
    if (suggestions.length === 0) {
        // Analyze Program Content
        let lowerBodyCount = 0;
        let upperBodyCount = 0;

        weeks.forEach(week => {
            week.days.forEach(day => {
                day.blocks.forEach(block => {
                    block.exercises.forEach(ex => {
                        const name = normalizeText(ex.name);
                        // Simple heuristic
                        if (name.includes('squat') || name.includes('sentadilla') || name.includes('deadlift') || name.includes('peso muerto') || name.includes('leg')) {
                            lowerBodyCount++;
                        } else if (name.includes('bench') || name.includes('banca') || name.includes('press') || name.includes('row') || name.includes('remo')) {
                            upperBodyCount++;
                        }
                    });
                });
            });
        });

        // Determine Context
        if (normalizedQuery.length === 0) { // Only suggest based on context if no search
            if (lowerBodyCount > upperBodyCount) {
                suggestions.push({
                    id: 'sug-warmup-leg',
                    name: 'Calentamiento Pierna Completo',
                    type: 'warmup',
                    estimatedDuration: 12,
                    exercises: []
                });
                suggestions.push({
                    id: 'sug-mobility-hip',
                    name: 'Movilidad de Cadera',
                    type: 'warmup',
                    estimatedDuration: 8,
                    exercises: []
                });
            } else if (upperBodyCount > lowerBodyCount) {
                suggestions.push({
                    id: 'sug-warmup-upper',
                    name: 'Calentamiento Torso',
                    type: 'warmup',
                    estimatedDuration: 10,
                    exercises: []
                });
                suggestions.push({
                    id: 'sug-mobility-shoulder',
                    name: 'Movilidad de Hombro',
                    type: 'warmup',
                    estimatedDuration: 8,
                    exercises: []
                });
            } else {
                suggestions.push({
                    id: 'sug-warmup-general',
                    name: 'Activación General',
                    type: 'warmup',
                    estimatedDuration: 10,
                    exercises: []
                });
            }
        }
    }
    
    // If we have a search query that IS NOT a trigger, we might want to filter these suggestions or just return empty
    // But for now, let's keep the logic simple: 
    // If specific trigger -> show specific suggestions.
    // If no search -> show context suggestions.
    // If generic search -> show filtered blocks (handled by filteredBlocks).

    return suggestions;
  }, [searchQuery, weeks]);

  useEffect(() => {
    localStorage.setItem('libraryActiveTab', activeTab);
  }, [activeTab]);

  const allMuscles = useMemo(() => Array.from(new Set(MOCK_EXERCISES.flatMap(ex => ex.muscleGroup))).sort(), []);
  const allEquipment = useMemo(() => Array.from(new Set(MOCK_EXERCISES.map(ex => ex.equipment))).sort(), []);

  const activeFilterCount = selectedMuscles.length + selectedEquipment.length;

  const filteredExercises = useMemo(() => {
    return MOCK_EXERCISES.filter(ex => {
      const matchesSearch = normalizeText(ex.name).includes(normalizeText(searchQuery));
      
      const matchesMuscle = selectedMuscles.length === 0 || 
        ex.muscleGroup.some(m => selectedMuscles.includes(m));

      const matchesEquipment = selectedEquipment.length === 0 || 
        selectedEquipment.includes(ex.equipment);

      return matchesSearch && matchesMuscle && matchesEquipment;
    });
  }, [searchQuery, selectedMuscles, selectedEquipment]);

  const filteredBlocks = useMemo(() => {
    return MOCK_BLOCKS.filter(block =>
      normalizeText(block.name).includes(normalizeText(searchQuery))
    );
  }, [searchQuery]);
  
  const filteredTemplates = useMemo(() => {
      return templates.filter(t => 
        normalizeText(t.name).includes(normalizeText(searchQuery))
      );
  }, [templates, searchQuery]);

  const isSearching = searchQuery.length > 0 || activeFilterCount > 0;

  const favoriteExercises = filteredExercises.filter(ex => ex.isFavorite);
  
  const allExercisesSorted = [...filteredExercises].sort((a, b) => a.name.localeCompare(b.name));

  const toggleMuscleFilter = (muscle: string) => {
    setSelectedMuscles(prev => 
      prev.includes(muscle) ? prev.filter(m => m !== muscle) : [...prev, muscle]
    );
  };

  const toggleEquipmentFilter = (item: string) => {
    setSelectedEquipment(prev => 
      prev.includes(item) ? prev.filter(e => e !== item) : [...prev, item]
    );
  };

  const clearFilters = () => {
    setSelectedMuscles([]);
    setSelectedEquipment([]);
    setSearchQuery('');
  };

  const handleSaveTemplate = (name: string, sanitize: boolean) => {
    saveAsTemplate(name, sanitize);
  };

  return (
    <aside 
      ref={sidebarRef}
      id="tour-library-panel" 
      className="relative border-r border-gray-200 bg-white flex flex-col h-full group"
      style={{ width: `${width}px`, minWidth: '240px', maxWidth: '600px' }}
    >
      {/* HEADER DE NAVEGACIÓN (Tabs) */}
      <div className="grid grid-cols-3 gap-1 p-2 border-b border-gray-200 bg-white z-20">
        <button
          className={`flex items-center justify-center gap-1 px-1 py-2 text-xs font-medium transition-colors duration-200 rounded w-full ${
            activeTab === 'blocks'
              ? 'text-blue-700 bg-blue-50'
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
          }`}
          onClick={() => setActiveTab('blocks')}
          title="Bloques"
        >
          <Box size={14} /> 
          <span className="truncate">Bloques</span>
        </button>
        <button
          className={`flex items-center justify-center gap-1 px-1 py-2 text-xs font-medium transition-colors duration-200 rounded w-full ${
            activeTab === 'exercises'
              ? 'text-blue-700 bg-blue-50'
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
          }`}
          onClick={() => setActiveTab('exercises')}
          title="Ejercicios"
        >
          <Dumbbell size={14} />
          <span className="truncate">Ejercicios</span>
        </button>
        <button
          className={`flex items-center justify-center gap-1 px-1 py-2 text-xs font-medium transition-colors duration-200 rounded w-full ${
            activeTab === 'templates'
              ? 'text-blue-700 bg-blue-50'
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
          }`}
          onClick={() => setActiveTab('templates')}
          title="Plantillas"
        >
          <LayoutTemplate size={14} />
          <span className="truncate">Plantillas</span>
        </button>
      </div>

      {/* BARRA DE HERRAMIENTAS (Search & Filter) */}
      <div className="p-3 border-b border-gray-200 bg-white z-20">
        <div className="relative mb-2">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar..."
            className="w-full pl-9 pr-9 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              onClick={() => setSearchQuery('')}
              aria-label="Limpiar búsqueda"
            >
              <X size={16} />
            </button>
          )}
        </div>

        <div className="relative">
          <button
            className={`w-full flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                activeFilterCount > 0 ? 'bg-blue-50 text-blue-600 border border-blue-200' : 'text-gray-700 bg-gray-100 hover:bg-gray-200'
            }`}
            onClick={() => setShowFiltersPopover(!showFiltersPopover)}
          >
            <SlidersHorizontal size={16} />
            Filtros {activeFilterCount > 0 && `(${activeFilterCount})`}
          </button>
          
          {showFiltersPopover && (
            <div className="absolute z-30 top-full left-0 mt-2 w-64 bg-white border border-gray-300 rounded-md shadow-xl p-4 max-h-96 overflow-y-auto">
              <div className="flex justify-between items-center mb-3">
                <h4 className="text-xs font-semibold text-gray-500 uppercase">Filtros</h4>
                {(activeFilterCount > 0) && (
                    <button onClick={() => { setSelectedMuscles([]); setSelectedEquipment([]); }} className="text-xs text-blue-600 hover:underline">
                        Limpiar
                    </button>
                )}
              </div>
              
              <div className="mb-4">
                <h5 className="text-sm font-medium text-gray-700 mb-2">Grupo Muscular</h5>
                <div className="space-y-1">
                  {allMuscles.map(muscle => (
                    <label key={muscle} className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer hover:text-gray-900">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        checked={selectedMuscles.includes(muscle)}
                        onChange={() => toggleMuscleFilter(muscle)}
                      />
                      {muscle}
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h5 className="text-sm font-medium text-gray-700 mb-2">Equipamiento</h5>
                <div className="space-y-1">
                  {allEquipment.map(eq => (
                    <label key={eq} className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer hover:text-gray-900">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        checked={selectedEquipment.includes(eq)}
                        onChange={() => toggleEquipmentFilter(eq)}
                      />
                      {eq}
                    </label>
                  ))}
                </div>
              </div>
              
              <button
                className="mt-4 w-full py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
                onClick={() => setShowFiltersPopover(false)}
              >
                Ver resultados
              </button>
            </div>
          )}
        </div>
      </div>


      {/* LISTA DE RECURSOS (Scrollable Body) */}
      <div className="flex-1 overflow-y-auto relative">
        {activeTab === 'blocks' && (
          <div className="p-2 space-y-1">
            {smartSuggestions.length > 0 && (
                <>
                    <div className="sticky top-0 bg-white z-10 py-2 px-2 border-b border-gray-100 flex items-center gap-2">
                        <Lightbulb size={14} className="text-yellow-500" />
                        <h3 className="text-xs font-semibold text-yellow-600 uppercase">Bloques Sugeridos</h3>
                    </div>
                    {smartSuggestions.map(block => (
                        <DraggableLibraryCard
                            key={block.id}
                            id={`smart-${block.id}`}
                            data={{ ...block, itemType: 'block' }}
                            title={block.name}
                            subtitle={`Sugerido • ${block.estimatedDuration} min`}
                            type="block"
                            className="border-l-4 border-l-yellow-400"
                        />
                    ))}
                    <div className="h-4"></div>
                </>
            )}

            <div className="sticky top-0 bg-white z-10 py-2 px-2 border-b border-gray-100">
                <h3 className="text-xs font-semibold text-gray-400 uppercase">Bloques ({filteredBlocks.length})</h3>
            </div>
            {filteredBlocks.map(block => (
              <DraggableLibraryCard
                key={block.id}
                id={`block-${block.id}`}
                data={{ ...block, itemType: 'block' }}
                title={block.name}
                subtitle={`${block.type} • ${block.estimatedDuration} min`}
                type="block"
              />
            ))}
            {filteredBlocks.length === 0 && (
                <div className="flex flex-col items-center justify-center py-10 text-center px-4">
                    <div className="bg-gray-100 p-3 rounded-full mb-3">
                        <Search className="text-gray-400" size={24} />
                    </div>
                    <p className="text-sm font-medium text-gray-900">No se encontraron bloques</p>
                    <p className="text-xs text-gray-500 mt-1">Intenta ajustar tu búsqueda</p>
                    {searchQuery && (
                        <button onClick={() => setSearchQuery('')} className="mt-3 text-sm text-blue-600 font-medium hover:underline">
                            Limpiar búsqueda
                        </button>
                    )}
                </div>
            )}
          </div>
        )}
        
        {activeTab === 'exercises' && (
          <div className="p-2 space-y-1">
             {allExercisesSorted.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-center px-4">
                    <div className="bg-gray-100 p-3 rounded-full mb-3">
                        <Search className="text-gray-400" size={24} />
                    </div>
                    <p className="text-sm font-medium text-gray-900">No se encontraron ejercicios</p>
                    <p className="text-xs text-gray-500 mt-1">
                        {searchQuery ? `No hay resultados para "${searchQuery}"` : "Intenta cambiar los filtros"}
                    </p>
                    <button onClick={clearFilters} className="mt-3 text-sm text-blue-600 font-medium hover:underline">
                        Limpiar búsqueda y filtros
                    </button>
                </div>
             ) : (
                <>
                    {/* SECTION: FAVORITES */}
                    {favoriteExercises.length > 0 && (
                    <>
                        <div className="sticky top-0 bg-white z-10 py-2 px-2 border-b border-gray-100">
                        <h3 className="text-xs font-semibold text-gray-400 uppercase">Favoritos ({favoriteExercises.length})</h3>
                        </div>
                        <div className="space-y-1 mb-4">
                        {favoriteExercises.map(ex => (
                            <DraggableLibraryCard
                            key={`fav-${ex.id}`}
                            id={`fav-${ex.id}`}
                            data={{ ...ex, itemType: 'exercise' }}
                            title={ex.name}
                            subtitle={`${ex.muscleGroup.join(', ')} • ${ex.equipment}`}
                            type="exercise"
                            />
                        ))}
                        </div>
                    </>
                    )}

                    {/* SECTION: ALL */}
                    <div className="sticky top-0 bg-white z-10 py-2 px-2 border-b border-gray-100">
                        <h3 className="text-xs font-semibold text-gray-400 uppercase">Todos ({allExercisesSorted.length})</h3>
                    </div>
                    <div className="space-y-1">
                    {allExercisesSorted.map(ex => (
                        <DraggableLibraryCard
                        key={ex.id}
                        id={`exercise-${ex.id}`}
                        data={{ ...ex, itemType: 'exercise' }}
                        title={ex.name}
                        subtitle={`${ex.muscleGroup.join(', ')} • ${ex.equipment}`}
                        type="exercise"
                        />
                    ))}
                    </div>
                </>
             )}
          </div>
        )}

        {activeTab === 'templates' && (
          <div className="p-2 space-y-1">
             {/* AI Templates Section */}
             <div className="sticky top-0 bg-white z-10 py-2 px-2 border-b border-gray-100 flex items-center gap-2">
                <Sparkles size={14} className="text-purple-500" />
                <h3 className="text-xs font-semibold text-purple-600 uppercase">Plantillas IA</h3>
            </div>
            {AI_TEMPLATES.map(template => (
                 <DraggableLibraryCard
                    key={template.id}
                    id={`ai-${template.id}`}
                    data={template}
                    title={template.name}
                    subtitle={`Generado por IA • ${template.days} días`}
                    type="template"
                    className="border-l-4 border-l-purple-400"
                 />
            ))}

            <div className="sticky top-0 bg-white z-10 py-2 px-2 border-b border-gray-100 mt-2">
                <h3 className="text-xs font-semibold text-gray-400 uppercase">Mis Plantillas ({filteredTemplates.length})</h3>
            </div>
            {filteredTemplates.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-center px-4">
                    <div className="bg-gray-100 p-3 rounded-full mb-3">
                        <LayoutTemplate className="text-gray-400" size={24} />
                    </div>
                    <p className="text-sm font-medium text-gray-900">No hay plantillas guardadas</p>
                    <p className="text-xs text-gray-500 mt-1">
                        Guarda tu programación actual para reutilizarla
                    </p>
                </div>
            ) : (
                filteredTemplates.map(template => (
                    <div key={template.id} className="group relative">
                         <DraggableLibraryCard
                            id={`template-${template.id}`}
                            data={{ ...template, itemType: 'template' }}
                            title={template.name}
                            subtitle={new Date(template.createdAt).toLocaleDateString()}
                            type="template"
                         />
                         <button 
                            onClick={(e) => { e.stopPropagation(); deleteTemplate(template.id); }}
                            className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 p-1 hover:bg-red-50 text-red-500 rounded bg-white shadow-sm"
                            title="Eliminar"
                         >
                            <X size={14} />
                         </button>
                    </div>
                ))
            )}
          </div>
        )}
      </div>

      {/* ACCIONES GLOBALES (Footer) */}
      <div className="p-3 border-t border-gray-200 bg-white z-20">
        <button 
            className="w-full py-2 px-4 bg-blue-900 text-white font-medium rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            onClick={() => {
                if (activeTab === 'templates') {
                    setSaveModalOpen(true);
                }
            }}
        >
          {activeTab === 'blocks' && '+ Crear Bloque'}
          {activeTab === 'exercises' && '+ Crear Ejercicio'}
          {activeTab === 'templates' && '+ Guardar Plantilla'}
        </button>
      </div>

      <SaveTemplateModal 
        isOpen={isSaveModalOpen}
        onClose={() => setSaveModalOpen(false)}
        onSave={handleSaveTemplate}
      />
      <div
        className="absolute right-0 top-0 w-1 h-full cursor-col-resize hover:bg-blue-400 z-50 transition-colors opacity-0 group-hover:opacity-100"
        onMouseDown={startResizing}
      />
    </aside>
  );
};