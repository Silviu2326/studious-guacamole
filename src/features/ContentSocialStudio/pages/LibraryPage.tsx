import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Library } from 'lucide-react';
import { Button } from '../../../components/componentsreutilizables';
import { ScrollAnchorTabs } from '../components/ScrollAnchorTabs';
import { BackToTopButton } from '../components/BackToTopButton';
import {
    ClipperHighlights,
    ContentRecycler,
    ApprovedContentToCampaigns,
    ContentToFunnelsLinker,
} from '../components';
import { getContentSocialStudioSnapshot } from '../api';
import type { ContentSocialSnapshot } from '../types';

export default function LibraryPage() {
    const navigate = useNavigate();
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

    const tabs = [
        { id: 'biblioteca', label: 'Biblioteca de Clips' },
        { id: 'reciclaje', label: 'Reciclaje' },
        { id: 'campanas', label: 'A Campañas' },
        { id: 'funnels', label: 'A Funnels' },
    ];

    // Default empty clipper data if snapshot is null
    const clipperData = snapshot?.clipper || {
        totalClips: 0,
        newThisWeek: 0,
        categories: [],
        featured: [],
        trendingTags: [],
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
            {/* Header */}
            <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50">
                <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => navigate('/dashboard/content/social-studio')}
                            >
                                <ArrowLeft className="w-5 h-5" />
                            </Button>
                            <div>
                                <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                                    <Library className="w-5 h-5 text-emerald-500" />
                                    Biblioteca & Distribución
                                </h1>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <ScrollAnchorTabs tabs={tabs} />

            <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
                <section id="biblioteca" className="scroll-mt-32">
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Biblioteca de Clips</h2>
                        <p className="text-slate-600 dark:text-slate-400">Gestiona y organiza tus clips de contenido.</p>
                    </div>
                    <ClipperHighlights clipper={clipperData} loading={loading} />
                </section>

                <section id="reciclaje" className="scroll-mt-32">
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Reciclaje de Contenido</h2>
                        <p className="text-slate-600 dark:text-slate-400">Reutiliza tu mejor contenido para maximizar el alcance.</p>
                    </div>
                    <ContentRecycler loading={loading} />
                </section>

                <section id="campanas" className="scroll-mt-32">
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Distribución a Campañas</h2>
                        <p className="text-slate-600 dark:text-slate-400">Envía contenido aprobado a tus campañas activas.</p>
                    </div>
                    <ApprovedContentToCampaigns loading={loading} />
                </section>

                <section id="funnels" className="scroll-mt-32">
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Integración con Funnels</h2>
                        <p className="text-slate-600 dark:text-slate-400">Conecta tu contenido con tus embudos de venta.</p>
                    </div>
                    <ContentToFunnelsLinker loading={loading} />
                </section>
            </div>

            <BackToTopButton />
        </div>
    );
}
