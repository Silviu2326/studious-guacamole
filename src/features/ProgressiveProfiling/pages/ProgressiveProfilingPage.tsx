import React, { useState, useEffect } from 'react';
import { Layout } from '../../../components/layout';
import { ProfilingSequenceBuilder } from '../components/ProfilingSequenceBuilder';
import { SequenceAnalyticsCard } from '../components/SequenceAnalyticsCard';
import {
  getProfilingSequences,
  createProfilingSequence,
  updateProfilingSequence,
  getSequenceStats,
  ProfilingSequence,
  SequenceStats,
  getStatusLabel,
  getStatusColor
} from '../api/profiling';
import { Plus, List, BarChart3, Settings, AlertCircle, Eye, Edit, Trash2 } from 'lucide-react';

export default function ProgressiveProfilingPage() {
  const [sequences, setSequences] = useState<ProfilingSequence[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<'list' | 'create' | 'edit' | 'analytics'>('list');
  const [selectedSequence, setSelectedSequence] = useState<ProfilingSequence | null>(null);
  const [stats, setStats] = useState<SequenceStats | null>(null);

  useEffect(() => {
    loadSequences();
  }, []);

  const loadSequences = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await getProfilingSequences();
      setSequences(data);
    } catch (err: any) {
      setError(err.message || 'Error al cargar las secuencias');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateSequence = () => {
    setSelectedSequence(null);
    setActiveView('create');
  };

  const handleEditSequence = (sequence: ProfilingSequence) => {
    setSelectedSequence(sequence);
    setActiveView('edit');
  };

  const handleViewAnalytics = async (sequence: ProfilingSequence) => {
    setSelectedSequence(sequence);
    try {
      const data = await getSequenceStats(sequence.id);
      setStats(data);
      setActiveView('analytics');
    } catch (err: any) {
      alert('Error al cargar estadísticas: ' + err.message);
    }
  };

  const handleSaveSequence = async (sequence: ProfilingSequence) => {
    try {
      if (sequence.id && sequences.find(s => s.id === sequence.id)) {
        await updateProfilingSequence(sequence.id, sequence);
      } else {
        await createProfilingSequence(sequence.name, sequence.questions);
      }
      await loadSequences();
      setActiveView('list');
      setSelectedSequence(null);
    } catch (err: any) {
      alert('Error al guardar: ' + err.message);
    }
  };

  const handleDeleteSequence = async (sequenceId: string) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar esta secuencia?')) {
      return;
    }

    try {
      // En producción, llamar a API de eliminación
      await loadSequences();
    } catch (err: any) {
      alert('Error al eliminar: ' + err.message);
    }
  };

  const goBackToList = () => {
    setActiveView('list');
    setSelectedSequence(null);
    setStats(null);
  };

  if (error && sequences.length === 0) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <p className="text-red-600 font-medium">{error}</p>
          </div>
        </div>
      </Layout>
    );
  }

  // Create/Edit View
  if (activeView === 'create' || activeView === 'edit') {
    return (
      <Layout>
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <button
              onClick={goBackToList}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
            >
              ← Volver
            </button>
            <h1 className="text-3xl font-bold text-gray-900">
              {activeView === 'create' ? 'Nueva Secuencia' : 'Editar Secuencia'}
            </h1>
          </div>
          <ProfilingSequenceBuilder
            sequenceId={selectedSequence?.id || null}
            onSave={handleSaveSequence}
            onCancel={goBackToList}
          />
        </div>
      </Layout>
    );
  }

  // Analytics View
  if (activeView === 'analytics' && stats) {
    return (
      <Layout>
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <button
              onClick={goBackToList}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
            >
              ← Volver
            </button>
            <h1 className="text-3xl font-bold text-gray-900">
              Analíticas: {selectedSequence?.name}
            </h1>
          </div>
          <SequenceAnalyticsCard stats={stats} />
        </div>
      </Layout>
    );
  }

  // List View
  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Progressive Profiling</h1>
            <p className="text-gray-600 mt-2">
              Crea secuencias de perfilado progresivo para enriquecer tus leads
            </p>
          </div>
          <button
            onClick={handleCreateSequence}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
          >
            <Plus className="w-5 h-5" />
            Nueva Secuencia
          </button>
        </div>

        {/* Sequences List */}
        {isLoading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          </div>
        ) : sequences.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <List className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay secuencias</h3>
            <p className="text-gray-600 mb-6">Crea tu primera secuencia de perfilado progresivo</p>
            <button
              onClick={handleCreateSequence}
              className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
            >
              <Plus className="w-5 h-5" />
              Crear Secuencia
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sequences.map((sequence) => (
              <div
                key={sequence.id}
                className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 mb-1">{sequence.name}</h3>
                    <span className={`inline-block text-xs font-medium px-2 py-1 rounded ${getStatusColor(sequence.status)}`}>
                      {getStatusLabel(sequence.status)}
                    </span>
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Preguntas</span>
                    <span className="font-semibold text-gray-900">{sequence.questionCount || 0}</span>
                  </div>
                  {sequence.completionRate !== undefined && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Tasa de finalización</span>
                      <span className="font-semibold text-green-600">{sequence.completionRate.toFixed(1)}%</span>
                    </div>
                  )}
                </div>

                <div className="flex gap-2 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => handleViewAnalytics(sequence)}
                    className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                  >
                    <BarChart3 className="w-4 h-4" />
                    Analíticas
                  </button>
                  <button
                    onClick={() => handleEditSequence(sequence)}
                    className="flex items-center justify-center px-3 py-2 text-sm text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteSequence(sequence.id)}
                    className="flex items-center justify-center px-3 py-2 text-sm text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}

