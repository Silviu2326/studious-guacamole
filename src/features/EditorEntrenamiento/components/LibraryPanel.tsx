import React, { useState, useEffect, useMemo } from 'react';
import { Box, Dumbbell, LayoutTemplate, Search, X, SlidersHorizontal } from 'lucide-react';
import { useDraggable, DragOverlay, useDndContext } from '@dnd-kit/core';
import { MOCK_EXERCISES, MOCK_BLOCKS } from '../../../data/libraryMocks';
import { LibraryCard } from './LibraryCard';

const normalizeText = (text: string) => {
  return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
};

interface DraggableLibraryCardProps extends React.ComponentProps<typeof LibraryCard> {
  id: string;
  data: any;
}

const DraggableLibraryCard: React.FC<DraggableLibraryCardProps> = ({ id, data, ...props }) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id,
    data,
  });

  return (
    <div ref={setNodeRef} {...listeners} {...attributes} className={isDragging ? 'opacity-50' : ''}>
      <LibraryCard {...props} />
    </div>
  );
};

export const LibraryPanel: React.FC = () => {
  // Access the DndContext state to render the DragOverlay
  const { active } = useDndContext();

  const [activeTab, setActiveTab] = useState<'blocks' | 'exercises' | 'templates'>(() => {
    const storedTab = localStorage.getItem('libraryActiveTab');
    return (storedTab as 'blocks' | 'exercises' | 'templates') || 'exercises';
  });

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showFiltersPopover, setShowFiltersPopover] = useState<boolean>(false);
  
  // Filter states
  const [selectedMuscles, setSelectedMuscles] = useState<string[]>([]);
  const [selectedEquipment, setSelectedEquipment] = useState<string[]>([]);

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

  return (
    <aside className="w-60 relative border-r border-gray-200 bg-white flex flex-col h-full">
      {/* HEADER DE NAVEGACIÓN (Tabs) */}
      <div className="flex justify-around p-2 border-b border-gray-200 bg-white z-20">
        <button
          className={`flex items-center gap-1 px-3 py-2 text-sm font-medium transition-colors duration-200 ${
            activeTab === 'blocks'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('blocks')}
        >
          <Box size={16} /> Bloques
        </button>
        <button
          className={`flex items-center gap-1 px-3 py-2 text-sm font-medium transition-colors duration-200 ${
            activeTab === 'exercises'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('exercises')}
        >
          <Dumbbell size={16} /> Ejercicios
        </button>
        <button
          className={`flex items-center gap-1 px-3 py-2 text-sm font-medium transition-colors duration-200 ${
            activeTab === 'templates'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('templates')}
        >
          <LayoutTemplate size={16} /> Plantillas
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
          <div className="p-2">
            <div className="sticky top-0 bg-white z-10 py-2 px-2 border-b border-gray-100">
                <h3 className="text-xs font-semibold text-gray-400 uppercase">Plantillas</h3>
            </div>
            <p className="text-sm text-gray-500 px-2 py-4 text-center">Contenido de Plantillas próximamente...</p>
          </div>
        )}
      </div>

      {/* ACCIONES GLOBALES (Footer) */}
      <div className="p-3 border-t border-gray-200 bg-white z-20">
        <button className="w-full py-2 px-4 bg-blue-900 text-white font-medium rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors">
          {activeTab === 'blocks' && '+ Crear Bloque'}
          {activeTab === 'exercises' && '+ Crear Ejercicio'}
          {activeTab === 'templates' && '+ Guardar Plantilla'}
        </button>
      </div>

      <DragOverlay>
        {active && active.data.current ? (
          <div style={{ width: '240px' }}>
            <LibraryCard
                title={active.data.current.name}
                subtitle={
                    active.data.current.itemType === 'block'
                    ? `${active.data.current.type} • ${active.data.current.estimatedDuration} min`
                    : `${(active.data.current.muscleGroup || []).join(', ')} • ${active.data.current.equipment}`
                }
                type={active.data.current.itemType}
            />
          </div>
        ) : null}
      </DragOverlay>
    </aside>
  );
};