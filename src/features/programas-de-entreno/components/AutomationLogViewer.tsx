/**
 * Componente para visualizar logs de automatizaciones
 * User Story: Como coach quiero disponer de un log detallado de cada automatización aplicada
 */

import { useState, useMemo } from 'react';
import {
  History,
  Filter,
  X,
  ChevronDown,
  ChevronRight,
  CheckCircle,
  XCircle,
  Info,
  Calendar,
  User,
  FileText,
  Tag,
} from 'lucide-react';
import { Button, Modal, Card, Badge, Select, Input } from '../../../components/componentsreutilizables';
import { 
  obtenerLogsAutomatizaciones, 
  type LogAutomatizacion,
  type TipoAutomatizacion 
} from '../utils/automationLog';

type AutomationLogViewerProps = {
  open: boolean;
  onClose: () => void;
  programaId?: string;
  clienteId?: string;
};

const tipoLabels: Record<TipoAutomatizacion, string> = {
  regla_inteligente: 'Regla Inteligente',
  bulk_automation: 'Automatización Masiva',
  regla_encadenada: 'Regla Encadenada',
  automatizacion_recurrente: 'Automatización Recurrente',
  sustitucion_manual: 'Sustitución Manual',
  batch_operation: 'Operación Batch',
};

const tipoColors: Record<TipoAutomatizacion, 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'gray'> = {
  regla_inteligente: 'blue',
  bulk_automation: 'green',
  regla_encadenada: 'purple',
  automatizacion_recurrente: 'orange',
  sustitucion_manual: 'red',
  batch_operation: 'gray',
};

