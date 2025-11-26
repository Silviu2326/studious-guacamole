import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Video,
    Calendar,
    Library,
    Palette,
    BarChart3,
    Sparkles,
    Loader2,
} from 'lucide-react';
import { CategoryCard } from '../components/CategoryCard';
import { getContentSocialStudioSnapshot } from '../api';
import type { ContentSocialSnapshot } from '../types';
import { useAuth } from '../../../context/AuthContext';

export default function ContentStudioHomePage() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [snapshot, setSnapshot] = useState<ContentSocialSnapshot | null>(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const data = await getContentSocialStudioSnapshot('30d');
            setSnapshot(data);
        } catch (error) {
            console.error('Error loading snapshot:', error);
        } finally {
            setLoading(false);
        }
    };

    const categories = [
        {
            id: 'creation',
            title: 'Creación de Contenido',
            description: 'Produce videos, genera scripts y crea contenido basado en transformaciones.',
            icon: Video,
            gradient: 'bg-gradient-to-br from-violet-500 to-purple-600',
            path: '/dashboard/content/social-studio/creation',
            metrics: [
                { label: 'Videos', value: snapshot?.video.projects.length || 0 },
                { label: 'Scripts', value: snapshot?.video.readyToPublish || 0 }, // Using readyToPublish as proxy for scripts for now
                { label: 'Posts', value: snapshot?.clientTransformations.generatedPosts.length || 0 },
            ],
        },
        {
            id: 'planning',
            title: 'Planificación & Calendario',
            description: 'Organiza tu calendario de contenido con IA y detecta gaps.',
            icon: Calendar,
            gradient: 'bg-gradient-to-br from-blue-500 to-indigo-600',
            path: '/dashboard/content/social-studio/planning',
            metrics: [
                { label: 'Cobertura', value: `${snapshot?.planner.coverageDays || 0}d` },
                { label: 'Gaps', value: snapshot?.planner.upcoming.length ? '0' : '2' }, // Mock logic for gaps
                { label: 'Posts', value: snapshot?.planner.upcoming.length || 0 },
            ],
        },
        {
            id: 'library',
            title: 'Biblioteca & Distribución',
            description: 'Gestiona tu biblioteca de contenido y distribuye a campañas/funnels.',
            icon: Library,
            gradient: 'bg-gradient-to-br from-emerald-500 to-teal-600',
            path: '/dashboard/content/social-studio/library',
            metrics: [
                { label: 'Clips', value: snapshot?.clipper.totalClips || 0 },
                { label: 'Reciclados', value: snapshot?.clipper.newThisWeek || 0 },
                { label: 'Activos', value: snapshot?.syndication.activeCampaigns || 0 },
            ],
        },
        {
            id: 'brand',
            title: 'Marca & Identidad',
            description: 'Define tu voz, formatos estrella y kits de marca.',
            icon: Palette,
            gradient: 'bg-gradient-to-br from-pink-500 to-rose-600',
            path: '/dashboard/content/social-studio/brand',
            metrics: [
                { label: 'Perfil', value: '100%' },
                { label: 'Formatos', value: '5' },
                { label: 'Kits', value: '3' },
            ],
        },
        {
            id: 'analytics',
            title: 'Análisis & Optimización',
            description: 'Analiza rendimiento, detecta saturación y aprende de campañas.',
            icon: BarChart3,
            gradient: 'bg-gradient-to-br from-orange-500 to-amber-600',
            path: '/dashboard/content/social-studio/analytics',
            metrics: [
                { label: 'Leads', value: '124' },
                { label: 'Saturación', value: 'Baja' },
                { label: 'Insights', value: '12' },
            ],
        },
        {
            id: 'ai-assistants',
            title: 'Asistentes IA',
            description: 'Herramientas IA para generar ideas, contenido y recibir feedback.',
            icon: Sparkles,
            gradient: 'bg-gradient-to-br from-cyan-500 to-sky-600',
            path: '/dashboard/content/social-studio/ai-assistants',
            metrics: [
                { label: 'Ideas', value: snapshot?.ai.quickIdeas.length || 0 },
                { label: 'Templates', value: '8' },
                { label: 'Feedback', value: 'New' },
            ],
        },
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
            {/* Header */}
            <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
                <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl">
                            <Sparkles className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                                Content & Social Studio
                            </h1>
                            <p className="text-slate-600 dark:text-slate-400 mt-1">
                                {user?.name ? `Hola ${user.name.split(' ')[0]}, ` : ''}
                                gestiona todo tu contenido orgánico desde un solo lugar.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Grid */}
            <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {categories.map((category) => (
                        <CategoryCard
                            key={category.id}
                            {...category}
                            onClick={() => navigate(category.path)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
