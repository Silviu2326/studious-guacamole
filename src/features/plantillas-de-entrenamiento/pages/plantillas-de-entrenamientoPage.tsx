import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { Card, MetricCards } from '../../../components/componentsreutilizables';
import { TemplateLibraryContainer, TemplateEditorModal, TemplateAnalytics } from '../components';
import { createTemplate, updateTemplate } from '../api';
import { Template } from '../types';
import { FileText, Plus, BarChart3 } from 'lucide-react';

export default function PlantillasDeEntrenamientoPage() {
  const { user } = useAuth();
  const isEntrenador = user?.role === 'entrenador';
  const [tabActiva, setTabActiva] = useState<string>('biblioteca');
  const [mostrarEditor, setMostrarEditor] = useState(false);
  const [plantillaEditando, setPlantillaEditando] = useState<Template | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const tabItems = [
    {
      id: 'biblioteca',
      label: 'Biblioteca',
      icon: FileText,
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: BarChart3,
    },
  ];

  const metricas = [
    {
      id: '1',
      title: 'Plantillas Activas',
      value: '6',
      icon: <FileText className="w-5 h-5" />,
      trend: {
        value: 12.5,
        direction: 'up' as const,
      },
      color: 'info' as const,
    },
    {
      id: '2',
      title: 'Plantillas Más Asignadas',
      value: '45',
      icon: <BarChart3 className="w-5 h-5" />,
      trend: {
        value: 8.3,
        direction: 'up' as const,
      },
      color: 'success' as const,
    },
    {
      id: '3',
      title: 'Total Asignaciones',
      value: '146',
      icon: <Plus className="w-5 h-5" />,
      trend: {
        value: 18.7,
        direction: 'up' as const,
      },
      color: 'primary' as const,
    },
    {
      id: '4',
      title: 'Promedio por Plantilla',
      value: '24.3',
      icon: <FileText className="w-5 h-5" />,
      trend: {
        value: 5.2,
        direction: 'up' as const,
      },
      color: 'warning' as const,
    },
  ];

  const handleCrear = () => {
    setPlantillaEditando(null);
    setMostrarEditor(true);
  };

  const handleEditar = (plantilla: Template) => {
    setPlantillaEditando(plantilla);
    setMostrarEditor(true);
  };

  const handleGuardar = async (templateData: Omit<Template, 'id' | 'assignmentCount' | 'createdAt' | 'updatedAt'>) => {
    try {
      if (plantillaEditando) {
        await updateTemplate(plantillaEditando.id, templateData);
      } else {
        await createTemplate(templateData);
      }
      setMostrarEditor(false);
      setPlantillaEditando(null);
      // Forzar actualización de la biblioteca
      setRefreshKey(prev => prev + 1);
    } catch (error) {
      console.error('Error guardando plantilla:', error);
      alert('Error al guardar la plantilla');
    }
  };

  const handleCerrarEditor = () => {
    setMostrarEditor(false);
    setPlantillaEditando(null);
  };

  const renderTabContent = () => {
    switch (tabActiva) {
      case 'biblioteca':
        return (
          <TemplateLibraryContainer
            onEdit={handleEditar}
            onCreate={handleCrear}
            refreshKey={refreshKey}
          />
        );
      case 'analytics':
        return <TemplateAnalytics />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6">
          <div className="py-6">
            <div className="flex items-center">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-xl mr-4 ring-1 ring-blue-200/70">
                  <FileText size={24} className="text-blue-600" />
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                    Plantillas de Entrenamiento
                  </h1>
                  <p className="text-gray-600">
                    Crea y gestiona plantillas de entrenamiento reutilizables para asignar a tus clientes
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
        <div className="space-y-6">
          {/* Métricas */}
          <MetricCards data={metricas} />

          {/* Tabs */}
          <Card className="p-0 bg-white shadow-sm">
            <div className="px-4 py-3">
              <div
                role="tablist"
                aria-label="Secciones"
                className="flex items-center gap-2 rounded-2xl bg-slate-100 p-1"
              >
                {tabItems.map(({ id, label, icon: Icon }) => {
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

          {/* Contenido de la pestaña activa */}
          <div className="mt-6">
            {renderTabContent()}
          </div>
        </div>
      </div>

      {/* Modal Editor */}
      <TemplateEditorModal
        isOpen={mostrarEditor}
        onClose={handleCerrarEditor}
        initialData={plantillaEditando}
        onSave={handleGuardar}
      />
    </div>
  );
}

