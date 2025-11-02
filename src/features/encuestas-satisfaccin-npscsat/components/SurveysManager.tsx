import React, { useState, useEffect } from 'react';
import { Card, Button, Table, ConfirmModal } from '../../../components/componentsreutilizables';
import { getSurveys, deleteSurvey, sendSurvey, createSurvey, updateSurvey } from '../api';
import { Survey } from '../types';
import { Plus, Send, Edit, Trash2, FileText } from 'lucide-react';
import { SurveyBuilder } from './SurveyBuilder';

export const SurveysManager: React.FC = () => {
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

  const handleDelete = async (survey: Survey) => {
    try {
      await deleteSurvey(survey.id);
      await loadSurveys();
      setDeleteConfirm({ survey: null });
    } catch (error) {
      console.error('Error eliminando encuesta:', error);
    }
  };

  const handleSend = async (survey: Survey) => {
    try {
      // En producción, esto pediría seleccionar clientes
      const clientIds = ['c1', 'c2', 'c3'];
      await sendSurvey(survey.id, clientIds);
      alert('Encuesta enviada exitosamente');
    } catch (error) {
      console.error('Error enviando encuesta:', error);
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

  const tableColumns = [
    {
      key: 'title',
      label: 'Encuesta',
      render: (value: string, row: Survey) => (
        <div>
          <span className="text-sm font-semibold text-gray-900">
            {value}
          </span>
          {row.description && (
            <p className="text-sm text-gray-600">
              {row.description}
            </p>
          )}
        </div>
      ),
    },
    {
      key: 'type',
      label: 'Tipo',
      render: (value: string) => {
        const colorClass = value === 'nps' 
          ? 'bg-blue-100 text-blue-800' 
          : 'bg-slate-100 text-slate-800';
        return (
          <span className={`px-2 py-1 rounded-md text-xs font-medium ${colorClass}`}>
            {value.toUpperCase()}
          </span>
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
      key: 'automation',
      label: 'Automatización',
      render: (_: any, row: Survey) => (
        <span className={`text-sm ${row.automation?.enabled ? 'text-green-600' : 'text-gray-500'}`}>
          {row.automation?.enabled ? 'Activa' : 'Inactiva'}
        </span>
      ),
    },
    {
      key: 'actions',
      label: 'Acciones',
      render: (_: any, row: Survey) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleSend(row)}
            className="p-2 rounded-lg bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400 hover:opacity-80 transition"
            title="Enviar"
          >
            <Send className="w-4 h-4" />
          </button>
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
          Nueva Encuesta
        </Button>
      </div>

      <Card className="p-4 bg-white shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-blue-100 rounded-xl ring-1 ring-blue-200/70">
            <FileText size={24} className="text-blue-600" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">
              Gestión de Encuestas
            </h3>
            <p className="text-sm text-gray-600">
              Crea y gestiona tus encuestas de satisfacción
            </p>
          </div>
        </div>

        <Table
          data={surveys}
          columns={tableColumns}
          loading={loading}
          emptyMessage="No hay encuestas creadas"
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

