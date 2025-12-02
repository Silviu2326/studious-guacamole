import React, { useState, useEffect } from 'react';
import { Card, Button, Table, TableColumn, Badge } from '../../../components/componentsreutilizables';
import { SuscripcionFacturacion, EstadoSuscripcion, FrecuenciaFacturacion } from '../types';
import { suscripcionesRecurrentesAPI } from '../api/suscripcionesRecurrentes';
import { ConfigurarCobrosRecurrentes } from './ConfigurarCobrosRecurrentes';
import { Plus, Pause, Play, Trash2, Edit } from 'lucide-react';

export const GestorSuscripcionesRecurrentes: React.FC = () => {
  const [suscripciones, setSuscripciones] = useState<SuscripcionFacturacion[]>([]);
  const [loading, setLoading] = useState(false);
  const [mostrarModal, setMostrarModal] = useState(false);

  useEffect(() => {
    cargarSuscripciones();
  }, []);

  const cargarSuscripciones = async () => {
    setLoading(true);
    try {
      const suscripcionesData = await suscripcionesRecurrentesAPI.obtenerSuscripciones();
      setSuscripciones(suscripcionesData);
    } catch (error) {
      console.error('Error al cargar suscripciones:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatearMoneda = (valor: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(valor);
  };

  const obtenerBadgeEstado = (estado: EstadoSuscripcion) => {
    const estados: Record<EstadoSuscripcion, { label: string; variant: 'gray' | 'blue' | 'green' | 'yellow' | 'red' }> = {
      activa: { label: 'Activa', variant: 'green' },
      pausada: { label: 'Pausada', variant: 'yellow' },
      cancelada: { label: 'Cancelada', variant: 'gray' },
      vencida: { label: 'Vencida', variant: 'red' },
    };
    
    const estadoInfo = estados[estado];
    return (
      <Badge variant={estadoInfo.variant} size="sm">
        {estadoInfo.label}
      </Badge>
    );
  };

  const obtenerFrecuencia = (frecuencia: FrecuenciaFacturacion) => {
    const frecuencias: Record<FrecuenciaFacturacion, string> = {
      semanal: 'Semanal',
      quincenal: 'Quincenal',
      mensual: 'Mensual',
      trimestral: 'Trimestral',
      anual: 'Anual',
    };
    return frecuencias[frecuencia] || frecuencia;
  };

  const handlePausar = async (id: string) => {
    try {
      await suscripcionesRecurrentesAPI.pausarSuscripcion(id);
      cargarSuscripciones();
    } catch (error) {
      console.error('Error al pausar suscripción:', error);
      alert('Error al pausar la suscripción');
    }
  };

  const handleReactivar = async (id: string) => {
    try {
      await suscripcionesRecurrentesAPI.reactivarSuscripcion(id);
      cargarSuscripciones();
    } catch (error) {
      console.error('Error al reactivar suscripción:', error);
      alert('Error al reactivar la suscripción');
    }
  };

  const handleCancelar = async (id: string) => {
    if (!confirm('¿Está seguro de que desea cancelar esta suscripción?')) {
      return;
    }
    try {
      await suscripcionesRecurrentesAPI.cancelarSuscripcion(id);
      cargarSuscripciones();
    } catch (error) {
      console.error('Error al cancelar suscripción:', error);
      alert('Error al cancelar la suscripción');
    }
  };

  const columnas: TableColumn<SuscripcionFacturacion>[] = [
    {
      key: 'clienteNombre',
      label: 'Cliente',
      render: (_, row) => (
        <div>
          <div className="font-medium">{row.clienteNombre}</div>
          <div className="text-sm text-gray-500">{row.clienteEmail}</div>
        </div>
      ),
    },
    {
      key: 'descripcion',
      label: 'Descripción',
    },
    {
      key: 'monto',
      label: 'Monto',
      render: (_, row) => formatearMoneda(row.monto),
      align: 'right',
      sortable: true,
    },
    {
      key: 'frecuencia',
      label: 'Frecuencia',
      render: (_, row) => obtenerFrecuencia(row.frecuencia),
    },
    {
      key: 'fechaProximaFacturacion',
      label: 'Próxima Facturación',
      render: (_, row) => row.fechaProximaFacturacion.toLocaleDateString('es-ES'),
      sortable: true,
    },
    {
      key: 'estado',
      label: 'Estado',
      render: (_, row) => obtenerBadgeEstado(row.estado),
    },
    {
      key: 'facturasGeneradas',
      label: 'Facturas',
      render: (_, row) => (
        <span className="text-sm text-gray-600">
          {row.facturasGeneradas.length} generadas
        </span>
      ),
    },
    {
      key: 'acciones',
      label: 'Acciones',
      render: (_, row) => (
        <div className="flex gap-2">
          {row.estado === 'activa' && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handlePausar(row.id)}
              title="Pausar suscripción"
            >
              <Pause className="w-4 h-4" />
            </Button>
          )}
          {row.estado === 'pausada' && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleReactivar(row.id)}
              title="Reactivar suscripción"
            >
              <Play className="w-4 h-4" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleCancelar(row.id)}
            title="Cancelar suscripción"
          >
            <Trash2 className="w-4 h-4 text-red-500" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Suscripciones Recurrentes</h2>
          <p className="text-sm text-gray-600">
            Gestiona las suscripciones de facturación automática
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => setMostrarModal(true)}
        >
          <Plus size={20} className="mr-2" />
          Nueva Suscripción
        </Button>
      </div>

      <Table
        data={suscripciones}
        columns={columnas}
        loading={loading}
        emptyMessage="No hay suscripciones recurrentes configuradas"
      />

      {mostrarModal && (
        <ConfigurarCobrosRecurrentes
          isOpen={mostrarModal}
          onClose={() => setMostrarModal(false)}
          onSuscripcionCreada={() => {
            setMostrarModal(false);
            cargarSuscripciones();
          }}
        />
      )}
    </div>
  );
};


