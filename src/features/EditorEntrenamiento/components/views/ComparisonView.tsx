import React, { useState, useMemo } from 'react';
import { Week } from '../../types/training';
import { ArrowLeftRight, BarChart2, Clock, Activity, AlertTriangle } from 'lucide-react';

interface ComparisonViewProps {
    weeks: Week[];
}

// Helper to calculate metrics for a program
const calculateMetrics = (weeks: Week[]) => {
    let totalDuration = 0;
    let totalRPE = 0;
    let rpeCount = 0;
    const patternDistribution: Record<string, number> = {};

    weeks.forEach(week => {
        week.days.forEach(day => {
            totalDuration += day.totalDuration || 0;
            
            // RPE
            if (day.averageRpe && day.averageRpe > 0) {
                totalRPE += day.averageRpe;
                rpeCount++;
            }

            // Patterns
            day.tags.forEach(tag => {
                if (tag.category === 'pattern') {
                    patternDistribution[tag.label] = (patternDistribution[tag.label] || 0) + 1;
                }
            });
        });
    });

    return {
        totalDuration,
        averageIntensity: rpeCount > 0 ? (totalRPE / rpeCount).toFixed(1) : 'N/A',
        patternDistribution
    };
};

// Mock Program for Comparison
const MOCK_PROGRAM_B: Week[] = [
    {
        id: 'w1-b',
        name: 'Semana 1 (Hypertrophy Focus)',
        days: [
            {
                id: 'd1-b',
                name: 'LUNES',
                tags: [{ id: 't1', label: 'Fuerza', color: 'blue', category: 'pattern' }],
                totalDuration: 90,
                averageRpe: 9,
                blocks: []
            },
            {
                id: 'd2-b',
                name: 'MARTES',
                tags: [{ id: 't2', label: 'Hipertrofia', color: 'purple', category: 'pattern' }],
                totalDuration: 60,
                averageRpe: 8,
                blocks: []
            },
            {
                id: 'd3-b',
                name: 'MIÉRCOLES',
                tags: [{ id: 't5', label: 'Descanso', color: 'gray', category: 'other' }],
                totalDuration: 0,
                averageRpe: 0,
                blocks: []
            },
             {
                id: 'd4-b',
                name: 'JUEVES',
                tags: [{ id: 't1', label: 'Fuerza', color: 'blue', category: 'pattern' }],
                totalDuration: 80,
                averageRpe: 8.5,
                blocks: []
            },
            {
                id: 'd5-b',
                name: 'VIERNES',
                tags: [{ id: 't2', label: 'Hipertrofia', color: 'purple', category: 'pattern' }],
                totalDuration: 75,
                averageRpe: 9,
                blocks: []
            },
            {
                id: 'd6-b',
                name: 'SÁBADO',
                tags: [{ id: 't1', label: 'Fuerza', color: 'blue', category: 'pattern' }],
                totalDuration: 45,
                averageRpe: 7,
                blocks: []
            },
            {
                id: 'd7-b',
                name: 'DOMINGO',
                tags: [{ id: 't5', label: 'Descanso', color: 'gray', category: 'other' }],
                totalDuration: 0,
                averageRpe: 0,
                blocks: []
            },
        ]
    }
];

