import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { Button } from '../../../components/componentsreutilizables';
import { ScrollAnchorTabs } from '../components/ScrollAnchorTabs';
import { BackToTopButton } from '../components/BackToTopButton';
import {
    AIContentWorkbench,
    AITemplateLibrary,
    InternalContentIdeasGenerator,
    ContentAIFeedback,
    PromotionalContentTemplates,
    EventChallengeContentKit,
} from '../components';
import { getContentSocialStudioSnapshot } from '../api';
import type { ContentSocialSnapshot } from '../types';

export default function AIAssistantsPage() {
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
        { id: 'workbench', label: 'AI Workbench' },
        { id: 'plantillas', label: 'Plantillas IA' },
        { id: 'ideas', label: 'Generador de Ideas' },
        { id: 'feedback', label: 'Feedback IA' },
        { id: 'promocional', label: 'Contenido Promocional' },
        { id: 'events', label: 'Event Kits' },
    ];

    // Default empty ai data if snapshot is null
    const aiData = snapshot?.ai || {
        assistants: [],
        quickIdeas: [],
        lastUpdated: new Date().toISOString(),
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
                                    <Sparkles className="w-5 h-5 text-cyan-500" />
                                    Asistentes IA
                                </h1>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <ScrollAnchorTabs tabs={tabs} />

            <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
                <section id="workbench" className="scroll-mt-32">
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">AI Workbench</h2>
                        <p className="text-slate-600 dark:text-slate-400">Tu espacio de trabajo principal con asistentes IA.</p>
                    </div>
                    <AIContentWorkbench ai={aiData} loading={loading} />
                </section>

                <section id="plantillas" className="scroll-mt-32">
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Plantillas IA</h2>
                        <p className="text-slate-600 dark:text-slate-400">Plantillas pre-configuradas para generación rápida.</p>
                    </div>
                    <AITemplateLibrary loading={loading} />
                </section>

                <section id="ideas" className="scroll-mt-32">
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Generador de Ideas</h2>
                        <p className="text-slate-600 dark:text-slate-400">Genera ideas de contenido basadas en tu nicho.</p>
                    </div>
                    <InternalContentIdeasGenerator loading={loading} />
                </section>

                <section id="feedback" className="scroll-mt-32">
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Feedback IA</h2>
                        <p className="text-slate-600 dark:text-slate-400">Recibe retroalimentación instantánea sobre tu contenido.</p>
                    </div>
                    <ContentAIFeedback loading={loading} />
                </section>

                <section id="promocional" className="scroll-mt-32">
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Contenido Promocional</h2>
                        <p className="text-slate-600 dark:text-slate-400">Crea contenido enfocado en ventas y promociones.</p>
                    </div>
                    <PromotionalContentTemplates loading={loading} />
                </section>

                <section id="events" className="scroll-mt-32">
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Event Kits</h2>
                        <p className="text-slate-600 dark:text-slate-400">Kits completos para eventos y retos.</p>
                    </div>
                    <EventChallengeContentKit loading={loading} />
                </section>
            </div>

            <BackToTopButton />
        </div>
    );
}
