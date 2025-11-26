import React, { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  AreaChart,
  Area,
  BarChart,
  Bar
} from 'recharts';
import { TrendingUp, Scale, Ruler, Trophy, ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

// Mock Data
const MOCK_1RM_HISTORY = [
  { date: '2023-08-01', squat: 100, bench: 60, deadlift: 120 },
  { date: '2023-08-15', squat: 105, bench: 62.5, deadlift: 125 },
  { date: '2023-09-01', squat: 110, bench: 65, deadlift: 130 },
  { date: '2023-09-15', squat: 112.5, bench: 67.5, deadlift: 135 },
  { date: '2023-10-01', squat: 115, bench: 70, deadlift: 140 },
  { date: '2023-10-15', squat: 120, bench: 72.5, deadlift: 145 },
];

const MOCK_BODYWEIGHT_HISTORY = [
  { date: '2023-08-01', weight: 75.0 },
  { date: '2023-08-08', weight: 74.8 },
  { date: '2023-08-15', weight: 74.5 },
  { date: '2023-08-22', weight: 74.2 },
  { date: '2023-08-29', weight: 73.9 },
  { date: '2023-09-05', weight: 73.5 },
  { date: '2023-09-12', weight: 73.2 },
  { date: '2023-09-19', weight: 73.0 },
  { date: '2023-09-26', weight: 72.8 },
  { date: '2023-10-03', weight: 72.5 },
  { date: '2023-10-10', weight: 72.3 },
  { date: '2023-10-17', weight: 72.0 },
];

const MOCK_MEASUREMENTS_HISTORY = [
  { date: '2023-08-01', chest: 100, waist: 85, thigh: 60 },
  { date: '2023-09-01', chest: 101, waist: 83, thigh: 61 },
  { date: '2023-10-01', chest: 102, waist: 81, thigh: 62 },
];

const InsightsCard = ({ title, description, trend, value }: { title: string, description: string, trend?: 'up' | 'down' | 'neutral', value?: string }) => (
  <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-3 mb-3">
    <div className="flex justify-between items-start">
      <h4 className="font-semibold text-indigo-900 text-sm">{title}</h4>
      {trend && (
        <span className={`flex items-center text-xs font-bold px-2 py-0.5 rounded-full ${
          trend === 'up' ? 'bg-green-100 text-green-700' : 
          trend === 'down' ? 'bg-red-100 text-red-700' : 
          'bg-gray-100 text-gray-700'
        }`}>
          {trend === 'up' && <ArrowUpRight size={12} className="mr-1" />}
          {trend === 'down' && <ArrowDownRight size={12} className="mr-1" />}
          {trend === 'neutral' && <Minus size={12} className="mr-1" />}
          {value}
        </span>
      )}
    </div>
    <p className="text-xs text-indigo-800 mt-1">{description}</p>
  </div>
);

export const ClientProgressPanel: React.FC = () => {
  const [chartView, setChartView] = useState<'1rm' | 'bodyweight' | 'measurements'>('1rm');

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-gray-900">Progreso del Cliente</h3>
          <p className="text-xs text-gray-500">Evolución de métricas clave</p>
        </div>
      </div>

      {/* Auto Insights Section */}
      <div className="space-y-2">
        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Insights Automáticos</h4>
        <InsightsCard 
          title="Fuerza en Press Banca" 
          description="María ha aumentado su 1RM en Press Banca un 20% en las últimas 10 semanas."
          trend="up"
          value="+20%"
        />
        <InsightsCard 
          title="Composición Corporal" 
          description="El peso corporal ha bajado 3kg mientras que las medidas de pecho y muslo han aumentado, indicando recomposición positiva."
          trend="down"
          value="-3kg"
        />
      </div>

      {/* Chart Controls */}
      <div className="flex p-1 bg-gray-100 rounded-lg">
        <button
          onClick={() => setChartView('1rm')}
          className={`flex-1 flex items-center justify-center py-2 text-xs font-medium rounded-md transition-all ${
            chartView === '1rm' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <Trophy size={14} className="mr-1" /> 1RM
        </button>
        <button
          onClick={() => setChartView('bodyweight')}
          className={`flex-1 flex items-center justify-center py-2 text-xs font-medium rounded-md transition-all ${
            chartView === 'bodyweight' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <Scale size={14} className="mr-1" /> Peso
        </button>
        <button
          onClick={() => setChartView('measurements')}
          className={`flex-1 flex items-center justify-center py-2 text-xs font-medium rounded-md transition-all ${
            chartView === 'measurements' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <Ruler size={14} className="mr-1" /> Medidas
        </button>
      </div>

      {/* Chart Display */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm h-80">
        <ResponsiveContainer width="100%" height="100%">
          {chartView === '1rm' ? (
            <LineChart data={MOCK_1RM_HISTORY} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
              <XAxis dataKey="date" tickFormatter={(val) => new Date(val).toLocaleDateString(undefined, {month:'short', day:'numeric'})} axisLine={false} tickLine={false} tick={{fontSize: 10}} />
              <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10}} />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                labelFormatter={(label) => new Date(label).toLocaleDateString()}
              />
              <Legend wrapperStyle={{ fontSize: '10px' }} />
              <Line type="monotone" dataKey="squat" name="Sentadilla" stroke="#3B82F6" strokeWidth={2} dot={{r:3}} />
              <Line type="monotone" dataKey="bench" name="Press Banca" stroke="#10B981" strokeWidth={2} dot={{r:3}} />
              <Line type="monotone" dataKey="deadlift" name="Peso Muerto" stroke="#F59E0B" strokeWidth={2} dot={{r:3}} />
            </LineChart>
          ) : chartView === 'bodyweight' ? (
            <AreaChart data={MOCK_BODYWEIGHT_HISTORY} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
              <XAxis dataKey="date" tickFormatter={(val) => new Date(val).toLocaleDateString(undefined, {month:'short', day:'numeric'})} axisLine={false} tickLine={false} tick={{fontSize: 10}} />
              <YAxis domain={['dataMin - 1', 'dataMax + 1']} axisLine={false} tickLine={false} tick={{fontSize: 10}} />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                labelFormatter={(label) => new Date(label).toLocaleDateString()}
              />
              <Area type="monotone" dataKey="weight" name="Peso Corporal (kg)" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.1} strokeWidth={2} />
            </AreaChart>
          ) : (
            <LineChart data={MOCK_MEASUREMENTS_HISTORY} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
              <XAxis dataKey="date" tickFormatter={(val) => new Date(val).toLocaleDateString(undefined, {month:'short', day:'numeric'})} axisLine={false} tickLine={false} tick={{fontSize: 10}} />
              <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10}} />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                labelFormatter={(label) => new Date(label).toLocaleDateString()}
              />
              <Legend wrapperStyle={{ fontSize: '10px' }} />
              <Line type="monotone" dataKey="chest" name="Pecho (cm)" stroke="#EC4899" strokeWidth={2} />
              <Line type="monotone" dataKey="waist" name="Cintura (cm)" stroke="#14B8A6" strokeWidth={2} />
              <Line type="monotone" dataKey="thigh" name="Muslo (cm)" stroke="#F97316" strokeWidth={2} />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-gray-50 rounded-lg p-3 text-center border border-gray-100">
           <p className="text-xs text-gray-500 uppercase">Total Movido</p>
           <p className="text-lg font-bold text-gray-800">4,250 kg</p>
           <p className="text-[10px] text-green-600 flex justify-center items-center"><TrendingUp size={10} className="mr-0.5"/> +5% vs mes ant.</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-3 text-center border border-gray-100">
           <p className="text-xs text-gray-500 uppercase">Asistencia</p>
           <p className="text-lg font-bold text-gray-800">92%</p>
           <p className="text-[10px] text-gray-500">Últimas 4 semanas</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-3 text-center border border-gray-100">
           <p className="text-xs text-gray-500 uppercase">RPE Promedio</p>
           <p className="text-lg font-bold text-gray-800">7.8</p>
           <p className="text-[10px] text-gray-500">Intensidad Alta</p>
        </div>
      </div>
    </div>
  );
};
