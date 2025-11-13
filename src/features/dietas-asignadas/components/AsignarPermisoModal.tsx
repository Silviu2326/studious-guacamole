import React, { useState } from 'react';
import { Modal, Button, Input, Select } from '../../../components/componentsreutilizables';
import { useAuth } from '../../../context/AuthContext';
import {
  PermisoColaborador,
  TipoPermisoDieta,
} from '../types';

interface AsignarPermisoModalProps {
  dietaId: string;
  permiso?: PermisoColaborador;
  onAsignar: (datos: Omit<PermisoColaborador, 'id' | 'asignadoEn' | 'actualizadoEn' | 'permisos'>) => Promise<void>;
  onActualizar?: (actualizaciones: Partial<PermisoColaborador>) => Promise<void>;
  onCancel: () => void;
}

export const AsignarPermisoModal: React.FC<AsignarPermisoModalProps> = ({
  dietaId,
  permiso,
  onAsignar,
  onActualizar,
  onCancel,
}) => {
  const { user } = useAuth();
  const [colaboradorId, setColaboradorId] = useState(permiso?.colaboradorId || '');
  const [colaboradorNombre, setColaboradorNombre] = useState(permiso?.colaboradorNombre || '');
  const [colaboradorEmail, setColaboradorEmail] = useState(permiso?.colaboradorEmail || '');
  const [tipo, setTipo] = useState<TipoPermisoDieta>(permiso?.tipo || 'solo-lectura');
  const [activo, setActivo] = useState(permiso?.activo ?? true);
  const [fechaInicio, setFechaInicio] = useState(permiso?.fechaInicio || '');
  const [fechaFin, setFechaFin] = useState(permiso?.fechaFin || '');
  const [soloComidas, setSoloComidas] = useState(permiso?.restricciones?.soloComidas || false);
  const [requiereAprobacion, setRequiereAprobacion] = useState(permiso?.restricciones?.requiereAprobacion || false);
  const [guardando, setGuardando] = useState(false);

  const handleGuardar = async () => {
    if (!colaboradorId.trim()) return;
    
    setGuardando(true);
    try {
      if (permiso && onActualizar) {
        await onActualizar({
          colaboradorId,
          colaboradorNombre,
          colaboradorEmail,
          tipo,
          activo,
          fechaInicio: fechaInicio || undefined,
          fechaFin: fechaFin || undefined,
          restricciones: {
            soloComidas,
            requiereAprobacion,
          },
        });
      } else {
        if (!user?.id) return;
        await onAsignar({
          dietaId,
          colaboradorId,
          colaboradorNombre,
          colaboradorEmail,
          tipo,
          activo,
          fechaInicio: fechaInicio || undefined,
          fechaFin: fechaFin || undefined,
          restricciones: {
            soloComidas,
            requiereAprobacion,
          },
          asignadoPor: user.id,
          asignadoPorNombre: user.name || user.email || '',
        });
      }
    } catch (error) {
      console.error('Error guardando permiso:', error);
    } finally {
      setGuardando(false);
    }
  };

  const tiposPermiso: Array<{ value: TipoPermisoDieta; label: string; descripcion: string }> = [
    {
      value: 'solo-lectura',
      label: 'Solo Lectura',
      descripcion: 'Solo puede ver la dieta, no puede editar',
    },
    {
      value: 'sugerencias',
      label: 'Sugerencias',
      descripcion: 'Puede ver y hacer sugerencias, pero no editar directamente',
    },
    {
      value: 'edicion-completa',
      label: 'Edición Completa',
      descripcion: 'Puede editar completamente la dieta',
    },
  ];

  return (
    <Modal
      isOpen={true}
      onClose={onCancel}
      title={permiso ? 'Editar Permiso' : 'Asignar Permiso'}
      size="lg"
    >
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            ID del Colaborador *
          </label>
          <Input
            value={colaboradorId}
            onChange={e => setColaboradorId(e.target.value)}
            placeholder="ID del colaborador"
            disabled={!!permiso}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nombre del Colaborador
          </label>
          <Input
            value={colaboradorNombre}
            onChange={e => setColaboradorNombre(e.target.value)}
            placeholder="Nombre del colaborador"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email del Colaborador
          </label>
          <Input
            type="email"
            value={colaboradorEmail}
            onChange={e => setColaboradorEmail(e.target.value)}
            placeholder="email@ejemplo.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tipo de Permiso *
          </label>
          <Select
            value={tipo}
            onChange={e => setTipo(e.target.value as TipoPermisoDieta)}
            options={tiposPermiso.map(t => ({
              value: t.value,
              label: `${t.label} - ${t.descripcion}`,
            }))}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fecha de Inicio
            </label>
            <Input
              type="date"
              value={fechaInicio}
              onChange={e => setFechaInicio(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fecha de Fin
            </label>
            <Input
              type="date"
              value={fechaFin}
              onChange={e => setFechaFin(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Restricciones
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={soloComidas}
              onChange={e => setSoloComidas(e.target.checked)}
            />
            <span className="text-sm text-gray-700">Solo puede editar comidas, no macros</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={requiereAprobacion}
              onChange={e => setRequiereAprobacion(e.target.checked)}
            />
            <span className="text-sm text-gray-700">Los cambios requieren aprobación</span>
          </label>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={activo}
            onChange={e => setActivo(e.target.checked)}
          />
          <span className="text-sm text-gray-700">Activo</span>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <Button variant="ghost" onClick={onCancel} disabled={guardando}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleGuardar} loading={guardando}>
            {permiso ? 'Actualizar' : 'Asignar'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

