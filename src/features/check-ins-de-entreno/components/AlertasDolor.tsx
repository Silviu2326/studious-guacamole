import React from 'react';
import { Card, Badge, Button } from '../../../components/componentsreutilizables';
import { AlertTriangle, CheckCircle, XCircle, Bell } from 'lucide-react';
import { AlertaCheckIn } from '../api/alertas';

interface AlertasDolorProps {
  alertas: AlertaCheckIn[];
  onResolver: (alertaId: string) => void;
}

export const AlertasDolor: React.FC<AlertasDolorProps> = ({
  alertas,
  onResolver,
}) => {
  const alertasNoResueltas = alertas.filter((a) => !a.resuelta);
  const alertasResueltas = alertas.filter((a) => a.resuelta);

  // Estadísticas de alertas
  const estadisticas = {
    total: alertasNoResueltas.length,
    critica: alertasNoResueltas.filter(a => a.severidad === 'critica').length,
    alta: alertasNoResueltas.filter(a => a.severidad === 'alta').length,
    media: alertasNoResueltas.filter(a => a.severidad === 'media').length,
    baja: alertasNoResueltas.filter(a => a.severidad === 'baja').length,
    porTipo: {
      dolor_lumbar: alertasNoResueltas.filter(a => a.tipo === 'dolor_lumbar').length,
      fatiga_extrema: alertasNoResueltas.filter(a => a.tipo === 'fatiga_extrema').length,
      patron_negativo: alertasNoResueltas.filter(a => a.tipo === 'patron_negativo').length,
      sensacion_alerta: alertasNoResueltas.filter(a => a.tipo === 'sensacion_alerta').length,
    },
  };

  const getSeveridadColor = (severidad: string) => {
    switch (severidad) {
      case 'critica':
        return 'bg-red-600';
      case 'alta':
        return 'bg-orange-600';
      case 'media':
        return 'bg-yellow-600';
      default:
        return 'bg-blue-600';
    }
  };

  const getSeveridadBadgeColor = (severidad: string) => {
    switch (severidad) {
      case 'critica':
        return 'bg-red-100 text-red-700 border-red-300';
      case 'alta':
        return 'bg-orange-100 text-orange-700 border-orange-300';
      case 'media':
        return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      default:
        return 'bg-blue-100 text-blue-700 border-blue-300';
    }
  };

  const getIconoSeveridad = (severidad: string) => {
    switch (severidad) {
      case 'critica':
      case 'alta':
        return <XCircle size={20} />;
      case 'media':
        return <AlertTriangle size={20} />;
      default:
        return <Bell size={20} />;
    }
  };

  if (alertasNoResueltas.length === 0 && alertasResueltas.length === 0) {
    return (
      <Card className="p-8 text-center bg-white shadow-sm">
        <CheckCircle size={48} className="mx-auto text-green-500 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Sin Alertas
        </h3>
        <p className="text-gray-600">No hay alertas activas</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Estadísticas de Alertas */}
      {alertasNoResueltas.length > 0 && (
        <Card className="p-6 bg-white shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Bell size={20} className="text-blue-600" />
            Resumen de Alertas
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="p-3 rounded-lg bg-red-50 border border-red-200">
              <div className="text-xl font-bold text-red-600 mb-1">{estadisticas.critica}</div>
              <div className="text-xs text-slate-600">Críticas</div>
            </div>
            <div className="p-3 rounded-lg bg-orange-50 border border-orange-200">
              <div className="text-xl font-bold text-orange-600 mb-1">{estadisticas.alta}</div>
              <div className="text-xs text-slate-600">Alta</div>
            </div>
            <div className="p-3 rounded-lg bg-yellow-50 border border-yellow-200">
              <div className="text-xl font-bold text-yellow-600 mb-1">{estadisticas.media}</div>
              <div className="text-xs text-slate-600">Media</div>
            </div>
            <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
              <div className="text-xl font-bold text-blue-600 mb-1">{estadisticas.baja}</div>
              <div className="text-xs text-slate-600">Baja</div>
            </div>
          </div>
          <div className="pt-4 border-t border-slate-200">
            <h4 className="text-sm font-semibold text-slate-700 mb-2">Alertas por Tipo:</h4>
            <div className="flex flex-wrap gap-2">
              <span className="text-xs px-2 py-1 rounded bg-red-100 text-red-700">
                Dolor Lumbar: {estadisticas.porTipo.dolor_lumbar}
              </span>
              <span className="text-xs px-2 py-1 rounded bg-orange-100 text-orange-700">
                Fatiga: {estadisticas.porTipo.fatiga_extrema}
              </span>
              <span className="text-xs px-2 py-1 rounded bg-yellow-100 text-yellow-700">
                Patrón Negativo: {estadisticas.porTipo.patron_negativo}
              </span>
              <span className="text-xs px-2 py-1 rounded bg-purple-100 text-purple-700">
                Sensación: {estadisticas.porTipo.sensacion_alerta}
              </span>
            </div>
          </div>
        </Card>
      )}

      {alertasNoResueltas.length > 0 && (
        <Card className="p-4 bg-white shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <AlertTriangle size={20} className="text-orange-500" />
              Alertas Activas
            </h3>
            <Badge variant="destructive">{alertasNoResueltas.length}</Badge>
          </div>

          <div className="space-y-4">
            {alertasNoResueltas.map((alerta) => (
              <div
                key={alerta.id}
                className={`p-4 rounded-xl border-l-4 ${getSeveridadColor(alerta.severidad)} bg-white shadow-sm ring-1 ring-slate-200`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getIconoSeveridad(alerta.severidad)}
                    <span className="font-semibold text-gray-900">{alerta.tipo.replace('_', ' ')}</span>
                  </div>
                  <Badge className={`${getSeveridadBadgeColor(alerta.severidad)} border`}>
                    {alerta.severidad.charAt(0).toUpperCase() + alerta.severidad.slice(1)}
                  </Badge>
                </div>
                <p className="text-slate-700 mb-2">{alerta.mensaje}</p>
                {alerta.recomendacion && (
                  <p className="text-sm text-slate-600 mb-3">
                    <strong>Recomendación:</strong> {alerta.recomendacion}
                  </p>
                )}
                <p className="text-xs text-slate-500 mb-3">
                  {new Date(alerta.fecha).toLocaleDateString('es-ES', {
                    day: '2-digit',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => alerta.id && onResolver(alerta.id)}
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Marcar como Resuelta
                </Button>
              </div>
            ))}
          </div>
        </Card>
      )}

      {alertasResueltas.length > 0 && (
        <Card className="p-4 bg-white shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <CheckCircle size={20} className="text-green-500" />
            Alertas Resueltas
          </h3>
          <div className="space-y-2">
            {alertasResueltas.slice(0, 5).map((alerta) => (
              <div
                key={alerta.id}
                className="p-3 rounded-xl bg-slate-50 ring-1 ring-slate-200"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-700">{alerta.mensaje}</span>
                  <CheckCircle size={16} className="text-green-500" />
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

