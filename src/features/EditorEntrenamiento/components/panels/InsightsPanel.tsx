import React, { useMemo } from 'react';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
  Legend
} from 'recharts';
import { AlertTriangle, Activity, CheckCircle } from 'lucide-react';
import { useProgramContext } from '../../context/ProgramContext';
import { Exercise } from '../../types/training';

export const InsightsPanel: React.FC = () => {
  const { daysData } = useProgramContext();

  // Define pattern categories
  const PATTERNS = ['Empuje', 'Tracción', 'Rodilla', 'Cadera', 'Core'];
  
  // Ideal distribution (in percentage) - simplifying to equal distribution for now, 
  // or standard Hypertrophy balance. Let's use a balanced approach.
  const IDEAL_DISTRIBUTION: Record<string, number> = {
    'Empuje': 20,
    'Tracción': 20,
    'Rodilla': 20,
    'Cadera': 20,
    'Core': 20
  };

  const COLORS = {
    current: '#3B82F6', // Blue-500
    ideal: '#9CA3AF',   // Gray-400
    warning: '#F59E0B',
    success: '#10B981',
  };

  // Helper to detect pattern from exercise
  const detectPattern = (exercise: Exercise): string | null => {
    // 1. Check tags
    const patternTag = exercise.tags.find(t => t.category === 'pattern' || PATTERNS.includes(t.label));
    if (patternTag) {
        // Map tag label to standard PATTERNS if needed, but assuming match for now or simple mapping
        if (patternTag.label === 'Push' || patternTag.label === 'Fuerza') return 'Empuje'; // 'Fuerza' is vague but used in mock
        // In a real app, tags would be more specific.
        return patternTag.label; 
    }

    // 2. Keyword matching on Name
    const name = exercise.name.toLowerCase();
    if (name.includes('bench') || name.includes('press') || name.includes('push') || name.includes('chest') || name.includes('tricep')) return 'Empuje';
    if (name.includes('row') || name.includes('pull') || name.includes('chin') || name.includes('back') || name.includes('bicep') || name.includes('face pull')) return 'Tracción';
    if (name.includes('squat') || name.includes('lunge') || name.includes('leg press') || name.includes('quad') || name.includes('step')) return 'Rodilla';
    if (name.includes('deadlift') || name.includes('hinge') || name.includes('glute') || name.includes('hip') || name.includes('rdl')) return 'Cadera';
    if (name.includes('plank') || name.includes('crunch') || name.includes('abs') || name.includes('core') || name.includes('hollow')) return 'Core';

    return null;
  };

  const { data, alerts, totalSets } = useMemo(() => {
    const counts: Record<string, number> = {
      'Empuje': 0,
      'Tracción': 0,
      'Rodilla': 0,
      'Cadera': 0,
      'Core': 0
    };
    
    let total = 0;

    daysData.forEach(day => {
      day.blocks.forEach(block => {
        block.exercises.forEach(exercise => {
          const setsCount = exercise.sets.filter(s => s.type !== 'warmup').length || exercise.sets.length;
          const pattern = detectPattern(exercise);
          
          if (pattern && counts[pattern] !== undefined) {
            counts[pattern] += setsCount;
            total += setsCount;
          }
        });
      });
    });

    // Format for Recharts
    // Radar chart needs: { subject: 'Empuje', A: 120, B: 110, fullMark: 150 }
    // We will normalize to percentages for easier comparison
    const chartData = PATTERNS.map(pattern => {
      const count = counts[pattern];
      const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
      const ideal = IDEAL_DISTRIBUTION[pattern];
      
      return {
        subject: pattern,
        actual: percentage,
        ideal: ideal,
        fullMark: 100
      };
    });

    // Generate Alerts
    const newAlerts: string[] = [];
    chartData.forEach(item => {
      const diff = item.actual - item.ideal;
      if (Math.abs(diff) > 10) { // Using >10% deviation as trigger (Prompt said >20%, checking text)
         // Prompt: "Genera una alerta textual si hay desequilibrio >20%"
         // I will use 20.
         if (Math.abs(diff) > 20) {
             if (diff > 0) {
                 newAlerts.push(`Exceso de trabajo en ${item.subject} (+${diff}% vs ideal).`);
             } else {
                 newAlerts.push(`Déficit de trabajo en ${item.subject} (${diff}% vs ideal).`);
             }
         }
      }
    });
    
    // Special check: Push vs Pull ratio
    const push = chartData.find(d => d.subject === 'Empuje')?.actual || 0;
    const pull = chartData.find(d => d.subject === 'Tracción')?.actual || 0;
    if (push > pull + 15) {
        newAlerts.push(`Desbalance Empuje/Tracción: Mucho empuje frente a tracción.`);
    }

    return { data: chartData, alerts: newAlerts, totalSets: total };
  }, [daysData]);

  if (totalSets === 0) {
      return (
        <div className="flex flex-col items-center justify-center h-64 text-center p-6 border-2 border-dashed border-gray-200 rounded-lg bg-gray-50">
        <Activity className="w-12 h-12 text-gray-300 mb-3" />
        <h5 className="text-sm font-medium text-gray-900">Sin datos suficientes</h5>
        <p className="text-xs text-gray-500 mt-1">Agrega ejercicios con sets de trabajo para generar insights.</p>
      </div>
      );
  }

  return (
    <div className="space-y-6">
      <div className="mb-4">
        <h4 className="text-lg font-bold text-gray-900 mb-1">Insights del Programa</h4>
        <p className="text-xs text-gray-500">Balance muscular y patrones de movimiento</p>
      </div>

      {/* Radar Chart */}
      <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
        <h5 className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-3">Patrones de Movimiento</h5>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
              <PolarGrid stroke="#E5E7EB" />
              <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: '#4B5563', fontWeight: 500 }} />
              <PolarRadiusAxis angle={30} domain={[0, 60]} tick={false} axisLine={false} /> {/* Domain 0-60 covers typical % distributions */}
              <Radar
                name="Actual (%)"
                dataKey="actual"
                stroke={COLORS.current}
                fill={COLORS.current}
                fillOpacity={0.5}
              />
              <Radar
                name="Ideal (%)"
                dataKey="ideal"
                stroke={COLORS.ideal}
                fill="transparent"
                strokeDasharray="4 4"
              />
              <Legend iconSize={8} wrapperStyle={{ fontSize: '10px' }} />
              <Tooltip 
                contentStyle={{ fontSize: '12px', borderRadius: '4px' }}
                formatter={(value: number) => [`${value}%`, '']}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mt-3 space-y-2">
            {alerts.length > 0 ? (
                alerts.map((alert, idx) => (
                    <div key={idx} className="p-2 bg-yellow-50 border border-yellow-100 rounded text-xs text-yellow-800 flex items-start gap-2">
                        <AlertTriangle size={14} className="mt-0.5 flex-shrink-0 text-yellow-600" />
                        <span>{alert}</span>
                    </div>
                ))
            ) : (
                <div className="p-2 bg-green-50 border border-green-100 rounded text-xs text-green-800 flex items-start gap-2">
                    <CheckCircle size={14} className="mt-0.5 flex-shrink-0 text-green-600" />
                    <span>El programa está bien balanceado según los patrones fundamentales.</span>
                </div>
            )}
        </div>
      </div>

      {/* Stat Summary - Optional but helpful */}
      <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
          <h5 className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-3">Distribución Detallada</h5>
          <div className="space-y-3">
              {data.map((item) => (
                  <div key={item.subject} className="flex items-center justify-between text-xs">
                      <span className="text-gray-600 font-medium w-16">{item.subject}</span>
                      <div className="flex-1 mx-2 h-2 bg-gray-100 rounded-full overflow-hidden relative">
                          {/* Ideal Marker */}
                           <div 
                              className="absolute top-0 bottom-0 w-0.5 bg-gray-400 z-10" 
                              style={{ left: `${Math.min(item.ideal, 100)}%` }}
                              title="Ideal"
                           />
                          <div 
                              className={`h-full rounded-full ${Math.abs(item.actual - item.ideal) > 20 ? 'bg-yellow-500' : 'bg-blue-500'}`}
                              style={{ width: `${Math.min(item.actual, 100)}%` }}
                          />
                      </div>
                      <span className="text-gray-500 w-8 text-right">{item.actual}%</span>
                  </div>
              ))}
          </div>
      </div>

    </div>
  );
};
