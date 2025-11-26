import React from 'react';
import { TemplateManagerContainer } from '../components';
import { FileText } from 'lucide-react';

/**
 * Página principal de Plantillas de Mensajes y Contratos
 * 
 * Sistema completo de gestión de plantillas para gimnasios y entrenadores.
 * Funcionalidades principales:
 * - Creación y edición de plantillas de Email, SMS y Contratos
 * - Variables dinámicas para personalización
 * - Firma digital para contratos
 * - Organización y filtrado
 * - Duplicación y eliminación
 */
const PlantillasDeMensajesYContratosPage: React.FC = () => {
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
                  Plantillas de Mensajes y Contratos
                </h1>
                <p className="text-gray-600">
                  Gestiona tus plantillas de comunicación automatizada. Crea emails de bienvenida, 
                  recordatorios SMS, contratos con firma digital y más.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenedor principal */}
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
        <TemplateManagerContainer />
      </div>
    </div>
  );
};

export default PlantillasDeMensajesYContratosPage;

