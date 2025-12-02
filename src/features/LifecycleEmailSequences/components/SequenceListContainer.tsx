import React, { useState, useEffect } from 'react';
import { Card, Button } from '../../../components/componentsreutilizables';
import { SequenceCard } from './SequenceCard';
import { getSequences, updateSequence, deleteSequence, EmailSequence } from '../api/sequences';
import { Plus, Mail, AlertCircle, Loader2 } from 'lucide-react';

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
      {/* Toolbar Superior */}
      <div className="flex items-center justify-end">
        <Button onClick={() => alert('Funcionalidad en desarrollo')} leftIcon={<Plus size={20} />}>
          Nueva Secuencia
        </Button>
      </div>

      {/* Sequences Grid */}
      {error ? (
        <Card className="p-8 text-center bg-white shadow-sm">
          <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error al cargar</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={loadSequences}>Reintentar</Button>
        </Card>
      ) : isLoading ? (
        <Card className="p-8 text-center bg-white shadow-sm">
          <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
          <p className="text-gray-600">Cargando...</p>
        </Card>
      ) : sequences.length === 0 ? (
        <Card className="p-8 text-center bg-white shadow-sm">
          <Mail size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No hay secuencias configuradas
          </h3>
          <p className="text-gray-600 mb-4">
            Crea tu primera secuencia automática de emails para mantener a tus clientes comprometidos
          </p>
          <Button onClick={() => alert('Funcionalidad en desarrollo')}>Crear Primera Secuencia</Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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

