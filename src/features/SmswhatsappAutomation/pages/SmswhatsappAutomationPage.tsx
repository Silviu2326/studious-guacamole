import React from 'react';
import { useAuth } from '../../../context/AuthContext';
import { 
  MessageSquare, 
  Plus,
  Play,
  BarChart3,
  Send,
  Smartphone,
  Package
} from 'lucide-react';
import { Button, Card, MetricCards } from '../../../components/componentsreutilizables';
import type { MetricCardData } from '../../../components/componentsreutilizables';

/**
 * Página principal de Automatización de SMS/WhatsApp
 * 
 * Permite a los entrenadores diseñar y desplegar flujos de mensajes automáticos
 * que se activan en función de eventos específicos en el ciclo de vida de sus clientes.
 * 
 * Ruta: /dashboard/automations/messaging
 */
export const SmswhatsappAutomationPage: React.FC = () => {
  const { user } = useAuth();
  const esEntrenador = user?.role === 'entrenador';

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {/* Icono con contenedor */}
                <div className="p-2 bg-blue-100 rounded-xl mr-4 ring-1 ring-blue-200/70">
                  <MessageSquare size={24} className="text-blue-600" />
                </div>
                
                {/* Título y descripción */}
                <div>
                  <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                    Automatización SMS/WhatsApp
                  </h1>
                  <p className="text-gray-600">
                    Crea flujos de comunicación automáticos que se activan por eventos clave
                  </p>
                </div>
              </div>

              {/* Botón de acción principal */}
              <Button 
                variant="primary"
                leftIcon={<Plus size={20} />}
                onClick={() => {}}
              >
                Nueva Automatización
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
        <div className="space-y-6">
          {/* Información educativa */}
          <Card className="bg-white shadow-sm">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Smartphone size={20} className="text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  ¿Qué es la Automatización de Mensajería?
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Automatiza tu comunicación con clientes enviando mensajes SMS o WhatsApp que se activan 
                  automáticamente según eventos clave. Configura recordatorios de citas, mensajes de bienvenida, 
                  felicitaciones por logros y mucho más. Cada mensaje se personaliza automáticamente con información 
                  del cliente usando variables dinámicas como {'{{cliente_nombre}}'} o {'{{fecha_cita}}'}.
                </p>
              </div>
            </div>
          </Card>

          {/* Dashboard de estadísticas */}
          <MetricCards
            data={[
              {
                id: 'mensajes-enviados',
                title: 'Mensajes Enviados',
                value: '0',
                subtitle: 'Últimos 30 días',
                icon: <Send size={24} />,
                color: 'info',
              },
              {
                id: 'tasa-entrega',
                title: 'Tasa de Entrega',
                value: '-',
                subtitle: 'Porcentaje de éxito',
                icon: <BarChart3 size={24} />,
                color: 'success',
              },
              {
                id: 'automatizaciones-activas',
                title: 'Automatizaciones Activas',
                value: '0',
                subtitle: 'Flujos en ejecución',
                icon: <Play size={24} />,
                color: 'info',
              },
              {
                id: 'costo-estimado',
                title: 'Costo Estimado',
                value: '€0.00',
                subtitle: 'Este mes',
                icon: <BarChart3 size={24} />,
                color: 'warning',
              },
            ]}
            columns={4}
          />

          {/* Lista de automatizaciones */}
          <Card className="p-0 bg-white shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Tus Automatizaciones</h2>
              <p className="text-sm text-gray-600 mt-1">
                Gestiona y monitorea todos tus flujos de mensajería automática
              </p>
            </div>

            <div className="p-8 text-center">
              {/* Estado vacío */}
              <Package size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No hay automatizaciones creadas aún
              </h3>
              <p className="text-gray-600 mb-4">
                Crea tu primera automatización para comenzar a comunicarte automáticamente con tus clientes
              </p>
              <Button
                variant="primary"
                leftIcon={<Plus size={20} />}
                onClick={() => {}}
              >
                Crear Primera Automatización
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SmswhatsappAutomationPage;

