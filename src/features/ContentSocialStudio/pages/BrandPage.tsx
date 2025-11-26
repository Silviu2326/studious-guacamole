import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Palette } from 'lucide-react';
import { Button } from '../../../components/componentsreutilizables';
import { ScrollAnchorTabs } from '../components/ScrollAnchorTabs';
import { BackToTopButton } from '../components/BackToTopButton';
import {
    BrandProfileConfig,
    CreativeVoiceConfig,
    StarFormatsConfig,
    TrainerNichesConfig,
    BrandKitGenerator,
    VisualStyleLearning,
} from '../components';

export default function BrandPage() {
    const navigate = useNavigate();
    const [loading] = useState(false);

    const tabs = [
        { id: 'perfil', label: 'Perfil de Marca' },
        { id: 'voz', label: 'Voz Creativa' },
        { id: 'formatos', label: 'Formatos Estrella' },
        { id: 'nichos', label: 'Nichos Principales' },
        { id: 'kits', label: 'Kits de Marca' },
        { id: 'estilos', label: 'Estilos Visuales' },
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
                                    <Palette className="w-5 h-5 text-pink-500" />
                                    Marca & Identidad
                                </h1>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <ScrollAnchorTabs tabs={tabs} />

            <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
                <section id="perfil" className="scroll-mt-32">
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Perfil de Marca</h2>
                        <p className="text-slate-600 dark:text-slate-400">Configura la identidad base de tu marca.</p>
                    </div>
                    <BrandProfileConfig loading={loading} />
                </section>

                <section id="voz" className="scroll-mt-32">
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Voz Creativa</h2>
                        <p className="text-slate-600 dark:text-slate-400">Define el tono y estilo de comunicación.</p>
                    </div>
                    <CreativeVoiceConfig loading={loading} />
                </section>

                <section id="formatos" className="scroll-mt-32">
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Formatos Estrella</h2>
                        <p className="text-slate-600 dark:text-slate-400">Gestiona tus formatos de contenido más exitosos.</p>
                    </div>
                    <StarFormatsConfig loading={loading} />
                </section>

                <section id="nichos" className="scroll-mt-32">
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Nichos Principales</h2>
                        <p className="text-slate-600 dark:text-slate-400">Identifica y configura tus nichos de mercado.</p>
                    </div>
                    <TrainerNichesConfig loading={loading} />
                </section>

                <section id="kits" className="scroll-mt-32">
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Kits de Marca</h2>
                        <p className="text-slate-600 dark:text-slate-400">Genera assets visuales coherentes con tu marca.</p>
                    </div>
                    <BrandKitGenerator loading={loading} />
                </section>

                <section id="estilos" className="scroll-mt-32">
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Estilos Visuales</h2>
                        <p className="text-slate-600 dark:text-slate-400">Entrena a la IA con tus preferencias visuales.</p>
                    </div>
                    <VisualStyleLearning loading={loading} />
                </section>
            </div>

            <BackToTopButton />
        </div>
    );
}
