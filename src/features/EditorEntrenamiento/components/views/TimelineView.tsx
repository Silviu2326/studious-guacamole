import React, { useState, useMemo } from 'react';
import { Week } from '../../types/training';
import { 
  ZoomIn, 
  ZoomOut, 
  Filter, 
  MoreHorizontal, 
  Edit2, 
  Copy, 
  Trash2,
  TrendingUp,
  Activity,
  Layout
} from 'lucide-react';

interface TimelineViewProps {
  weeks?: Week[];
}

// Helper types for visualization since we only have flat weeks in the current type definition
interface Mesocycle {
  id: string;
  name: string;
  phase: string;
  weeks: Week[];
  color: string; // Color theme for the mesocycle
}

export const TimelineView: React.FC<TimelineViewProps> = ({ weeks = [] }) => {
  const [zoomLevel, setZoomLevel] = useState<number>(50); // 0 to 100

  // Mock grouping of weeks into Mesocycles
  const mesocycles: Mesocycle[] = useMemo(() => {
    if (!weeks || weeks.length === 0) {
        // Return mock data if no weeks provided for visualization demo
        return [
            {
                id: 'meso-1',
                name: 'Mesociclo 1',
                phase: 'Base',
                color: 'blue',
                weeks: Array(4).fill(null).map((_, i) => ({
                    id: `mock-w-${i+1}`,
                    name: `Semana ${i+1}`,
                    days: [],
                    tags: []
                }))
            },
            {
                id: 'meso-2',
                name: 'Mesociclo 2',
                phase: 'Intensificación',
                color: 'indigo',
                weeks: Array(4).fill(null).map((_, i) => ({
                    id: `mock-w-${i+5}`,
                    name: `Semana ${i+5}`,
                    days: [],
                    tags: []
                }))
            }
        ];
    }

    const cycles: Mesocycle[] = [];
    let currentWeeks: Week[] = [];
    // Default to grouping by 4 weeks for this implementation if explicit grouping is missing
    const WEEKS_PER_CYCLE = 4;
    
    weeks.forEach((week, index) => {
        currentWeeks.push(week);
        
        if (currentWeeks.length === WEEKS_PER_CYCLE || index === weeks.length - 1) {
             const cycleIndex = cycles.length + 1;
             const phaseName = currentWeeks[0].phase || (cycleIndex === 1 ? 'Base' : cycleIndex === 2 ? 'Intensificación' : 'Realización');
             
             cycles.push({
               id: `meso-${cycleIndex}`,
               name: `Mesociclo ${cycleIndex}`,
               phase: phaseName,
               weeks: [...currentWeeks],
               color: cycleIndex === 1 ? 'blue' : cycleIndex === 2 ? 'indigo' : 'purple'
             });
             currentWeeks = [];
        }
    });

    return cycles;
  }, [weeks]);

  // Helper to calculate mock volume percentage for visualization
  const getVolumePercent = (weekIndex: number) => {
      // Mock pattern: progressive overload + deload
      const pattern = [60, 75, 85, 40]; 
      return pattern[weekIndex % 4];
  };

  const getIntensityPercent = (weekIndex: number) => {
      // Mock pattern: increasing intensity
      const pattern = [65, 70, 80, 60]; 
      return pattern[weekIndex % 4];
  };

  // Color mappings for Tailwind JIT safety
  const colorVariants: Record<string, { badge: string, text: string, bar: string }> = {
      blue: { badge: 'bg-blue-100 text-blue-700', text: 'text-blue-600', bar: 'bg-blue-500' },
      indigo: { badge: 'bg-indigo-100 text-indigo-700', text: 'text-indigo-600', bar: 'bg-indigo-500' },
      purple: { badge: 'bg-purple-100 text-purple-700', text: 'text-purple-600', bar: 'bg-purple-500' },
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 overflow-hidden">
      {/* Header / Toolbar */}
      <div className="flex flex-col bg-white border-b border-gray-200 shadow-sm z-10">
        <div className="flex items-center justify-between px-6 py-3 border-b border-gray-100">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                    <Layout size={20} />
                </div>
                <div>
                    <h2 className="text-lg font-bold text-gray-800">Vista Timeline</h2>
                    <p className="text-xs text-gray-500">Programa 12 Semanas</p>
                </div>
            </div>
            <div className="flex items-center gap-2">
                 <button className="px-3 py-1.5 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors">
                    Exportar Timeline
                 </button>
            </div>
        </div>

        {/* Controls Bar */}
        <div className="flex items-center justify-between px-6 py-2 bg-gray-50 text-sm">
            <div className="flex items-center gap-6 flex-1">
                {/* Zoom Control */}
                <div className="flex items-center gap-3 w-64">
                    <ZoomOut size={16} className="text-gray-400" />
                    <input 
                        type="range" 
                        min="0" 
                        max="100" 
                        value={zoomLevel} 
                        onChange={(e) => setZoomLevel(parseInt(e.target.value))}
                        className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                    />
                    <ZoomIn size={16} className="text-gray-600" />
                </div>
                
                {/* Divider */}
                <div className="h-4 w-px bg-gray-300"></div>

                {/* Filters */}
                <div className="flex items-center gap-2 cursor-pointer hover:text-indigo-600 text-gray-600">
                    <Filter size={14} />
                    <span className="font-medium">Filtros:</span>
                    <span className="bg-white border border-gray-200 px-2 py-0.5 rounded text-xs text-gray-700">#Todos</span>
                </div>

                 {/* Metrics */}
                 <div className="flex items-center gap-2 cursor-pointer hover:text-indigo-600 text-gray-600">
                    <Activity size={14} />
                    <span className="font-medium">Métricas:</span>
                    <span className="bg-white border border-gray-200 px-2 py-0.5 rounded text-xs text-gray-700">Volumen</span>
                </div>
            </div>
        </div>
      </div>

      {/* Timeline Scroll Area */}
      <div className="flex-1 overflow-x-auto overflow-y-auto p-6">
          <div className="flex flex-col gap-8 min-w-[1000px]">
              {mesocycles.map((meso, mesoIndex) => {
                  const colors = colorVariants[meso.color] || colorVariants['blue'];
                  
                  return (
                  <div key={meso.id} className="flex flex-col animate-in fade-in duration-500" style={{ animationDelay: `${mesoIndex * 100}ms` }}>
                      {/* Mesocycle Header */}
                      <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                              <span className={`flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm border-2 border-white shadow-sm ${colors.badge}`}>
                                  {mesoIndex + 1}
                              </span>
                              <h3 className="font-bold text-gray-800 text-lg uppercase tracking-wide">
                                  {meso.name}: <span className={`${colors.text}`}>{meso.phase}</span>
                              </h3>
                              <span className="text-sm text-gray-500 font-medium px-2 py-0.5 bg-gray-200 rounded-full">
                                  Semanas {mesoIndex * 4 + 1}-{mesoIndex * 4 + meso.weeks.length}
                              </span>
                          </div>
                          
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded"><Edit2 size={14} /></button>
                              <button className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded"><Copy size={14} /></button>
                              <button className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"><Trash2 size={14} /></button>
                          </div>
                      </div>

                      {/* Mesocycle Grid (Weeks/Microcycles) */}
                      <div className="grid grid-cols-4 gap-4 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                          {meso.weeks.map((week, weekIndex) => {
                              const volPercent = getVolumePercent(weekIndex);
                              const intPercent = getIntensityPercent(weekIndex);
                              const isDeload = volPercent < 50;

                              return (
                                  <div key={week.id} className="flex flex-col h-full border-r border-gray-100 last:border-0 px-2">
                                      {/* Microcycle Header */}
                                      <div className="flex items-center justify-between mb-4">
                                          <div>
                                              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Microciclo {weekIndex + 1}</span>
                                              <div className="font-semibold text-gray-800">{week.name}</div>
                                          </div>
                                          {isDeload && (
                                              <span className="text-[10px] font-bold bg-green-100 text-green-700 px-1.5 py-0.5 rounded border border-green-200">
                                                  DELOAD
                                              </span>
                                          )}
                                      </div>

                                      {/* Visualization Bars */}
                                      <div className="flex flex-col gap-4 flex-1 justify-end">
                                          
                                          {/* Volume Bar */}
                                          <div className="space-y-1">
                                              <div className="flex justify-between text-xs">
                                                  <span className="font-medium text-gray-500">Volumen</span>
                                                  <span className="font-bold text-gray-700">{Math.round(180 * (volPercent/100))} sets</span>
                                              </div>
                                              <div className="h-24 w-full bg-gray-100 rounded-md relative overflow-hidden flex items-end">
                                                  {/* Striped Pattern Background */}
                                                  <div className="absolute inset-0 opacity-30" 
                                                      style={{ backgroundImage: 'linear-gradient(45deg, #f3f4f6 25%, transparent 25%, transparent 50%, #f3f4f6 50%, #f3f4f6 75%, transparent 75%, transparent)', backgroundSize: '8px 8px' }}>
                                                  </div>
                                                  
                                                  {/* Fill */}
                                                  <div 
                                                      className={`w-full rounded-b-md transition-all duration-500 relative group cursor-help
                                                          ${isDeload ? 'bg-green-400' : colors.bar}
                                                      `}
                                                      style={{ height: `${volPercent}%` }}
                                                  >
                                                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-20">
                                                          {volPercent}% Capacidad
                                                      </div>
                                                  </div>
                                              </div>
                                          </div>

                                          {/* Intensity Bar (Horizontal) */}
                                          <div className="space-y-1">
                                               <div className="flex justify-between text-xs">
                                                  <span className="font-medium text-gray-500">Intensidad (RPE)</span>
                                                  <span className="font-bold text-gray-700">~{Math.round(10 * (intPercent/100))}</span>
                                              </div>
                                              <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                                                  <div 
                                                      className="h-full bg-orange-500 rounded-full"
                                                      style={{ width: `${intPercent}%` }}
                                                  ></div>
                                              </div>
                                          </div>

                                          {/* Tags Preview */}
                                          <div className="flex flex-wrap gap-1 mt-2">
                                              <span className="px-1.5 py-0.5 bg-gray-100 text-gray-500 text-[10px] rounded">#Fuerza</span>
                                              <span className="px-1.5 py-0.5 bg-gray-100 text-gray-500 text-[10px] rounded">#Técnica</span>
                                          </div>

                                      </div>
                                  </div>
                              );
                          })}
                      </div>
                  </div>
                  );
              })}
              
              {/* Add Mesocycle Button */}
              <div className="flex items-center justify-center py-8 border-2 border-dashed border-gray-300 rounded-xl hover:border-indigo-400 hover:bg-indigo-50 transition-colors cursor-pointer group">
                  <div className="flex flex-col items-center gap-2 text-gray-400 group-hover:text-indigo-600">
                      <div className="p-2 rounded-full bg-gray-100 group-hover:bg-indigo-100">
                         <MoreHorizontal size={24} />
                      </div>
                      <span className="font-medium">Agregar Mesociclo</span>
                  </div>
              </div>
          </div>
      </div>
    </div>
  );
};
