import { useState, useCallback } from 'react';
import { templatesAPI } from './templatesAPI';
import { 
  Template, 
  CreateTemplateRequest, 
  UpdateTemplateRequest, 
  TemplateResponse 
} from '../types';

interface QueryParams {
  page?: number;
  limit?: number;
  type?: string;
}

export const useTemplateAPI = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<Template[] | null>(null);
  const [pagination, setPagination] = useState<any>(null);

  const getTemplates = useCallback(async (params?: QueryParams) => {
    setLoading(true);
    setError(null);
    try {
      const response: TemplateResponse = await templatesAPI.getTemplates(params);
      setData(response.data);
      setPagination(response.pagination);
      return response;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Error desconocido');
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const getTemplateById = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const template = await templatesAPI.getTemplateById(id);
      return template;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Error desconocido');
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const createTemplate = useCallback(async (data: CreateTemplateRequest) => {
    setLoading(true);
    setError(null);
    try {
      const template = await templatesAPI.createTemplate(data);
      return template;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Error desconocido');
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateTemplate = useCallback(async (id: string, data: UpdateTemplateRequest) => {
    setLoading(true);
    setError(null);
    try {
      const template = await templatesAPI.updateTemplate(id, data);
      return template;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Error desconocido');
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteTemplate = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await templatesAPI.deleteTemplate(id);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Error desconocido');
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const duplicateTemplate = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const template = await templatesAPI.duplicateTemplate(id);
      return template;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Error desconocido');
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    data,
    loading,
    error,
    pagination,
    getTemplates,
    getTemplateById,
    createTemplate,
    updateTemplate,
    deleteTemplate,
    duplicateTemplate,
  };
};

