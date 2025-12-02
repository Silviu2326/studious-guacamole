import React, { useState } from 'react';
import { Card } from '../../../components/componentsreutilizables';
import { Button } from '../../../components/componentsreutilizables';
import { Badge } from '../../../components/componentsreutilizables';
import {
  AlertCircle,
  Bell,
  CheckCircle2,
  Filter,
  X,
  TrendingDown,
  Activity,
  Dumbbell,
  User,
  Calendar,
} from 'lucide-react';
import type { AlertaEstancamiento } from '../types';

export const AlertasEstancamiento: React.FC = () => {
  const [severidadFiltro, setSeveridadFiltro] = useState<string>('todos');
  const [soloNoLeidas, setSoloNoLeidas] = useState(false);

  // Datos de ejemplo
  const alertasEjemplo: AlertaEstancamiento[] = [
    {
      id: '1',
      progresoId: 'p1',
      clienteId: 'c1',
      clienteNombre: 'Juan Pérez',
      tipo: 'fuerza',
      ejercicioId: 'e1',
      ejercicioNombre: 'Press Banca',
      diasSinProgreso: 21,
      severidad: 'alta',
      fecha: '2025-01-15',
      leida: false,
    },
    {
      id: '2',
      progresoId: 'p2',
      clienteId: 'c2',
      clienteNombre: 'María García',
      tipo: 'repeticiones',
      ejercicioId: 'e2',
      ejercicioNombre: 'Sentadilla',
      diasSinProgreso: 14,
      severidad: 'media',
      fecha: '2025-01-14',
      leida: true,
    },
  ];

  const getTipoIcon = (tipo: AlertaEstancamiento['tipo']) => {
    switch (tipo) {
      case 'fuerza':
        return <Dumbbell size={20} className="text-blue-600" />;
      case 'repeticiones':
        return <Activity size={20} className="text-green-600" />;
      case 'rango_movimiento':
        return <TrendingDown size={20} className="text-orange-600" />;
    }
  };

  const getSeveridadColor = (severidad: AlertaEstancamiento['severidad']) => {
    switch (severidad) {
      case 'alta':
        return 'red';
      case 'media':
        return 'yellow';
      case 'baja':
        return 'gray';
    }
  };

  const alertasFiltradas = alertasEjemplo.filter((alerta) => {
    if (severidadFiltro !== 'todos' && alerta.severidad !== severidadFiltro) {
      return false;
    }
    if (soloNoLeidas && alerta.leida) {
      return false;
    }
    return true;
  });

  const alertasNoLeidas = alertasEjemplo.filter((a) => !a.leida).length;

  return (
    <div className="space-y-6">
      {/* Toolbar Superior */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-red-100 rounded-lg">
            <Bell size={24} className="text-red-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Alertas de Estancamiento</h2>
            <p className="text-sm text-gray-600">
              {alertasNoLeidas} alertas sin leer
            </p>
          </div>
        </div>
        <Button variant="secondary" onClick={() => {}}>
          Marcar todas como leídas
        </Button>
      </div>

      {/* Sistema de Filtros */}
      <Card className="bg-white shadow-sm">
        <div className="p-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            {/* Filtro de severidad */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Severidad:</span>
              <select
                value={severidadFiltro}
                onChange={(e) => setSeveridadFiltro(e.target.value)}
                className="rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
              >
                <option value="todos">Todas</option>
                <option value="alta">Alta</option>
                <option value="media">Media</option>
                <option value="baja">Baja</option>
              </select>
            </div>

            {/* Checkbox solo no leídas */}
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={soloNoLeidas}
                onChange={(e) => setSoloNoLeidas(e.target.checked)}
                className="rounded ring-1 ring-slate-300"
              />
              <span className="text-sm text-gray-700">Solo no leídas</span>
            </label>
          </div>
        </div>
      </Card>

      {/* Lista de Alertas */}
      <div className="space-y-4">
        {alertasFiltradas.map((alerta) => (
          <Card
            key={alerta.id}
            variant="hover"
            className={`transition-shadow ${
              !alerta.leida ? 'ring-2 ring-blue-400 bg-blue-50/30' : ''
            }`}
          >
            <div className="p-4">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-red-100 rounded-lg flex-shrink-0">
                  <AlertCircle
                    size={24}
                    className={`${
                      alerta.severidad === 'alta'
                        ? 'text-red-600'
                        : alerta.severidad === 'media'
                        ? 'text-yellow-600'
                        : 'text-gray-600'
                    }`}
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-semibold text-gray-900">
                          Estancamiento Detectado
                        </h3>
                        <Badge variant={getSeveridadColor(alerta.severidad) as any}>
                          {alerta.severidad}
                        </Badge>
                        {!alerta.leida && (
                          <Badge variant="blue">Nueva</Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                        <span className="flex items-center gap-1">
                          <User size={14} />
                          {alerta.clienteNombre}
                        </span>
                        {alerta.ejercicioNombre && (
                          <span className="flex items-center gap-1">
                            {getTipoIcon(alerta.tipo)}
                            {alerta.ejercicioNombre}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {!alerta.leida && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {}}
                          title="Marcar como leída"
                        >
                          <CheckCircle2 size={16} />
                        </Button>
                      )}
                      <Button variant="ghost" size="sm" onClick={() => {}}>
                        <X size={16} />
                      </Button>
                    </div>
                  </div>

                  <div className="mt-3 p-3 bg-white rounded-xl ring-1 ring-gray-200">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Tipo:</span>
                        <span className="ml-2 font-medium text-gray-900">
                          {alerta.tipo === 'fuerza'
                            ? 'Fuerza'
                            : alerta.tipo === 'repeticiones'
                            ? 'Repeticiones'
                            : 'Rango de Movimiento'}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Días sin progreso:</span>
                        <span className="ml-2 font-medium text-red-600">
                          {alerta.diasSinProgreso} días
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-gray-600">
                        <Calendar size={14} />
                        <span>
                          {new Date(alerta.fecha).toLocaleDateString('es-ES')}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3">
                    <Button variant="primary" size="sm" onClick={() => {}}>
                      Ver Detalles del Progreso
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Estado vacío */}
      {alertasFiltradas.length === 0 && (
        <Card className="p-8 text-center bg-white shadow-sm">
          <CheckCircle2 size={48} className="mx-auto text-green-500 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No hay alertas activas
          </h3>
          <p className="text-gray-600">
            Todos los clientes están progresando correctamente
          </p>
        </Card>
      )}
    </div>
  );
};

