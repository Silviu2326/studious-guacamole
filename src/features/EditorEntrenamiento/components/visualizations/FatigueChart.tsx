import React, { useMemo } from 'react';
import {
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ReferenceArea
} from 'recharts';
import { Week, Set } from '../../types/training';

interface FatigueChartProps {
  weeks: Week[];
}

interface ChartData {
  name: string;
  acuteLoad: number;
  chronicLoad: number;
  volume: number;
  intensity: number;
  ratio: number;
  safeZoneLow: number;
  safeZoneHigh: number;
  safeZoneRange: [number, number];
}

const parseReps = (reps: number | string | undefined): number => {
  if (typeof reps === 'number') return reps;
  if (!reps) return 0;
  
  const strReps = String(reps).trim();
  
  // Handle ranges "8-12"
  if (strReps.includes('-')) {
    const [min, max] = strReps.split('-').map(Number);
    return (min + max) / 2;
  }
  
  // Handle AMRAP (arbitrary conservative estimate or try to parse "AMRAP 10")
  if (strReps.toUpperCase().includes('AMRAP')) {
      // If it's just AMRAP, assume a reasonable number like 8 for calculation
      return 8; 
  }

  // Try parsing as float
  const parsed = parseFloat(strReps);
  return isNaN(parsed) ? 0 : parsed;
};

const calculateWeekStats = (week: Week) => {
  let totalReps = 0;
  let totalSets = 0;
  let totalRpe = 0;
  let setsWithRpe = 0;

  week.days.forEach(day => {
    day.blocks.forEach(block => {
      block.exercises.forEach(exercise => {
        exercise.sets.forEach((set: Set) => {
          const reps = parseReps(set.reps);
          // Assuming set is valid if it has reps or is a working set
          if (set.type !== 'warmup') {
            totalReps += reps;
            totalSets += 1;
            
            if (set.rpe) {
              totalRpe += set.rpe;
              setsWithRpe += 1;
            }
          }
        });
      });
    });
  });

  const averageRpe = setsWithRpe > 0 ? totalRpe / setsWithRpe : 0;
  const volume = totalReps; // Total reps as volume proxy, or totalSets * avgReps? 
                            // Using totalReps is more accurate for volume load if weight isn't consistent.
                            // Prompt says "volumen total (series * reps)". 
                            // If I sum reps of all sets, that IS sum(series * reps) effectively.
  
  const load = volume * (averageRpe || 1); // Load = Volume * Intensity (RPE)

  return {
    volume,
    intensity: averageRpe,
    load
  };
};

