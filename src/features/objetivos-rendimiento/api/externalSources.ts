import { ExternalSource, ExternalEvent, ChartAnnotation, ExternalSourceType } from '../types';

// Mock data storage
let mockExternalSources: ExternalSource[] = [];
let mockExternalEvents: ExternalEvent[] = [];
let mockAnnotations: ChartAnnotation[] = [];

// User Story 1: API para gestionar fuentes externas
export const getExternalSources = async (): Promise<ExternalSource[]> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  // Load from localStorage if available
  const saved = localStorage.getItem('external-sources');
  if (saved) {
    try {
      mockExternalSources = JSON.parse(saved);
      return mockExternalSources.filter(s => s.enabled);
    } catch (e) {
      console.error('Error loading external sources:', e);
    }
  }
  
  return mockExternalSources.filter(s => s.enabled);
};

export const getAllExternalSources = async (): Promise<ExternalSource[]> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const saved = localStorage.getItem('external-sources');
  if (saved) {
    try {
      mockExternalSources = JSON.parse(saved);
      return mockExternalSources;
    } catch (e) {
      console.error('Error loading external sources:', e);
    }
  }
  
  return mockExternalSources;
};

export const getExternalSource = async (id: string): Promise<ExternalSource | null> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const saved = localStorage.getItem('external-sources');
  if (saved) {
    try {
      mockExternalSources = JSON.parse(saved);
    } catch (e) {
      console.error('Error loading external sources:', e);
    }
  }
  
  return mockExternalSources.find(s => s.id === id) || null;
};

export const createExternalSource = async (source: Omit<ExternalSource, 'id' | 'createdAt' | 'updatedAt'>): Promise<ExternalSource> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const saved = localStorage.getItem('external-sources');
  if (saved) {
    try {
      mockExternalSources = JSON.parse(saved);
    } catch (e) {
      console.error('Error loading external sources:', e);
    }
  }
  
  const newSource: ExternalSource = {
    ...source,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  mockExternalSources.push(newSource);
  localStorage.setItem('external-sources', JSON.stringify(mockExternalSources));
  
  return newSource;
};

export const updateExternalSource = async (id: string, updates: Partial<ExternalSource>): Promise<ExternalSource> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const saved = localStorage.getItem('external-sources');
  if (saved) {
    try {
      mockExternalSources = JSON.parse(saved);
    } catch (e) {
      console.error('Error loading external sources:', e);
    }
  }
  
  const index = mockExternalSources.findIndex(s => s.id === id);
  if (index === -1) throw new Error('External source not found');
  
  const updated = {
    ...mockExternalSources[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  
  mockExternalSources[index] = updated;
  localStorage.setItem('external-sources', JSON.stringify(mockExternalSources));
  
  return updated;
};

export const deleteExternalSource = async (id: string): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const saved = localStorage.getItem('external-sources');
  if (saved) {
    try {
      mockExternalSources = JSON.parse(saved);
    } catch (e) {
      console.error('Error loading external sources:', e);
    }
  }
  
  mockExternalSources = mockExternalSources.filter(s => s.id !== id);
  localStorage.setItem('external-sources', JSON.stringify(mockExternalSources));
  
  // Also delete related events
  mockExternalEvents = mockExternalEvents.filter(e => e.sourceId !== id);
  localStorage.setItem('external-events', JSON.stringify(mockExternalEvents));
};

// User Story 1: API para gestionar eventos externos
export const getExternalEvents = async (
  sourceId?: string,
  dateFrom?: string,
  dateTo?: string
): Promise<ExternalEvent[]> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const saved = localStorage.getItem('external-events');
  if (saved) {
    try {
      mockExternalEvents = JSON.parse(saved);
    } catch (e) {
      console.error('Error loading external events:', e);
    }
  }
  
  let events = mockExternalEvents;
  
  if (sourceId) {
    events = events.filter(e => e.sourceId === sourceId);
  }
  
  if (dateFrom) {
    events = events.filter(e => e.date >= dateFrom);
  }
  
  if (dateTo) {
    events = events.filter(e => e.date <= dateTo);
  }
  
  return events.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

export const createExternalEvent = async (event: Omit<ExternalEvent, 'id'>): Promise<ExternalEvent> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const saved = localStorage.getItem('external-events');
  if (saved) {
    try {
      mockExternalEvents = JSON.parse(saved);
    } catch (e) {
      console.error('Error loading external events:', e);
    }
  }
  
  const newEvent: ExternalEvent = {
    ...event,
    id: Date.now().toString(),
  };
  
  mockExternalEvents.push(newEvent);
  localStorage.setItem('external-events', JSON.stringify(mockExternalEvents));
  
  // Generate annotation automatically
  await generateAnnotationForEvent(newEvent);
  
  return newEvent;
};

