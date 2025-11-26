import React, { useState, useMemo } from 'react';
import { AlertaVencimiento, AccionAlerta, PrioridadAlerta } from '../types';
import { Card, Button, Select, MetricCards, MetricCardData } from '../../../components/componentsreutilizables';
import { Bell, Check, X, Clock, Phone, Mail, Loader2, AlertCircle, AlertTriangle, Eye } from 'lucide-react';

interface AlertasVencimientoProps {
  alertas: AlertaVencimiento[];
  onMarkAsRead: (alertaId: string) => Promise<void>;
  onProcessAlerta: (alertaId: string, accion: AccionAlerta) => Promise<void>;
  onDismissAlerta: (alertaId: string) => Promise<void>;
  loading?: boolean;
}

export const AlertasVencimiento: React.FC<AlertasVencimientoProps> = ({
  alertas,
  onMarkAsRead,
  onProcessAlerta,
  onDismissAlerta,
  loading = false,
}) => {
  const [filter, setFilter] = useState<'todas' | 'no-leidas' | 'urgentes'>('todas');

  const filteredAlertas = useMemo(() => {
    return alertas.filter(alerta => {
      if (filter === 'todas') return true;
      if (filter === 'no-leidas') return !alerta.leida;
      if (filter === 'urgentes') return alerta.prioridad === 'alta';
      return true;
    });
  }, [alertas, filter]);

  // Calcular métricas
  const metricas = useMemo(() => {
    const total = alertas.length;
    const noLeidas = alertas.filter(a => !a.leida).length;
    const urgentes = alertas.filter(a => a.prioridad === 'alta').length;
    const porVencer = alertas.filter(a => a.diasRestantes <= 7).length;
    
    return {
      total,
      noLeidas,
      urgentes,
      porVencer,
    };
  }, [alertas]);

  const metricCards: MetricCardData[] = [
    {
      id: 'total-alertas',
      title: 'Total Alertas',
      value: metricas.total.toString(),
      subtitle: 'Alertas activas',
      color: 'info',
      icon: <Bell className="w-6 h-6" />,
    },
    {
      id: 'no-leidas',
      title: 'No Leídas',
      value: metricas.noLeidas.toString(),
      subtitle: 'Pendientes de revisar',
      color: 'warning',
      icon: <Eye className="w-6 h-6" />,
    },
    {
      id: 'urgentes',
      title: 'Urgentes',
      value: metricas.urgentes.toString(),
      subtitle: 'Alta prioridad',
      color: 'error',
      icon: <AlertTriangle className="w-6 h-6" />,
    },
    {
      id: 'por-vencer',
      title: 'Por Vencer',
      value: metricas.porVencer.toString(),
      subtitle: 'Menos de 7 días',
      color: metricas.porVencer > 5 ? 'error' : 'warning',
      icon: <Clock className="w-6 h-6" />,
    },
  ];

  const getPrioridadColor = (prioridad: PrioridadAlerta) => {
    switch (prioridad) {
      case 'alta':
        return 'border-red-500 bg-red-50';
      case 'media':
        return 'border-yellow-500 bg-yellow-50';
      case 'baja':
        return 'border-green-500 bg-green-50';
      default:
        return 'border-gray-500 bg-gray-50';
    }
  };

  const getPrioridadBadge = (prioridad: PrioridadAlerta) => {
    const prioridades = {
      alta: { bg: 'bg-red-100 text-red-800', text: 'Urgente' },
      media: { bg: 'bg-yellow-100 text-yellow-800', text: 'Media' },
      baja: { bg: 'bg-green-100 text-green-800', text: 'Baja' },
    };
    const pri = prioridades[prioridad];
    return (
      <span className={`px-2 py-1 rounded-lg text-xs font-semibold ${pri.bg}`}>
        {pri.text}
      </span>
    );
  };

  if (loading) {
    return (
      <Card className="p-8 text-center bg-white shadow-sm">
        <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
        <p className="text-gray-600">Cargando alertas...</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Métricas */}
      <MetricCards data={metricCards} columns={4} />

      {/* Toolbar Superior */}
      <div className="flex items-center justify-end">
        <Select
          value={filter}
          onChange={(e) => setFilter(e.target.value as typeof filter)}
          options={[
            { value: 'todas', label: 'Todas' },
            { value: 'no-leidas', label: 'No Leídas' },
            { value: 'urgentes', label: 'Urgentes' },
          ]}
          className="w-48"
          fullWidth={false}
        />
      </div>

      <div className="space-y-4">
        {filteredAlertas.length === 0 ? (
          <Card className="p-8 text-center bg-white shadow-sm">
            <Bell size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay alertas disponibles</h3>
            <p className="text-gray-600">No se encontraron alertas con los filtros seleccionados.</p>
          </Card>
        ) : (
          filteredAlertas.map(alerta => (
            <Card
              key={alerta.id}
              variant="hover"
              className={`p-6 bg-white shadow-sm ${
                !alerta.leida ? 'ring-2 ring-offset-2 ring-blue-500' : ''
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Bell className="w-5 h-5" />
                    <h3 className="font-semibold text-lg">{alerta.cliente.nombre}</h3>
                    {getPrioridadBadge(alerta.prioridad)}
                    {!alerta.leida && (
                      <span className="px-2 py-1 rounded-lg text-xs font-semibold bg-blue-100 text-blue-800">
                        Nueva
                      </span>
                    )}
                  </div>
                  <p className="text-gray-700 mb-2">{alerta.mensaje}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>
                      Vence: {new Date(alerta.fechaVencimiento).toLocaleDateString('es-ES')}
                    </span>
                    <span>{alerta.diasRestantes} días restantes</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-4 pt-3 border-t border-gray-100">
                {!alerta.leida && (
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => onMarkAsRead(alerta.id)}
                  >
                    <Check size={20} className="mr-2" />
                    Marcar como Leída
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="primary"
                  onClick={() => onProcessAlerta(alerta.id, 'renovar')}
                >
                  <Check size={20} className="mr-2" />
                  Renovar
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => onProcessAlerta(alerta.id, 'contactar')}
                >
                  <Phone size={20} className="mr-2" />
                  Contactar
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onProcessAlerta(alerta.id, 'posponer')}
                >
                  <Clock size={20} className="mr-2" />
                  Posponer
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onDismissAlerta(alerta.id)}
                >
                  <X size={20} />
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
