import React from 'react';
import { useAuth } from '../../../context/AuthContext';
import { UgcHubContainer } from '../components/UgcHubContainer';
import { Image, Shield, CheckCircle, Users } from 'lucide-react';

/**
 * Página principal del Hub de Contenidos & UGC
 * 
 * Permite a los entrenadores gestionar todo el contenido generado por clientes,
 * moderar, solicitar permisos y organizar su prueba social.
 */
export const HubDeContenidosYUgcPage: React.FC = () => {
  const { user } = useAuth();

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
                  <Image size={24} className="text-blue-600" />
                </div>
                
                {/* Título y descripción */}
                <div>
                  <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                    Hub de Contenidos & UGC
                  </h1>
                  <p className="text-gray-600 mt-1">
                    Gestiona, modera y organiza el contenido generado por tus clientes
                  </p>
                </div>
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
              <CheckCircle className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-2">
                ¿Qué es el Hub de Contenidos & UGC?
              </h3>
              <p className="text-sm text-gray-700 leading-relaxed mb-3">
                Este hub centraliza todo el contenido generado por tus clientes: testimonios, fotos 
                de transformación y menciones en redes sociales. Aquí puedes moderar, solicitar 
                consentimientos de forma legal y organizar tu prueba social para convertirla en 
                poderosa herramientas de marketing.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Consentimiento Legal</p>
                    <p className="text-xs text-gray-600">Solicita y gestiona permisos de uso</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Image className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Moderación Centralizada</p>
                    <p className="text-xs text-gray-600">Aprueba o rechaza contenido fácilmente</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Users className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Sincronización Automática</p>
                    <p className="text-xs text-gray-600">Importa desde redes sociales</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Container de UGC */}
        <UgcHubContainer trainerId={user?.id || 'user-123'} />
      </div>
    </div>
  );
};

export default HubDeContenidosYUgcPage;

