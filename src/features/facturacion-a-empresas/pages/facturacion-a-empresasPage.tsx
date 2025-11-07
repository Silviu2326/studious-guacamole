import React from 'react';
import { FacturacionB2BDashboard } from '../components';
import { Building2 } from 'lucide-react';

const FacturacionAEmpresasPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6">
          <div className="py-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-xl mr-4 ring-1 ring-blue-200/70">
                <Building2 size={24} className="text-blue-600" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                  Facturación a Empresas
                </h1>
                <p className="text-gray-600">
                  Gestión integral de facturación B2B y cuentas corporativas
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
        <FacturacionB2BDashboard />
      </div>
    </div>
  );
};

export default FacturacionAEmpresasPage;

