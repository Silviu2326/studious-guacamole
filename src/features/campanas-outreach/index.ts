// Exportar componentes principales
export { CampaignsManager } from './components/CampaignsManager';
export { CampaignsList } from './components/CampaignsList';
export { CampaignBuilder } from './components/CampaignBuilder';
export { CampaignAnalytics } from './components/CampaignAnalytics';
export { OutreachSequencesList } from './components/OutreachSequencesList';
export { AudienceSegmenter } from './components/AudienceSegmenter';

// Exportar hooks
export { useCampaigns } from './hooks/useCampaigns';

// Exportar servicios
export { CampaignsService } from './services/campaignsService';

// Exportar tipos
export type {
  Campaign,
  OutreachSequence,
  AudienceSegment,
  CampaignAnalytics,
  ROIData,
  CampaignFilters,
  OutreachFilters,
  MessageTemplate,
  CampaignsState,
  CampaignObjective,
  CampaignStatus,
  CampaignType,
  CommunicationChannel
} from './types';