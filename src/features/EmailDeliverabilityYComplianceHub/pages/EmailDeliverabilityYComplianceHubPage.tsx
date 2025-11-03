import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { EmailHealthDashboard } from '../components/EmailHealthDashboard';
import { SuppressionListTable } from '../components/SuppressionListTable';
import { useEmailComplianceAPI } from '../hooks/useEmailComplianceAPI';
import { Mail, Shield, List, Lightbulb, Loader2 } from 'lucide-react';

type TabType = 'health' | 'suppression' | 'compliance';

/**
 * Página principal de Email Deliverability & Compliance Hub
 * 
 * Permite a los entrenadores monitorear la salud de sus listas de email,
 * gestionar listas de supresión y cumplir con normativas como GDPR.
 */
export const EmailDeliverabilityYComplianceHubPage: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('health');

  const {
    suppressionList,
    addSuppressedEmail,
    removeSuppressedEmail,
    isLoading
  } = useEmailComplianceAPI({
    trainerId: user?.id || 'user-123'
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6">
          <div className="py-6">
            <div className="flex items-center">
              {/* Icono con contenedor */}
              <div className="p-2 bg-purple-100 rounded-xl mr-4 ring-1 ring-purple-200/70">
                <Mail size={24} className="text-purple-600" />
              </div>
              
              {/* Título y descripción */}
              <div>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                  Email Deliverability & Compliance Hub
                </h1>
                <p className="text-gray-600 mt-1">
                  Monitorea la salud de tus emails y asegura el cumplimiento legal
                </p>
              </div>
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
              <Lightbulb className="w-5 h-5 text-purple-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-2">
                ¿Qué es el Email Deliverability & Compliance Hub?
              </h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                Este hub es el centro de control para garantizar que tus emails lleguen a la bandeja de entrada 
                en lugar de a spam. Monitorea métricas críticas como tasas de rebote, quejas de spam y bajas de 
                suscripción. Gestiona listas de supresión automáticamente, limpia direcciones inválidas y mantén 
                un registro de consentimientos para cumplir con normativas como GDPR. Protege tu reputación como 
                remitente y maximiza el impacto de tus comunicaciones con clientes.
              </p>
            </div>
          </div>
        </div>

        {/* Tabs de navegación */}
        <div className="mb-6 border-b border-gray-200">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('health')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'health'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Salud de Email
              </div>
            </button>
            <button
              onClick={() => setActiveTab('suppression')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'suppression'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <List className="w-4 h-4" />
                Lista de Supresión
              </div>
            </button>
            <button
              onClick={() => setActiveTab('compliance')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'compliance'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Cumplimiento GDPR
              </div>
            </button>
          </nav>
        </div>

        {/* Contenido de las tabs */}
        {activeTab === 'health' && (
          <EmailHealthDashboard trainerId={user?.id || 'user-123'} />
        )}

        {activeTab === 'suppression' && (
          <div>
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Lista de Supresión</h2>
              <p className="text-sm text-gray-600">
                Emails que no recibirán más comunicaciones. Se actualiza automáticamente cuando hay rebotes, 
                quejas de spam o bajas de suscripción.
              </p>
            </div>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
              </div>
            ) : (
              <SuppressionListTable
                trainerId={user?.id || 'user-123'}
                suppressedEmails={suppressionList?.data || []}
                onAddEmail={addSuppressedEmail}
                onRemoveEmail={removeSuppressedEmail}
                isLoading={isLoading}
              />
            )}
          </div>
        )}

        {activeTab === 'compliance' && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Cumplimiento GDPR</h2>
            <p className="text-sm text-gray-600 mb-4">
              Registro de consentimientos para cumplimiento de normativas de protección de datos.
            </p>
            <div className="bg-gray-50 rounded-lg p-6 text-center">
              <Shield className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600">
                Esta funcionalidad se implementará próximamente. Incluirá registro de consentimientos, 
                exportación de datos para auditorías y gestión de solicitudes de eliminación de datos.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmailDeliverabilityYComplianceHubPage;


