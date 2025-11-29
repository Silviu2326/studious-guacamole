import { useState, useEffect, useCallback } from 'react';
import { 
  Campaign, 
  OutreachSequence, 
  AudienceSegment, 
  CampaignAnalytics, 
  ROIData,
  CampaignFilters,
  OutreachFilters,
  MessageTemplate,
  CampaignsState
} from '../types';
import { CampaignsService } from '../services/campaignsService';

export const useCampaigns = () => {
  const [state, setState] = useState<CampaignsState>({
    campaigns: [],
    outreachSequences: [],
    audienceSegments: [],
    templates: [],
    analytics: {},
    loading: false,
    error: null
  });

  // Campañas
  const loadCampaigns = useCallback(async (filters?: CampaignFilters) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const campaigns = await CampaignsService.getCampaigns(filters);
      setState(prev => ({ 
        ...prev, 
        campaigns, 
        loading: false 
      }));
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: error instanceof Error ? error.message : 'Error al cargar campañas' 
      }));
    }
  }, []);

  const getCampaign = useCallback(async (id: string): Promise<Campaign | null> => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const campaign = await CampaignsService.getCampaign(id);
      setState(prev => ({ ...prev, loading: false }));
      return campaign;
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: error instanceof Error ? error.message : 'Error al obtener campaña' 
      }));
      return null;
    }
  }, []);

  const createCampaign = useCallback(async (campaignData: Omit<Campaign, 'id' | 'createdAt' | 'updatedAt'>): Promise<Campaign | null> => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const newCampaign = await CampaignsService.createCampaign(campaignData);
      setState(prev => ({ 
        ...prev, 
        campaigns: [...prev.campaigns, newCampaign],
        loading: false 
      }));
      return newCampaign;
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: error instanceof Error ? error.message : 'Error al crear campaña' 
      }));
      return null;
    }
  }, []);

  const updateCampaign = useCallback(async (id: string, updates: Partial<Campaign>): Promise<Campaign | null> => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const updatedCampaign = await CampaignsService.updateCampaign(id, updates);
      setState(prev => ({ 
        ...prev, 
        campaigns: prev.campaigns.map(c => c.id === id ? updatedCampaign : c),
        loading: false 
      }));
      return updatedCampaign;
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: error instanceof Error ? error.message : 'Error al actualizar campaña' 
      }));
      return null;
    }
  }, []);

  const deleteCampaign = useCallback(async (id: string): Promise<boolean> => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      await CampaignsService.deleteCampaign(id);
      setState(prev => ({ 
        ...prev, 
        campaigns: prev.campaigns.filter(c => c.id !== id),
        loading: false 
      }));
      return true;
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: error instanceof Error ? error.message : 'Error al eliminar campaña' 
      }));
      return false;
    }
  }, []);

  // Outreach Sequences
  const loadOutreachSequences = useCallback(async (filters?: OutreachFilters) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const sequences = await CampaignsService.getOutreachSequences(filters);
      setState(prev => ({ 
        ...prev, 
        outreachSequences: sequences, 
        loading: false 
      }));
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: error instanceof Error ? error.message : 'Error al cargar secuencias' 
      }));
    }
  }, []);

  const createOutreachSequence = useCallback(async (sequenceData: Omit<OutreachSequence, 'id' | 'createdAt' | 'updatedAt'>): Promise<OutreachSequence | null> => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const newSequence = await CampaignsService.createOutreachSequence(sequenceData);
      setState(prev => ({ 
        ...prev, 
        outreachSequences: [...prev.outreachSequences, newSequence],
        loading: false 
      }));
      return newSequence;
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: error instanceof Error ? error.message : 'Error al crear secuencia' 
      }));
      return null;
    }
  }, []);

  // Audience Segments
  const loadAudienceSegments = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const segments = await CampaignsService.getAudienceSegments();
      setState(prev => ({ 
        ...prev, 
        audienceSegments: segments, 
        loading: false 
      }));
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: error instanceof Error ? error.message : 'Error al cargar segmentos' 
      }));
    }
  }, []);

  const createAudienceSegment = useCallback(async (segmentData: Omit<AudienceSegment, 'id' | 'size' | 'members'>): Promise<AudienceSegment | null> => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const newSegment = await CampaignsService.createAudienceSegment(segmentData);
      setState(prev => ({ 
        ...prev, 
        audienceSegments: [...prev.audienceSegments, newSegment],
        loading: false 
      }));
      return newSegment;
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: error instanceof Error ? error.message : 'Error al crear segmento' 
      }));
      return null;
    }
  }, []);

  // Analytics
  const loadCampaignAnalytics = useCallback(async (campaignId: string): Promise<CampaignAnalytics | null> => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const analytics = await CampaignsService.getCampaignAnalytics(campaignId);
      setState(prev => ({ 
        ...prev, 
        analytics: { ...prev.analytics, [campaignId]: analytics },
        loading: false 
      }));
      return analytics;
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: error instanceof Error ? error.message : 'Error al cargar analytics' 
      }));
      return null;
    }
  }, []);

  const loadROIData = useCallback(async (campaignId: string): Promise<ROIData | null> => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const roiData = await CampaignsService.getROIData(campaignId);
      setState(prev => ({ ...prev, loading: false }));
      return roiData;
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: error instanceof Error ? error.message : 'Error al cargar datos de ROI' 
      }));
      return null;
    }
  }, []);

  // Templates
  const loadMessageTemplates = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const templates = await CampaignsService.getMessageTemplates();
      setState(prev => ({ 
        ...prev, 
        templates, 
        loading: false 
      }));
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: error instanceof Error ? error.message : 'Error al cargar plantillas' 
      }));
    }
  }, []);

  // Utilidades
  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  const resetState = useCallback(() => {
    setState({
      campaigns: [],
      outreachSequences: [],
      audienceSegments: [],
      templates: [],
      analytics: {},
      loading: false,
      error: null
    });
  }, []);

  // Cargar datos iniciales
  useEffect(() => {
    loadCampaigns();
    loadOutreachSequences();
    loadAudienceSegments();
    loadMessageTemplates();
  }, [loadCampaigns, loadOutreachSequences, loadAudienceSegments, loadMessageTemplates]);

  return {
    // Estado
    ...state,
    
    // Campañas
    loadCampaigns,
    getCampaign,
    createCampaign,
    updateCampaign,
    deleteCampaign,
    
    // Outreach
    loadOutreachSequences,
    createOutreachSequence,
    
    // Segmentos
    loadAudienceSegments,
    createAudienceSegment,
    
    // Analytics
    loadCampaignAnalytics,
    loadROIData,
    
    // Templates
    loadMessageTemplates,
    
    // Utilidades
    clearError,
    resetState
  };
};