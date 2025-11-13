import React, { useState, useEffect } from 'react';
import { Card, Button, Modal, Table, Badge, ConfirmModal, Select, Input } from '../../../components/componentsreutilizables';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Users, 
  Shield,
  Eye,
  MessageSquare,
  CheckCircle2,
  XCircle,
  Clock,
  UserPlus,
} from 'lucide-react';
import {
  PermisoColaborador,
  TipoPermisoDieta,
  SugerenciaColaborador,
  HistorialPermisos,
} from '../types';
import {
  getPermisosDieta,
  asignarPermiso,
  actualizarPermiso,
  revocarPermiso,
  getSugerenciasColaborador,
  getHistorialPermisos,
} from '../api/permisosColaboradores';
import { useAuth } from '../../../context/AuthContext';
import { AsignarPermisoModal } from './AsignarPermisoModal';
import { VerSugerenciasColaborador } from './VerSugerenciasColaborador';

interface GestorPermisosColaboradoresProps {
  dietaId: string;
  dietaNombre?: string;
  onPermisoAsignado?: () => void;
}

export const GestorPermisosColaboradores: React.FC<GestorPermisosColaboradoresProps> = ({
  dietaId,
  dietaNombre,
  onPermisoAsignado,
}) => {
  const { user } = useAuth();
  const [permisos, setPermisos] = useState<PermisoColaborador[]>([]);
  const [cargando, setCargando] = useState(false);
  const [mostrarAsignar, setMostrarAsignar] = useState(false);
  const [permisoEditando, setPermisoEditando] = useState<PermisoColaborador | null>(null);
  const [confirmarRevocar, setConfirmarRevocar] = useState<PermisoColaborador | null>(null);
  const [mostrarSugerencias, setMostrarSugerencias] = useState(false);
  const [colaboradorSeleccionado, setColaboradorSeleccionado] = useState<string | null>(null);
  const [historial, setHistorial] = useState<HistorialPermisos[]>([]);

  useEffect(() => {
    cargarPermisos();
    cargarHistorial();
  }, [dietaId]);

  const cargarPermisos = async () => {
    setCargando(true);
    try {
      const data = await getPermisosDieta(dietaId);
      setPermisos(data);
    } catch (error) {
      console.error('Error cargando permisos:', error);
    } finally {
      setCargando(false);
    }
  };

  const cargarHistorial = async () => {
    try {
      const data = await getHistorialPermisos(dietaId);
      setHistorial(data);
    } catch (error) {
      console.error('Error cargando historial:', error);
    }
  };

  const handleAsignarPermiso = async (datos: Omit<PermisoColaborador, 'id' | 'asignadoEn' | 'actualizadoEn' | 'permisos'>) => {
    try {
      await asignarPermiso(datos);
      await cargarPermisos();
      await cargarHistorial();
      setMostrarAsignar(false);
      onPermisoAsignado?.();
    } catch (error) {
      console.error('Error asignando permiso:', error);
    }
  };

  const handleActualizarPermiso = async (actualizaciones: Partial<PermisoColaborador>) => {
    if (!permisoEditando) return;
    try {
      await actualizarPermiso(permisoEditando.id, actualizaciones);
      await cargarPermisos();
      await cargarHistorial();
      setPermisoEditando(null);
      setMostrarAsignar(false);
      onPermisoAsignado?.();
    } catch (error) {
      console.error('Error actualizando permiso:', error);
    }
  };

  const handleRevocarPermiso = async () => {
    if (!confirmarRevocar || !user?.id) return;
    
    try {
      await revocarPermiso(
        confirmarRevocar.id,
        user.id,
        user.name || user.email
      );
      await cargarPermisos();
      await cargarHistorial();
      setConfirmarRevocar(null);
    } catch (error) {
      console.error('Error revocando permiso:', error);
    }
  };

  const handleVerSugerencias = async (colaboradorId: string) => {
    setColaboradorSeleccionado(colaboradorId);
    setMostrarSugerencias(true);
  };

  const getTipoPermisoLabel = (tipo: TipoPermisoDieta) => {
    switch (tipo) {
      case 'solo-lectura':
        return 'Solo Lectura';
      case 'sugerencias':
        return 'Sugerencias';
      case 'edicion-completa':
        return 'Edición Completa';
      default:
        return tipo;
    }
  };

  const getTipoPermisoColor = (tipo: TipoPermisoDieta) => {
    switch (tipo) {
      case 'solo-lectura':
        return 'secondary';
      case 'sugerencias':
        return 'blue';
      case 'edicion-completa':
        return 'success';
      default:
        return 'secondary';
    }
  };

  const columnas = [
    {
      key: 'colaborador',
      label: 'Colaborador',
      render: (_: any, row: PermisoColaborador) => (
        <div>
          <div className="font-medium text-gray-900">
            {row.colaboradorNombre || row.colaboradorEmail || row.colaboradorId}
          </div>
          {row.colaboradorEmail && (
            <div className="text-sm text-gray-500">{row.colaboradorEmail}</div>
          )}
        </div>
      ),
    },
    {
      key: 'tipo',
      label: 'Tipo de Permiso',
      render: (_: any, row: PermisoColaborador) => (
        <Badge variant={getTipoPermisoColor(row.tipo) as 'gray' | 'blue' | 'green' | 'yellow' | 'red' | 'purple' | 'orange' | 'outline' | 'success' | 'destructive' | 'secondary'}>
          {getTipoPermisoLabel(row.tipo)}
        </Badge>
      ),
    },
    {
      key: 'permisos',
      label: 'Permisos',
      render: (_: any, row: PermisoColaborador) => (
        <div className="flex flex-wrap gap-1">
          {row.permisos.ver && (
            <Badge variant="secondary" className="text-xs">
              <Eye className="w-3 h-3 mr-1" />
              Ver
            </Badge>
          )}
          {row.permisos.sugerir && (
            <Badge variant="secondary" className="text-xs">
              <MessageSquare className="w-3 h-3 mr-1" />
              Sugerir
            </Badge>
          )}
          {row.permisos.editar && (
            <Badge variant="secondary" className="text-xs">
              <Edit className="w-3 h-3 mr-1" />
              Editar
            </Badge>
          )}
          {row.permisos.eliminar && (
            <Badge variant="secondary" className="text-xs">
              <Trash2 className="w-3 h-3 mr-1" />
              Eliminar
            </Badge>
          )}
        </div>
      ),
    },
    {
      key: 'restricciones',
      label: 'Restricciones',
      render: (_: any, row: PermisoColaborador) => (
        <div className="text-sm text-gray-600">
          {row.restricciones?.soloComidas && (
            <div>• Solo comidas</div>
          )}
          {row.restricciones?.requiereAprobacion && (
            <div>• Requiere aprobación</div>
          )}
          {row.restricciones?.soloBloques && row.restricciones.soloBloques.length > 0 && (
            <div>• Bloques específicos</div>
          )}
          {!row.restricciones && <span>-</span>}
        </div>
      ),
    },
    {
      key: 'asignadoEn',
      label: 'Asignado',
      render: (_: any, row: PermisoColaborador) => (
        <div className="text-sm text-gray-600">
          {new Date(row.asignadoEn).toLocaleDateString()}
        </div>
      ),
    },
    {
      key: 'acciones',
      label: 'Acciones',
      align: 'right' as const,
      render: (_: any, row: PermisoColaborador) => (
        <div className="flex items-center justify-end gap-2">
          {row.permisos.sugerir && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleVerSugerencias(row.colaboradorId)}
              title="Ver sugerencias"
            >
              <MessageSquare className="w-4 h-4" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setPermisoEditando(row)}
            title="Editar permiso"
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setConfirmarRevocar(row)}
            title="Revocar permiso"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <Card className="p-4 bg-white shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-xl ring-1 ring-purple-200/70">
              <Shield size={24} className="text-purple-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">
                Permisos de Colaboradores
              </h3>
              <p className="text-sm text-gray-600">
                Gestiona los permisos de colaboradores para esta dieta
              </p>
            </div>
          </div>
          <Button
            variant="primary"
            onClick={() => {
              setPermisoEditando(null);
              setMostrarAsignar(true);
            }}
          >
            <UserPlus size={20} className="mr-2" />
            Asignar Permiso
          </Button>
        </div>

        <Table
          data={permisos}
          columns={columnas}
          loading={cargando}
          emptyMessage="No hay permisos asignados"
        />
      </Card>

      {mostrarAsignar && (
        <AsignarPermisoModal
          dietaId={dietaId}
          permiso={permisoEditando || undefined}
          onAsignar={handleAsignarPermiso}
          onActualizar={permisoEditando ? handleActualizarPermiso : undefined}
          onCancel={() => {
            setMostrarAsignar(false);
            setPermisoEditando(null);
          }}
        />
      )}

      {mostrarSugerencias && colaboradorSeleccionado && (
        <VerSugerenciasColaborador
          dietaId={dietaId}
          colaboradorId={colaboradorSeleccionado}
          onClose={() => {
            setMostrarSugerencias(false);
            setColaboradorSeleccionado(null);
          }}
        />
      )}

      <ConfirmModal
        isOpen={!!confirmarRevocar}
        onClose={() => setConfirmarRevocar(null)}
        onConfirm={handleRevocarPermiso}
        title="Revocar Permiso"
        message={`¿Estás seguro de que quieres revocar el permiso de "${confirmarRevocar?.colaboradorNombre || confirmarRevocar?.colaboradorEmail}"? Esta acción no se puede deshacer.`}
        confirmText="Revocar"
        cancelText="Cancelar"
        variant="destructive"
      />
    </div>
  );
};

