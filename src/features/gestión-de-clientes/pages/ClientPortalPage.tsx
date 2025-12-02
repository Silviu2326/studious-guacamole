import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { Card } from '../../../components/componentsreutilizables';
import {
  ClientObjectivesPanel,
  ClientReservationsPanel,
  ClientFeedbackPanel,
} from '../components';
import { 
  Target, 
  Calendar, 
  MessageSquare, 
  User,
  Loader2
} from 'lucide-react';
import { getClientById } from '../api/clients';

/**
 * Página del Portal del Cliente
 * 
 * Permite a los clientes:
 * - Gestionar sus objetivos
 * - Ver y gestionar sus reservas
 * - Enviar feedback sobre sesiones
 */
export default function ClientPortalPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'objectives' | 'reservations' | 'feedback'>('objectives');
  const [clientId, setClientId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // En un escenario real, el clientId vendría del contexto del cliente autenticado
    // Por ahora, usamos el userId del usuario autenticado o un cliente por defecto
    const loadClientId = async () => {
      try {
        // Simular obtención del ID del cliente desde el contexto
        // En producción, esto vendría de la autenticación del cliente
        if (user?.id) {
          // Por ahora, usamos el primer cliente disponible como ejemplo
          // En producción, esto se obtendría del contexto de autenticación del cliente
          setClientId('client_1'); // Esto debería venir del contexto de autenticación
        }
      } catch (error) {
        console.error('Error cargando cliente:', error);
      } finally {
        setLoading(false);
      }
    };
    loadClientId();
  }, [user]);

  const tabs = [
    {
      id: 'objectives' as const,
      label: 'Objetivos',
      icon: Target,
      description: 'Gestiona tus objetivos y sigue tu progreso',
    },
    {
      id: 'reservations' as const,
      label: 'Reservas',
      icon: Calendar,
      description: 'Ver y gestionar tus reservas',
    },
    {
      id: 'feedback' as const,
      label: 'Feedback',
      icon: MessageSquare,
      description: 'Comparte tu opinión sobre las sesiones',
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 p-6">
        <Card className="p-8 text-center bg-white shadow-sm">
          <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
          <p className="text-gray-600">Cargando portal del cliente...</p>
        </Card>
      </div>
    );
  }

  if (!clientId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 p-6">
        <Card className="p-8 text-center bg-white shadow-sm">
          <User size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No se pudo cargar el portal
          </h3>
          <p className="text-gray-600">
            Por favor, inicia sesión como cliente para acceder al portal.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <Card className="bg-white shadow-sm">
          <div className="p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Portal del Cliente
            </h1>
            <p className="text-gray-600">
              Gestiona tus objetivos, reservas y comparte tu feedback
            </p>
          </div>
        </Card>

        {/* Tabs */}
        <Card className="p-0 bg-white shadow-sm">
          <div className="px-4 py-3">
            <div
              role="tablist"
              aria-label="Secciones del portal"
              className="flex items-center gap-2 rounded-2xl bg-slate-100 p-1"
            >
              {tabs.map(({ id, label, icon: Icon }) => {
                const activo = activeTab === id;
                return (
                  <button
                    key={id}
                    role="tab"
                    aria-selected={activo}
                    onClick={() => setActiveTab(id)}
                    className={[
                      'inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all',
                      activo
                        ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
                    ].join(' ')}
                  >
                    <Icon
                      size={18}
                      className={activo ? 'opacity-100' : 'opacity-70'}
                    />
                    <span>{label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </Card>

        {/* Content */}
        <div className="mt-6">
          {activeTab === 'objectives' && (
            <ClientObjectivesPanel clientId={clientId} />
          )}
          {activeTab === 'reservations' && (
            <ClientReservationsPanel clientId={clientId} />
          )}
          {activeTab === 'feedback' && (
            <ClientFeedbackPanel clientId={clientId} />
          )}
        </div>
      </div>
    </div>
  );
}

