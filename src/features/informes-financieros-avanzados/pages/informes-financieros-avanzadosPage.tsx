import React from 'react';
import { FinancialReportsContainer } from '../components';
import { FileBarChart } from 'lucide-react';

/**
 * Página de Informes Financieros Avanzados
 * 
 * Dashboard de inteligencia de negocio diseñado exclusivamente para gimnasios.
 * Proporciona métricas avanzadas como MRR, Churn de Ingresos, LTV, CAC, y análisis
 * de rentabilidad por servicio y por sede.
 */
export default function InformesFinancierosAvanzadosPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6">
          <div className="py-6">
            <div className="flex items-center">
              {/* Icono con contenedor */}
              <div className="p-2 bg-blue-100 rounded-xl mr-4 ring-1 ring-blue-200/70">
                <FileBarChart size={24} className="text-blue-600" />
              </div>
              
              {/* Título y descripción */}
              <div>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                  Informes Financieros Avanzados
                </h1>
                <p className="text-gray-600">
                  Centro de inteligencia de negocio para análisis financiero avanzado. Visualiza KPIs clave, 
                  analiza la evolución de ingresos y compara la rentabilidad entre servicios y sedes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenedor Principal */}
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
        {/* Contenido principal */}
        <FinancialReportsContainer />
      </div>
    </div>
  );
}