export const FatigueChart: React.FC<FatigueChartProps> = ({ weeks }) => {
  const data = useMemo(() => {
    const weeklyStats = weeks.map(week => calculateWeekStats(week));
    
    return weeks.map((week, index) => {
      const acuteLoad = weeklyStats[index].load;
      
      // Calculate Chronic Load (4-week moving average)
      // We include the current week and previous 3 weeks
      const startWindow = Math.max(0, index - 3);
      const windowStats = weeklyStats.slice(startWindow, index + 1);
      const sumLoad = windowStats.reduce((acc, curr) => acc + curr.load, 0);
      const chronicLoad = sumLoad / windowStats.length;

      const ratio = chronicLoad > 0 ? acuteLoad / chronicLoad : 0;

      // Safe zones usually defined around the Chronic Load
      // 0.8 - 1.3 is often considered the "Sweet Spot"
      const safeZoneLow = chronicLoad * 0.8;
      const safeZoneHigh = chronicLoad * 1.3;

      return {
        name: week.name || `Semana ${index + 1}`,
        acuteLoad: Math.round(acuteLoad),
        chronicLoad: Math.round(chronicLoad),
        volume: Math.round(weeklyStats[index].volume),
        intensity: parseFloat(weeklyStats[index].intensity.toFixed(1)),
        ratio: parseFloat(ratio.toFixed(2)),
        safeZoneLow: Math.round(safeZoneLow),
        safeZoneHigh: Math.round(safeZoneHigh),
        safeZoneRange: [Math.round(safeZoneLow), Math.round(safeZoneHigh)],
      };
    });
  }, [weeks]);

  // Determine risk color for the tooltip/dots
  const getRiskColor = (ratio: number) => {
    if (ratio > 1.5) return '#EF4444'; // Red - High Risk
    if (ratio > 1.3) return '#F59E0B'; // Yellow - Warning
    if (ratio < 0.8) return '#F59E0B'; // Yellow - Undertraining
    return '#10B981'; // Green - Optimal
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const dataPoint = payload[0].payload;
      const riskColor = getRiskColor(dataPoint.ratio);
      
      return (
        <div className="bg-white p-4 border border-gray-200 shadow-lg rounded-lg">
          <p className="font-bold text-gray-900 mb-2">{label}</p>
          <div className="space-y-1 text-sm">
            <p className="text-blue-600">
              Carga Aguda (Semanal): <span className="font-semibold">{dataPoint.acuteLoad}</span>
            </p>
            <p className="text-purple-600">
              Carga Crónica (4-sem): <span className="font-semibold">{dataPoint.chronicLoad}</span>
            </p>
            <p className="text-gray-600">
              Ratio A:C: <span className="font-semibold" style={{ color: riskColor }}>{dataPoint.ratio}</span>
            </p>
            <div className="border-t border-gray-100 my-2 pt-2">
              <p className="text-gray-500 text-xs">Componentes:</p>
              <p className="text-gray-600">Volumen: {dataPoint.volume} reps</p>
              <p className="text-gray-600">Intensidad: RPE {dataPoint.intensity}</p>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-[300px] bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-semibold text-gray-900">Análisis de Fatiga (ACWR)</h3>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1">
            <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
            <span className="text-gray-600">Carga Aguda</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-3 h-3 bg-purple-500 rounded-full opacity-50"></span>
            <span className="text-gray-600">Carga Crónica</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-3 h-3 bg-green-100 border border-green-200 rounded-sm"></span>
            <span className="text-gray-600">Zona Óptima (0.8-1.3)</span>
          </div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorAcute" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 12, fill: '#6B7280' }} 
            dy={10}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 12, fill: '#6B7280' }} 
          />
          <Tooltip content={<CustomTooltip />} />
          
          {/* Safe Zone Area (Range) */}
          {/* We use two Areas stacked or a single Area with [min, max] if supported, 
              but Recharts Area 'dataKey' usually takes one value. 
              To do a range area, we can use 'dataKey' as an array? No. 
              We can use 'range' prop in Area? 
              Actually, Recharts Area component accepts 'dataKey' as the upper bound.
              The 'baseValue' prop sets the lower bound but it's constant.
              
              To achieve a variable band, we need to use the 'Area' with an array of values in dataKey is not standard.
              Standard way: Use 'dataKey' for the top line, and we can try to stack? 
              No, stacking is for additive.
              
              Correct way in Recharts for a band:
              Use <Area dataKey="range" /> where data.range = [min, max].
          */}
          <Area
            type="monotone"
            dataKey="safeZoneRange"
            stroke="none"
            fill="#10B981"
            fillOpacity={0.1}
            isAnimationActive={false}
          />

          {/* Lines */}
          <Line 
            type="monotone" 
            dataKey="chronicLoad" 
            stroke="#8B5CF6" 
            strokeWidth={2} 
            strokeDasharray="4 4"
            dot={false}
            activeDot={false}
            isAnimationActive={true}
          />
          
          <Line 
            type="monotone" 
            dataKey="acuteLoad" 
            stroke="#3B82F6" 
            strokeWidth={3}
            dot={{ r: 4, strokeWidth: 2, fill: '#fff' }}
            activeDot={{ r: 6, strokeWidth: 0 }}
            isAnimationActive={true}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};
