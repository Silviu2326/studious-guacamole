import { SavedMetricView, GlobalFilters } from '../types';

// User Story 2: API para gestionar vistas personalizadas guardadas
let mockSavedViews: SavedMetricView[] = [];

export const getSavedViews = async (): Promise<SavedMetricView[]> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  // Load from localStorage if available
  const saved = localStorage.getItem('saved-metric-views');
  if (saved) {
    try {
      mockSavedViews = JSON.parse(saved);
      return mockSavedViews.sort((a, b) => 
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );
    } catch (e) {
      console.error('Error loading saved views:', e);
    }
  }
  
  return mockSavedViews;
};

export const getSavedView = async (id: string): Promise<SavedMetricView | null> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const saved = localStorage.getItem('saved-metric-views');
  if (saved) {
    try {
      mockSavedViews = JSON.parse(saved);
    } catch (e) {
      console.error('Error loading saved views:', e);
    }
  }
  
  return mockSavedViews.find(v => v.id === id) || null;
};

export const getSavedViewByToken = async (token: string): Promise<SavedMetricView | null> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const saved = localStorage.getItem('saved-metric-views');
  if (saved) {
    try {
      mockSavedViews = JSON.parse(saved);
    } catch (e) {
      console.error('Error loading saved views:', e);
    }
  }
  
  return mockSavedViews.find(v => v.shareToken === token) || null;
};

export const createSavedView = async (
  view: Omit<SavedMetricView, 'id' | 'createdAt' | 'updatedAt' | 'shareToken'>
): Promise<SavedMetricView> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const saved = localStorage.getItem('saved-metric-views');
  if (saved) {
    try {
      mockSavedViews = JSON.parse(saved);
    } catch (e) {
      console.error('Error loading saved views:', e);
    }
  }
  
  // Generate share token if shared
  const shareToken = view.shared 
    ? `view-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    : undefined;
  
  const newView: SavedMetricView = {
    ...view,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    shareToken,
  };
  
  mockSavedViews.push(newView);
  localStorage.setItem('saved-metric-views', JSON.stringify(mockSavedViews));
  
  return newView;
};

export const updateSavedView = async (
  id: string,
  updates: Partial<SavedMetricView>
): Promise<SavedMetricView> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const saved = localStorage.getItem('saved-metric-views');
  if (saved) {
    try {
      mockSavedViews = JSON.parse(saved);
    } catch (e) {
      console.error('Error loading saved views:', e);
    }
  }
  
  const index = mockSavedViews.findIndex(v => v.id === id);
  if (index === -1) throw new Error('Saved view not found');
  
  // Generate share token if being shared for the first time
  let shareToken = mockSavedViews[index].shareToken;
  if (updates.shared && !shareToken) {
    shareToken = `view-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
  
  const updated = {
    ...mockSavedViews[index],
    ...updates,
    updatedAt: new Date().toISOString(),
    shareToken,
  };
  
  mockSavedViews[index] = updated;
  localStorage.setItem('saved-metric-views', JSON.stringify(mockSavedViews));
  
  return updated;
};

export const deleteSavedView = async (id: string): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const saved = localStorage.getItem('saved-metric-views');
  if (saved) {
    try {
      mockSavedViews = JSON.parse(saved);
    } catch (e) {
      console.error('Error loading saved views:', e);
    }
  }
  
  mockSavedViews = mockSavedViews.filter(v => v.id !== id);
  localStorage.setItem('saved-metric-views', JSON.stringify(mockSavedViews));
};

export const duplicateSavedView = async (id: string, newName: string): Promise<SavedMetricView> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const saved = localStorage.getItem('saved-metric-views');
  if (saved) {
    try {
      mockSavedViews = JSON.parse(saved);
    } catch (e) {
      console.error('Error loading saved views:', e);
    }
  }
  
  const original = mockSavedViews.find(v => v.id === id);
  if (!original) throw new Error('Saved view not found');
  
  const duplicated: SavedMetricView = {
    ...original,
    id: Date.now().toString(),
    name: newName,
    shared: false,
    shareToken: undefined,
    sharedWith: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  mockSavedViews.push(duplicated);
  localStorage.setItem('saved-metric-views', JSON.stringify(mockSavedViews));
  
  return duplicated;
};

// Generate share URL
export const getShareUrl = (view: SavedMetricView): string => {
  if (!view.shareToken) {
    throw new Error('View is not shared');
  }
  
  const baseUrl = window.location.origin;
  return `${baseUrl}/objetivos-rendimiento?view=${view.shareToken}`;
};

