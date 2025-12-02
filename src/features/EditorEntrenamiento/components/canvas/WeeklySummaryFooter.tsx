import React, { useMemo } from 'react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip,
  Legend 
} from 'recharts';
import { Dumbbell, Activity, TrendingUp } from 'lucide-react';
import { Day, Set, Exercise } from '../../types/training';

interface WeeklySummaryFooterProps {
  days: Day[];
  weekIndex: number;
}

const COLORS = {
  'Fuerza': '#3B82F6', // Blue-500
  'Hipertrofia': '#8B5CF6', // Purple-500
  'Metabólico': '#EF4444', // Red-500
  'Otros': '#9CA3AF' // Gray-400
};

export const WeeklySummaryFooter: React.FC<WeeklySummaryFooterProps> = ({ days, weekIndex }) => {
  const stats = useMemo(() => {
    let totalSets = 0;
    let totalTonnage = 0;
    let totalRpeSum = 0;
    let rpeCount = 0;
    
    const zoneDistribution: Record<string, number> = {
      'Fuerza': 0,
      'Hipertrofia': 0,
      'Metabólico': 0,
      'Otros': 0
    };

    days.forEach(day => {
      // Zone Distribution based on Day Tags
      let hasZoneTag = false;
      day.tags.forEach(tag => {
        const label = tag.label.toLowerCase();
        if (label === 'fuerza') {
          zoneDistribution['Fuerza']++;
          hasZoneTag = true;
        } else if (label === 'hipertrofia') {
          zoneDistribution['Hipertrofia']++;
          hasZoneTag = true;
        } else if (['metabólico', 'metabolico', 'cardio', 'hiit', 'conditioning'].includes(label)) {
          zoneDistribution['Metabólico']++;
          hasZoneTag = true;
        }
      });

      // If no recognized tag, check blocks or fall back to 'Otros' if day has blocks
      if (!hasZoneTag && day.blocks.length > 0) {
        // Fallback logic: Check if any block is conditioning
        const hasConditioning = day.blocks.some(b => b.type === 'conditioning');
        if (hasConditioning) {
            zoneDistribution['Metabólico']++;
        } else {
            zoneDistribution['Otros']++;
        }
      }

      // Stats Calculation
      day.blocks.forEach(block => {
        block.exercises.forEach((exercise: Exercise) => {
          totalSets += exercise.sets.length;
          
          exercise.sets.forEach((set: Set) => {
            // Tonnage: weight * reps
            if (set.weight && set.reps) {
              let reps = 0;
              if (typeof set.reps === 'number') {
                reps = set.reps;
              } else if (typeof set.reps === 'string') {
                 // Parse ranges "8-12"
                 if (set.reps.includes('-')) {
                    const [min, max] = set.reps.split('-').map(Number);
                    if (!isNaN(min) && !isNaN(max)) {
                        reps = (min + max) / 2;
                    }
                 } else {
                    // Simple parse
                    const parsed = parseFloat(set.reps);
                    if (!isNaN(parsed)) reps = parsed;
                 }
              }
              totalTonnage += set.weight * reps;
            }

            // Avg RPE
            if (set.rpe) {
              totalRpeSum += set.rpe;
              rpeCount++;
            }
          });
        });
      });
    });

    return {
      totalSets,
      totalTonnage: Math.round(totalTonnage),
      avgRpe: rpeCount > 0 ? (totalRpeSum / rpeCount).toFixed(1) : 'N/A',
      chartData: [
        { name: 'Fuerza', value: zoneDistribution['Fuerza'] },
        { name: 'Hipertrofia', value: zoneDistribution['Hipertrofia'] },
        { name: 'Metabólico', value: zoneDistribution['Metabólico'] },
      ].filter(item => item.value > 0) // Only show non-zero
    };
  }, [days]);

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mt-4 mb-8 shadow-sm">
      <h3 className="text-sm font-bold text-gray-700 mb-3">Resumen Semana {weekIndex + 1}</h3>
      <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
        
        {/* Left: Summary Stats */}
        <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
          <div className="bg-white p-3 rounded-lg border border-gray-100 shadow-sm flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-full text-blue-600">
              <ListIcon size={20} />
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase font-semibold tracking-wider">Series Totales</p>
              <p className="text-lg font-bold text-gray-900">{stats.totalSets}</p>
            </div>
          </div>

          <div className="bg-white p-3 rounded-lg border border-gray-100 shadow-sm flex items-center gap-3">
            <div className="p-2 bg-purple-50 rounded-full text-purple-600">
              <Dumbbell size={20} />
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase font-semibold tracking-wider">Tonelaje Est.</p>
              <p className="text-lg font-bold text-gray-900">{stats.totalTonnage.toLocaleString()} kg</p>
            </div>
          </div>

          <div className="bg-white p-3 rounded-lg border border-gray-100 shadow-sm flex items-center gap-3">
            <div className="p-2 bg-orange-50 rounded-full text-orange-600">
              <Activity size={20} />
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase font-semibold tracking-wider">Intensidad Avg</p>
              <p className="text-lg font-bold text-gray-900">{stats.avgRpe} RPE</p>
            </div>
          </div>
          
           {/* Placeholder for future stat */}
           <div className="hidden md:flex bg-white p-3 rounded-lg border border-gray-100 shadow-sm items-center gap-3 opacity-50">
            <div className="p-2 bg-gray-50 rounded-full text-gray-400">
              <TrendingUp size={20} />
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase font-semibold tracking-wider">Progresión</p>
              <p className="text-lg font-bold text-gray-900">-</p>
            </div>
          </div>
        </div>

        {/* Right: Distribution Chart */}
        <div className="w-full lg:w-1/3 h-32 flex items-center bg-white rounded-lg border border-gray-100 p-2">
            {stats.chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={stats.chartData}
                            cx="50%"
                            cy="50%"
                            innerRadius={25}
                            outerRadius={40}
                            paddingAngle={5}
                            dataKey="value"
                        >
                            {stats.chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[entry.name as keyof typeof COLORS] || '#ccc'} />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend 
                            layout="vertical" 
                            verticalAlign="middle" 
                            align="right"
                            iconType="circle"
                            iconSize={8}
                            wrapperStyle={{ fontSize: '10px', lineHeight: '14px' }}
                        />
                    </PieChart>
                </ResponsiveContainer>
            ) : (
                <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
                    Sin datos de distribución
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

// Helper component for icon if ListIcon isn't imported or differs
const ListIcon = ({ size }: { size: number }) => (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <line x1="8" y1="6" x2="21" y2="6" />
      <line x1="8" y1="12" x2="21" y2="12" />
      <line x1="8" y1="18" x2="21" y2="18" />
      <line x1="3" y1="6" x2="3.01" y2="6" />
      <line x1="3" y1="12" x2="3.01" y2="12" />
      <line x1="3" y1="18" x2="3.01" y2="18" />
    </svg>
);