import React, { useState, useEffect } from 'react';
import { Card } from '../../../components/componentsreutilizables';
import { getLeads, Lead } from '../api/inbox';
import { Inbox, AlertCircle } from 'lucide-react';

export const LeadInboxContainer: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadLeads();
  }, []);

  const loadLeads = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getLeads();
      setLeads(response.data);
    } catch (err: any) {
      setError(err.message || 'Error al cargar los leads');
    } finally {
      setIsLoading(false);
    }
  };

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 font-medium">{error}</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {leads.length === 0 ? (
        <Card className="p-12 text-center">
          <Inbox className="w-16 h-16 text-purple-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay leads</h3>
          <p className="text-gray-600">Los nuevos leads aparecerán aquí</p>
        </Card>
      ) : (
        <div>Leads listados</div>
      )}
    </div>
  );
};

