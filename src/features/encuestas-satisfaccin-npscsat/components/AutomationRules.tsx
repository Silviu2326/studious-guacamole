import React, { useState, useEffect } from 'react';
import { Card, Button, Table, ConfirmModal } from '../../../components/componentsreutilizables';
import { getSurveys, updateSurvey, createSurvey, deleteSurvey } from '../api';
import { Survey } from '../types';
import { Settings, Play, Pause, Trash2, Plus, Edit } from 'lucide-react';
import { SurveyBuilder } from './SurveyBuilder';

export const AutomationRules: React.FC = () => {
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [loading, setLoading] = useState(true);
  const [showBuilder, setShowBuilder] = useState(false);
  const [editingSurvey, setEditingSurvey] = useState<Survey | undefined>();
  const [deleteConfirm, setDeleteConfirm] = useState<{ survey: Survey | null }>({ survey: null });

  useEffect(() => {
    loadSurveys();
  }, []);

  const loadSurveys = async () => {
    setLoading(true);
    try {
      const data = await getSurveys();
      setSurveys(data);
    } catch (error) {
      console.error('Error cargando encuestas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleAutomation = async (survey: Survey) => {
    try {
      const updated = await updateSurvey(survey.id, {
        ...survey,
        automation: survey.automation
          ? { ...survey.automation, enabled: !survey.automation.enabled }
          : undefined,
      });
      setSurveys(surveys.map((s) => (s.id === survey.id ? updated : s)));
    } catch (error) {
      console.error('Error actualizando automatización:', error);
    }
  };

  const handleDelete = async (survey: Survey) => {
    try {
      await deleteSurvey(survey.id);
      await loadSurveys();
      setDeleteConfirm({ survey: null });
    } catch (error) {
      console.error('Error eliminando encuesta:', error);
    }
  };

  const handleSave = async (surveyData: Omit<Survey, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      if (editingSurvey) {
        await updateSurvey(editingSurvey.id, surveyData);
      } else {
        await createSurvey(surveyData);
      }
      await loadSurveys();
      setShowBuilder(false);
      setEditingSurvey(undefined);
    } catch (error) {
      console.error('Error guardando encuesta:', error);
    }
  };

  const getTriggerLabel = (trigger: string) => {
    const labels: Record<string, string> = {
      manual: 'Manual',
      class_attendance: 'Después de asistir a clase',
      service_use: 'Después de usar servicio',
      periodic: 'Periódica',
    };
    return labels[trigger] || trigger;
  };

  const tableColumns = [
    {
      key: 'title',
      label: 'Encuesta',
      render: (value: string, row: Survey) => (
        <div>
          <span className="text-sm font-semibold text-gray-900">
            {value}
          </span>
          <p className="text-sm text-gray-600">
            {row.type.toUpperCase()} {row.area ? `- ${row.area}` : ''}
          </p>
        </div>
      ),
    },
    {
      key: 'automation',
      label: 'Automatización',
      render: (_: any, row: Survey) => {
        if (!row.automation) {
          return (
            <span className="text-sm text-gray-500">
              Sin automatización
            </span>
          );
        }
        return (
          <div>
            <span className="text-sm text-gray-900">
              {getTriggerLabel(row.automation.trigger)}
            </span>
            {row.automation.delay && (
              <p className="text-xs text-gray-500">
                Retraso: {row.automation.delay}h
              </p>
            )}
          </div>
        );
      },
    },
    {
      key: 'status',
      label: 'Estado',
      render: (value: string) => {
        const colorClasses: Record<string, string> = {
          active: 'bg-green-100 text-green-800',
          paused: 'bg-yellow-100 text-yellow-800',
          draft: 'bg-slate-100 text-slate-800',
          archived: 'bg-red-100 text-red-800',
        };
        return (
          <span className={`px-2 py-1 rounded-md text-xs font-medium ${colorClasses[value] || 'bg-gray-100 text-gray-800'}`}>
            {value}
          </span>
        );
      },
    },
    {
      key: 'actions',
      label: 'Acciones',
      render: (_: any, row: Survey) => (
        <div className="flex items-center gap-2">
          {row.automation && (
            <button
              onClick={() => handleToggleAutomation(row)}
              className={`p-2 rounded-lg ${
                row.automation.enabled
                  ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-400'
                  : 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400'
              } hover:opacity-80 transition`}
              title={row.automation.enabled ? 'Pausar' : 'Activar'}
            >
              {row.automation.enabled ? (
                <Pause className="w-4 h-4" />
              ) : (
                <Play className="w-4 h-4" />
              )}
            </button>
          )}
          <button
            onClick={() => {
              setEditingSurvey(row);
              setShowBuilder(true);
            }}
            className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 hover:opacity-80 transition"
            title="Editar"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => setDeleteConfirm({ survey: row })}
            className="p-2 rounded-lg bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400 hover:opacity-80 transition"
            title="Eliminar"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Toolbar superior */}
      <div className="flex items-center justify-end">
        <Button
          variant="primary"
          size="md"
          onClick={() => {
            setEditingSurvey(undefined);
            setShowBuilder(true);
          }}
        >
          <Plus size={20} className="mr-2" />
          Nueva Regla
        </Button>
      </div>

      <Card className="p-4 bg-white shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-blue-100 rounded-xl ring-1 ring-blue-200/70">
            <Settings size={24} className="text-blue-600" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">
              Reglas de Automatización
            </h3>
            <p className="text-sm text-gray-600">
              Gestiona las reglas de envío automático de encuestas
            </p>
          </div>
        </div>

        <Table
          data={surveys}
          columns={tableColumns}
          loading={loading}
          emptyMessage="No hay reglas de automatización configuradas"
        />
      </Card>

      {showBuilder && (
        <SurveyBuilder
          survey={editingSurvey}
          onSave={handleSave}
          onCancel={() => {
            setShowBuilder(false);
            setEditingSurvey(undefined);
          }}
        />
      )}

      <ConfirmModal
        isOpen={!!deleteConfirm.survey}
        onClose={() => setDeleteConfirm({ survey: null })}
        onConfirm={() => deleteConfirm.survey && handleDelete(deleteConfirm.survey)}
        title="Eliminar Encuesta"
        message={`¿Estás seguro de que quieres eliminar la encuesta "${deleteConfirm.survey?.title}"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        variant="destructive"
      />
    </div>
  );
};

