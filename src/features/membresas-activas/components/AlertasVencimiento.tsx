import React, { useState, useEffect } from 'react';
import { Card, Table, Badge, Button } from '../../../components/componentsreutilizables';
import { AlertaVencimiento } from '../types';
import { getAlertasVencimiento, marcarAlertaComoLeida, procesarAlerta } from '../api/alertas';
import { AlertTriangle, Clock, CheckCircle, Send, Filter } from 'lucide-react';

interface AlertasVencimientoProps {
  role: 'entrenador' | 'gimnasio';
  userId?: string;
}

export const AlertasVencimiento: React.FC<AlertasVencimientoProps> = ({
  role,
  userId,
}) => {
  const [alertas, setAlertas] = useState<AlertaVencimiento[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtroPrioridad, setFiltroPrioridad] = useState<'todas' | 'alta' | 'media' | 'baja'>('todas');

  useEffect(() => {
    loadAlertas();
  }, [role, userId]);

  const loadAlertas = async () => {
    setLoading(true);
    try {
      const data = await getAlertasVencimiento(role, userId);
      setAlertas(data);
    } catch (error) {
      console.error('Error cargando alertas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarcarLeida = async (alertaId: string) => {
    try {
      await marcarAlertaComoLeida(alertaId);
      setAlertas(alertas.map(a => a.id === alertaId ? { ...a, estado: 'enviada' } : a));
    } catch (error) {
      console.error('Error marcando alerta:', error);
    }
  };

  const handleProcesar = async (alertaId: string) => {
    try {
      await procesarAlerta(alertaId);
      setAlertas(alertas.map(a => a.id === alertaId ? { ...a, estado: 'procesada' } : a));
    } catch (error) {
      console.error('Error procesando alerta:', error);
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getPrioridadBadge = (prioridad: string) => {
    switch (prioridad) {
      case 'alta':
        return <Badge variant="red">Alta</Badge>;
      case 'media':
        return <Badge variant="yellow">Media</Badge>;
      case 'baja':
        return <Badge variant="blue">Baja</Badge>;
      default:
        return <Badge variant="gray">{prioridad}</Badge>;
    }
  };

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case 'pendiente':
        return <Badge variant="yellow">Pendiente</Badge>;
      case 'enviada':
        return <Badge variant="blue">Enviada</Badge>;
      case 'procesada':
        return <Badge variant="green">Procesada</Badge>;
      default:
        return <Badge variant="gray">{estado}</Badge>;
    }
  };

  const alertasFiltradas = alertas.filter(alerta => {
    if (filtroPrioridad === 'todas') return true;
    return alerta.prioridad === filtroPrioridad;
  });

  const columns = [
    {
      key: 'clienteNombre',
      label: 'Cliente',
      render: (_: any, row: AlertaVencimiento) => (
        <div>
          <div className="text-sm font-semibold text-gray-900">
            {row.clienteNombre}
          </div>
          <div className="text-xs text-gray-600">
            {row.clienteEmail}
          </div>
        </div>
      ),
    },
    {
      key: 'fechaVencimiento',
      label: 'Fecha Vencimiento',
      render: (_: any, row: AlertaVencimiento) => (
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-slate-500" />
          <span className="text-sm text-gray-600">
            {formatDate(row.fechaVencimiento)}
          </span>
        </div>
      ),
    },
    {
      key: 'diasRestantes',
      label: 'Días Restantes',
      render: (_: any, row: AlertaVencimiento) => (
        <div>
          {row.diasRestantes < 0 ? (
            <Badge variant="red">Vencido hace {Math.abs(row.diasRestantes)} días</Badge>
          ) : row.diasRestantes === 0 ? (
            <Badge variant="yellow">Vence hoy</Badge>
          ) : (
            <Badge variant="blue">{row.diasRestantes} días</Badge>
          )}
        </div>
      ),
    },
    {
      key: 'prioridad',
      label: 'Prioridad',
      render: (_: any, row: AlertaVencimiento) => getPrioridadBadge(row.prioridad),
    },
    {
      key: 'estado',
      label: 'Estado',
      render: (_: any, row: AlertaVencimiento) => getEstadoBadge(row.estado),
    },
    {
      key: 'actions',
      label: 'Acciones',
      align: 'right' as const,
      render: (_: any, row: AlertaVencimiento) => (
        <div className="flex items-center gap-2 justify-end">
          {row.estado === 'pendiente' && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => handleMarcarLeida(row.id)}
              title="Enviar Recordatorio"
            >
              <Send className="w-4 h-4 mr-1" />
              Enviar
            </Button>
          )}
          {row.estado === 'enviada' && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => handleProcesar(row.id)}
              title="Marcar como Procesada"
            >
              <CheckCircle className="w-4 h-4 mr-1" />
              Procesar
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Sistema de Filtros */}
      <Card className="mb-6 bg-white shadow-sm">
        <div className="space-y-4">
          <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-3">
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  <Filter className="inline w-4 h-4 mr-1" />
                  Filtrar por Prioridad
                </label>
                <select
                  value={filtroPrioridad}
                  onChange={(e) => setFiltroPrioridad(e.target.value as any)}
                  className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5 text-sm"
                >
                  <option value="todas">Todas las Prioridades</option>
                  <option value="alta">Alta Prioridad</option>
                  <option value="media">Media Prioridad</option>
                  <option value="baja">Baja Prioridad</option>
                </select>
              </div>
            </div>
          </div>
          <div className="flex justify-between items-center text-sm text-slate-600 border-t border-slate-200 pt-4">
            <span>{alertasFiltradas.length} resultados encontrados</span>
            {filtroPrioridad !== 'todas' && (
              <span>1 filtro aplicado</span>
            )}
          </div>
        </div>
      </Card>

      {/* Tabla de alertas */}
      {loading ? (
        <Card className="p-8 text-center bg-white shadow-sm">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </Card>
      ) : alertasFiltradas.length === 0 ? (
        <Card className="p-8 text-center bg-white shadow-sm">
          <AlertTriangle size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay alertas de vencimiento</h3>
          <p className="text-gray-600">No se encontraron alertas para mostrar</p>
        </Card>
      ) : (
        <Card className="bg-white shadow-sm">
          <Table
            data={alertasFiltradas}
            columns={columns}
            loading={false}
            emptyMessage="No hay alertas de vencimiento"
          />
        </Card>
      )}
    </div>
  );
};

