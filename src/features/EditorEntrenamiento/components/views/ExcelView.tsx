import React, { useState, useMemo, useCallback } from 'react';
import { 
  ChevronDown, 
  ChevronRight, 
  MoreHorizontal, 
  Plus, 
  Copy, 
  Trash2, 
  Printer, 
  Download,
  Maximize2,
  Zap
} from 'lucide-react';
import { Week, Day, Block, Exercise } from '../../types/training';
import { useProgramContext } from '../../context/ProgramContext';

interface ExcelViewProps {
  weeks?: Week[]; // Optional for now to allow standalone rendering if needed
}

// Helper types for flattened rows
type RowType = 'week' | 'day' | 'block' | 'exercise';

interface FlatRow {
  id: string;
  type: RowType;
  data: Week | Day | Block | Exercise;
  parentId: string | null;
  level: number;
  isExpanded: boolean;
  path: string[]; // IDs path for updates
}

export const ExcelView: React.FC<ExcelViewProps> = ({ weeks = [] }) => {
  const { bulkUpdateExercises, setProgramData, weeks: contextWeeks } = useProgramContext();
  
  // State for expanded rows
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});
  const [selectedRows, setSelectedRows] = useState<Record<string, boolean>>({});

  // Bulk Action Inputs State
  const [bulkRpe, setBulkRpe] = useState<string>('');
  
  // Derived Selection State
  const selectedIds = useMemo(() => Object.keys(selectedRows).filter(k => selectedRows[k]), [selectedRows]);
  const isMultiSelection = selectedIds.length > 1;

  // Toggle expand/collapse
  const toggleExpand = (id: string) => {
    setExpandedRows(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Toggle selection
  const toggleSelect = (id: string) => {
    setSelectedRows(prev => {
        const newState = { ...prev, [id]: !prev[id] };
        // Clean up false keys
        if (!newState[id]) delete newState[id];
        return newState;
    });
  };

  // Bulk Actions Handlers
  const handleBulkRpe = () => {
    const rpeValue = parseFloat(bulkRpe);
    if (!isNaN(rpeValue) && selectedIds.length > 0) {
        bulkUpdateExercises(selectedIds, { type: 'SET_PROPERTY', field: 'rpe', value: rpeValue });
        setBulkRpe(''); // Reset input
        // Optional: Clear selection? Usually better to keep it to allow chaining actions
    }
  };

  const handleBulkSetsMultiply = () => {
    if (selectedIds.length > 0) {
        bulkUpdateExercises(selectedIds, { type: 'ADD_SETS_FACTOR', field: 'sets', value: 1.2 });
    }
  };

  // Update Handler
  const handleUpdate = useCallback((path: string[], field: string, value: any) => {
      const newWeeks = [...contextWeeks];
      const [weekId, dayId, blockId, exerciseId] = path;

      const week = newWeeks.find(w => w.id === weekId);
      if (!week) return;

      if (path.length === 1) { // Week Update
           (week as any)[field] = value;
      } else {
          const day = week.days.find(d => d.id === dayId);
          if (!day) return;

          if (path.length === 2) { // Day Update
              (day as any)[field] = value;
          } else {
              const block = day.blocks.find(b => b.id === blockId);
              if (!block) return;

              if (path.length === 3) { // Block Update
                  (block as any)[field] = value;
              } else {
                  const exercise = block.exercises.find(e => e.id === exerciseId);
                  if (!exercise) return;

                   // Exercise Update
                   if (field === 'setsReps') {
                       // Parse "3x10" or "3 x 10"
                       const parts = String(value).toLowerCase().split('x');
                       let setsCount = exercise.sets.length;
                       let repsVal: string | number = '';
                       
                       if (parts.length === 2) {
                           const s = parseInt(parts[0].trim());
                           if (!isNaN(s)) setsCount = s;
                           repsVal = parts[1].trim();
                           const rNum = parseInt(repsVal as string);
                           if (!isNaN(rNum) && String(rNum) === repsVal) repsVal = rNum;
                       } else if (parts.length === 1) {
                           // Assume just reps if it's not a sets format
                           repsVal = parts[0].trim();
                           const rNum = parseInt(repsVal as string);
                           if (!isNaN(rNum) && String(rNum) === repsVal) repsVal = rNum;
                       }

                       // Update sets array
                       const currentSets = [...exercise.sets];
                       if (setsCount > currentSets.length) {
                           const lastSet = currentSets[currentSets.length - 1] || { id: 'temp', type: 'working', reps: repsVal };
                           for (let i = currentSets.length; i < setsCount; i++) {
                               currentSets.push({ ...lastSet, id: crypto.randomUUID(), reps: repsVal });
                           }
                       } else if (setsCount < currentSets.length) {
                           currentSets.splice(setsCount);
                       }
                       
                       // Update reps for all sets (simple mode)
                       currentSets.forEach(s => s.reps = repsVal);
                       exercise.sets = currentSets;

                   } else if (field === 'load') {
                       // Parse "100kg" or "80%" or "100"
                       const valStr = String(value).trim();
                       const isPercentage = valStr.includes('%');
                       const numVal = parseFloat(valStr.replace(/[^\d.]/g, ''));
                       
                       if (!isNaN(numVal)) {
                           exercise.sets.forEach(s => {
                               if (isPercentage) {
                                   s.percentage = numVal;
                                   delete s.weight;
                               } else {
                                   s.weight = numVal;
                                   delete s.percentage;
                               }
                           });
                       }
                   } else if (field === 'rpe') {
                       // Update RPE for all sets
                        exercise.sets.forEach(s => s.rpe = value);
                   } else {
                       (exercise as any)[field] = value;
                   }
              }
          }
      }
      setProgramData(newWeeks);
  }, [contextWeeks, setProgramData]);

  // Flatten data for table rendering
  const rows = useMemo(() => {
    const flatRows: FlatRow[] = [];

    weeks.forEach((week) => {
      const weekId = week.id;
      const isWeekExpanded = expandedRows[weekId] ?? true; // Default expanded

      flatRows.push({
        id: weekId,
        type: 'week',
        data: week,
        parentId: null,
        level: 0,
        isExpanded: isWeekExpanded,
        path: [weekId]
      });

      if (isWeekExpanded) {
        week.days.forEach((day) => {
          const dayId = day.id;
          const isDayExpanded = expandedRows[dayId] ?? true;

          flatRows.push({
            id: dayId,
            type: 'day',
            data: day,
            parentId: weekId,
            level: 1,
            isExpanded: isDayExpanded,
            path: [weekId, dayId]
          });

          if (isDayExpanded) {
            day.blocks.forEach((block) => {
              const blockId = block.id;
              const isBlockExpanded = expandedRows[blockId] ?? true;

              flatRows.push({
                id: blockId,
                type: 'block',
                data: block,
                parentId: dayId,
                level: 2,
                isExpanded: isBlockExpanded,
                path: [weekId, dayId, blockId]
              });

              if (isBlockExpanded) {
                block.exercises.forEach((exercise) => {
                  flatRows.push({
                    id: exercise.id,
                    type: 'exercise',
                    data: exercise,
                    parentId: blockId,
                    level: 3,
                    isExpanded: false, // Exercises don't expand further in this view
                    path: [weekId, dayId, blockId, exercise.id]
                  });
                });
              }
            });
          }
        });
      }
    });

    return flatRows;
  }, [weeks, expandedRows]);

  // Render helper for Tags
  const renderTags = (tags: any[]) => {
    if (!tags || tags.length === 0) return null;
    return (
      <div className="flex flex-wrap gap-1">
        {tags.map(tag => (
          <span key={tag.id} className="px-1.5 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
            {tag.label}
          </span>
        ))}
        <span className="px-1.5 py-0.5 rounded text-xs text-gray-400 hover:bg-gray-100 cursor-pointer">+</span>
      </div>
    );
  };

  // Helper to render Sets/Reps string for Block/Exercise
  const renderSetsReps = (data: any, type: RowType) => {
    if (type === 'exercise') {
        const ex = data as Exercise;
        // Simple summary of sets
        if (ex.sets.length === 0) return '-';
        const firstSet = ex.sets[0];
        return `${ex.sets.length} x ${firstSet.reps || '?'}`;
    }
    return '';
  };

  // Helper to render RPE
  const renderRpe = (data: any, type: RowType) => {
     if (type === 'week') return '';
     if (type === 'day') return (data as Day).averageRpe ?? '-';
     if (type === 'block') return (data as Block).rpe ?? '-';
     if (type === 'exercise') {
         const ex = data as Exercise;
         if (ex.sets.length === 0) return '-';
         return ex.sets[0].rpe ?? '-';
     }
     return '';
  };

  // Helper to render Duration
  const renderDuration = (data: any, type: RowType) => {
      if (type === 'day') return `${(data as Day).totalDuration ?? 0}`;
      if (type === 'block') return `${(data as Block).duration ?? 0}`;
      return '';
  };

  return (
    <div className="flex flex-col h-full bg-white border-t border-gray-200">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-gray-700 flex items-center gap-2">
            <Maximize2 size={16} />
            VISTA EXCEL
          </span>
        </div>
        <div className="flex items-center gap-2">
           <button className="p-1.5 text-gray-600 hover:bg-gray-200 rounded flex items-center gap-1 text-sm">
             <Download size={14} /> Exportar .xlsx
           </button>
           <button className="p-1.5 text-gray-600 hover:bg-gray-200 rounded flex items-center gap-1 text-sm">
             <Printer size={14} /> Imprimir
           </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex items-center gap-3 px-4 py-2 bg-white border-b border-gray-200 text-sm">
        <span className="text-gray-500">Filtros:</span>
        <select className="bg-transparent border-none font-medium text-gray-700 focus:ring-0 cursor-pointer hover:text-blue-600">
            <option>Todos los días</option>
        </select>
        <select className="bg-transparent border-none font-medium text-gray-700 focus:ring-0 cursor-pointer hover:text-blue-600">
            <option>Todos los tags</option>
        </select>
        <select className="bg-transparent border-none font-medium text-gray-700 focus:ring-0 cursor-pointer hover:text-blue-600">
            <option>Semanas 1-12</option>
        </select>
        <select className="bg-transparent border-none font-medium text-gray-700 focus:ring-0 cursor-pointer hover:text-blue-600">
            <option>RPE: Todos</option>
        </select>
      </div>

      {/* Main Table Area */}
      <div className="flex-1 overflow-auto">
        <table className="w-full min-w-[1000px] border-collapse text-sm">
          <thead className="bg-gray-50 sticky top-0 z-10 shadow-sm">
            <tr>
              <th className="w-10 p-2 border-r border-b border-gray-200">
                  <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
              </th>
              <th className="w-24 p-2 text-left font-semibold text-gray-600 border-r border-b border-gray-200">Sem</th>
              <th className="w-32 p-2 text-left font-semibold text-gray-600 border-r border-b border-gray-200">Día</th>
              <th className="w-48 p-2 text-left font-semibold text-gray-600 border-r border-b border-gray-200">Sesión / Bloque / Ejercicio</th>
              <th className="w-32 p-2 text-left font-semibold text-gray-600 border-r border-b border-gray-200">Tags</th>
              <th className="w-16 p-2 text-center font-semibold text-gray-600 border-r border-b border-gray-200">Dur.</th>
              <th className="w-16 p-2 text-center font-semibold text-gray-600 border-r border-b border-gray-200">RPE</th>
              <th className="w-20 p-2 text-center font-semibold text-gray-600 border-r border-b border-gray-200">Sets/Reps</th>
              <th className="w-20 p-2 text-center font-semibold text-gray-600 border-r border-b border-gray-200">Carga</th>
              <th className="p-2 text-left font-semibold text-gray-600 border-b border-gray-200">Notas</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr 
                key={row.id} 
                className={`
                    group hover:bg-blue-50 transition-colors
                    ${selectedRows[row.id] ? 'bg-blue-50' : 'bg-white'}
                    ${row.type === 'week' ? 'bg-gray-50 font-bold' : ''}
                `}
              >
                {/* Checkbox */}
                <td className="p-2 border-r border-b border-gray-100 text-center">
                    <input 
                        type="checkbox" 
                        checked={!!selectedRows[row.id]}
                        onChange={() => toggleSelect(row.id)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 opacity-0 group-hover:opacity-100 checked:opacity-100 transition-opacity"
                    />
                </td>

                {/* Semana Column */}
                <td className="p-2 border-r border-b border-gray-100 align-top">
                    {row.type === 'week' && (
                        <div className="flex items-center gap-1 cursor-pointer" onClick={() => toggleExpand(row.id)}>
                            {row.isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                            <input
                              type="text"
                              defaultValue={row.data.name}
                              onBlur={(e) => handleUpdate(row.path, 'name', e.target.value)}
                              className="bg-transparent border-none w-full focus:ring-2 focus:ring-blue-200 rounded px-1 py-0.5"
                            />
                        </div>
                    )}
                </td>

                {/* Día Column */}
                <td className="p-2 border-r border-b border-gray-100 align-top">
                    {row.type === 'day' && (
                         <div className="flex items-center gap-1 cursor-pointer pl-2" onClick={() => toggleExpand(row.id)}>
                            {row.isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                            <input
                              type="text"
                              defaultValue={(row.data as Day).name}
                              onBlur={(e) => handleUpdate(row.path, 'name', e.target.value)}
                              className="bg-transparent border-none w-full focus:ring-2 focus:ring-blue-200 rounded px-1 py-0.5 font-semibold text-gray-800"
                            />
                        </div>
                    )}
                </td>

                {/* Sesión / Bloque / Ejercicio Column */}
                <td className="p-2 border-r border-b border-gray-100">
                    <div 
                        className="flex items-center gap-2"
                        style={{ paddingLeft: `${(row.level > 1 ? row.level - 1 : 0) * 1.5}rem` }}
                    >
                        {/* Expand icon for Block */}
                        {row.type === 'block' && (
                            <div className="cursor-pointer" onClick={() => toggleExpand(row.id)}>
                                {row.isExpanded ? <ChevronDown size={14} className="text-gray-400" /> : <ChevronRight size={14} className="text-gray-400" />}
                            </div>
                        )}
                        
                        {/* Hierarchy Lines (Visual) */}
                        {row.type === 'exercise' && <span className="text-gray-300">├─</span>}
                        
                        {/* Content Input */}
                        {row.type !== 'week' && row.type !== 'day' && (
                          <input 
                              type="text" 
                              defaultValue={
                                  row.type === 'block' ? (row.data as Block).name :
                                  (row.data as Exercise).name
                              }
                              onBlur={(e) => handleUpdate(row.path, 'name', e.target.value)}
                              className={`
                                  bg-transparent border-none w-full focus:ring-2 focus:ring-blue-200 rounded px-1 py-0.5
                                  ${row.type === 'block' ? 'font-medium text-gray-700' : ''}
                                  ${row.type === 'exercise' ? 'text-gray-600' : ''}
                              `}
                          />
                        )}
                    </div>
                </td>

                {/* Tags Column */}
                <td className="p-2 border-r border-b border-gray-100">
                    {(row.type === 'day' || row.type === 'exercise') && renderTags((row.data as any).tags)}
                </td>

                {/* Duration Column */}
                <td className="p-2 border-r border-b border-gray-100 text-center">
                   {(row.type === 'day' || row.type === 'block') && (
                     <input 
                          type="number"
                          defaultValue={renderDuration(row.data, row.type)}
                          onBlur={(e) => handleUpdate(row.path, row.type === 'day' ? 'totalDuration' : 'duration', parseFloat(e.target.value))}
                          className="bg-transparent border-none w-full text-center focus:ring-2 focus:ring-blue-200 rounded px-1 py-0.5 text-gray-600"
                     />
                   )}
                </td>

                {/* RPE Column */}
                <td className="p-2 border-r border-b border-gray-100 text-center">
                   {(row.type === 'day' || row.type === 'block' || row.type === 'exercise') && (
                    <input 
                        type="number"
                        defaultValue={renderRpe(row.data, row.type)}
                        onBlur={(e) => handleUpdate(row.path, row.type === 'day' ? 'averageRpe' : 'rpe', parseFloat(e.target.value))}
                        className="bg-transparent border-none w-full text-center focus:ring-2 focus:ring-blue-200 rounded px-1 py-0.5 text-gray-600 font-medium"
                    />
                   )}
                </td>

                {/* Sets/Reps Column */}
                <td className="p-2 border-r border-b border-gray-100 text-center">
                    {row.type === 'exercise' && (
                     <input 
                        type="text"
                        defaultValue={renderSetsReps(row.data, row.type)}
                        onBlur={(e) => handleUpdate(row.path, 'setsReps', e.target.value)}
                        className="bg-transparent border-none w-full text-center focus:ring-2 focus:ring-blue-200 rounded px-1 py-0.5 text-gray-600"
                   />
                   )}
                </td>
                
                 {/* Carga/Weight Column */}
                 <td className="p-2 border-r border-b border-gray-100 text-center">
                     {row.type === 'exercise' && (
                          <input 
                            type="text"
                            defaultValue={(row.data as Exercise).sets[0]?.weight ? `${(row.data as Exercise).sets[0]?.weight}kg` : (row.data as Exercise).sets[0]?.percentage ? `${(row.data as Exercise).sets[0]?.percentage}%` : '-'}
                            onBlur={(e) => handleUpdate(row.path, 'load', e.target.value)}
                            className="bg-transparent border-none w-full text-center focus:ring-2 focus:ring-blue-200 rounded px-1 py-0.5 text-gray-600"
                       />
                     )}
                </td>

                {/* Notas Column */}
                <td className="p-2 border-b border-gray-100">
                    <input 
                        type="text" 
                        placeholder="Agregar nota..."
                        defaultValue={(row.data as any).notes || ''}
                        onBlur={(e) => handleUpdate(row.path, 'notes', e.target.value)}
                        className="bg-transparent border-none w-full focus:ring-2 focus:ring-blue-200 rounded px-1 py-0.5 text-gray-500 italic text-xs"
                    />
                </td>
              </tr>
            ))}
            
            {/* Empty State or Add Row */}
            <tr>
                <td colSpan={10} className="p-2 border-t border-gray-200">
                    <button className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm font-medium px-2 py-1 rounded hover:bg-blue-50 transition-colors">
                        <Plus size={16} /> Agregar Fila / Semana
                    </button>
                </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Footer Actions */}
      <div className="px-4 py-3 bg-white border-t border-gray-200 shadow-lg z-20">
        {isMultiSelection ? (
             <div className="flex items-center justify-between animate-in slide-in-from-bottom-2 fade-in duration-200">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-blue-700 font-semibold bg-blue-50 px-3 py-1 rounded-full text-sm">
                        <Zap size={16} />
                        <span>{selectedIds.length} seleccionados</span>
                    </div>
                    <div className="h-6 w-px bg-gray-200"></div>
                    
                    {/* RPE Action */}
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-600">RPE:</span>
                        <div className="flex items-center">
                            <input 
                                type="number" 
                                placeholder="Target" 
                                value={bulkRpe}
                                onChange={(e) => setBulkRpe(e.target.value)}
                                className="w-16 h-8 px-2 border border-gray-300 rounded-l text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                            <button 
                                onClick={handleBulkRpe}
                                className="h-8 px-3 bg-blue-600 text-white rounded-r hover:bg-blue-700 text-sm font-medium flex items-center"
                            >
                                Aplicar
                            </button>
                        </div>
                    </div>

                    {/* Sets Action */}
                    <button 
                        onClick={handleBulkSetsMultiply}
                        className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded text-sm font-medium transition-colors shadow-sm"
                    >
                        <span>Series x 1.2 (+20%)</span>
                    </button>
                </div>
                
                <button 
                    onClick={() => setSelectedRows({})}
                    className="text-gray-500 hover:text-gray-700 text-sm underline"
                >
                    Cancelar
                </button>
             </div>
        ) : (
            <div className="flex items-center gap-2">
                <button className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 rounded hover:bg-blue-100 transition-colors text-sm font-medium">
                    <Plus size={16} /> Agregar Fila
                </button>
                <div className="h-4 w-px bg-gray-300 mx-2"></div>
                <button className="flex items-center gap-2 px-3 py-1.5 text-gray-600 hover:bg-gray-100 rounded transition-colors text-sm">
                    <MoreHorizontal size={16} /> Edición Masiva
                </button>
                <button className="flex items-center gap-2 px-3 py-1.5 text-gray-600 hover:bg-gray-100 rounded transition-colors text-sm">
                    <Copy size={16} /> Copiar Selección
                </button>
                <button className="flex items-center gap-2 px-3 py-1.5 text-red-600 hover:bg-red-50 rounded transition-colors text-sm">
                    <Trash2 size={16} /> Eliminar
                </button>
            </div>
        )}
      </div>
    </div>
  );
};
