import React, { useState, useEffect } from 'react';
import { Card, Button, Table, Badge } from '../../../components/componentsreutilizables';
import { InventarioService } from '../services/inventarioService';
import { AlertaStock, Producto } from '../types';
import { AlertTriangle, Calendar, CheckCircle } from 'lucide-react';

interface AlertasCaducidadProps {
  onAlertUpdate?: () => void;
}

export const AlertasCaducidad: React.FC<AlertasCaducidadProps> = ({ onAlertUpdate }) => {
  const [alertas, setAlertas] = useState<AlertaStock[]>([]);
  const [productosProximos, setProductosProximos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [tabActiva, setTabActiva] = useState('alertas');

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const [alertasData, productosData] = await Promise.all([
        InventarioService.obtenerAlertas({ resuelta: false }),
        InventarioService.obtenerCaducidades(30),
      ]);
      setAlertas(alertasData);
      setProductosProximos(productosData);
    } catch (error) {
      console.error('Error al cargar datos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleResolverAlerta = async (id: string) => {
    try {
      await InventarioService.resolverAlerta(id);
      cargarDatos();
      onAlertUpdate?.();
    } catch (error) {
      console.error('Error al resolver alerta:', error);
      alert('Error al resolver alerta');
    }
  };

  const getSeveridadColor = (severidad: AlertaStock['severidad']): 'red' | 'yellow' | 'green' => {
    switch (severidad) {
      case 'critica':
        return 'red';
      case 'alta':
        return 'red';
      case 'media':
        return 'yellow';
      default:
        return 'green';
    }
  };

  const tabs = [
    {
      id: 'alertas',
      label: 'Alertas Activas',
      icon: <AlertTriangle className="w-4 h-4" />
    },
    {
      id: 'caducidades',
      label: 'Próximos a Vencer',
      icon: <Calendar className="w-4 h-4" />
    }
  ];

  const alertasColumns = [
    {
      key: 'productoNombre',
      label: 'Producto',
      sortable: true,
    },
    {
      key: 'tipo',
      label: 'Tipo de Alerta',
      render: (value: AlertaStock['tipo']) => {
        const tipos = {
          stock_bajo: 'Stock Bajo',
          stock_agotado: 'Stock Agotado',
          caducidad_proxima: 'Caducidad Próxima',
          caducidad_vencida: 'Caducidad Vencida',
        };
        return <span>{tipos[value] || value}</span>;
      },
    },
    {
      key: 'severidad',
      label: 'Severidad',
      render: (value: AlertaStock['severidad']) => (
        <Badge variant={getSeveridadColor(value)}>
          {value.toUpperCase()}
        </Badge>
      ),
    },
    {
      key: 'mensaje',
      label: 'Mensaje',
      render: (value: string, row: AlertaStock) => (
        <div>
          <p className="text-sm text-gray-900">
            {value}
          </p>
          {row.stockActual !== undefined && (
            <p className="text-xs text-gray-500">
              Stock actual: {row.stockActual} | Mínimo: {row.stockMinimo}
            </p>
          )}
        </div>
      ),
    },
    {
      key: 'diasParaVencimiento',
      label: 'Días Restantes',
      render: (value: number | undefined) => {
        if (value === undefined) return <span>-</span>;
        return (
          <span className={value <= 7 ? 'text-red-600' : 'text-yellow-600'}>
            {value} días
          </span>
        );
      },
    },
    {
      key: 'acciones',
      label: 'Acciones',
      render: (_: any, row: AlertaStock) => (
        <Button
          variant="primary"
          size="sm"
          onClick={() => handleResolverAlerta(row.id)}
        >
          <CheckCircle className="w-4 h-4 mr-2" />
          Resolver
        </Button>
      ),
    },
  ];

  const productosColumns = [
    {
      key: 'codigo',
      label: 'Código',
      sortable: true,
    },
    {
      key: 'nombre',
      label: 'Producto',
      sortable: true,
    },
    {
      key: 'fechaCaducidad',
      label: 'Fecha de Caducidad',
      render: (value: Date | undefined) => {
        if (!value) return <span>-</span>;
        const hoy = new Date();
        const diasRestantes = Math.ceil((value.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24));
        return (
          <div>
            <p className="text-sm text-gray-900">
              {value.toLocaleDateString('es-CO')}
            </p>
            <p className={`text-xs ${
              diasRestantes <= 7 ? 'text-red-600' : 'text-yellow-600'
            }`}>
              {diasRestantes} días restantes
            </p>
          </div>
        );
      },
    },
    {
      key: 'stockActual',
      label: 'Stock Actual',
      align: 'center' as const,
      render: (value: number) => (
        <span className="text-base font-semibold text-gray-900">
          {value}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Sistema de Tabs */}
      <Card className="p-0 bg-white shadow-sm">
        <div className="px-4 py-3">
          <div
            role="tablist"
            aria-label="Secciones de alertas"
            className="flex items-center gap-2 rounded-2xl bg-slate-100 p-1"
          >
            {tabs.map((tab) => {
              const activo = tabActiva === tab.id;
              return (
                <button
                  key={tab.id}
                  role="tab"
                  aria-selected={activo}
                  onClick={() => setTabActiva(tab.id)}
                  className={[
                    'inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all',
                    activo
                      ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
                  ].join(' ')}
                >
                  <span className={activo ? 'opacity-100' : 'opacity-70'}>
                    {tab.icon}
                  </span>
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </Card>

      {/* Contenido de la pestaña activa */}
      <div className="mt-6">
        {tabActiva === 'alertas' && (
          <Table
            data={alertas}
            columns={alertasColumns}
            loading={loading}
            emptyMessage="No hay alertas activas"
          />
        )}

        {tabActiva === 'caducidades' && (
          <Table
            data={productosProximos}
            columns={productosColumns}
            loading={loading}
            emptyMessage="No hay productos próximos a vencer en los próximos 30 días"
          />
        )}
      </div>
    </div>
  );
};
