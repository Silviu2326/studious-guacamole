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
import { Plus, List, BarChart3, Settings, AlertCircle, Eye, Edit, Trash2, Loader2, UserCog, ArrowLeft } from 'lucide-react';
import { Card, Button } from '../../../components/componentsreutilizables';

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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
          <Card className="p-8 text-center bg-white shadow-sm">
            <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Error al cargar</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={loadSequences}>Reintentar</Button>
          </Card>
        </div>
      </div>
    );
  }

  // Create/Edit View
  if (activeView === 'create' || activeView === 'edit') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={goBackToList}
                leftIcon={<ArrowLeft size={16} />}
              >
                Volver
              </Button>
            </div>
            <ProfilingSequenceBuilder
              sequenceId={selectedSequence?.id || null}
              onSave={handleSaveSequence}
              onCancel={goBackToList}
            />
          </div>
        </div>
      </div>
    );
  }

  // Analytics View
  if (activeView === 'analytics' && stats) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        {/* Header */}
        <div className="border-b border-gray-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
          <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6">
            <div className="py-6">
              <div className="flex items-center">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={goBackToList}
                  className="mr-4"
                  leftIcon={<ArrowLeft size={16} />}
                >
                  Volver
                </Button>
                <div className="p-2 bg-blue-100 rounded-xl mr-4 ring-1 ring-blue-200/70">
                  <BarChart3 size={24} className="text-blue-600" />
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                    Analíticas: {selectedSequence?.name}
                  </h1>
                  <p className="text-gray-600">
                    Métricas y estadísticas de rendimiento de la secuencia
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Contenido Principal */}
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
          <SequenceAnalyticsCard stats={stats} />
        </div>
      </div>
    );
  }

  // List View
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
                  <UserCog size={24} className="text-blue-600" />
                </div>
                
                {/* Título y descripción */}
                <div>
                  <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                    Progressive Profiling
                  </h1>
                  <p className="text-gray-600">
                    Crea secuencias de perfilado progresivo para enriquecer tus leads
                  </p>
                </div>
              </div>
              
              {/* Botón de acción principal */}
              <Button
                variant="primary"
                onClick={handleCreateSequence}
                leftIcon={<Plus size={20} />}
              >
                Nueva Secuencia
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Contenedor Principal */}
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
        <div className="space-y-6">
          {/* Sequences List */}
          {isLoading ? (
            <Card className="p-8 text-center bg-white shadow-sm">
              <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
              <p className="text-gray-600">Cargando...</p>
            </Card>
          ) : sequences.length === 0 ? (
            <Card className="p-8 text-center bg-white shadow-sm">
              <List size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay secuencias</h3>
              <p className="text-gray-600 mb-4">Crea tu primera secuencia de perfilado progresivo</p>
              <Button
                variant="primary"
                onClick={handleCreateSequence}
                leftIcon={<Plus size={20} />}
              >
                Crear Secuencia
              </Button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sequences.map((sequence) => (
                <Card
                  key={sequence.id}
                  variant="hover"
                  className="h-full flex flex-col transition-shadow overflow-hidden"
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

                  <div className="flex gap-2 mt-auto pt-3 border-t border-gray-100">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleViewAnalytics(sequence)}
                      className="flex-1"
                      leftIcon={<BarChart3 size={16} />}
                    >
                      Analíticas
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditSequence(sequence)}
                      leftIcon={<Edit size={16} />}
                    />
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteSequence(sequence.id)}
                      leftIcon={<Trash2 size={16} />}
                    />
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

