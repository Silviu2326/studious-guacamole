export interface FeatureFlags {
    team_collaboration: boolean;
    playbook_export: boolean;
    advanced_segmentation: boolean;
    ab_testing: boolean;
    journey_gaps: boolean;
    channel_recommendations: boolean;
}

// Configuración por defecto (todos ocultos)
export const defaultFeatureFlags: FeatureFlags = {
    team_collaboration: false,
    playbook_export: false,
    advanced_segmentation: false,
    ab_testing: false,
    journey_gaps: false,
    channel_recommendations: false,
};

// Hook para acceder a feature flags
export function useFeatureFlags(): FeatureFlags {
    // Puede leer de localStorage, API, o config
    // Por ahora retornamos los defaults, pero esto podría expandirse
    return defaultFeatureFlags;
}
