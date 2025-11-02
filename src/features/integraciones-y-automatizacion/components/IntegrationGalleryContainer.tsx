import React, { useState, useEffect } from 'react';
import { IntegrationCard } from './IntegrationCard';
import { IntegrationSettingsModal } from './IntegrationSettingsModal';
import { integrationService } from '../api';
import type { Integration } from '../types';
import { integrationData } from '../data/mockIntegrations';
import { Card, Button } from '../../../components/componentsreutilizables';
import { Loader2, AlertCircle } from 'lucide-react';

export const IntegrationGalleryContainer: React.FC = () => {
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  useEffect(() => {
    loadIntegrations();
  }, []);

  const loadIntegrations = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // En producción, usaríamos:
      // const data = await integrationService.getAllIntegrations();
      // setIntegrations(data);
      
      // Por ahora usamos datos mock
      setIntegrations(integrationData);
    } catch (err: any) {
      setError(err.message || 'Error al cargar las integraciones');
    } finally {
      setIsLoading(false);
    }
  };

  const handleConnect = async (integrationId: string) => {
    try {
      const response = await integrationService.connectIntegration({ integrationId });
      
      // Abrir ventana de autorización OAuth
      const popup = window.open(
        response.authorizationUrl,
        'oauth-popup',
        'width=600,height=700'
      );

      // Escuchar mensaje del popup cuando complete la autenticación
      const handleMessage = (event: MessageEvent) => {
        if (event.data.type === 'OAUTH_SUCCESS') {
          popup?.close();
          window.removeEventListener('message', handleMessage);
          loadIntegrations(); // Recargar para actualizar el estado
        } else if (event.data.type === 'OAUTH_ERROR') {
          popup?.close();
          window.removeEventListener('message', handleMessage);
          setError(event.data.message || 'Error en la autenticación');
        }
      };

      window.addEventListener('message', handleMessage);

      // Cerrar automáticamente si se cierra el popup antes de completar
      const checkClosed = setInterval(() => {
        if (popup?.closed) {
          clearInterval(checkClosed);
          window.removeEventListener('message', handleMessage);
        }
      }, 1000);
    } catch (err: any) {
      setError(err.message || 'Error al conectar la integración');
    }
  };

  const handleManage = (integrationId: string, userIntegrationId: string) => {
    const integration = integrations.find((i) => i.id === integrationId);
    if (integration) {
      setSelectedIntegration(integration);
      setIsSettingsModalOpen(true);
    }
  };

  const handleDisconnect = async (userIntegrationId: string) => {
    if (!confirm('¿Estás seguro de que quieres desconectar esta integración?')) {
      return;
    }

    try {
      await integrationService.disconnectIntegration(userIntegrationId);
      loadIntegrations(); // Recargar para actualizar el estado
    } catch (err: any) {
      setError(err.message || 'Error al desconectar la integración');
    }
  };

  const groupedIntegrations = integrations.reduce((acc, integration) => {
    if (!acc[integration.category]) {
      acc[integration.category] = [];
    }
    acc[integration.category].push(integration);
    return acc;
  }, {} as Record<string, Integration[]>);

  const categoryLabels: Record<string, string> = {
    payments: 'Pagos',
    calendars: 'Calendarios',
    marketing: 'Marketing',
    communication: 'Comunicación',
    health: 'Salud y Fitness',
    other: 'Otras',
  };

  if (isLoading) {
    return (
      <Card className="p-8 text-center bg-white shadow-sm">
        <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
        <p className="text-gray-600">Cargando integraciones...</p>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-8 text-center bg-white shadow-sm">
        <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Error al cargar integraciones</h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <Button variant="primary" onClick={() => loadIntegrations()}>
          Reintentar
        </Button>
      </Card>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {Object.entries(groupedIntegrations).map(([category, categoryIntegrations]) => (
          <div key={category}>
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              {categoryLabels[category] || category}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {categoryIntegrations.map((integration) => (
                <IntegrationCard
                  key={integration.id}
                  integration={integration}
                  onConnect={handleConnect}
                  onManage={handleManage}
                  onDisconnect={handleDisconnect}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {selectedIntegration && selectedIntegration.userIntegrationId && (
        <IntegrationSettingsModal
          isOpen={isSettingsModalOpen}
          onClose={() => setIsSettingsModalOpen(false)}
          integrationId={selectedIntegration.id}
          userIntegrationId={selectedIntegration.userIntegrationId}
          integrationName={selectedIntegration.name}
        />
      )}
    </>
  );
};

