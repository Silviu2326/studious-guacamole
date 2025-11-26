import React from 'react';
import { 
  MessageSquare, 
  Plus,
  Send,
  BarChart3,
  TrendingUp,
  Smartphone,
  Mail,
  Target,
  Package
} from 'lucide-react';
import { Card, Button, MetricCards } from '../../../components/componentsreutilizables';
import type { MetricCardData } from '../../../components/componentsreutilizables';

/**
 * Página principal de Marketing SMS/WhatsApp
 * 
 * Centro de control para la comunicación directa e instantánea con clientes y leads.
 * Permite crear campañas altamente segmentadas y personalizadas a través de SMS y WhatsApp.
 * 
 * Ruta: /dashboard/marketing/mensajeria
 */
export const SmswhatsappMarketingPage: React.FC = () => {

  // Datos de métricas según la guía
  const metricas: MetricCardData[] = [
    {
      id: 'tasa-entrega',
      title: 'Tasa de Entrega',
      value: '-',
      subtitle: 'Mensajes entregados',
      icon: <Send size={20} />,
      color: 'success',
    },
    {
      id: 'tasa-clics',
      title: 'Tasa de Clics (CTR)',
      value: '-',
      subtitle: 'Clics únicos',
      icon: <Target size={20} />,
      color: 'info',
    },
    {
      id: 'tasa-conversion',
      title: 'Tasa de Conversión',
      value: '-',
      subtitle: 'Acciones completadas',
      icon: <TrendingUp size={20} />,
      color: 'success',
    },
    {
      id: 'costo-total',
      title: 'Costo Total',
      value: '€0.00',
      subtitle: 'Este mes',
      icon: <BarChart3 size={20} />,
      color: 'warning',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6">
          <div className="py-6">
            <div className="flex items-center">
              {/* Icono con contenedor */}
              <div className="p-2 bg-blue-100 rounded-xl mr-4 ring-1 ring-blue-200/70">
                <MessageSquare size={24} className="text-blue-600" />
              </div>
              
              {/* Título y descripción */}
              <div>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                  Marketing SMS/WhatsApp
                </h1>
                <p className="text-gray-600">
                  Crea campañas segmentadas y personalizadas para comunicarte directamente con tus clientes
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
        <div className="space-y-6">
          {/* Toolbar superior */}
          <div className="flex items-center justify-end">
            <Button onClick={() => {}} leftIcon={<Plus size={20} />}>
              Nueva Campaña
            </Button>
          </div>

          {/* Información educativa */}
          <Card className="p-4 bg-white shadow-sm">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Smartphone size={20} className="text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  ¿Qué es el Marketing SMS/WhatsApp?
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Comunícate directamente con tus clientes a través de los canales con las tasas de apertura más altas.
                  Crea campañas segmentadas con mensajes personalizados usando variables dinámicas como {'{{nombre_cliente}}'} 
                  o {'{{proxima_sesion}}'}. Reduce ausencias con recordatorios automáticos, llena tu agenda con ofertas flash 
                  y fideliza a tus clientes con mensajes motivacionales personalizados. Con una tasa de apertura superior al 90%, 
                  cada mensaje llega directamente al bolsillo de tu cliente.
                </p>
              </div>
            </div>
          </Card>

          {/* Métricas/KPIs */}
          <MetricCards data={metricas} columns={4} />

          {/* Lista de campañas */}
          <Card className="p-0 bg-white shadow-sm">
            <div className="px-4 py-3 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Tus Campañas</h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Gestiona y analiza todas tus campañas de mensajería
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="secondary" size="sm" leftIcon={<Mail size={18} />}>
                    SMS
                  </Button>
                  <Button variant="secondary" size="sm" leftIcon={<Smartphone size={18} />}>
                    WhatsApp
                  </Button>
                </div>
              </div>
            </div>

            <div className="p-8">
              {/* Estado vacío según la guía */}
              <div className="text-center">
                <Package size={48} className="mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No hay campañas creadas aún
                </h3>
                <p className="text-gray-600 mb-4">
                  Crea tu primera campaña para comenzar a comunicarte directamente con tus clientes y leads a través de SMS o WhatsApp
                </p>
                <Button onClick={() => {}} leftIcon={<Plus size={20} />}>
                  Crear Primera Campaña
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SmswhatsappMarketingPage;

