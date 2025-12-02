import React from 'react';
import { useAuth } from '../../../context/AuthContext';
import { DynamicPricingDashboardContainer } from '../components/DynamicPricingDashboardContainer';
import { DollarSign, Lightbulb, TrendingUp } from 'lucide-react';

/**
 * Página principal de Dynamic Pricing & Ofertas Inteligentes
 * 
 * Permite a los entrenadores crear reglas automáticas de precios dinámicos
 * que se ajustan según condiciones como horario, temporada, comportamiento del cliente, etc.
 */
export const DynamicPricingYOfertasInteligentesPage: React.FC = () => {
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
                <DollarSign size={24} className="text-blue-600" />
              </div>
              
              {/* Título y descripción */}
              <div>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                  Dynamic Pricing & Ofertas Inteligentes
                </h1>
                <p className="text-gray-600 mt-1">
                  Automatiza tu estrategia de precios para maximizar ingresos, ocupación y retención
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
        {/* Información educativa */}
        <div className="mb-6 bg-gradient-to-r from-blue-50 to-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Lightbulb className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-2">
                ¿Qué es Dynamic Pricing & Ofertas Inteligentes?
              </h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                Esta herramienta permite crear reglas automáticas que ajustan los precios en tiempo real 
                basándose en múltiples factores: horario del día, días de la semana, inactividad del cliente, 
                temporada, lealtad del cliente, nivel de demanda, etc. Maximiza los ingresos llenando horas 
                valle con descuentos, aumenta la conversión con ofertas personalizadas, y mejora la retención 
                con incentivos para clientes inactivos. Transforma la fijación de precios de una tarea manual 
                a un sistema inteligente que optimiza continuamente tu negocio.
              </p>
            </div>
          </div>
        </div>

        {/* Dashboard */}
        <DynamicPricingDashboardContainer />
      </div>
    </div>
  );
};

export default DynamicPricingYOfertasInteligentesPage;


