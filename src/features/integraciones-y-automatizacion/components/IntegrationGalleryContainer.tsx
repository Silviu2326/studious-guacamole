import React, { useState, useEffect } from 'react';
import { IntegrationCard } from './IntegrationCard';
import { IntegrationSettingsModal } from './IntegrationSettingsModal';
import { IntegrationFilters } from './IntegrationFilters';
import { integrationService } from '../api';
import type { Integration, IntegrationCategory } from '../types';
import { integrationData } from '../data/mockIntegrations';
import { Card, Button } from '../../../components/componentsreutilizables';
import { Loader2, AlertCircle, Star, PlusCircle, Activity, ArrowRight, CheckCircle2, X } from 'lucide-react';

export const IntegrationGalleryContainer: React.FC = () => {
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<IntegrationCategory | 'all'>('all');

  // Notification state
  const [notification, setNotification] = useState<{
    type: 'success' | 'error' | 'info';
    message: string;
  } | null>(null);

  useEffect(() => {
    loadIntegrations();
  }, []);

  // Auto-dismiss notification
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

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
          setNotification({
            type: 'success',
            message: 'Integración conectada exitosamente'
          });
        } else if (event.data.type === 'OAUTH_ERROR') {
          popup?.close();
          window.removeEventListener('message', handleMessage);
          setError(event.data.message || 'Error en la autenticación');
          setNotification({
            type: 'error',
            message: event.data.message || 'Error al conectar la integración'
          });
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
      // En un entorno real, esto sería un error. 
      // Para la demo, simulamos éxito si falla la API mock
      console.warn('API call failed, simulating success for demo', err);
      setNotification({
        type: 'info',
        message: 'Simulación: Iniciando proceso de conexión...'
      });
      // setError(err.message || 'Error al conectar la integración');
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
      setNotification({
        type: 'success',
        message: 'Integración desconectada correctamente'
      });
    } catch (err: any) {
      // setError(err.message || 'Error al desconectar la integración');
      // Simular éxito para demo
      setNotification({
        type: 'success',
        message: 'Integración desconectada (Simulación)'
      });
    }
  };

  const handleRequestIntegration = () => {
    const tool = prompt('¿Qué herramienta te gustaría integrar?');
    if (tool) {
      setNotification({
        type: 'success',
        message: `¡Gracias! Hemos registrado tu solicitud para integrar ${tool}.`
      });
    }
  };

  const handleViewRoadmap = () => {
    window.open('https://trello.com/b/roadmap-demo', '_blank');
    setNotification({
      type: 'info',
      message: 'Abriendo roadmap público en nueva pestaña...'
    });
  };

  const handleViewAllActivity = () => {
    setNotification({
      type: 'info',
      message: 'Cargando historial completo de actividad...'
    });
    // Aquí se abriría un modal o navegaría a una página de logs
  };

  // Filter logic
  const filteredIntegrations = integrations.filter((integration) => {
    const matchesSearch = integration.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          integration.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || integration.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const groupedIntegrations = filteredIntegrations.reduce((acc, integration) => {
    if (!acc[integration.category]) {
      acc[integration.category] = [];
    }
    acc[integration.category].push(integration);
    return acc;
  }, {} as Record<string, Integration[]>);

  const categoryLabels: Record<string, string> = {
    payments: 'Pagos y Finanzas',
    calendars: 'Calendarios y Agenda',
    marketing: 'Marketing y Ventas',
    communication: 'Comunicación y Mensajería',
    health: 'Salud y Wearables',
    other: 'Otras Herramientas',
  };

  // Mock Activity Log
  const activityLog = [
    { id: 1, action: 'Sincronización completada', integration: 'Stripe', time: 'Hace 5 min', status: 'success' },
    { id: 2, action: 'Nuevo contacto añadido', integration: 'Mailchimp', time: 'Hace 2 horas', status: 'success' },
    { id: 3, action: 'Error de conexión', integration: 'Google Calendar', time: 'Hace 4 horas', status: 'error' },
  ];

  if (isLoading) {
    return (
      <Card className="p-12 text-center bg-white shadow-sm">
        <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
        <p className="text-gray-600 text-lg">Cargando ecosistema de integraciones...</p>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-8 text-center bg-white shadow-sm border-red-100">
        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertCircle size={32} className="text-red-500" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">Error al cargar integraciones</h3>
        <p className="text-gray-600 mb-6 max-w-md mx-auto">{error}</p>
        <Button variant="primary" onClick={() => loadIntegrations()}>
          Reintentar conexión
        </Button>
      </Card>
    );
  }

  return (
    <>
      {/* Notification Toast */}
      {notification && (
        <div className="fixed bottom-4 right-4 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300">
          <div className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg border ${
            notification.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' :
            notification.type === 'error' ? 'bg-red-50 border-red-200 text-red-800' :
            'bg-blue-50 border-blue-200 text-blue-800'
          }`}>
            {notification.type === 'success' && <CheckCircle2 size={20} className="text-green-600" />}
            {notification.type === 'error' && <AlertCircle size={20} className="text-red-600" />}
            {notification.type === 'info' && <Activity size={20} className="text-blue-600" />}
            <p className="text-sm font-medium">{notification.message}</p>
            <button 
              onClick={() => setNotification(null)}
              className="ml-2 p-1 hover:bg-black/5 rounded-full transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      <div className="space-y-8">
        {/* Featured Section (Only show if no search/filter active) */}
        {searchQuery === '' && selectedCategory === 'all' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 text-white shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-4">
                    <Star className="text-yellow-300 fill-yellow-300" size={20} />
                    <span className="font-medium text-blue-100">Destacado del mes</span>
                  </div>
                  <h2 className="text-3xl font-bold mb-4">Automatiza tus cobros con Stripe</h2>
                  <p className="text-blue-100 mb-8 max-w-lg text-lg">
                    Reduce la morosidad y automatiza la facturación. Conecta Stripe para gestionar suscripciones y pagos únicos sin esfuerzo manual.
                  </p>
                  <Button 
                    variant="secondary" 
                    className="bg-white text-blue-600 hover:bg-blue-50 border-none shadow-md"
                    onClick={() => {
                      setSearchQuery('Stripe');
                    }}
                  >
                    Configurar ahora <ArrowRight size={16} className="ml-2" />
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Activity Log Widget */}
            <Card className="h-full flex flex-col bg-white shadow-sm border-gray-100">
              <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  <Activity size={18} className="text-blue-500" />
                  Actividad Reciente
                </h3>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-xs"
                  onClick={handleViewAllActivity}
                >
                  Ver todo
                </Button>
              </div>
              <div className="flex-1 p-4 overflow-y-auto max-h-[250px]">
                <div className="space-y-4">
                  {activityLog.map((log) => (
                    <div key={log.id} className="flex items-start gap-3">
                      <div className={`w-2 h-2 mt-2 rounded-full ${log.status === 'success' ? 'bg-green-500' : 'bg-red-500'}`} />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{log.action}</p>
                        <p className="text-xs text-gray-500">{log.integration} • {log.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Filters */}
        <IntegrationFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />

        {/* Results */}
        {Object.keys(groupedIntegrations).length === 0 ? (
          <div className="text-center py-16 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search size={32} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">No se encontraron integraciones</h3>
            <p className="text-gray-500">Intenta ajustar tu búsqueda o filtros</p>
            <Button 
              variant="ghost" 
              className="mt-4 text-blue-600"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
            >
              Limpiar filtros
            </Button>
          </div>
        ) : (
          <div className="space-y-10">
            {Object.entries(groupedIntegrations).map(([category, categoryIntegrations]) => (
              <div key={category} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center gap-3 mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {categoryLabels[category] || category}
                  </h2>
                  <span className="px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-600 text-xs font-medium">
                    {categoryIntegrations.length}
                  </span>
                </div>
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
        )}

        {/* Request Integration Section */}
        <div className="mt-16 bg-gray-900 rounded-2xl p-8 md:p-12 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20">
            <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-500 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-purple-500 rounded-full blur-3xl"></div>
          </div>
          <div className="relative z-10 max-w-2xl mx-auto">
            <div className="w-16 h-16 bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl border border-gray-700">
              <PlusCircle size={32} className="text-blue-400" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">¿No encuentras lo que buscas?</h2>
            <p className="text-gray-300 mb-8 text-lg">
              Estamos constantemente añadiendo nuevas integraciones. Cuéntanos qué herramienta necesitas y priorizaremos su desarrollo.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                variant="primary" 
                size="lg" 
                className="bg-blue-600 hover:bg-blue-700 border-none"
                onClick={handleRequestIntegration}
              >
                Solicitar Integración
              </Button>
              <Button 
                variant="secondary" 
                size="lg" 
                className="bg-gray-800 text-white hover:bg-gray-700 border-gray-700"
                onClick={handleViewRoadmap}
              >
                Ver Roadmap
              </Button>
            </div>
          </div>
        </div>
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

