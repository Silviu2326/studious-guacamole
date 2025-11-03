import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { EmailHealthDashboard } from '../components/EmailHealthDashboard';
import { SuppressionListTable } from '../components/SuppressionListTable';
import { useEmailComplianceAPI } from '../hooks/useEmailComplianceAPI';
import { Card } from '../../../components/componentsreutilizables';
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
              <div className="p-2 bg-blue-100 rounded-xl mr-4 ring-1 ring-blue-200/70">
                <Mail size={24} className="text-blue-600" />
              </div>
              
              {/* Título y descripción */}
              <div>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                  Email Deliverability & Compliance Hub
                </h1>
                <p className="text-gray-600">
                  Monitorea la salud de tus emails y asegura el cumplimiento legal
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
        <div className="space-y-6">
          {/* Información educativa */}
          <Card className="p-0 bg-white shadow-sm">
            <div className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Lightbulb className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    ¿Qué es el Email Deliverability & Compliance Hub?
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Este hub es el centro de control para garantizar que tus emails lleguen a la bandeja de entrada 
                    en lugar de a spam. Monitorea métricas críticas como tasas de rebote, quejas de spam y bajas de 
                    suscripción. Gestiona listas de supresión automáticamente, limpia direcciones inválidas y mantén 
                    un registro de consentimientos para cumplir con normativas como GDPR. Protege tu reputación como 
                    remitente y maximiza el impacto de tus comunicaciones con clientes.
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Tabs de navegación */}
          <Card className="p-0 bg-white shadow-sm">
            <div className="px-4 py-3">
              <div
                role="tablist"
                aria-label="Secciones"
                className="flex items-center gap-2 rounded-2xl bg-slate-100 p-1"
              >
                <button
                  onClick={() => setActiveTab('health')}
                  className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all ${
                    activeTab === 'health'
                      ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
                  }`}
                >
                  <Shield size={18} className={activeTab === 'health' ? 'opacity-100' : 'opacity-70'} />
                  <span>Salud de Email</span>
                </button>
                <button
                  onClick={() => setActiveTab('suppression')}
                  className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all ${
                    activeTab === 'suppression'
                      ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
                  }`}
                >
                  <List size={18} className={activeTab === 'suppression' ? 'opacity-100' : 'opacity-70'} />
                  <span>Lista de Supresión</span>
                </button>
                <button
                  onClick={() => setActiveTab('compliance')}
                  className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all ${
                    activeTab === 'compliance'
                      ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
                  }`}
                >
                  <Shield size={18} className={activeTab === 'compliance' ? 'opacity-100' : 'opacity-70'} />
                  <span>Cumplimiento GDPR</span>
                </button>
              </div>
            </div>
          </Card>

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
                <Card className="p-8 text-center bg-white shadow-sm">
                  <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
                  <p className="text-gray-600">Cargando...</p>
                </Card>
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
            <Card className="p-6 bg-white shadow-sm">
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
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmailDeliverabilityYComplianceHubPage;


