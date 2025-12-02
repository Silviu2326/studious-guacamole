import React from 'react';
import { FileText, Sparkles, BookOpen } from 'lucide-react';
import { ScrollableTabsLayout } from '../components/shared/ScrollableTabsLayout';
import { useFeatureFlags } from '../../../config/featureFlags';
import {
    MessageTemplatesLibrary,
    AIMessageLibrary,
    CampaignObjectiveSelector,
    Campaign360AIGenerator,
    AIPlaybookExporter
} from '../components';

import type {
    MessageTemplate,
    AIMessageLibrary as AIMessageLibraryType,
    AIPlaybook,
    MultiChannelCampaign,
    SpecializedTemplate,
    LifecycleSequence,
    PostLeadMagnetSequence,
    PlaybookExport
} from '../types';

interface ContentPageProps {
    loading: boolean;
    messageTemplates: MessageTemplate[];
    aiMessageLibrary?: AIMessageLibraryType;
    aiPlaybooks: AIPlaybook[];
    campaigns: MultiChannelCampaign[];
    specializedTemplates: SpecializedTemplate[];
    sequences: LifecycleSequence[];
    postLeadMagnetSequences: PostLeadMagnetSequence[];
    playbookExports: PlaybookExport[];
    onBack: () => void;
}

export const ContentPage: React.FC<ContentPageProps> = ({
    loading,
    messageTemplates,
    aiMessageLibrary,
    aiPlaybooks,
    campaigns,
    specializedTemplates,
    sequences,
    postLeadMagnetSequences,
    playbookExports,
    onBack,
}) => {
    const featureFlags = useFeatureFlags();
    const [isCampaign360ModalOpen, setIsCampaign360ModalOpen] = React.useState(false);

    const tabs = [
        { id: 'plantillas', label: 'Biblioteca de Plantillas', icon: FileText, anchor: '#plantillas' },
        { id: 'ia-generation', label: 'Generación con IA', icon: Sparkles, anchor: '#ia-generation' },
    ];

    if (featureFlags.playbook_export) {
        tabs.push({ id: 'playbooks', label: 'Playbooks', icon: BookOpen, anchor: '#playbooks' });
    }

    return (
        <ScrollableTabsLayout
            tabs={tabs}
            title="Contenido & Assets"
            description="Centraliza tus recursos creativos, plantillas y herramientas de generación de contenido con IA."
            onBack={onBack}
        >
            {/* Sección Plantillas */}
            <section id="plantillas" className="space-y-8 scroll-mt-24">
                <div>
                    <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                        <FileText className="text-indigo-500" />
                        Biblioteca de Plantillas
                    </h2>
                    <div className="space-y-6">
                        <MessageTemplatesLibrary
                            templates={messageTemplates}
                            loading={loading}
                            className="w-full"
                            onTemplateCreate={() => { }}
                            onTemplateEdit={() => { }}
                            onTemplateDelete={() => { }}
                            onTemplateUse={() => { }}
                            onTemplateSendBulk={() => { }}
                            onTemplateToggleFavorite={() => { }}
                        />

                        {aiMessageLibrary && (
                            <AIMessageLibrary
                                library={aiMessageLibrary}
                                loading={loading}
                                className="w-full"
                                onTemplateCreate={() => { }}
                                onTemplateEdit={() => { }}
                                onTemplateDelete={() => { }}
                                onTemplateUse={() => { }}
                                onTemplateSendBulk={() => { }}
                                onTemplateToggleFavorite={() => { }}
                                onGenerateWithAI={() => { }}
                                onSyncWithProfile={() => { }}
                                onSettingsEdit={() => { }}
                            />
                        )}
                    </div>
                </div>
            </section>

            {/* Sección IA Generation */}
            <section id="ia-generation" className="space-y-8 scroll-mt-24">
                <div>
                    <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                        <Sparkles className="text-indigo-500" />
                        Generación con IA
                    </h2>
                    <div className="space-y-6">
                        <CampaignObjectiveSelector
                            onSuggestionsGenerated={() => { }}
                            className="w-full"
                        />

                        <div className="p-6 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-2xl border border-indigo-100 dark:border-indigo-900/50">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                                        Generador de Campañas 360°
                                    </h3>
                                    <p className="text-slate-600 dark:text-slate-400 max-w-2xl">
                                        Crea una estrategia completa multicanal en segundos. Nuestra IA analizará tu objetivo y generará emails, mensajes de WhatsApp y secuencias automáticamente.
                                    </p>
                                </div>
                                <button
                                    onClick={() => setIsCampaign360ModalOpen(true)}
                                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-colors shadow-lg shadow-indigo-500/20"
                                >
                                    Abrir Generador
                                </button>
                            </div>
                        </div>

                        <Campaign360AIGenerator
                            isOpen={isCampaign360ModalOpen}
                            onClose={() => setIsCampaign360ModalOpen(false)}
                            onCampaignGenerated={() => setIsCampaign360ModalOpen(false)}
                        />
                    </div>
                </div>
            </section>

            {/* Feature Flag: Playbooks */}
            {featureFlags.playbook_export && (
                <section id="playbooks" className="space-y-8 scroll-mt-24">
                    <div>
                        <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                            <BookOpen className="text-indigo-500" />
                            Playbooks
                        </h2>
                        <div className="space-y-6">
                            <AIPlaybookExporter
                                playbooks={aiPlaybooks}
                                campaigns={campaigns}
                                campaign360s={[]}
                                templates={specializedTemplates}
                                sequences={[...sequences, ...postLeadMagnetSequences]}
                                loading={loading}
                                className="w-full"
                                onPlaybookCreate={() => { }}
                                onPlaybookExport={() => { }}
                                onPlaybookDownload={() => { }}
                                onPlaybookShare={() => { }}
                            />
                        </div>
                    </div>
                </section>
            )}
        </ScrollableTabsLayout>
    );
};
