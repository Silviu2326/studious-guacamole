import React from 'react';
import { useAuth } from '../../../context/AuthContext';
import { 
  MessageSquare, 
  Plus,
  Play,
  Pause,
  Trash2,
  Edit,
  BarChart3,
  Send,
  Smartphone
} from 'lucide-react';

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
                <div className="p-2 bg-purple-100 rounded-xl mr-4 ring-1 ring-purple-200/70">
                  <MessageSquare size={24} className="text-purple-600" />
                </div>
                
                {/* Título y descripción */}
                <div>
                  <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                    Automatización SMS/WhatsApp
                  </h1>
                  <p className="text-gray-600 mt-1">
                    Crea flujos de comunicación automáticos que se activan por eventos clave
                  </p>
                </div>
              </div>

              {/* Botón de acción principal */}
              <button className="flex items-center gap-2 px-4 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors shadow-sm">
                <Plus className="w-5 h-5" />
                <span className="font-medium">Nueva Automatización</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
        {/* Información educativa */}
        <div className="mb-6 bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-6">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Smartphone className="w-5 h-5 text-purple-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-2">
                ¿Qué es la Automatización de Mensajería?
              </h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                Automatiza tu comunicación con clientes enviando mensajes SMS o WhatsApp que se activan 
                automáticamente según eventos clave. Configura recordatorios de citas, mensajes de bienvenida, 
                felicitaciones por logros y mucho más. Cada mensaje se personaliza automáticamente con información 
                del cliente usando variables dinámicas como {'{{cliente_nombre}}'} o {'{{fecha_cita}}'}.
              </p>
            </div>
          </div>
        </div>

        {/* Dashboard de estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Mensajes Enviados</p>
                <p className="text-2xl font-bold text-gray-900">0</p>
                <p className="text-xs text-gray-500 mt-1">Últimos 30 días</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <Send className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Tasa de Entrega</p>
                <p className="text-2xl font-bold text-gray-900">-</p>
                <p className="text-xs text-gray-500 mt-1">Porcentaje de éxito</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <BarChart3 className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Automatizaciones Activas</p>
                <p className="text-2xl font-bold text-gray-900">0</p>
                <p className="text-xs text-gray-500 mt-1">Flujos en ejecución</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Play className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Costo Estimado</p>
                <p className="text-2xl font-bold text-gray-900">€0.00</p>
                <p className="text-xs text-gray-500 mt-1">Este mes</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-lg">
                <BarChart3 className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Lista de automatizaciones */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Tus Automatizaciones</h2>
            <p className="text-sm text-gray-600 mt-1">
              Gestiona y monitorea todos tus flujos de mensajería automática
            </p>
          </div>

          <div className="p-6">
            {/* Estado vacío */}
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                <MessageSquare className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No hay automatizaciones creadas aún
              </h3>
              <p className="text-sm text-gray-600 mb-6 max-w-md mx-auto">
                Crea tu primera automatización para comenzar a comunicarte automáticamente con tus clientes
              </p>
              <button className="inline-flex items-center gap-2 px-4 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors shadow-sm">
                <Plus className="w-5 h-5" />
                <span className="font-medium">Crear Primera Automatización</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SmswhatsappAutomationPage;

