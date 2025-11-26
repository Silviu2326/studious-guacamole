import React, { useMemo } from 'react';
import { Archive, Search, MapPin, Video, Target, X, RotateCcw } from 'lucide-react';
import { Card, Button, Input, Badge } from '../../../components/componentsreutilizables';
import { Evento, TipoEvento } from '../api/events';

interface ArchivoEventosProps {
  eventos: Evento[];
  busqueda: string;
  tipoFiltro: TipoEvento | 'todos';
  onBusquedaChange: (busqueda: string) => void;
  onTipoFiltroChange: (tipo: TipoEvento | 'todos') => void;
  onDesarchivar: (eventoId: string) => void;
  onEventoClick: (evento: Evento) => void;
}

export const ArchivoEventos: React.FC<ArchivoEventosProps> = ({
  eventos,
  busqueda,
  tipoFiltro,
  onBusquedaChange,
  onTipoFiltroChange,
  onDesarchivar,
  onEventoClick,
}) => {
  // Filtrar eventos archivados
  const eventosArchivados = useMemo(() => {
    return eventos.filter(evento => {
      // Solo eventos archivados
      if (!evento.archivado) {
        return false;
      }

      // Filtrar por tipo
      if (tipoFiltro !== 'todos' && evento.tipo !== tipoFiltro) {
        return false;
      }

      // Filtrar por búsqueda
      if (busqueda) {
        const busquedaLower = busqueda.toLowerCase();
        return (
          evento.nombre.toLowerCase().includes(busquedaLower) ||
          evento.descripcion?.toLowerCase().includes(busquedaLower) ||
          evento.ubicacion?.toLowerCase().includes(busquedaLower) ||
          evento.plataforma?.toLowerCase().includes(busquedaLower)
        );
      }

      return true;
    }).sort((a, b) => {
      // Ordenar por fecha de archivado (más reciente primero)
      const fechaA = a.fechaArchivado || a.fechaInicio;
      const fechaB = b.fechaArchivado || b.fechaInicio;
      return fechaB.getTime() - fechaA.getTime();
    });
  }, [eventos, tipoFiltro, busqueda]);

  const getTipoBadge = (tipo: TipoEvento) => {
    const configs = {
      presencial: { label: 'Presencial', variant: 'blue' as const, icon: <MapPin className="w-3 h-3" /> },
      reto: { label: 'Reto', variant: 'purple' as const, icon: <Target className="w-3 h-3" /> },
      virtual: { label: 'Virtual', variant: 'green' as const, icon: <Video className="w-3 h-3" /> },
    };
    const config = configs[tipo];
    return (
      <Badge variant={config.variant} leftIcon={config.icon}>
        {config.label}
      </Badge>
    );
  };

  const getEstadoBadge = (estado: string) => {
    const configs: Record<string, { label: string; variant: 'gray' | 'blue' | 'green' | 'red' }> = {
      borrador: { label: 'Borrador', variant: 'gray' },
      programado: { label: 'Programado', variant: 'blue' },
      'en-curso': { label: 'En Curso', variant: 'green' },
      finalizado: { label: 'Finalizado', variant: 'gray' },
      cancelado: { label: 'Cancelado', variant: 'red' },
    };
    const config = configs[estado] || { label: estado, variant: 'gray' as const };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  return (
    <Card className="bg-white shadow-sm">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Archive className="w-6 h-6 text-gray-600" />
            <h2 className="text-xl font-bold text-gray-900">Archivo de Eventos</h2>
          </div>
          <div className="text-sm text-gray-500">
            {eventosArchivados.length} {eventosArchivados.length === 1 ? 'evento archivado' : 'eventos archivados'}
          </div>
        </div>

        {/* Filtros */}
        <div className="mb-6 space-y-4">
          {/* Búsqueda */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Buscar en archivo..."
              value={busqueda}
              onChange={(e) => onBusquedaChange(e.target.value)}
              className="pl-10"
            />
            {busqueda && (
              <button
                onClick={() => onBusquedaChange('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Filtro por tipo */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-medium text-gray-700">Tipo:</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onTipoFiltroChange('todos')}
              className={tipoFiltro === 'todos' ? 'bg-blue-100 text-blue-900' : ''}
            >
              Todos
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onTipoFiltroChange('presencial')}
              className={tipoFiltro === 'presencial' ? 'bg-blue-100 text-blue-900' : ''}
              leftIcon={<MapPin className="w-4 h-4" />}
            >
              Presencial
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onTipoFiltroChange('reto')}
              className={tipoFiltro === 'reto' ? 'bg-green-100 text-green-900' : ''}
              leftIcon={<Target className="w-4 h-4" />}
            >
              Reto
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onTipoFiltroChange('virtual')}
              className={tipoFiltro === 'virtual' ? 'bg-purple-100 text-purple-900' : ''}
              leftIcon={<Video className="w-4 h-4" />}
            >
              Virtual
            </Button>
          </div>
        </div>

        {/* Lista de eventos archivados */}
        {eventosArchivados.length === 0 ? (
          <div className="text-center py-12">
            <Archive className="mx-auto text-gray-400 mb-4" size={48} />
            <p className="text-gray-500 text-lg">
              {busqueda || tipoFiltro !== 'todos' 
                ? 'No se encontraron eventos archivados con los filtros seleccionados'
                : 'No hay eventos archivados'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {eventosArchivados.map((evento) => (
              <div
                key={evento.id}
                className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 cursor-pointer" onClick={() => onEventoClick(evento)}>
                    <div className="flex items-center gap-3 mb-2">
                      {getTipoBadge(evento.tipo)}
                      <h3 className="text-lg font-semibold text-gray-900">{evento.nombre}</h3>
                      {getEstadoBadge(evento.estado)}
                    </div>
                    {evento.descripcion && (
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">{evento.descripcion}</p>
                    )}
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>
                        Fecha: {evento.fechaInicio.toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </span>
                      {evento.fechaArchivado && (
                        <span>
                          Archivado: {evento.fechaArchivado.toLocaleDateString('es-ES', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </span>
                      )}
                      {evento.ubicacion && (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {evento.ubicacion}
                        </span>
                      )}
                      {evento.plataforma && (
                        <span className="flex items-center gap-1">
                          <Video className="w-4 h-4" />
                          {evento.plataforma}
                        </span>
                      )}
                      <span>
                        {evento.participantesDetalle?.length || 0} participantes
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDesarchivar(evento.id)}
                      leftIcon={<RotateCcw className="w-4 h-4" />}
                    >
                      Desarchivar
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
};


