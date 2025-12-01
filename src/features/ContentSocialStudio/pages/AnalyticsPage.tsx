import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, BarChart3 } from 'lucide-react';
import { Button } from '../../../components/componentsreutilizables';
import { ScrollAnchorTabs } from '../components/ScrollAnchorTabs';
import { BackToTopButton } from '../components/BackToTopButton';
import {
    ContentLeadAnalytics,
    SaturatedTopicsDetector,
    PostCampaignInsights,
    ContentLearningsManager,
} from '../components';

export default function AnalyticsPage() {
    const navigate = useNavigate();
    const [loading] = useState(false);
    const period = '30d';

    const tabs = [
        { id: 'leads', label: 'Analytics de Leads' },
        { id: 'saturacion', label: 'Temas Saturados' },
        { id: 'post-campana', label: 'Post-Campaña Insights' },
        { id: 'aprendizajes', label: 'Aprendizajes' },
    ];

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
                                    <BarChart3 className="w-5 h-5 text-orange-500" />
                                    Análisis & Optimización
                                </h1>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <ScrollAnchorTabs tabs={tabs} />

            <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
                <section id="leads" className="scroll-mt-32">
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Analytics de Leads</h2>
                        <p className="text-slate-600 dark:text-slate-400">Analiza cómo tu contenido genera leads.</p>
                    </div>
                    <ContentLeadAnalytics loading={loading} period={period} />
                </section>

                <section id="saturacion" className="scroll-mt-32">
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Temas Saturados</h2>
                        <p className="text-slate-600 dark:text-slate-400">Detecta temas que están perdiendo efectividad.</p>
                    </div>
                    <SaturatedTopicsDetector loading={loading} period={period} />
                </section>

                <section id="post-campana" className="scroll-mt-32">
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Post-Campaña Insights</h2>
                        <p className="text-slate-600 dark:text-slate-400">Obtén insights valiosos después de tus campañas.</p>
                    </div>
                    <PostCampaignInsights loading={loading} period={period} />
                </section>

                <section id="aprendizajes" className="scroll-mt-32">
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Aprendizajes</h2>
                        <p className="text-slate-600 dark:text-slate-400">Biblioteca de aprendizajes para mejorar tu estrategia.</p>
                    </div>
                    <ContentLearningsManager loading={loading} />
                </section>
            </div>

            <BackToTopButton />
        </div>
    );
}