export const updateExternalEvent = async (id: string, updates: Partial<ExternalEvent>): Promise<ExternalEvent> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const saved = localStorage.getItem('external-events');
  if (saved) {
    try {
      mockExternalEvents = JSON.parse(saved);
    } catch (e) {
      console.error('Error loading external events:', e);
    }
  }
  
  const index = mockExternalEvents.findIndex(e => e.id === id);
  if (index === -1) throw new Error('External event not found');
  
  const updated = {
    ...mockExternalEvents[index],
    ...updates,
  };
  
  mockExternalEvents[index] = updated;
  localStorage.setItem('external-events', JSON.stringify(mockExternalEvents));
  
  // Update annotation
  await updateAnnotationForEvent(updated);
  
  return updated;
};

export const deleteExternalEvent = async (id: string): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const saved = localStorage.getItem('external-events');
  if (saved) {
    try {
      mockExternalEvents = JSON.parse(saved);
    } catch (e) {
      console.error('Error loading external events:', e);
    }
  }
  
  mockExternalEvents = mockExternalEvents.filter(e => e.id !== id);
  localStorage.setItem('external-events', JSON.stringify(mockExternalEvents));
  
  // Delete related annotation
  mockAnnotations = mockAnnotations.filter(a => a.eventId !== id);
  localStorage.setItem('chart-annotations', JSON.stringify(mockAnnotations));
};

// User Story 1: API para gestionar anotaciones en gráficos
export const getChartAnnotations = async (
  metricIds?: string[],
  dateFrom?: string,
  dateTo?: string
): Promise<ChartAnnotation[]> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const saved = localStorage.getItem('chart-annotations');
  if (saved) {
    try {
      mockAnnotations = JSON.parse(saved);
    } catch (e) {
      console.error('Error loading chart annotations:', e);
    }
  }
  
  let annotations = mockAnnotations;
  
  if (metricIds && metricIds.length > 0) {
    annotations = annotations.filter(a => 
      a.metricIds.some(id => metricIds.includes(id))
    );
  }
  
  if (dateFrom) {
    annotations = annotations.filter(a => a.date >= dateFrom);
  }
  
  if (dateTo) {
    annotations = annotations.filter(a => a.date <= dateTo);
  }
  
  return annotations.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
};

const generateAnnotationForEvent = async (event: ExternalEvent): Promise<ChartAnnotation> => {
  const saved = localStorage.getItem('chart-annotations');
  if (saved) {
    try {
      mockAnnotations = JSON.parse(saved);
    } catch (e) {
      console.error('Error loading chart annotations:', e);
    }
  }
  
  const sourceColors: Record<ExternalSourceType, string> = {
    crm: '#3B82F6',
    wearable: '#10B981',
    campaign: '#F59E0B',
    other: '#6B7280',
  };
  
  const annotation: ChartAnnotation = {
    id: `annotation-${event.id}`,
    eventId: event.id,
    date: event.date,
    label: event.name,
    description: event.description,
    sourceType: event.sourceType,
    color: sourceColors[event.sourceType],
    position: 'top',
    metricIds: event.relatedMetrics || [],
  };
  
  mockAnnotations.push(annotation);
  localStorage.setItem('chart-annotations', JSON.stringify(mockAnnotations));
  
  return annotation;
};

const updateAnnotationForEvent = async (event: ExternalEvent): Promise<void> => {
  const saved = localStorage.getItem('chart-annotations');
  if (saved) {
    try {
      mockAnnotations = JSON.parse(saved);
    } catch (e) {
      console.error('Error loading chart annotations:', e);
    }
  }
  
  const index = mockAnnotations.findIndex(a => a.eventId === event.id);
  if (index >= 0) {
    mockAnnotations[index] = {
      ...mockAnnotations[index],
      date: event.date,
      label: event.name,
      description: event.description,
      metricIds: event.relatedMetrics || [],
    };
    localStorage.setItem('chart-annotations', JSON.stringify(mockAnnotations));
  }
};

// Sync external source (simulate fetching events from external API)
export const syncExternalSource = async (sourceId: string): Promise<ExternalEvent[]> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const source = await getExternalSource(sourceId);
  if (!source) throw new Error('External source not found');
  
  // Simulate fetching events from external API
  // In a real implementation, this would call the actual external API
  const mockEvents: ExternalEvent[] = [];
  
  // Update last sync time
  await updateExternalSource(sourceId, {
    lastSync: new Date().toISOString(),
  });
  
  return mockEvents;
};

