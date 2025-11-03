import React from 'react';
import { useAuth } from '../../../context/AuthContext';
import { SequenceListContainer } from '../components/SequenceListContainer';
import { Mail, Zap, Target, Clock } from 'lucide-react';

export const LifecycleEmailSequencesPage: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-xl mr-4 ring-1 ring-purple-200/70">
                  <Mail size={24} className="text-purple-600" />
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                    Lifecycle Email Sequences
                  </h1>
                  <p className="text-gray-600 mt-1">
                    Automatiza la comunicación con tus clientes
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
        <div className="mb-6 bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-6">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Zap className="w-5 h-5 text-purple-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-2">
                ¿Qué son las Lifecycle Email Sequences?
              </h3>
              <p className="text-sm text-gray-700 leading-relaxed mb-3">
                Las secuencias de emails automáticos te permiten mantener a tus clientes 
                comprometidos sin esfuerzo manual. Configura flujos que se activan 
                automáticamente según eventos del ciclo de vida de tus clientes.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div className="flex items-start gap-3">
                  <Target className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Onboarding Automático</p>
                    <p className="text-xs text-gray-600">Bienvenidas para nuevos clientes</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Reactivación</p>
                    <p className="text-xs text-gray-600">Recupera clientes inactivos</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Felicitaciones</p>
                    <p className="text-xs text-gray-600">Celebra los logros de tus clientes</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <SequenceListContainer />
      </div>
    </div>
  );
};

export default LifecycleEmailSequencesPage;

