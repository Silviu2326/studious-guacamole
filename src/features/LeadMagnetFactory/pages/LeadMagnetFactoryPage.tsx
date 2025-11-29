import React from 'react';
import { useAuth } from '../../../context/AuthContext';
import { LeadMagnetDashboard } from '../components/LeadMagnetDashboard';
import { Card } from '../../../components/componentsreutilizables';
import { FileText, Target, Rocket } from 'lucide-react';

export const LeadMagnetFactoryPage: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6">
          <div className="py-6">
            <div className="flex items-center">
              {/* Icono con contenedor */}
              <div className="p-2 bg-blue-100 rounded-xl mr-4 ring-1 ring-blue-200/70">
                <FileText size={24} className="text-blue-600" />
              </div>
              
              {/* Título y descripción */}
              <div>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                  Lead Magnet Factory
                </h1>
                <p className="text-gray-600">
                  Crea, gestiona y analiza tus imanes de plomo para captar clientes
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
        <div className="space-y-6">
          {/* Información educativa */}
          <Card className="p-0 bg-white shadow-sm">
            <div className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Target className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    ¿Qué es un Lead Magnet?
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed mb-3">
                    Los lead magnets son recursos de valor que ofreces gratis a cambio de los datos de contacto 
                    de un potencial cliente. Guías en PDF, calculadoras interactivas, checklists y planes de 
                    entrenamiento son ejemplos perfectos para el nicho fitness.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    <div className="flex items-start gap-3">
                      <Rocket className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Captación Automática</p>
                        <p className="text-xs text-gray-600">Convierte visitantes en leads</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Target className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Plantillas Listas</p>
                        <p className="text-xs text-gray-600">Para el nicho fitness</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <FileText className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Integración Total</p>
                        <p className="text-xs text-gray-600">Con CRM y automatizaciones</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <LeadMagnetDashboard trainerId={user?.id || 'user-123'} />
        </div>
      </div>
    </div>
  );
};

export default LeadMagnetFactoryPage;

