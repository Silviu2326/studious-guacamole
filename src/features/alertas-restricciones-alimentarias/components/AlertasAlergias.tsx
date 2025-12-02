import React, { useEffect, useState, useMemo } from 'react';
import { Card, Table, Button, Badge, Modal } from '../../../components/componentsreutilizables';
import { AlertTriangle, CheckCircle, Clock, XCircle, Eye } from 'lucide-react';
import * as api from '../api/alertas';
import { AlertaAlergia, EstadoAlerta } from '../types';

export const AlertasAlergias: React.FC = () => {
  const [alertas, setAlertas] = useState<AlertaAlergia[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAlerta, setSelectedAlerta] = useState<AlertaAlergia | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [filtroEstado, setFiltroEstado] = useState<EstadoAlerta | 'todas'>('todas');

  useEffect(() => {
    cargarAlertas();
  }, []);

  const cargarAlertas = async () => {
    setLoading(true);
    const data = await api.getAlertas();
    setAlertas(data);
    setLoading(false);
  };

  const handleResolver = async (id: string, accionTomada: string) => {
    await api.resolverAlerta(id, accionTomada);
    cargarAlertas();
  };

  const alertasFiltradas = useMemo(() => {
    if (filtroEstado === 'todas') return alertas;
    return alertas.filter((a) => a.estado === filtroEstado);
  }, [alertas, filtroEstado]);

  const getEstadoBadge = (estado: EstadoAlerta) => {
    switch (estado) {
      case 'pendiente':
        return (
          <Badge variant="red" leftIcon={<Clock className="w-3 h-3" />}>
            Pendiente
          </Badge>
        );
      case 'resuelta':
        return (
          <Badge variant="green" leftIcon={<CheckCircle className="w-3 h-3" />}>
            Resuelta
          </Badge>
        );
      case 'ignorada':
        return (
          <Badge variant="gray" leftIcon={<XCircle className="w-3 h-3" />}>
            Ignorada
          </Badge>
        );
      default:
        return null;
    }
  };

  const getSeveridadBadge = (severidad: string) => {
    switch (severidad) {
      case 'critica':
        return <Badge variant="red">Crítica</Badge>;
      case 'severa':
        return <Badge variant="red">Severa</Badge>;
      case 'moderada':
        return <Badge variant="yellow">Moderada</Badge>;
      case 'leve':
        return <Badge variant="green">Leve</Badge>;
      default:
        return null;
    }
  };

  const columns = useMemo(
    () => [
      {
        key: 'ingredienteProblema',
        label: 'Ingrediente',
        render: (_: any, row: AlertaAlergia) => (
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-500" />
            <span className="font-semibold">{row.ingredienteProblema}</span>
          </div>
        ),
      },
      {
        key: 'clienteNombre',
        label: 'Cliente',
        render: (_: any, row: AlertaAlergia) => row.clienteNombre || 'No especificado',
      },
      {
        key: 'tipo',
        label: 'Tipo',
        render: (_: any, row: AlertaAlergia) => (
          <span className="capitalize">{row.tipo}</span>
        ),
      },
      {
        key: 'severidad',
        label: 'Severidad',
        render: (_: any, row: AlertaAlergia) => getSeveridadBadge(row.severidad),
      },
      {
        key: 'estado',
        label: 'Estado',
        render: (_: any, row: AlertaAlergia) => getEstadoBadge(row.estado),
      },
      {
        key: 'fechaDetectada',
        label: 'Fecha',
        render: (_: any, row: AlertaAlergia) =>
          new Date(row.fechaDetectada).toLocaleDateString('es-ES'),
      },
      {
        key: 'actions',
        label: 'Acciones',
        render: (_: any, row: AlertaAlergia) => (
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                setSelectedAlerta(row);
                setIsDetailModalOpen(true);
              }}
            >
              <Eye className="w-4 h-4" />
            </Button>
            {row.estado === 'pendiente' && (
              <Button
                size="sm"
                variant="primary"
                onClick={() => {
                  const accion = prompt('Acción tomada:');
                  if (accion) handleResolver(row.id, accion);
                }}
              >
                Resolver
              </Button>
            )}
          </div>
        ),
      },
    ],
    []
  );

  return (
    <div className="space-y-6">
      {/* Toolbar superior */}
      <div className="flex items-center justify-end">
        <div className="flex gap-2">
          <Button
            variant={filtroEstado === 'todas' ? 'primary' : 'secondary'}
            onClick={() => setFiltroEstado('todas')}
            size="sm"
          >
            Todas
          </Button>
          <Button
            variant={filtroEstado === 'pendiente' ? 'primary' : 'secondary'}
            onClick={() => setFiltroEstado('pendiente')}
            size="sm"
          >
            Pendientes
          </Button>
          <Button
            variant={filtroEstado === 'resuelta' ? 'primary' : 'secondary'}
            onClick={() => setFiltroEstado('resuelta')}
            size="sm"
          >
            Resueltas
          </Button>
        </div>
      </div>

      {/* Tabla de alertas */}
      <Card className="bg-white shadow-sm">
        <div className="p-4">
          <h2 className="text-xl font-bold text-gray-900 mb-1">
            Alertas de Alergias
          </h2>
          <p className="text-gray-600 text-sm">
            Sistema de alertas automáticas para restricciones alimentarias
          </p>
        </div>
        <Table
          data={alertasFiltradas}
          columns={columns}
          loading={loading}
          emptyMessage="No hay alertas registradas"
        />
      </Card>

      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedAlerta(null);
        }}
        title="Detalle de Alerta"
        size="lg"
      >
        {selectedAlerta && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-slate-700 mb-1">
                  Ingrediente Problemático
                </p>
                <p className="text-base text-gray-900 font-semibold">
                  {selectedAlerta.ingredienteProblema}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-700 mb-1">
                  Cliente
                </p>
                <p className="text-base text-gray-900">
                  {selectedAlerta.clienteNombre || 'No especificado'}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-700 mb-1">
                  Tipo
                </p>
                <p className="text-base text-gray-900 capitalize">
                  {selectedAlerta.tipo}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-700 mb-1">
                  Severidad
                </p>
                <div className="mt-1">
                  {getSeveridadBadge(selectedAlerta.severidad)}
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-700 mb-1">
                  Estado
                </p>
                <div className="mt-1">
                  {getEstadoBadge(selectedAlerta.estado)}
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-700 mb-1">
                  Fecha Detectada
                </p>
                <p className="text-base text-gray-900">
                  {new Date(selectedAlerta.fechaDetectada).toLocaleString('es-ES')}
                </p>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-700 mb-1">
                Descripción
              </p>
              <p className="text-base text-gray-900 mt-1">
                {selectedAlerta.descripcion}
              </p>
            </div>
            {selectedAlerta.accionTomada && (
              <div>
                <p className="text-sm font-medium text-slate-700 mb-1">
                  Acción Tomada
                </p>
                <p className="text-base text-gray-900 mt-1">
                  {selectedAlerta.accionTomada}
                </p>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

