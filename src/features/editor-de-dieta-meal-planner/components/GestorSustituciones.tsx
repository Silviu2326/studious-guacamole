import React, { useState } from 'react';
import { Card, Button, Input, Select, Table } from '../../../components/componentsreutilizables';
import { RefreshCcw, Plus, Trash2 } from 'lucide-react';
import { type Sustitucion, type Alimento } from '../api/editor';
import { ds } from '../../adherencia/ui/ds';

interface GestorSustitucionesProps {
  alimentos: Alimento[];
  sustituciones: Sustitucion[];
  onSustitucionAgregada: (sustitucion: Sustitucion) => void;
  onSustitucionEliminada: (id: string) => void;
}

export const GestorSustituciones: React.FC<GestorSustitucionesProps> = ({
  alimentos,
  sustituciones,
  onSustitucionAgregada,
  onSustitucionEliminada,
}) => {
  const [alimentoOriginal, setAlimentoOriginal] = useState('');
  const [alimentoSustituto, setAlimentoSustituto] = useState('');
  const [motivo, setMotivo] = useState('');

  const handleAgregar = () => {
    if (!alimentoOriginal || !alimentoSustituto || !motivo.trim()) {
      alert('Completa todos los campos');
      return;
    }

    const sustitucion: Sustitucion = {
      id: Date.now().toString(),
      alimentoOriginalId: alimentoOriginal,
      alimentoSustitutoId: alimentoSustituto,
      motivo,
    };

    onSustitucionAgregada(sustitucion);
    setAlimentoOriginal('');
    setAlimentoSustituto('');
    setMotivo('');
  };

  const obtenerNombreAlimento = (id: string) => {
    return alimentos.find((a) => a.id === id)?.nombre || 'Alimento no encontrado';
  };

  const columnas = [
    {
      key: 'original',
      label: 'Alimento Original',
      render: (sust: Sustitucion) => (
        <span className="text-gray-900">
          {obtenerNombreAlimento(sust.alimentoOriginalId)}
        </span>
      ),
    },
    {
      key: 'sustituto',
      label: 'Alimento Sustituto',
      render: (sust: Sustitucion) => (
        <span className="text-gray-900">
          {obtenerNombreAlimento(sust.alimentoSustitutoId)}
        </span>
      ),
    },
    {
      key: 'motivo',
      label: 'Motivo',
      render: (sust: Sustitucion) => (
        <span className="text-gray-700">{sust.motivo}</span>
      ),
    },
    {
      key: 'acciones',
      label: '',
      render: (sust: Sustitucion) => (
        <Button
          variant="destructive"
          size="sm"
          onClick={() => onSustitucionEliminada(sust.id)}
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      ),
    },
  ];

  return (
    <Card className="p-6 bg-white shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <RefreshCcw size={24} className="text-blue-600" />
        <h2 className="text-xl font-bold text-gray-900">
          Gestor de Sustituciones
        </h2>
      </div>

      <div className="space-y-4 mb-6">
        <Select
          label="Alimento Original"
          options={alimentos.map((a) => ({
            value: a.id,
            label: a.nombre,
          }))}
          value={alimentoOriginal}
          onChange={(e) => setAlimentoOriginal(e.target.value)}
          placeholder="Selecciona el alimento a sustituir"
        />

        <Select
          label="Alimento Sustituto"
          options={alimentos
            .filter((a) => a.id !== alimentoOriginal)
            .map((a) => ({
              value: a.id,
              label: a.nombre,
            }))}
          value={alimentoSustituto}
          onChange={(e) => setAlimentoSustituto(e.target.value)}
          placeholder="Selecciona el alimento sustituto"
        />

        <Input
          label="Motivo de la Sustitución"
          value={motivo}
          onChange={(e) => setMotivo(e.target.value)}
          placeholder="Ej: Alergia al gluten, preferencia vegetariana..."
        />

        <Button onClick={handleAgregar} fullWidth>
          <Plus className="w-4 h-4 mr-2" />
          Agregar Sustitución
        </Button>
      </div>

      {sustituciones.length > 0 ? (
        <Table
          columns={columnas}
          data={sustituciones}
          emptyMessage="No hay sustituciones configuradas"
        />
      ) : (
        <p className="text-gray-600 text-sm text-center py-4">
          No hay sustituciones configuradas. Agrega una usando el formulario arriba.
        </p>
      )}
    </Card>
  );
};

