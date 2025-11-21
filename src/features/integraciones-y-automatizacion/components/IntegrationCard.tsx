import React from 'react';
import { Card } from '../../../components/componentsreutilizables';
import { Badge } from '../../../components/componentsreutilizables';
import { Button } from '../../../components/componentsreutilizables';
import { Settings, AlertCircle, CheckCircle2, ExternalLink, ArrowRight } from 'lucide-react';
import type { Integration } from '../types';
import { INTEGRATION_STATUS_COLORS, INTEGRATION_STATUS_LABELS } from '../types';

interface IntegrationCardProps {
  integration: Integration;
  onConnect: (integrationId: string) => void;
  onManage: (integrationId: string, userIntegrationId: string) => void;
  onDisconnect?: (userIntegrationId: string) => void;
}

export const IntegrationCard: React.FC<IntegrationCardProps> = ({
  integration,
  onConnect,
  onManage,
  onDisconnect,
}) => {
  const getStatusIcon = () => {
    switch (integration.status) {
      case 'connected':
        return <CheckCircle2 className="w-4 h-4" />;
      case 'error':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const handleAction = () => {
    if (integration.status === 'connected' && integration.userIntegrationId) {
      onManage(integration.id, integration.userIntegrationId);
    } else {
      onConnect(integration.id);
    }
  };

  return (
    <div className="group relative h-full">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl opacity-0 group-hover:opacity-10 transition duration-300 blur"></div>
      <Card className="relative h-full flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-xl border-gray-200/60 bg-white overflow-hidden">
        {/* Status Banner for Connected/Error */}
        {integration.status !== 'disconnected' && (
          <div className={`h-1.5 w-full ${integration.status === 'connected' ? 'bg-green-500' : 'bg-red-500'}`} />
        )}
        
        <div className="flex flex-col flex-1 p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-5">
            <div className="w-14 h-14 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center overflow-hidden shadow-sm group-hover:scale-105 transition-transform duration-300">
              {integration.logoUrl ? (
                <img
                  src={integration.logoUrl}
                  alt={integration.name}
                  className="w-full h-full object-contain p-2.5"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-2xl">
                  {integration.name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <Badge
              variant={INTEGRATION_STATUS_COLORS[integration.status] as any}
              size="sm"
              className={`flex items-center gap-1.5 px-2.5 py-1 ${
                integration.status === 'connected' ? 'bg-green-50 text-green-700 border-green-200' : 
                integration.status === 'error' ? 'bg-red-50 text-red-700 border-red-200' : 
                'bg-gray-50 text-gray-600 border-gray-200'
              }`}
            >
              {getStatusIcon()}
              <span className="font-medium">
                {INTEGRATION_STATUS_LABELS[integration.status]}
              </span>
            </Badge>
          </div>

          {/* Content */}
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
              {integration.name}
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed mb-4 line-clamp-3">
              {integration.description}
            </p>

            {/* Metadata */}
            {integration.status === 'connected' && integration.lastSync && (
              <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-50 p-2 rounded-lg mb-4">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                Sincronizado: {new Date(integration.lastSync).toLocaleDateString('es-ES', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </div>
            )}

            {/* Error Message */}
            {integration.status === 'error' && integration.errorMessage && (
              <div className="bg-red-50 border border-red-100 rounded-lg p-3 mb-4">
                <div className="flex gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <p className="text-xs text-red-700 font-medium">{integration.errorMessage}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Actions Footer */}
        <div className="p-4 bg-gray-50/50 border-t border-gray-100 flex flex-col gap-2">
          {integration.status === 'connected' ? (
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="primary"
                size="sm"
                onClick={() => onManage(integration.id, integration.userIntegrationId!)}
                className="w-full justify-center shadow-sm"
              >
                <Settings size={16} className="mr-2" />
                Configurar
              </Button>
              {onDisconnect && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDisconnect(integration.userIntegrationId!)}
                  className="w-full justify-center text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  Desconectar
                </Button>
              )}
            </div>
          ) : (
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="flex-1 text-gray-600 hover:text-blue-600"
                onClick={() => window.open('#', '_blank')}
              >
                <ExternalLink size={16} className="mr-2" />
                Info
              </Button>
              <Button
                variant="primary"
                size="sm"
                className="flex-[2] justify-center shadow-blue-100 shadow-lg hover:shadow-blue-200 transition-all"
                onClick={handleAction}
              >
                Conectar
                <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

