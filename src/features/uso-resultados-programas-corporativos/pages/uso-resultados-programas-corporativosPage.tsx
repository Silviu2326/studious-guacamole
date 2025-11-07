import React from 'react';
import { CorporateUsageDashboard } from '../components';
import { BarChart3 } from 'lucide-react';

/**
 * Página de Uso y Resultados de Programas Corporativos
 * 
 * Dashboard analítico exclusivo para 'Administrador de Plataforma' o 'Gerente de Cuentas Corporativas' del gimnasio.
 * Permite analizar el rendimiento y la utilización de los programas de bienestar vendidos a clientes empresariales (B2B).
 * 
 * Funcionalidades:
 * - Visualización de KPIs clave (Tasa de Activación, Visitas Totales, etc.)
 * - Gráficos de tendencias temporales de uso
 * - Análisis de actividades más populares
 * - Exportación de informes en PDF/CSV
 * 
 * Ruta: /corporate/clients/:clientId/usage-results
 */
export default function UsoResultadosProgramasCorporativosPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6">
          <div className="py-6">
            <div className="flex items-center">
              {/* Icono con contenedor */}
              <div className="p-2 bg-blue-100 rounded-xl mr-4 ring-1 ring-blue-200/70">
                <BarChart3 size={24} className="text-blue-600" />
              </div>
              
              {/* Título y descripción */}
              <div>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                  Uso & Resultados - Programas Corporativos
                </h1>
                <p className="text-gray-600">
                  Analiza el rendimiento y la utilización de los programas de bienestar vendidos a tus clientes empresariales
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
        <CorporateUsageDashboard />
      </div>
    </div>
  );
}

