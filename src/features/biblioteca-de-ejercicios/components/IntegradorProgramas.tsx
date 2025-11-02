import React, { useState } from 'react';
import { Card, Button, Select, Modal } from '../../../components/componentsreutilizables';
import { Plus, FolderOpen } from 'lucide-react';
import { usarEjercicio } from '../api/ejercicios';
import { ds } from '../../adherencia/ui/ds';

interface IntegradorProgramasProps {
  ejercicioId: string;
  ejercicioNombre: string;
  className?: string;
}

export const IntegradorProgramas: React.FC<IntegradorProgramasProps> = ({
  ejercicioId,
  ejercicioNombre,
  className = '',
}) => {
  const [mostrarModal, setMostrarModal] = useState(false);
  const [programaSeleccionado, setProgramaSeleccionado] = useState('');
  const [sesionSeleccionada, setSesionSeleccionada] = useState('');
  const [cargando, setCargando] = useState(false);

  const programasMock = [
    { value: 'prog1', label: 'Programa Fuerza' },
    { value: 'prog2', label: 'Programa Hipertrofia' },
    { value: 'prog3', label: 'Programa Cardio' },
  ];

  const sesionesMock = [
    { value: 'ses1', label: 'Sesión 1: Tren Superior' },
    { value: 'ses2', label: 'Sesión 2: Tren Inferior' },
    { value: 'ses3', label: 'Sesión 3: Full Body' },
  ];

  const handleAgregar = async () => {
    if (!programaSeleccionado) return;

    setCargando(true);
    try {
      const exito = await usarEjercicio(ejercicioId, {
        programaId: programaSeleccionado,
        sesionId: sesionSeleccionada || undefined,
      });

      if (exito) {
        setMostrarModal(false);
        setProgramaSeleccionado('');
        setSesionSeleccionada('');
      }
    } catch (error) {
      console.error('Error al agregar ejercicio:', error);
    } finally {
      setCargando(false);
    }
  };

  return (
    <>
      <Card padding="md" className={className}>
        <div className="flex items-center justify-between">
          <div>
            <h3 className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark} mb-2`}>
              Usar en Programa
            </h3>
            <p className={`${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
              Agrega este ejercicio a un programa o plantilla de entrenamiento
            </p>
          </div>
          <Button
            variant="primary"
            onClick={() => setMostrarModal(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Agregar a Programa
          </Button>
        </div>
      </Card>

      <Modal
        isOpen={mostrarModal}
        onClose={() => setMostrarModal(false)}
        title="Agregar Ejercicio a Programa"
      >
        <div className="space-y-4">
          <p className={`${ds.typography.body} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
            Agregar <strong>{ejercicioNombre}</strong> a:
          </p>

          <Select
            label="Programa"
            placeholder="Seleccionar programa..."
            options={programasMock}
            value={programaSeleccionado}
            onChange={(e) => setProgramaSeleccionado(e.target.value)}
          />

          <Select
            label="Sesión (Opcional)"
            placeholder="Seleccionar sesión..."
            options={sesionesMock}
            value={sesionSeleccionada}
            onChange={(e) => setSesionSeleccionada(e.target.value)}
          />

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button
              variant="ghost"
              onClick={() => setMostrarModal(false)}
              disabled={cargando}
            >
              Cancelar
            </Button>
            <Button
              variant="primary"
              onClick={handleAgregar}
              disabled={cargando || !programaSeleccionado}
              loading={cargando}
            >
              Agregar
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

