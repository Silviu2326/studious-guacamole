import React, { useState, useEffect } from 'react';
import { Table, TableColumn, Badge, Button } from '../../../components/componentsreutilizables';
import { PagoPendiente } from '../types';
import { morosidadAPI } from '../api/morosidad';
import { AlertCircle, DollarSign, Calendar, User, Phone, Mail, Eye, CheckCircle, XCircle } from 'lucide-react';

interface MorosidadListProps {
  onRefresh?: () => void;
}

export const MorosidadList: React.FC<MorosidadListProps> = ({ onRefresh }) => {
  const [pagos, setPagos] = useState<PagoPendiente[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    cargarPagos();
  }, []);

  const cargarPagos = async () => {
    setLoading(true);
    try {
      const datos = await morosidadAPI.obtenerPagosPendientes();
      setPagos(datos);
    } catch (error) {
      console.error('Error al cargar pagos pendientes:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatearMoneda = (valor: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(valor);
  };

  const obtenerBadgeNivel = (nivel: string) => {
    const niveles: Record<string, { label: string; variant: 'gray' | 'blue' | 'green' | 'yellow' | 'red' }> = {
      verde: { label: '1-7 días', variant: 'green' },
      amarillo: { label: '8-15 días', variant: 'yellow' },
      naranja: { label: '16-30 días', variant: 'yellow' },
      rojo: { label: '+30 días', variant: 'red' },
      negro: { label: '+60 días', variant: 'red' }
    };
    
    const nivelInfo = niveles[nivel] || niveles.verde;
    return (
      <Badge variant={nivelInfo.variant} size="sm">
        {nivelInfo.label}
      </Badge>
    );
  };

  const obtenerBadgeRiesgo = (riesgo: string) => {
    const riesgos: Record<string, { label: string; variant: 'gray' | 'blue' | 'green' | 'yellow' | 'red' }> = {
      bajo: { label: 'Bajo', variant: 'green' },
      medio: { label: 'Medio', variant: 'yellow' },
      alto: { label: 'Alto', variant: 'yellow' },
      critico: { label: 'Crítico', variant: 'red' }
    };
    
    const riesgoInfo = riesgos[riesgo] || riesgos.bajo;
    return (
      <Badge variant={riesgoInfo.variant} size="sm">
        {riesgoInfo.label}
      </Badge>
    );
  };

  const handleMarcarPagado = async (id: string) => {
    try {
      await morosidadAPI.marcarComoPagado(id);
      cargarPagos();
      onRefresh?.();
    } catch (error) {
      console.error('Error al marcar como pagado:', error);
    }
  };

  const columnas: TableColumn<PagoPendiente>[] = [
    {
      key: 'numeroFactura',
      label: 'Factura',
      render: (_, row) => (
        <div className="font-medium">
          {row.numeroFactura}
        </div>
      )
    },
    {
      key: 'cliente',
      label: 'Cliente',
      render: (_, row) => (
        <div>
          <div className="font-medium">{row.cliente.nombre}</div>
          <div className="text-sm text-gray-500 flex items-center gap-2 mt-1">
            {row.cliente.email && (
              <span className="flex items-center gap-1">
                <Mail className="w-3 h-3" />
                {row.cliente.email}
              </span>
            )}
            {row.cliente.telefono && (
              <span className="flex items-center gap-1">
                <Phone className="w-3 h-3" />
                {row.cliente.telefono}
              </span>
            )}
          </div>
        </div>
      )
    },
    {
      key: 'fechaVencimiento',
      label: 'Fecha Vencimiento',
      render: (_, row) => (
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-gray-400" />
          <span>{row.fechaVencimiento.toLocaleDateString('es-ES')}</span>
        </div>
      ),
      sortable: true
    },
    {
      key: 'diasRetraso',
      label: 'Días Retraso',
      render: (_, row) => (
        <div className="flex items-center gap-2">
          <AlertCircle className={`w-4 h-4 ${row.diasRetraso > 30 ? 'text-red-500' : row.diasRetraso > 15 ? 'text-orange-500' : 'text-yellow-500'}`} />
          <span className="font-medium">{row.diasRetraso} días</span>
        </div>
      ),
      sortable: true
    },
    {
      key: 'montoPendiente',
      label: 'Monto Pendiente',
      render: (_, row) => (
        <div className="flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-gray-400" />
          <span className="font-semibold">{formatearMoneda(row.montoPendiente)}</span>
        </div>
      ),
      align: 'right',
      sortable: true
    },
    {
      key: 'nivelMorosidad',
      label: 'Nivel',
      render: (_, row) => obtenerBadgeNivel(row.nivelMorosidad)
    },
    {
      key: 'riesgo',
      label: 'Riesgo',
      render: (_, row) => obtenerBadgeRiesgo(row.riesgo)
    },
    {
      key: 'acciones',
      label: 'Acciones',
      render: (_, row) => (
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleMarcarPagado(row.id)}
            title="Marcar como pagado"
          >
            <CheckCircle className="w-4 h-4 text-green-600" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => console.log('Ver detalles:', row.id)}
            title="Ver detalles"
          >
            <Eye className="w-4 h-4" />
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Quién me debe dinero ahora mismo
          </h2>
          <p className="text-gray-600">
            Lista completa de pagos pendientes y en mora
          </p>
        </div>
        <div className="text-sm text-gray-600">
          Total: <span className="font-semibold text-gray-900">{pagos.length}</span> pagos pendientes
        </div>
      </div>

      <Table
        data={pagos}
        columns={columnas}
        loading={loading}
        emptyMessage="No hay pagos pendientes"
      />
    </div>
  );
};

