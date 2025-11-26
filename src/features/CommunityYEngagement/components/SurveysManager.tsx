import React from 'react';
import { Card, Button } from '../../../components/componentsreutilizables';
import {
    BarChart3,
    Plus,
    Calendar,
    Users,
    ArrowRight,
    PieChart,
    MoreVertical
} from 'lucide-react';

interface Survey {
    id: string;
    title: string;
    responses: number;
    totalRecipients: number;
    daysLeft: number;
    status: 'active' | 'draft' | 'completed';
    color: 'blue' | 'indigo' | 'slate';
}

export const SurveysManager: React.FC = () => {
    // Mock data
    const surveys: Survey[] = [
        {
            id: '1',
            title: 'Satisfacción Mensual - Noviembre',
            responses: 45,
            totalRecipients: 60,
            daysLeft: 2,
            status: 'active',
            color: 'blue'
        },
        {
            id: '2',
            title: 'Feedback Nuevo Programa Hipertrofia',
            responses: 12,
            totalRecipients: 25,
            daysLeft: 5,
            status: 'active',
            color: 'indigo'
        },
        {
            id: '3',
            title: 'Intereses para Próximo Reto',
            responses: 0,
            totalRecipients: 0,
            daysLeft: 0,
            status: 'draft',
            color: 'slate'
        }
    ];

    return (
        <div className="space-y-4 h-full flex flex-col">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <PieChart className="text-blue-600" size={20} />
                    Encuestas
                </h2>
                <Button size="sm" variant="ghost" className="text-blue-600 border border-blue-200 hover:bg-blue-50">
                    <Plus size={16} className="mr-1" />
                    Nueva
                </Button>
            </div>

            <div className="space-y-3 flex-1 overflow-y-auto pr-1 custom-scrollbar" style={{ maxHeight: '500px' }}>
                {/* Banner de Crear Encuesta IA */}
                <div className="p-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md relative overflow-hidden group cursor-pointer transition-transform hover:scale-[1.02]">
                    <div className="absolute top-0 right-0 p-3 opacity-10">
                        <BarChart3 size={80} />
                    </div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white/20 backdrop-blur-sm border border-white/30">
                                IA POWERED
                            </span>
                        </div>
                        <h3 className="font-bold text-lg mb-1">Generar Encuesta Inteligente</h3>
                        <p className="text-blue-100 text-xs mb-3 max-w-[80%]">
                            Deja que la IA cree las preguntas perfectas para obtener los insights que necesitas.
                        </p>
                        <button className="text-xs font-bold bg-white text-blue-600 px-3 py-1.5 rounded-lg flex items-center gap-1 hover:bg-blue-50 transition-colors">
                            Probar ahora <ArrowRight size={12} />
                        </button>
                    </div>
                </div>

                {/* Lista de Encuestas */}
                {surveys.map((survey) => (
                    <Card key={survey.id} className="p-4 bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all">
                        <div className="flex justify-between items-start mb-3">
                            <div className="flex items-center gap-2">
                                <span className={`w-2 h-2 rounded-full ${survey.status === 'active' ? 'bg-green-500 animate-pulse' :
                                    survey.status === 'draft' ? 'bg-gray-400' : 'bg-blue-500'
                                    }`} />
                                <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    {survey.status === 'active' ? 'En curso' :
                                        survey.status === 'draft' ? 'Borrador' : 'Finalizada'}
                                </span>
                            </div>
                            <button className="text-gray-400 hover:text-gray-600">
                                <MoreVertical size={16} />
                            </button>
                        </div>

                        <h4 className="font-semibold text-gray-900 text-sm mb-3">{survey.title}</h4>

                        {survey.status !== 'draft' && (
                            <div className="space-y-3">
                                <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                                    <span>Progreso</span>
                                    <span className="font-medium">{Math.round((survey.responses / survey.totalRecipients) * 100)}%</span>
                                </div>
                                <div className="w-full bg-gray-100 rounded-full h-1.5 mb-3">
                                    <div
                                        className={`h-1.5 rounded-full ${survey.color === 'blue' ? 'bg-blue-500' :
                                            survey.color === 'indigo' ? 'bg-indigo-500' : 'bg-slate-500'
                                            }`}
                                        style={{ width: `${(survey.responses / survey.totalRecipients) * 100}%` }}
                                    />
                                </div>

                                <div className="flex items-center justify-between pt-2 border-t border-gray-50">
                                    <div className="flex items-center gap-3">
                                        <div className="flex items-center gap-1 text-xs text-gray-500">
                                            <Users size={14} />
                                            <span>{survey.responses}/{survey.totalRecipients}</span>
                                        </div>
                                        <div className="flex items-center gap-1 text-xs text-gray-500">
                                            <Calendar size={14} />
                                            <span>{survey.daysLeft} días rest.</span>
                                        </div>
                                    </div>
                                    <button className="text-xs font-medium text-blue-600 hover:text-blue-700 hover:underline">
                                        Ver resultados
                                    </button>
                                </div>
                            </div>
                        )}

                        {survey.status === 'draft' && (
                            <div className="flex items-center justify-end pt-2 border-t border-gray-50">
                                <Button size="sm" variant="ghost" className="text-xs h-8">
                                    Editar
                                </Button>
                                <Button size="sm" className="text-xs h-8 bg-slate-800 text-white hover:bg-slate-900">
                                    Lanzar
                                </Button>
                            </div>
                        )}
                    </Card>
                ))}
            </div>
        </div>
    );
};
