import React, { useState, useMemo } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { Card, Button } from '../../../components/componentsreutilizables';
import { ds } from '../../adherencia/ui/ds';
import {
  LandingPagesList,
  LandingPageBuilder,
  LandingPageAnalytics,
} from '../components';
import {
  FileText,
  BarChart3,
  Layout,
  Globe,
  Target,
  Plus,
} from 'lucide-react';

/**
 * Página principal de Embudos & Ofertas / Landing Pages
 * 
 * Adaptada según el rol del usuario:
 * - Entrenadores: Enfoque en páginas de venta para programas online, retos de transformación o sesiones de coaching
 * - Gimnasios: Campañas de captación a mayor escala, promociones de matrícula, ofertas 'trae un amigo', jornadas de puertas abiertas
 */
export default function EmbudosOfertasLandingPagesPage() {
  const { user } = useAuth();
  const esEntrenador = user?.role === 'entrenador';
  const esGimnasio = user?.role === 'gimnasio';
  const role = esEntrenador ? 'entrenador' : 'gimnasio';

  const [tabActiva, setTabActiva] = useState<string>('list');
  const [selectedPageId, setSelectedPageId] = useState<string | null>(null);
  const [analyticsPageId, setAnalyticsPageId] = useState<string | null>(null);
  const [showBuilder, setShowBuilder] = useState(false);
  const [editingPageId, setEditingPageId] = useState<string | null>(null);

  const tabs = useMemo(() => {
    const comunes = [
      {
        id: 'list',
        label: 'Mis Landing Pages',
        icon: FileText,
      },
      {
        id: 'analytics',
        label: 'Analíticas',
        icon: BarChart3,
      },
    ];

    if (esGimnasio) {
      comunes.push({
        id: 'templates',
        label: 'Plantillas',
        icon: Layout,
      });
    }

    return comunes;
  }, [esGimnasio]);

  const handleCreateNew = () => {
    setEditingPageId(null);
    setShowBuilder(true);
  };

  const handleEdit = (pageId: string) => {
    setEditingPageId(pageId);
    setShowBuilder(true);
    setTabActiva('list');
  };

  const handleViewAnalytics = (pageId: string) => {
    setAnalyticsPageId(pageId);
    setTabActiva('analytics');
  };

  const handleBuilderSave = () => {
    setShowBuilder(false);
    setEditingPageId(null);
    // Recargar lista de páginas si está activa
    if (tabActiva === 'list') {
      window.location.reload(); // Temporal, mejor usar un estado o refetch
    }
  };

  const renderTabContent = () => {
    if (showBuilder && editingPageId !== undefined) {
      return (
        <LandingPageBuilder
          pageId={editingPageId}
          onSave={handleBuilderSave}
          onClose={() => {
            setShowBuilder(false);
            setEditingPageId(null);
          }}
          role={role}
        />
      );
    }

    switch (tabActiva) {
      case 'list':
        return (
          <LandingPagesList
            onCreateNew={handleCreateNew}
            onEdit={handleEdit}
            onViewAnalytics={handleViewAnalytics}
            role={role}
          />
        );
      case 'analytics':
        return analyticsPageId ? (
          <LandingPageAnalytics pageId={analyticsPageId} />
        ) : (
          <Card className={`p-8 text-center ${ds.card}`}>
            <BarChart3 size={48} className={`mx-auto ${ds.color.info} mb-4`} />
            <h3 className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark} mb-2`}>Selecciona una Landing Page</h3>
            <p className={`${ds.typography.body} ${ds.color.textSecondary} ${ds.color.textSecondaryDark} mb-4`}>
              Ve a la lista de landing pages y haz clic en "Analíticas" para ver las métricas de una página.
            </p>
            <Button variant="primary" onClick={() => setTabActiva('list')}>
              Ver Lista de Páginas
            </Button>
          </Card>
        );
      case 'templates':
        return (
          <Card className={`p-8 text-center ${ds.card}`}>
            <Layout size={48} className={`mx-auto ${ds.color.textMuted} ${ds.color.textMutedDark} mb-4`} />
            <h3 className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark} mb-2`}>Biblioteca de Plantillas</h3>
            <p className={`${ds.typography.body} ${ds.color.textSecondary} ${ds.color.textSecondaryDark} mb-4`}>
              Accede a nuestra biblioteca de plantillas optimizadas para diferentes tipos de campañas.
            </p>
            <div className={`p-4 ${ds.color.border} rounded-xl ${ds.color.surface}`}>
              <p className={`${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
                La biblioteca de plantillas estará disponible próximamente.
              </p>
            </div>
          </Card>
        );
      default:
        return null;
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50`}>
      {/* Header */}
      <div className="border-b border-gray-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-xl mr-4 ring-1 ring-blue-200/70">
                  <Globe size={24} className="text-blue-600" />
                </div>
                <div>
                  <h1 className={`text-3xl md:text-4xl font-extrabold tracking-tight ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                    Embudos & Ofertas / Landing Pages
                  </h1>
                  <p className={`${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
                    {esEntrenador
                      ? 'Crea páginas de venta para tus programas online, retos de transformación o sesiones de coaching. Personaliza cada elemento para convertir visitantes en clientes.'
                      : 'Gestiona campañas de captación a mayor escala: promociones de matrícula, ofertas "trae un amigo", jornadas de puertas abiertas o lanzamiento de nuevas clases grupales. Crea landing pages optimizadas para la conversión.'}
                  </p>
                </div>
              </div>
              {!showBuilder && (
                <div className="flex items-center gap-2">
                  <Button variant="primary" size="md" onClick={handleCreateNew}>
                    <Plus size={20} className="mr-2" />
                    Crear Landing Page
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
        {/* Sistema de Tabs */}
        {!showBuilder && (
          <Card className="p-0 bg-white shadow-sm">
            <div className="px-4 py-3">
              <div
                role="tablist"
                aria-label="Secciones"
                className="flex items-center gap-2 rounded-2xl bg-slate-100 p-1"
              >
                {tabs.map(({ id, label, icon: Icon }) => {
                  const activo = tabActiva === id;
                  return (
                    <button
                      key={id}
                      role="tab"
                      aria-selected={activo}
                      onClick={() => setTabActiva(id)}
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
        )}

        {/* Información contextual según rol */}
        {!showBuilder && (
          <div className="mt-6 space-y-6">
            {esEntrenador && (
              <Card className={`p-4 ${ds.card}`}>
                <div className="flex items-start gap-3">
                  <Target size={20} className={`${ds.color.info} mt-0.5 flex-shrink-0`} />
                  <div>
                    <h4 className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark} mb-1`}>
                      Enfoque para Entrenadores Personales
                    </h4>
                    <p className={`${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
                      Utiliza landing pages para promocionar tus servicios personales. Crea páginas de venta para programas online, retos de transformación o sesiones de coaching 1-a-1. Enfócate en tu marca personal y en mostrar los resultados de tus clientes.
                    </p>
                  </div>
                </div>
              </Card>
            )}

            {esGimnasio && (
              <Card className={`p-4 ${ds.card}`}>
                <div className="flex items-start gap-3">
                  <Globe size={20} className={`${ds.color.info} mt-0.5 flex-shrink-0`} />
                  <div>
                    <h4 className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark} mb-1`}>
                      Enfoque para Gimnasios
                    </h4>
                    <p className={`${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
                      Utiliza landing pages para campañas de captación a mayor escala. Promociona ofertas de matrícula, campañas "trae un amigo", jornadas de puertas abiertas o el lanzamiento de nuevas clases grupales. Optimiza cada página para maximizar la conversión.
                    </p>
                  </div>
                </div>
              </Card>
            )}
          </div>
        )}

        {/* Contenido según tab activa */}
        <div className={showBuilder ? 'mt-6' : 'mt-6'}>
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
}

