import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Video } from 'lucide-react';
import { Button } from '../../../components/componentsreutilizables';
import { ScrollAnchorTabs } from '../components/ScrollAnchorTabs';
import { BackToTopButton } from '../components/BackToTopButton';
import {
    VideoStudioSpotlight,
    VideoScriptGenerator,
    ClientTransformationPostGenerator,
    FAQContentGenerator,
    MobileContentApproval,
} from '../components';
import { getContentSocialStudioSnapshot } from '../api';
import type { ContentSocialSnapshot } from '../types';

export default function CreationPage() {
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
        { id: 'video-studio', label: 'Video Studio' },
        { id: 'scripts', label: 'Scripts de Video' },
        { id: 'evidencia', label: 'Contenido Basado en Evidencia' },
        { id: 'mobile-approval', label: 'Aprobación Móvil' },
    ];

    // Default empty video data if snapshot is null
    const videoData = snapshot?.video || {
        projects: [],
        automationPlaybooks: 0,
        readyToPublish: 0,
        libraryAssets: 0,
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
                                    <Video className="w-5 h-5 text-violet-500" />
                                    Creación de Contenido
                                </h1>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <ScrollAnchorTabs tabs={tabs} />

            <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
                {/* Video Studio Section */}
                <section id="video-studio" className="scroll-mt-32">
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Video Studio</h2>
                        <p className="text-slate-600 dark:text-slate-400">Gestiona tus proyectos de video y automatizaciones.</p>
                    </div>
                    <VideoStudioSpotlight video={videoData} loading={loading} />
                </section>

                {/* Scripts Section */}
                <section id="scripts" className="scroll-mt-32">
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Scripts de Video</h2>
                        <p className="text-slate-600 dark:text-slate-400">Genera guiones optimizados para tus videos.</p>
                    </div>
                    <VideoScriptGenerator loading={loading} />
                </section>

                {/* Evidence Content Section */}
                <section id="evidencia" className="scroll-mt-32">
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Contenido Basado en Evidencia</h2>
                        <p className="text-slate-600 dark:text-slate-400">Crea contenido a partir de transformaciones y preguntas frecuentes.</p>
                    </div>
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                        <ClientTransformationPostGenerator loading={loading} />
                        <FAQContentGenerator loading={loading} />
                    </div>
                </section>

                {/* Mobile Approval Section */}
                <section id="mobile-approval" className="scroll-mt-32">
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Aprobación Móvil</h2>
                        <p className="text-slate-600 dark:text-slate-400">Gestiona aprobaciones rápidas para dispositivos móviles.</p>
                    </div>
                    <MobileContentApproval loading={loading} />
                </section>
            </div>

            <BackToTopButton />
        </div>
    );
}