export const ComparisonView: React.FC<ComparisonViewProps> = ({ weeks }) => {
    const [programB, setProgramB] = useState<Week[] | null>(null);

    const metricsA = useMemo(() => calculateMetrics(weeks), [weeks]);
    const metricsB = useMemo(() => programB ? calculateMetrics(programB) : null, [programB]);

    // Simple diff calculator
    const getDiff = (valA: number, valB: number) => {
        const diff = valA - valB;
        return diff > 0 ? `+${diff}` : `${diff}`;
    };

    return (
        <div className="h-full overflow-y-auto p-6 bg-gray-50">
            <div className="max-w-6xl mx-auto space-y-6">
                
                {/* Header */}
                <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center gap-3">
                        <ArrowLeftRight className="text-blue-600" size={24} />
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">Comparación de Programas</h2>
                            <p className="text-sm text-gray-500">Analiza diferencias clave entre dos planificaciones</p>
                        </div>
                    </div>
                    
                    <div className="flex gap-2">
                        <select 
                            className="bg-gray-100 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            onChange={(e) => {
                                if (e.target.value === 'mock-b') setProgramB(MOCK_PROGRAM_B);
                                else setProgramB(null);
                            }}
                        >
                            <option value="">Seleccionar programa para comparar...</option>
                            <option value="mock-b">Programa B (Hipertrofia Mock)</option>
                        </select>
                    </div>
                </div>

                {/* Main Comparison Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    
                    {/* Program A (Current) */}
                    <div className="bg-white rounded-xl shadow-sm border-t-4 border-t-blue-500 p-6 space-y-6">
                        <div className="border-b pb-4">
                            <h3 className="text-lg font-bold text-gray-800">Programa Actual</h3>
                            <span className="text-xs font-medium px-2 py-1 bg-blue-100 text-blue-700 rounded-full">En edición</span>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center gap-2 text-gray-600">
                                    <Clock size={18} />
                                    <span className="font-medium">Volumen Total (min)</span>
                                </div>
                                <span className="text-xl font-bold text-gray-900">{metricsA.totalDuration}</span>
                            </div>

                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center gap-2 text-gray-600">
                                    <Activity size={18} />
                                    <span className="font-medium">Intensidad Promedio (RPE)</span>
                                </div>
                                <span className="text-xl font-bold text-gray-900">{metricsA.averageIntensity}</span>
                            </div>

                            <div className="p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center gap-2 text-gray-600 mb-2">
                                    <BarChart2 size={18} />
                                    <span className="font-medium">Distribución de Patrones</span>
                                </div>
                                <div className="space-y-2">
                                    {Object.entries(metricsA.patternDistribution).map(([label, count]) => (
                                        <div key={label} className="flex items-center justify-between text-sm">
                                            <span>{label}</span>
                                            <div className="flex-1 mx-3 bg-gray-200 rounded-full h-2">
                                                <div 
                                                    className="bg-blue-500 h-2 rounded-full" 
                                                    style={{ width: `${(count / 7) * 100}%` }} // Simplified percentage
                                                />
                                            </div>
                                            <span className="font-bold">{count}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Program B (Comparison) */}
                    <div className={`bg-white rounded-xl shadow-sm border-t-4 border-t-purple-500 p-6 space-y-6 transition-opacity duration-300 ${!programB ? 'opacity-50 blur-[1px]' : ''}`}>
                         <div className="border-b pb-4 flex justify-between items-start">
                            <div>
                                <h3 className="text-lg font-bold text-gray-800">
                                    {programB ? 'Programa B' : 'Selecciona un programa'}
                                </h3>
                                {programB && <span className="text-xs font-medium px-2 py-1 bg-purple-100 text-purple-700 rounded-full">Comparación</span>}
                            </div>
                        </div>

                        {programB && metricsB ? (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <Clock size={18} />
                                        <span className="font-medium">Volumen Total (min)</span>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-xl font-bold text-gray-900 block">{metricsB.totalDuration}</span>
                                        <span className={`text-xs font-bold ${metricsB.totalDuration > metricsA.totalDuration ? 'text-green-600' : 'text-red-600'}`}>
                                            {getDiff(metricsB.totalDuration, metricsA.totalDuration)} vs A
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <Activity size={18} />
                                        <span className="font-medium">Intensidad Promedio (RPE)</span>
                                    </div>
                                     <div className="text-right">
                                        <span className="text-xl font-bold text-gray-900 block">{metricsB.averageIntensity}</span>
                                    </div>
                                </div>

                                <div className="p-3 bg-gray-50 rounded-lg">
                                    <div className="flex items-center gap-2 text-gray-600 mb-2">
                                        <BarChart2 size={18} />
                                        <span className="font-medium">Distribución de Patrones</span>
                                    </div>
                                    <div className="space-y-2">
                                        {Object.entries(metricsB.patternDistribution).map(([label, count]) => (
                                            <div key={label} className="flex items-center justify-between text-sm">
                                                <span>{label}</span>
                                                <div className="flex-1 mx-3 bg-gray-200 rounded-full h-2">
                                                    <div 
                                                        className="bg-purple-500 h-2 rounded-full" 
                                                        style={{ width: `${(count / 7) * 100}%` }} 
                                                    />
                                                </div>
                                                <span className="font-bold">{count}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="h-64 flex flex-col items-center justify-center text-gray-400">
                                <AlertTriangle size={48} className="mb-2 opacity-50" />
                                <p>Selecciona un programa arriba para ver la comparación</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
