import React, { useMemo, useState } from 'react';
import { Card, TableWithActions, TableAction, TableColumn, Button } from '../../../components/componentsreutilizables';
import { getCalendario } from '../api/calendario';
import { Calendar, CalendarDays, CalendarRange, Download } from 'lucide-react';

type Role = 'entrenador' | 'gimnasio';

interface Evento {
  id: string;
  titulo: string;
  fecha: string; // ISO date
  horaInicio: string; // HH:mm
  horaFin: string; // HH:mm
  tipo: 'sesion' | 'clase' | 'evaluacion' | 'videollamada';
  capacidad?: number;
  ocupacion?: number;
}

interface Props {
  role: Role;
}

export const AgendaCalendar: React.FC<Props> = ({ role }) => {
  const [vista, setVista] = useState<'mes' | 'semana' | 'dia'>('mes');
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [fechaActual, setFechaActual] = useState<Date>(new Date());

  React.useEffect(() => {
    setLoading(true);
    getCalendario(role).then((data) => {
      setEventos(data);
      setLoading(false);
    });
  }, [role]);

  const vistaTabs = useMemo(() => [
    { id: 'mes', label: 'Mes', icon: Calendar },
    { id: 'semana', label: 'Semana', icon: CalendarDays },
    { id: 'dia', label: 'Día', icon: CalendarRange },
  ], []);

  const columns: TableColumn<Evento>[] = [
    { key: 'titulo', label: 'Título', sortable: true },
    { 
      key: 'tipo', 
      label: 'Tipo',
      render: (evento: Evento) => {
        const tipos: Record<string, string> = {
          'sesion': 'Sesión',
          'clase': 'Clase',
          'evaluacion': 'Evaluación',
          'videollamada': 'Videollamada',
        };
        return tipos[evento.tipo] || evento.tipo;
      },
    },
    { 
      key: 'fecha', 
      label: 'Fecha', 
      sortable: true,
      render: (evento: Evento) => new Date(evento.fecha).toLocaleDateString('es-ES'),
    },
    { key: 'horaInicio', label: 'Inicio' },
    { key: 'horaFin', label: 'Fin' },
    ...(role === 'gimnasio' ? [
      { key: 'capacidad', label: 'Capacidad' },
      { 
        key: 'ocupacion', 
        label: 'Ocupación',
        render: (evento: Evento) => `${evento.ocupacion}/${evento.capacidad}`,
      },
    ] : []),
  ];

  const actions: TableAction<Evento>[] = [
    {
      label: 'Ver',
      variant: 'ghost',
      onClick: (row) => console.log('Ver evento', row),
    },
    {
      label: role === 'entrenador' ? 'Editar' : 'Editar clase',
      variant: 'secondary',
      onClick: (row) => console.log('Editar', row),
    },
    {
      label: 'Eliminar',
      variant: 'destructive',
      onClick: (row) => console.log('Eliminar', row),
    },
  ];

  // Función para generar calendario mensual
  const generarCalendarioMensual = () => {
    const year = fechaActual.getFullYear();
    const month = fechaActual.getMonth();
    
    const primerDia = new Date(year, month, 1);
    const ultimoDia = new Date(year, month + 1, 0);
    const diasEnMes = ultimoDia.getDate();
    const inicioSemana = primerDia.getDay(); // 0 (Domingo) a 6 (Sábado)
    
    const semanas: (Date | null)[][] = [];
    let semanaActual: (Date | null)[] = [];
    
    // Rellenar inicio de la primera semana con nulls
    for (let i = 0; i < inicioSemana; i++) {
      semanaActual.push(null);
    }
    
    // Agregar los días del mes
    for (let dia = 1; dia <= diasEnMes; dia++) {
      semanaActual.push(new Date(year, month, dia));
      
      if (semanaActual.length === 7) {
        semanas.push(semanaActual);
        semanaActual = [];
      }
    }
    
    // Rellenar el final de la última semana si es necesario
    while (semanaActual.length < 7 && semanaActual.length > 0) {
      semanaActual.push(null);
    }
    if (semanaActual.length > 0) {
      semanas.push(semanaActual);
    }
    
    return semanas;
  };

  // Obtener eventos de un día específico
  const getEventosDelDia = (fecha: Date | null): Evento[] => {
    if (!fecha) return [];
    const year = fecha.getFullYear();
    const month = String(fecha.getMonth() + 1).padStart(2, '0');
    const day = String(fecha.getDate()).padStart(2, '0');
    const fechaStr = `${year}-${month}-${day}`;
    return eventos.filter(e => e.fecha === fechaStr);
  };

  const semanas = generarCalendarioMensual();
  const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  const diasSemana = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  const cambiarMes = (direccion: number) => {
    setFechaActual(new Date(fechaActual.getFullYear(), fechaActual.getMonth() + direccion, 1));
  };

  const getColorEvento = (tipo: string) => {
    const colores: Record<string, string> = {
      'sesion': 'bg-blue-500',
      'clase': 'bg-purple-500',
      'evaluacion': 'bg-green-500',
      'videollamada': 'bg-orange-500',
    };
    return colores[tipo] || 'bg-gray-500';
  };

  return (
    <div className="space-y-6">
      <Card className="p-4 bg-white shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Vista:</span>
            <div className="flex items-center gap-2 rounded-2xl bg-slate-100 p-1">
              {vistaTabs.map(({ id, label, icon: Icon }) => {
                const activo = vista === id;
                return (
                  <button
                    key={id}
                    onClick={() => setVista(id as typeof vista)}
                    className={[
                      'inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all',
                      activo
                        ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
                    ].join(' ')}
                  >
                    <Icon size={18} className={activo ? 'opacity-100' : 'opacity-70'} />
                    <span>{label}</span>
                  </button>
                );
              })}
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={() => setFechaActual(new Date())}>Hoy</Button>
            <Button variant="secondary" size="sm">
              <Download size={16} className="mr-2" />
              Exportar
            </Button>
          </div>
        </div>
      </Card>

      {vista === 'mes' ? (
        <Card className="p-6 bg-white shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <button
              onClick={() => cambiarMes(-1)}
              className="flex items-center justify-center w-10 h-10 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <span className="text-2xl text-gray-600">‹</span>
            </button>
            <h2 className="text-xl font-bold text-gray-900">
              {meses[fechaActual.getMonth()]} {fechaActual.getFullYear()}
            </h2>
            <button
              onClick={() => cambiarMes(1)}
              className="flex items-center justify-center w-10 h-10 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <span className="text-2xl text-gray-600">›</span>
            </button>
          </div>
          
          <div className="grid grid-cols-7 gap-1">
            {diasSemana.map(dia => (
              <div key={dia} className="text-center py-2 text-sm font-semibold text-gray-700">
                {dia}
              </div>
            ))}
            
            {semanas.map((semana, idx) => 
              semana.map((dia, idxDia) => {
                const eventosDelDia = getEventosDelDia(dia);
                const esHoy = dia && dia.toDateString() === new Date().toDateString();
                const esOtroMes = dia && dia.getMonth() !== fechaActual.getMonth();
                
                return (
                  <div
                    key={`${idx}-${idxDia}`}
                    className={`min-h-[100px] p-2 border border-gray-200 rounded-lg ${
                      esHoy ? 'ring-2 ring-blue-500 bg-blue-50' : 'bg-white hover:bg-gray-50'
                    } ${esOtroMes ? 'opacity-40' : ''}`}
                  >
                    {dia && (
                      <>
                        <div className={`text-sm font-semibold mb-1 ${esHoy ? 'text-blue-700' : 'text-gray-900'}`}>
                          {dia.getDate()}
                        </div>
                        <div className="space-y-1">
                          {eventosDelDia.slice(0, 2).map(evento => (
                            <div
                              key={evento.id}
                              className={`text-xs px-1 py-0.5 rounded ${getColorEvento(evento.tipo)} text-white truncate cursor-pointer hover:opacity-80`}
                              title={evento.titulo}
                            >
                              {evento.titulo}
                            </div>
                          ))}
                          {eventosDelDia.length > 2 && (
                            <div className="text-xs text-gray-600 font-semibold">
                              +{eventosDelDia.length - 2} más
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </Card>
      ) : (
        <Card className="p-0 bg-white shadow-sm">
          <TableWithActions<Evento>
            data={eventos}
            columns={columns}
            actions={actions}
            loading={loading}
            emptyMessage={role === 'entrenador' ? 'Sin sesiones programadas' : 'Sin clases programadas'}
          />
        </Card>
      )}
    </div>
  );
};