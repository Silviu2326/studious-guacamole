import React from 'react';
import { Button } from '../../../components/componentsreutilizables';
import {
    MessageCircle,
    Heart,
    Reply,
    Activity,
    CheckCircle2
} from 'lucide-react';

interface Interaction {
    id: string;
    type: 'comment' | 'like' | 'survey_response' | 'check_in';
    clientName: string;
    clientAvatar?: string;
    content?: string;
    target: string;
    time: string;
    isUnread?: boolean;
}

export const InteractionsViewer: React.FC = () => {
    // Mock data
    const interactions: Interaction[] = [
        {
            id: '1',
            type: 'comment',
            clientName: 'Miguel Ángel',
            content: '¿Podrías revisar mi técnica en el video que subí?',
            target: 'Post: Técnica de Sentadilla',
            time: 'Hace 15 min',
            isUnread: true
        },
        {
            id: '2',
            type: 'survey_response',
            clientName: 'Sofía L.',
            content: 'Completó la encuesta de satisfacción',
            target: 'Encuesta Mensual',
            time: 'Hace 2 horas',
            isUnread: true
        },
        {
            id: '3',
            type: 'like',
            clientName: 'Juan Carlos',
            target: 'Tu publicación sobre nutrición',
            time: 'Hace 4 horas'
        },
        {
            id: '4',
            type: 'check_in',
            clientName: 'María P.',
            content: 'Completó sesión de entrenamiento',
            target: 'Rutina Pierna A',
            time: 'Hace 5 horas'
        },
        {
            id: '5',
            type: 'comment',
            clientName: 'Roberto G.',
            content: 'Gracias por los consejos, me sirvieron mucho hoy.',
            target: 'Post: Hidratación',
            time: 'Ayer'
        }
    ];

    const getIcon = (type: Interaction['type']) => {
        switch (type) {
            case 'comment': return <MessageCircle size={14} className="text-blue-500" />;
            case 'like': return <Heart size={14} className="text-red-500" />;
            case 'survey_response': return <Activity size={14} className="text-purple-500" />;
            case 'check_in': return <CheckCircle2 size={14} className="text-green-500" />;
        }
    };

    return (
        <div className="space-y-4 h-full flex flex-col">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <Activity className="text-green-600" size={20} />
                    Interacciones
                </h2>
                <Button size="sm" variant="ghost" className="text-xs text-gray-500 hover:text-gray-900">
                    Marcar leídas
                </Button>
            </div>

            <div className="space-y-0 flex-1 overflow-y-auto pr-1 custom-scrollbar" style={{ maxHeight: '500px' }}>
                <div className="relative border-l-2 border-gray-100 ml-4 space-y-6 py-2">
                    {interactions.map((interaction) => (
                        <div key={interaction.id} className="relative pl-6 group">
                            {/* Dot indicador de tipo */}
                            <div className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 border-white shadow-sm flex items-center justify-center bg-white ${interaction.isUnread ? 'ring-2 ring-blue-100' : ''
                                }`}>
                                {getIcon(interaction.type)}
                            </div>

                            <div className={`p-3 rounded-xl transition-all ${interaction.isUnread ? 'bg-blue-50/50 border border-blue-100' : 'hover:bg-gray-50 border border-transparent hover:border-gray-100'
                                }`}>
                                <div className="flex justify-between items-start mb-1">
                                    <div className="flex items-center gap-2">
                                        <span className="font-semibold text-sm text-gray-900">{interaction.clientName}</span>
                                        <span className="text-xs text-gray-400">• {interaction.time}</span>
                                    </div>
                                    {interaction.type === 'comment' && (
                                        <button className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-white rounded-full text-gray-400 hover:text-blue-600 shadow-sm">
                                            <Reply size={14} />
                                        </button>
                                    )}
                                </div>

                                {interaction.content && (
                                    <p className="text-sm text-gray-600 mb-1.5 line-clamp-2">
                                        {interaction.content}
                                    </p>
                                )}

                                <div className="flex items-center gap-1.5">
                                    <span className="text-xs font-medium text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">
                                        {interaction.target}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
