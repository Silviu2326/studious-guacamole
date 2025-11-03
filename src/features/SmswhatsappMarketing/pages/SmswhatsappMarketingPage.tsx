import React from 'react';
import { useAuth } from '../../../context/AuthContext';
import { 
  MessageSquare, 
  Plus,
  Send,
  BarChart3,
  TrendingUp,
  Smartphone,
  Mail,
  Target
} from 'lucide-react';

/**
 * Página principal de Marketing SMS/WhatsApp
 * 
 * Centro de control para la comunicación directa e instantánea con clientes y leads.
 * Permite crear campañas altamente segmentadas y personalizadas a través de SMS y WhatsApp.
 * 
 * Ruta: /dashboard/marketing/mensajeria
 */
export const SmswhatsappMarketingPage: React.FC = () => {
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
                    Marketing SMS/WhatsApp
                  </h1>
                  <p className="text-gray-600 mt-1">
                    Crea campañas segmentadas y personalizadas para comunicarte directamente con tus clientes
                  </p>
                </div>
              </div>

              {/* Botón de acción principal */}
              <button className="flex items-center gap-2 px-4 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors shadow-sm">
                <Plus className="w-5 h-5" />
                <span className="font-medium">Nueva Campaña</span>
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
                ¿Qué es el Marketing SMS/WhatsApp?
              </h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                Comunícate directamente con tus clientes a través de los canales con las tasas de apertura más altas.
                Crea campañas segmentadas con mensajes personalizados usando variables dinámicas como {'{{nombre_cliente}}'} 
                o {'{{proxima_sesion}}'}. Reduce ausencias con recordatorios automáticos, llena tu agenda con ofertas flash 
                y fideliza a tus clientes con mensajes motivacionales personalizados. Con una tasa de apertura superior al 90%, 
                cada mensaje llega directamente al bolsillo de tu cliente.
              </p>
            </div>
          </div>
        </div>

        {/* Dashboard de estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Tasa de Entrega</p>
                <p className="text-2xl font-bold text-gray-900">-</p>
                <p className="text-xs text-gray-500 mt-1">Mensajes entregados</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <Send className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Tasa de Clics (CTR)</p>
                <p className="text-2xl font-bold text-gray-900">-</p>
                <p className="text-xs text-gray-500 mt-1">Clics únicos</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Target className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Tasa de Conversión</p>
                <p className="text-2xl font-bold text-gray-900">-</p>
                <p className="text-xs text-gray-500 mt-1">Acciones completadas</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Costo Total</p>
                <p className="text-2xl font-bold text-gray-900">€0.00</p>
                <p className="text-xs text-gray-500 mt-1">Este mes</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-lg">
                <BarChart3 className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Lista de campañas */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Tus Campañas</h2>
                <p className="text-sm text-gray-600 mt-1">
                  Gestiona y analiza todas tus campañas de mensajería
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button className="px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                  <Mail className="w-4 h-4 inline mr-1" />
                  SMS
                </button>
                <button className="px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                  <Smartphone className="w-4 h-4 inline mr-1" />
                  WhatsApp
                </button>
              </div>
            </div>
          </div>

          <div className="p-6">
            {/* Estado vacío */}
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                <MessageSquare className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No hay campañas creadas aún
              </h3>
              <p className="text-sm text-gray-600 mb-6 max-w-md mx-auto">
                Crea tu primera campaña para comenzar a comunicarte directamente con tus clientes y leads a través de SMS o WhatsApp
              </p>
              <button className="inline-flex items-center gap-2 px-4 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors shadow-sm">
                <Plus className="w-5 h-5" />
                <span className="font-medium">Crear Primera Campaña</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SmswhatsappMarketingPage;

