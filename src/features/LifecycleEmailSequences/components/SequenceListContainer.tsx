import React, { useState, useEffect } from 'react';
import { Card } from '../../../components/componentsreutilizables';
import { SequenceCard } from './SequenceCard';
import { getSequences, updateSequence, deleteSequence, EmailSequence } from '../api/sequences';
import { Plus, Mail, AlertCircle, Loader, PlayCircle } from 'lucide-react';

export const SequenceListContainer: React.FC = () => {
  const [sequences, setSequences] = useState<EmailSequence[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadSequences();
  }, []);

  const loadSequences = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await getSequences();
      setSequences(response.data);
    } catch (err: any) {
      setError(err.message || 'Error al cargar las secuencias');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggle = async (id: string) => {
    const sequence = sequences.find(s => s.id === id);
    if (!sequence) return;

    try {
      await updateSequence(id, { isActive: !sequence.isActive });
      setSequences(prev =>
        prev.map(s => (s.id === id ? { ...s, isActive: !s.isActive } : s))
      );
    } catch (err: any) {
      alert('Error al actualizar la secuencia: ' + err.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar esta secuencia?')) {
      return;
    }

    try {
      await deleteSequence(id);
      setSequences(prev => prev.filter(s => s.id !== id));
    } catch (err: any) {
      alert('Error al eliminar: ' + err.message);
    }
  };

  const handleEdit = (id: string) => {
    alert('Funcionalidad de edición en desarrollo');
  };

  const handleViewStats = (id: string) => {
    alert('Funcionalidad de estadísticas en desarrollo');
  };

  return (
    <div className="space-y-6">
      {/* Actions Bar */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Tus Secuencias</h2>
          <p className="text-gray-600 mt-1">
            {sequences.length} secuencia{sequences.length !== 1 ? 's' : ''} configurada{sequences.length !== 1 ? 's' : ''}
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition">
          <Plus className="w-4 h-4" />
          Nueva Secuencia
        </button>
      </div>

      {/* Sequences Grid */}
      {error ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <p className="text-red-600 font-medium">{error}</p>
          </div>
        </div>
      ) : isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg border border-gray-200 overflow-hidden animate-pulse">
              <div className="h-6 bg-gray-200"></div>
              <div className="p-4 space-y-3">
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-20 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      ) : sequences.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No hay secuencias configuradas
            </h3>
            <p className="text-gray-600 mb-6">
              Crea tu primera secuencia automática de emails para mantener a tus clientes comprometidos
            </p>
            <button className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition">
              Crear Primera Secuencia
            </button>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sequences.map((sequence) => (
            <SequenceCard
              key={sequence.id}
              sequence={sequence}
              onToggle={handleToggle}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onViewStats={handleViewStats}
            />
          ))}
        </div>
      )}
    </div>
  );
};

