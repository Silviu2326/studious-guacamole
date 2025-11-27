import React, { useState, useEffect, useMemo } from 'react';
import { Card, Table, Button, Select } from '../../../components/componentsreutilizables';
import { Badge } from '../../../components/componentsreutilizables/Badge';
import { Reserva } from '../types';
import { getReservas, FiltrosReservas } from '../api';
import { useAuth } from '../../../context/AuthContext';
import { XCircle, Calendar, Clock, DollarSign, User, AlertTriangle, TrendingDown, Filter, Download } from 'lucide-react';
import * as XLSX from 'xlsx';

interface CancelacionesProps {
  role: 'entrenador' | 'gimnasio';
}

export const Cancelaciones: React.FC<CancelacionesProps> = ({ role }) => {
  const { user } = useAuth();
  const [reservasCanceladas, setReservasCanceladas] = useState<Reserva[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtroFecha, setFiltroFecha] = useState<'todas' | 'ultimo-mes' | 'ultimos-3-meses' | 'ultimo-ano'>('ultimo-mes');
  const [filtroCliente, setFiltroCliente] = useState<string>('todos');
  const [filtroTipoSesion, setFiltroTipoSesion] = useState<'todos' | 'presencial' | 'videollamada'>('todos');
  const [filtroQuienCancelo, setFiltroQuienCancelo] = useState<'todos' | 'cliente' | 'centro'>('todos');

  // Calcular fechas según el filtro seleccionado
  const rangoFechas = useMemo(() => {
    const hoy = new Date();
    const fechaFin = new Date(hoy);
    fechaFin.setHours(23, 59, 59, 999);
    
    let fechaInicio = new Date(hoy);
    
    switch (filtroFecha) {
      case 'ultimo-mes':
        fechaInicio.setMonth(fechaInicio.getMonth() - 1);
        break;
      case 'ultimos-3-meses':
        fechaInicio.setMonth(fechaInicio.getMonth() - 3);
        break;
      case 'ultimo-ano':
        fechaInicio.setFullYear(fechaInicio.getFullYear() - 1);
        break;
      default:
        fechaInicio = new Date(0); // Todas las fechas
    }
    
    fechaInicio.setHours(0, 0, 0, 0);
    return { fechaInicio, fechaFin };
  }, [filtroFecha]);

  // Cargar reservas canceladas
  useEffect(() => {
    const cargarCancelaciones = async () => {
      setLoading(true);
      try {
        const filtros: FiltrosReservas = {
          fechaInicio: rangoFechas.fechaInicio,
          fechaFin: rangoFechas.fechaFin,
          estado: ['canceladaCliente', 'canceladaCentro'],
        };
        
        const reservas = await getReservas(filtros, role);
        setReservasCanceladas(reservas);
      } catch (error) {
        console.error('Error cargando cancelaciones:', error);
      } finally {
        setLoading(false);
      }
    };

    cargarCancelaciones();
  }, [role, rangoFechas]);

  // Obtener lista única de clientes para el filtro
  const clientesUnicos = useMemo(() => {
    const clientesMap = new Map<string, { id: string; nombre: string }>();
    reservasCanceladas.forEach((reserva) => {
      if (!clientesMap.has(reserva.clienteId)) {
        clientesMap.set(reserva.clienteId, {
          id: reserva.clienteId,
          nombre: reserva.clienteNombre || 'Cliente desconocido',
        });
      }
    });
    return Array.from(clientesMap.values()).sort((a, b) => a.nombre.localeCompare(b.nombre));
  }, [reservasCanceladas]);

  // Filtrar reservas canceladas
  const reservasFiltradas = useMemo(() => {
    return reservasCanceladas.filter((reserva) => {
      // Filtro por cliente
      if (filtroCliente !== 'todos' && reserva.clienteId !== filtroCliente) {
        return false;
      }

      // Filtro por tipo de sesión
      if (filtroTipoSesion !== 'todos' && reserva.tipoSesion !== filtroTipoSesion) {
        return false;
      }

      // Filtro por quién canceló
      if (filtroQuienCancelo !== 'todos') {
        if (filtroQuienCancelo === 'cliente' && reserva.estado !== 'canceladaCliente') {
          return false;
        }
        if (filtroQuienCancelo === 'centro' && reserva.estado !== 'canceladaCentro') {
          return false;
        }
      }

      return true;
    });
  }, [reservasCanceladas, filtroCliente, filtroTipoSesion, filtroQuienCancelo]);

  // Calcular impacto económico
  const impactoEconomico = useMemo(() => {
    const total = reservasFiltradas.reduce((sum, reserva) => {
      return sum + (reserva.precio || 0);
    }, 0);
    
    const promedio = reservasFiltradas.length > 0 ? total / reservasFiltradas.length : 0;
    
    return {
      total,
      promedio,
      cantidad: reservasFiltradas.length,
    };
  }, [reservasFiltradas]);

  // Extraer motivo de cancelación de las observaciones
  const extraerMotivo = (reserva: Reserva): string => {
    if (reserva.observaciones) {
      // Buscar patrones comunes en las observaciones
      const obs = reserva.observaciones.toLowerCase();
      if (obs.includes('cancelada:')) {
        const partes = reserva.observaciones.split('Cancelada:');
        if (partes.length > 1) {
          return partes[1].trim();
        }
      }
      if (obs.includes('motivo')) {
        const partes = reserva.observaciones.split(/motivo[:\-]/i);
        if (partes.length > 1) {
          return partes[1].trim();
        }
      }
      // Si no hay patrón claro, devolver las observaciones completas
      return reserva.observaciones;
    }
    return 'No especificado';
  };

  // Determinar quién canceló
  const quienCancelo = (reserva: Reserva): { texto: string; tipo: 'cliente' | 'centro' } => {
    if (reserva.estado === 'canceladaCliente') {
      return { texto: 'Cliente', tipo: 'cliente' };
    }
    if (reserva.estado === 'canceladaCentro') {
      return { texto: role === 'entrenador' ? 'Entrenador' : 'Centro', tipo: 'centro' };
    }
    return { texto: 'Desconocido', tipo: 'centro' };
  };

  const columns = [
    {
      key: 'fecha',
      label: 'Fecha',
      render: (value: Date) => (
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-slate-600" />
          <span>{value.toLocaleDateString('es-ES')}</span>
        </div>
      ),
    },
    {
      key: 'horaInicio',
      label: 'Hora',
      render: (_: any, row: Reserva) => (
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-slate-600" />
          <span>{row.horaInicio} - {row.horaFin}</span>
        </div>
      ),
    },
    {
      key: 'clienteNombre',
      label: role === 'entrenador' ? 'Cliente' : 'Socio',
      render: (value: string) => (
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-slate-600" />
          <span>{value || 'Cliente desconocido'}</span>
        </div>
      ),
    },
    ...(role === 'gimnasio' ? [{
      key: 'claseNombre',
      label: 'Clase',
      render: (value: string) => value || '-',
    }] : []),
    {
      key: 'tipoSesion',
      label: 'Tipo',
      render: (_: any, row: Reserva) => {
        if (row.tipoSesion === 'videollamada') {
          return 'Videollamada';
        }
        return row.tipo === 'clase-grupal' ? 'Clase Grupal' : 'Presencial';
      },
    },
    {
      key: 'quienCancelo',
      label: 'Quién Canceló',
      render: (_: any, row: Reserva) => {
        const quien = quienCancelo(row);
        return (
          <Badge 
            variant={quien.tipo === 'cliente' ? 'yellow' : 'red'}
            leftIcon={<User className="w-3 h-3" />}
          >
            {quien.texto}
          </Badge>
        );
      },
    },
    {
      key: 'motivo',
      label: 'Motivo',
      render: (_: any, row: Reserva) => {
        const motivo = extraerMotivo(row);
        return (
          <div className="max-w-xs">
            <p className="text-sm text-gray-700 truncate" title={motivo}>
              {motivo}
            </p>
          </div>
        );
      },
    },
    {
      key: 'precio',
      label: 'Impacto Económico',
      render: (value: number) => (
        <div className="flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-red-600" />
          <span className="text-red-600 font-semibold">
            €{value.toFixed(2)}
          </span>
        </div>
      ),
      align: 'right' as const,
    },
  ];

  // Función para exportar a Excel
  const handleExportarAExcel = () => {
    if (reservasFiltradas.length === 0) {
      alert('No hay cancelaciones para exportar');
      return;
    }

    const datos = reservasFiltradas.map((reserva) => {
      const quien = quienCancelo(reserva);
      return {
        'Fecha': reserva.fecha.toLocaleDateString('es-ES'),
        'Hora': `${reserva.horaInicio} - ${reserva.horaFin}`,
        'Cliente': reserva.clienteNombre || 'Cliente desconocido',
        ...(role === 'gimnasio' && reserva.claseNombre ? { 'Clase': reserva.claseNombre } : {}),
        'Tipo Sesión': reserva.tipoSesion === 'videollamada' ? 'Videollamada' : 'Presencial',
        'Quién Canceló': quien.texto,
        'Motivo': extraerMotivo(reserva),
        'Impacto Económico (€)': (reserva.precio || 0).toFixed(2),
        'Fecha Creación': reserva.createdAt.toLocaleDateString('es-ES'),
        'Fecha Cancelación': reserva.updatedAt.toLocaleDateString('es-ES'),
      };
    });

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(datos);

    const columnWidths = [
      { wch: 12 }, // Fecha
      { wch: 15 }, // Hora
      { wch: 25 }, // Cliente
      ...(role === 'gimnasio' ? [{ wch: 20 }] : []), // Clase
      { wch: 15 }, // Tipo Sesión
      { wch: 15 }, // Quién Canceló
      { wch: 40 }, // Motivo
      { wch: 20 }, // Impacto Económico
      { wch: 15 }, // Fecha Creación
      { wch: 15 }, // Fecha Cancelación
    ];
    ws['!cols'] = columnWidths;

    XLSX.utils.book_append_sheet(wb, ws, 'Cancelaciones');

    const nombreArchivo = `Cancelaciones_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(wb, nombreArchivo);
  };

  return (
    <Card className="bg-white shadow-sm">
      <div className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <XCircle className="w-5 h-5 text-red-600" />
            <h3 className="text-xl font-bold text-gray-900">
              Cancelaciones
            </h3>
          </div>
          <Button
            variant="primary"
            onClick={handleExportarAExcel}
            leftIcon={<Download className="w-4 h-4" />}
            disabled={reservasFiltradas.length === 0}
          >
            Exportar a Excel
          </Button>
        </div>

        {/* Resumen de impacto económico */}
        {reservasFiltradas.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-red-50 rounded-lg border border-red-200">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <TrendingDown className="w-5 h-5 text-red-600" />
                <p className="text-sm font-medium text-gray-700">Total Cancelado</p>
              </div>
              <p className="text-2xl font-bold text-red-600">
                €{impactoEconomico.total.toFixed(2)}
              </p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <XCircle className="w-5 h-5 text-red-600" />
                <p className="text-sm font-medium text-gray-700">Cancelaciones</p>
              </div>
              <p className="text-2xl font-bold text-red-600">
                {impactoEconomico.cantidad}
              </p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <DollarSign className="w-5 h-5 text-red-600" />
                <p className="text-sm font-medium text-gray-700">Promedio por Cancelación</p>
              </div>
              <p className="text-2xl font-bold text-red-600">
                €{impactoEconomico.promedio.toFixed(2)}
              </p>
            </div>
          </div>
        )}

        {/* Filtros */}
        <div className="space-y-4">
          {/* Filtro por período */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">Período:</span>
            </div>
            <div className="flex gap-2">
              {(['todas', 'ultimo-mes', 'ultimos-3-meses', 'ultimo-ano'] as const).map((periodo) => (
                <button
                  key={periodo}
                  onClick={() => setFiltroFecha(periodo)}
                  className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                    filtroFecha === periodo
                      ? 'bg-red-100 text-red-700 border border-red-200'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {periodo === 'todas' ? 'Todas' :
                   periodo === 'ultimo-mes' ? 'Último mes' :
                   periodo === 'ultimos-3-meses' ? 'Últimos 3 meses' :
                   'Último año'}
                </button>
              ))}
            </div>
          </div>

          {/* Filtro por cliente */}
          {role === 'entrenador' && (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">Filtrar por cliente:</span>
              </div>
              <div className="w-64">
                <Select
                  value={filtroCliente}
                  onChange={(e) => setFiltroCliente(e.target.value)}
                  options={[
                    { value: 'todos', label: 'Todos los clientes' },
                    ...clientesUnicos.map((cliente) => ({
                      value: cliente.id,
                      label: cliente.nombre,
                    })),
                  ]}
                  placeholder="Selecciona un cliente"
                  fullWidth={false}
                  className="w-full"
                />
              </div>
              {filtroCliente !== 'todos' && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setFiltroCliente('todos')}
                  className="text-sm"
                >
                  Limpiar filtro
                </Button>
              )}
            </div>
          )}

          {/* Filtro por tipo de sesión */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">Tipo de sesión:</span>
            </div>
            <div className="w-64">
              <Select
                value={filtroTipoSesion}
                onChange={(e) => setFiltroTipoSesion(e.target.value as 'todos' | 'presencial' | 'videollamada')}
                options={[
                  { value: 'todos', label: 'Todos los tipos' },
                  { value: 'presencial', label: 'Presencial' },
                  { value: 'videollamada', label: 'Videollamada' },
                ]}
                placeholder="Selecciona un tipo"
                fullWidth={false}
                className="w-full"
              />
            </div>
            {filtroTipoSesion !== 'todos' && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setFiltroTipoSesion('todos')}
                className="text-sm"
              >
                Limpiar filtro
              </Button>
            )}
          </div>

          {/* Filtro por quién canceló */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">Quién canceló:</span>
            </div>
            <div className="w-64">
              <Select
                value={filtroQuienCancelo}
                onChange={(e) => setFiltroQuienCancelo(e.target.value as 'todos' | 'cliente' | 'centro')}
                options={[
                  { value: 'todos', label: 'Todos' },
                  { value: 'cliente', label: 'Cliente' },
                  { value: 'centro', label: role === 'entrenador' ? 'Entrenador' : 'Centro' },
                ]}
                placeholder="Selecciona"
                fullWidth={false}
                className="w-full"
              />
            </div>
            {filtroQuienCancelo !== 'todos' && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setFiltroQuienCancelo('todos')}
                className="text-sm"
              >
                Limpiar filtro
              </Button>
            )}
          </div>

          {/* Limpiar todos los filtros */}
          {(filtroCliente !== 'todos' || filtroTipoSesion !== 'todos' || filtroQuienCancelo !== 'todos' || filtroFecha !== 'ultimo-mes') && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setFiltroCliente('todos');
                setFiltroTipoSesion('todos');
                setFiltroQuienCancelo('todos');
                setFiltroFecha('ultimo-mes');
              }}
              className="text-sm"
            >
              Limpiar todos los filtros
            </Button>
          )}
        </div>

        <Table
          data={reservasFiltradas}
          columns={columns}
          loading={loading}
          emptyMessage="No hay cancelaciones registradas"
          getRowProps={(row: Reserva) => {
            return {
              className: 'border-l-4 border-l-red-500',
            };
          }}
        />
      </div>
    </Card>
  );
};
