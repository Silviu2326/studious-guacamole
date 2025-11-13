import React, { useState, useEffect } from 'react';
import { Modal, Card, Button, Badge, Table } from '../../../components/componentsreutilizables';
import { 
  MessageSquare,
  CheckCircle2,
  XCircle,
  Clock,
  Eye,
} from 'lucide-react';
import {
  SugerenciaColaborador,
} from '../types';
import {
  getSugerenciasColaborador,
  aprobarSugerencia,
  rechazarSugerencia,
  aplicarSugerencia,
} from '../api/permisosColaboradores';
import { useAuth } from '../../../context/AuthContext';

interface VerSugerenciasColaboradorProps {
  dietaId: string;
  colaboradorId: string;
  onClose: () => void;
}

export const VerSugerenciasColaborador: React.FC<VerSugerenciasColaboradorProps> = ({
  dietaId,
  colaboradorId,
  onClose,
}) => {
  const { user } = useAuth();
  const [sugerencias, setSugerencias] = useState<SugerenciaColaborador[]>([]);
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    cargarSugerencias();
  }, [dietaId, colaboradorId]);

  const cargarSugerencias = async () => {
    setCargando(true);
    try {
      const data = await getSugerenciasColaborador(dietaId, colaboradorId);
      setSugerencias(data);
    } catch (error) {
      console.error('Error cargando sugerencias:', error);
    } finally {
      setCargando(false);
    }
  };

  const handleAprobar = async (sugerenciaId: string) => {
    try {
      if (!user?.id) return;
      
      await aprobarSugerencia(sugerenciaId, user.id, user.name || user.email);
      await cargarSugerencias();
    } catch (error) {
      console.error('Error aprobando sugerencia:', error);
    }
  };

  const handleRechazar = async (sugerenciaId: string) => {
    try {
      if (!user?.id) return;
      
      await rechazarSugerencia(sugerenciaId, user.id);
      await cargarSugerencias();
    } catch (error) {
      console.error('Error rechazando sugerencia:', error);
    }
  };

  const handleAplicar = async (sugerenciaId: string) => {
    try {
      if (!user?.id) return;
      
      await aplicarSugerencia(sugerenciaId, user.id);
      await cargarSugerencias();
    } catch (error) {
      console.error('Error aplicando sugerencia:', error);
    }
  };

  const getEstadoBadge = (estado: SugerenciaColaborador['estado']) => {
    switch (estado) {
      case 'pendiente':
        return <Badge variant="yellow"><Clock className="w-3 h-3 mr-1" /> Pendiente</Badge>;
      case 'aprobada':
        return <Badge variant="success"><CheckCircle2 className="w-3 h-3 mr-1" /> Aprobada</Badge>;
      case 'rechazada':
        return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" /> Rechazada</Badge>;
      case 'aplicada':
        return <Badge variant="blue"><CheckCircle2 className="w-3 h-3 mr-1" /> Aplicada</Badge>;
      default:
        return null;
    }
  };

  const columnas = [
    {
      key: 'titulo',
      label: 'Título',
      render: (_: any, row: SugerenciaColaborador) => (
        <div>
          <div className="font-medium text-gray-900">{row.titulo}</div>
          <div className="text-sm text-gray-500">{row.descripcion}</div>
        </div>
      ),
    },
    {
      key: 'tipo',
      label: 'Tipo',
      render: (_: any, row: SugerenciaColaborador) => (
        <Badge variant="secondary">{row.tipo}</Badge>
      ),
    },
    {
      key: 'estado',
      label: 'Estado',
      render: (_: any, row: SugerenciaColaborador) => getEstadoBadge(row.estado),
    },
    {
      key: 'fecha',
      label: 'Fecha',
      render: (_: any, row: SugerenciaColaborador) => (
        <div className="text-sm text-gray-600">
          {new Date(row.creadoEn).toLocaleDateString()}
        </div>
      ),
    },
    {
      key: 'acciones',
      label: 'Acciones',
      align: 'right' as const,
      render: (_: any, row: SugerenciaColaborador) => (
        <div className="flex items-center justify-end gap-2">
          {row.estado === 'pendiente' && (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleAprobar(row.id)}
              >
                <CheckCircle2 className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleRechazar(row.id)}
              >
                <XCircle className="w-4 h-4" />
              </Button>
            </>
          )}
          {row.estado === 'aprobada' && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleAplicar(row.id)}
            >
              Aplicar
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title="Sugerencias del Colaborador"
      size="xl"
    >
      <div className="space-y-6">
        <Table
          data={sugerencias}
          columns={columnas}
          loading={cargando}
          emptyMessage="No hay sugerencias"
        />
      </div>
    </Modal>
  );
};