export function AutomationLogViewer({ 
  open, 
  onClose, 
  programaId, 
  clienteId 
}: AutomationLogViewerProps) {
  const [filtroTipo, setFiltroTipo] = useState<TipoAutomatizacion | 'todos'>('todos');
  const [busqueda, setBusqueda] = useState('');
  const [logExpandido, setLogExpandido] = useState<string | null>(null);

  const logs = useMemo(() => {
    return obtenerLogsAutomatizaciones({
      programaId,
      clienteId,
      tipo: filtroTipo !== 'todos' ? filtroTipo : undefined,
    });
  }, [programaId, clienteId, filtroTipo]);

  const logsFiltrados = useMemo(() => {
    if (!busqueda.trim()) return logs;
    
    const busquedaLower = busqueda.toLowerCase();
    return logs.filter(log => 
      log.nombre.toLowerCase().includes(busquedaLower) ||
      log.descripcion?.toLowerCase().includes(busquedaLower) ||
      log.cambios.some(c => 
        c.sesionNombre?.toLowerCase().includes(busquedaLower) ||
        c.propiedad?.toLowerCase().includes(busquedaLower)
      )
    );
  }, [logs, busqueda]);

  const formatearFecha = (fecha: string) => {
    const date = new Date(fecha);
    return new Intl.DateTimeFormat('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const toggleLog = (logId: string) => {
    setLogExpandido(logExpandido === logId ? null : logId);
  };

  const getTipoCambioLabel = (tipo: string) => {
    const labels: Record<string, string> = {
      sesion_agregada: 'Sesión agregada',
      sesion_eliminada: 'Sesión eliminada',
      sesion_modificada: 'Sesión modificada',
      sesion_movida: 'Sesión movida',
      sesion_duplicada: 'Sesión duplicada',
      propiedad_modificada: 'Propiedad modificada',
      dia_modificado: 'Día modificado',
    };
    return labels[tipo] || tipo;
  };

  const getTipoCambioColor = (tipo: string): 'green' | 'red' | 'blue' | 'yellow' => {
    if (tipo.includes('agregada') || tipo.includes('duplicada')) return 'green';
    if (tipo.includes('eliminada')) return 'red';
    if (tipo.includes('modificada') || tipo.includes('movida')) return 'blue';
    return 'yellow';
  };

  return (
    <Modal
      open={open}
      onOpenChange={onClose}
      title="Log de Automatizaciones"
      description="Historial detallado de todas las automatizaciones aplicadas"
      size="xl"
    >
      <div className="space-y-4">
        {/* Filtros */}
        <div className="flex gap-3">
          <div className="flex-1">
            <Input
              placeholder="Buscar en logs..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              leftIcon={<Filter className="h-4 w-4" />}
            />
          </div>
          <Select
            options={[
              { label: 'Todos los tipos', value: 'todos' },
              ...Object.entries(tipoLabels).map(([value, label]) => ({
                label,
                value,
              })),
            ]}
            value={filtroTipo}
            onChange={(e) => setFiltroTipo(e.target.value as TipoAutomatizacion | 'todos')}
            className="w-48"
          />
        </div>

        {/* Lista de logs */}
        <div className="max-h-[600px] space-y-3 overflow-y-auto">
          {logsFiltrados.length === 0 ? (
            <Card className="p-8 text-center">
              <History className="mx-auto h-12 w-12 text-slate-400 mb-3" />
              <p className="text-slate-600 dark:text-slate-400">
                No hay logs de automatizaciones para mostrar
              </p>
            </Card>
          ) : (
            logsFiltrados.map((log) => (
              <Card key={log.id} className="p-4">
                <div className="space-y-3">
                  {/* Header del log */}
                  <div 
                    className="flex items-start justify-between cursor-pointer"
                    onClick={() => toggleLog(log.id)}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge 
                          variant={tipoColors[log.tipo] as any}
                          className="text-xs"
                        >
                          {tipoLabels[log.tipo]}
                        </Badge>
                        <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                          {log.nombre}
                        </h3>
                        {log.resultado.exito ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-500" />
                        )}
                      </div>
                      {log.descripcion && (
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                          {log.descripcion}
                        </p>
                      )}
                      <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatearFecha(log.fechaAplicacion)}
                        </div>
                        <div className="flex items-center gap-1">
                          <FileText className="h-3 w-3" />
                          {log.resultado.sesionesAfectadas} sesión(es)
                        </div>
                        <div className="flex items-center gap-1">
                          <Tag className="h-3 w-3" />
                          {log.resultado.diasAfectados} día(s)
                        </div>
                      </div>
                    </div>
                    <div className="ml-4">
                      {logExpandido === log.id ? (
                        <ChevronDown className="h-5 w-5 text-slate-400" />
                      ) : (
                        <ChevronRight className="h-5 w-5 text-slate-400" />
                      )}
                    </div>
                  </div>

                  {/* Detalles expandidos */}
                  {logExpandido === log.id && (
                    <div className="mt-4 space-y-4 border-t border-slate-200 dark:border-slate-700 pt-4">
                      {/* Condiciones */}
                      {log.condiciones.length > 0 && (
                        <div>
                          <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
                            <Info className="h-4 w-4" />
                            Condiciones aplicadas
                          </h4>
                          <div className="space-y-1">
                            {log.condiciones.map((condicion, idx) => (
                              <div 
                                key={idx}
                                className="text-xs bg-slate-50 dark:bg-slate-800 rounded px-2 py-1"
                              >
                                <span className="font-medium">{condicion.tipo}</span>
                                {condicion.operador && (
                                  <span className="mx-1 text-slate-500">({condicion.operador})</span>
                                )}
                                : <span className="text-slate-600 dark:text-slate-400">{String(condicion.valor)}</span>
                                {condicion.resultado ? (
                                  <CheckCircle className="inline h-3 w-3 text-green-500 ml-2" />
                                ) : (
                                  <XCircle className="inline h-3 w-3 text-red-500 ml-2" />
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Cambios detallados */}
                      {log.cambios.length > 0 && (
                        <div>
                          <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                            Cambios realizados ({log.cambios.length})
                          </h4>
                          <div className="space-y-2 max-h-64 overflow-y-auto">
                            {log.cambios.map((cambio, idx) => (
                              <div 
                                key={idx}
                                className="text-xs bg-slate-50 dark:bg-slate-800 rounded p-2 border-l-2"
                                style={{
                                  borderLeftColor: 
                                    getTipoCambioColor(cambio.tipo) === 'green' ? '#10b981' :
                                    getTipoCambioColor(cambio.tipo) === 'red' ? '#ef4444' :
                                    getTipoCambioColor(cambio.tipo) === 'blue' ? '#3b82f6' : '#eab308',
                                }}
                              >
                                <div className="flex items-center gap-2 mb-1">
                                  <Badge 
                                    variant={getTipoCambioColor(cambio.tipo) as any}
                                    className="text-xs"
                                  >
                                    {getTipoCambioLabel(cambio.tipo)}
                                  </Badge>
                                  {cambio.dia && (
                                    <span className="text-slate-600 dark:text-slate-400">
                                      Día: {cambio.dia}
                                    </span>
                                  )}
                                </div>
                                {cambio.sesionNombre && (
                                  <div className="font-medium text-slate-900 dark:text-slate-100 mb-1">
                                    {cambio.sesionNombre}
                                  </div>
                                )}
                                {cambio.propiedad && (
                                  <div className="text-slate-600 dark:text-slate-400">
                                    <span className="font-medium">{cambio.propiedad}:</span>{' '}
                                    <span className="line-through text-red-500">
                                      {String(cambio.valorAnterior || 'N/A')}
                                    </span>
                                    {' → '}
                                    <span className="text-green-600 font-medium">
                                      {String(cambio.valorNuevo || 'N/A')}
                                    </span>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Contexto */}
                      {log.contexto && (
                        <div>
                          <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                            Contexto
                          </h4>
                          <div className="text-xs space-y-1">
                            {log.contexto.lesiones && log.contexto.lesiones.length > 0 && (
                              <div>
                                <span className="font-medium">Lesiones:</span>{' '}
                                {log.contexto.lesiones.join(', ')}
                              </div>
                            )}
                            {log.contexto.equipamiento && log.contexto.equipamiento.length > 0 && (
                              <div>
                                <span className="font-medium">Equipamiento:</span>{' '}
                                {log.contexto.equipamiento.join(', ')}
                              </div>
                            )}
                            {log.contexto.tags && log.contexto.tags.length > 0 && (
                              <div>
                                <span className="font-medium">Tags:</span>{' '}
                                {log.contexto.tags.join(', ')}
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Errores */}
                      {log.resultado.errores && log.resultado.errores.length > 0 && (
                        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded p-3">
                          <h4 className="text-sm font-semibold text-red-700 dark:text-red-400 mb-2">
                            Errores
                          </h4>
                          <ul className="text-xs text-red-600 dark:text-red-400 space-y-1">
                            {log.resultado.errores.map((error, idx) => (
                              <li key={idx}>• {error}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </Card>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end">
          <Button variant="ghost" onClick={onClose}>
            Cerrar
          </Button>
        </div>
      </div>
    </Modal>
  );
}

