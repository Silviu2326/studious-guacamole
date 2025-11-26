import React, { useState } from 'react';
import { Card, Button } from '../../../components/componentsreutilizables';
import {
    Star,
    Quote,
    MoreHorizontal,
    Share2,
    Archive,
    CheckCircle,
    Plus
} from 'lucide-react';

interface Testimonial {
    id: string;
    clientName: string;
    clientAvatar?: string;
    content: string;
    rating: number;
    date: string;
    status: 'pending' | 'approved' | 'featured' | 'archived';
    program?: string;
}

export const TestimonialsViewer: React.FC = () => {
    const [filter, setFilter] = useState<'all' | 'featured' | 'pending'>('all');

    // Mock data
    const testimonials: Testimonial[] = [
        {
            id: '1',
            clientName: 'Ana García',
            content: '¡Increíble progreso en solo 3 meses! El plan de entrenamiento es super adaptado a mi estilo de vida.',
            rating: 5,
            date: 'Hace 2 días',
            status: 'featured',
            program: 'Pérdida de Peso'
        },
        {
            id: '2',
            clientName: 'Carlos Ruiz',
            content: 'La mejor decisión que he tomado. La atención personalizada marca la diferencia.',
            rating: 5,
            date: 'Hace 5 días',
            status: 'approved',
            program: 'Hipertrofia'
        },
        {
            id: '3',
            clientName: 'Laura M.',
            content: 'Me encanta la comunidad y cómo nos motivamos entre todos.',
            rating: 4,
            date: 'Hace 1 semana',
            status: 'pending',
            program: 'Yoga Flex'
        }
    ];

    const filteredTestimonials = testimonials.filter(t => {
        if (filter === 'all') return true;
        return t.status === filter;
    });

    return (
        <div className="space-y-4 h-full flex flex-col">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <Quote className="text-purple-600" size={20} />
                    Testimonios
                </h2>
                <Button size="sm" variant="ghost" className="text-purple-600 border border-purple-200 hover:bg-purple-50">
                    <Plus size={16} className="mr-1" />
                    Solicitar
                </Button>
            </div>

            {/* Filtros rápidos */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {[
                    { id: 'all', label: 'Todos' },
                    { id: 'featured', label: 'Destacados' },
                    { id: 'pending', label: 'Pendientes' }
                ].map(f => (
                    <button
                        key={f.id}
                        onClick={() => setFilter(f.id as any)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${filter === f.id
                                ? 'bg-purple-100 text-purple-700 ring-1 ring-purple-200'
                                : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                            }`}
                    >
                        {f.label}
                    </button>
                ))}
            </div>

            {/* Lista de testimonios */}
            <div className="space-y-3 flex-1 overflow-y-auto pr-1 custom-scrollbar" style={{ maxHeight: '500px' }}>
                {filteredTestimonials.map((testimonial) => (
                    <Card key={testimonial.id} className="p-4 bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all group">
                        <div className="flex justify-between items-start mb-3">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-100 to-indigo-100 flex items-center justify-center text-purple-600 font-bold text-sm">
                                    {testimonial.clientAvatar ? (
                                        <img src={testimonial.clientAvatar} alt={testimonial.clientName} className="w-full h-full rounded-full object-cover" />
                                    ) : (
                                        testimonial.clientName.charAt(0)
                                    )}
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-900 text-sm">{testimonial.clientName}</h4>
                                    <div className="flex items-center gap-2">
                                        <div className="flex text-yellow-400">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} size={10} fill={i < testimonial.rating ? "currentColor" : "none"} className={i < testimonial.rating ? "" : "text-gray-300"} />
                                            ))}
                                        </div>
                                        <span className="text-xs text-gray-400">• {testimonial.date}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                <button className="p-1 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600">
                                    <MoreHorizontal size={16} />
                                </button>
                            </div>
                        </div>

                        <p className="text-sm text-gray-600 mb-3 italic">"{testimonial.content}"</p>

                        {testimonial.program && (
                            <div className="mb-3">
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600">
                                    {testimonial.program}
                                </span>
                            </div>
                        )}

                        <div className="flex items-center gap-2 pt-3 border-t border-gray-50">
                            {testimonial.status === 'pending' ? (
                                <Button size="sm" className="w-full bg-purple-600 hover:bg-purple-700 text-white h-8 text-xs">
                                    <CheckCircle size={14} className="mr-1.5" />
                                    Aprobar
                                </Button>
                            ) : (
                                <>
                                    <button className="flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-medium text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors">
                                        <Share2 size={14} />
                                        Compartir
                                    </button>
                                    <button className="flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                                        <Archive size={14} />
                                        Archivar
                                    </button>
                                </>
                            )}
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
};
