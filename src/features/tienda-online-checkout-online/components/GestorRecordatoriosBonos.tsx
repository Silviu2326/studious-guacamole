import React, { useState, useEffect } from 'react';
import { Card, Button, Badge, Input, Select, Switch, Modal } from '../../../components/componentsreutilizables';
import {
  obtenerClientesConBonosParaRecordatorio,
  enviarRecordatoriosAutomaticos,
  crearConfiguracionRecordatoriosPorDefecto,
  ConfiguracionRecordatorios,
  RecordatorioEnviado,
  ClienteConBonosRecordatorio,
  CanalRecordatorio,
} from '../api/recordatoriosBonos';
import { Bell, Send, Settings, AlertCircle, Clock, Calendar, Users, CheckCircle } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';

interface GestorRecordatoriosBonosProps {
  entrenadorId?: string;
}

export const GestorRecordatoriosBonos: React.FC<GestorRecordatoriosBonosProps> = ({
  entrenadorId,
}) => {
  const { user } = useAuth();
  const [clientesConRecordatorios, setClientesConRecordatorios] = useState<ClienteConBonosRecordatorio[]>([]);
  const [cargando, setCargando] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [configuracion, setConfiguracion] = useState<ConfiguracionRecordatorios>(crearConfiguracionRecordatoriosPorDefecto());
  const [mostrarConfiguracion, setMostrarConfiguracion] = useState(false);
  const [historialRecordatorios, setHistorialRecordatorios] = useState<RecordatorioEnviado[]>([]);
  const [mostrarHistorial, setMostrarHistorial] = useState(false);

  useEffect(() => {
    cargarClientesConRecordatorios();
  }, [entrenadorId, configuracion]);

  const cargarClientesConRecordatorios = async () => {
    if (!configuracion.activo) {
      setClientesConRecordatorios([]);
      return;
    }

    setCargando(true);
    try {
      const idEntrenador = entrenadorId || user?.id;
      const clientes = await obtenerClientesConBonosParaRecordatorio(idEntrenador, configuracion);
      setClientesConRecordatorios(clientes);
    } catch (error) {
      console.error('Error cargando clientes con recordatorios:', error);
    } finally {
      setCargando(false);
    }
  };

  const handleEnviarRecordatorios = async () => {
    setEnviando(true);
    try {
      const idEntrenador = entrenadorId || user?.id;
      const recordatorios = await enviarRecordatoriosAutomaticos(idEntrenador, configuracion);
      setHistorialRecordatorios([...historialRecordatorios, ...recordatorios]);
      alert(`Se enviaron ${recordatorios.length} recordatorios exitosamente`);
      await cargarClientesConRecordatorios();
    } catch (error) {
      console.error('Error enviando recordatorios:', error);
      alert('Error al enviar recordatorios');
    } finally {
      setEnviando(false);
    }
  };

  const getMotivoBadge = (motivo: string) => {
    switch (motivo) {
      case 'vencimiento_proximo':
        return <Badge variant="error">Vencimiento Próximo</Badge>;
      case 'sin_uso':
        return <Badge variant="warning">Sin Uso</Badge>;
      case 'sesiones_restantes':
        return <Badge variant="info">Sesiones Restantes</Badge>;
      default:
        return <Badge variant="info">{motivo}</Badge>;
    }
  };

  const formatoFecha = (fecha: Date) => {
    return new Intl.DateTimeFormat('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(new Date(fecha));
  };

  const totalRecordatorios = clientesConRecordatorios.reduce(
    (sum, cliente) => sum + cliente.bonos.length,
    0
  );

  return (
    <div className="space-y-6">
      <Card>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Bell className="w-6 h-6 text-blue-600" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Recordatorios de Bonos Activos</h2>
              <p className="text-sm text-gray-600">
                Envía recordatorios automáticos a clientes con bonos activos sin usar
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setMostrarConfiguracion(true)}
              icon={<Settings className="w-4 h-4" />}
            >
              Configuración
            </Button>
            <Button
              variant="outline"
              onClick={() => setMostrarHistorial(true)}
              icon={<Clock className="w-4 h-4" />}
            >
              Historial
            </Button>
            <Button
              onClick={handleEnviarRecordatorios}
              disabled={!configuracion.activo || enviando || totalRecordatorios === 0}
              icon={<Send className="w-4 h-4" />}
            >
              {enviando ? 'Enviando...' : `Enviar Recordatorios (${totalRecordatorios})`}
            </Button>
          </div>
        </div>

        <div className="mb-4 flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Switch
              checked={configuracion.activo}
              onChange={(checked) => setConfiguracion({ ...configuracion, activo: checked })}
            />
            <span className="text-sm font-medium text-gray-700">
              Recordatorios Automáticos {configuracion.activo ? 'Activados' : 'Desactivados'}
            </span>
          </div>
          {configuracion.activo && (
            <Badge variant={totalRecordatorios > 0 ? 'warning' : 'success'}>
              {totalRecordatorios} {totalRecordatorios === 1 ? 'recordatorio pendiente' : 'recordatorios pendientes'}
            </Badge>
          )}
        </div>

        {!configuracion.activo ? (
          <div className="text-center py-12 text-gray-500">
            <Bell className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>Los recordatorios automáticos están desactivados</p>
            <p className="text-sm mt-2">Actívalos en la configuración para comenzar a enviar recordatorios</p>
          </div>
        ) : cargando ? (
          <div className="text-center py-12 text-gray-500">Cargando...</div>
        ) : clientesConRecordatorios.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <CheckCircle className="w-12 h-12 mx-auto mb-4 text-green-300" />
            <p>No hay clientes que requieran recordatorios en este momento</p>
          </div>
        ) : (
          <div className="space-y-4">
            {clientesConRecordatorios.map((cliente) => (
              <Card key={cliente.clienteId} className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-900">{cliente.clienteNombre}</h3>
                    <p className="text-sm text-gray-600">{cliente.clienteEmail}</p>
                    {cliente.clienteTelefono && (
                      <p className="text-sm text-gray-600">{cliente.clienteTelefono}</p>
                    )}
                  </div>
                  <Badge variant="info">
                    {cliente.bonos.length} {cliente.bonos.length === 1 ? 'bono' : 'bonos'}
                  </Badge>
                </div>
                <div className="space-y-2">
                  {cliente.bonos.map((bonoInfo, index) => (
                    <div
                      key={bonoInfo.bono.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          {getMotivoBadge(bonoInfo.motivo)}
                          <span className="text-sm font-medium text-gray-700">
                            {bonoInfo.bono.sesionesRestantes} sesiones restantes
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          {bonoInfo.diasRestantes !== undefined && (
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              <span>Vence en {bonoInfo.diasRestantes} días</span>
                            </div>
                          )}
                          {bonoInfo.diasSinUso !== undefined && (
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              <span>Sin usar desde hace {bonoInfo.diasSinUso} días</span>
                            </div>
                          )}
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>Vence: {formatoFecha(bonoInfo.bono.fechaVencimiento)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        )}
      </Card>

      {/* Modal de Configuración */}
      <Modal
        isOpen={mostrarConfiguracion}
        onClose={() => setMostrarConfiguracion(false)}
        title="Configuración de Recordatorios"
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">Activar Recordatorios</label>
            <Switch
              checked={configuracion.activo}
              onChange={(checked) => setConfiguracion({ ...configuracion, activo: checked })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Días antes del vencimiento (separados por comas)
            </label>
            <Input
              type="text"
              value={configuracion.diasAntesVencimiento.join(', ')}
              onChange={(e) => {
                const dias = e.target.value.split(',').map((d) => parseInt(d.trim())).filter((d) => !isNaN(d));
                setConfiguracion({ ...configuracion, diasAntesVencimiento: dias });
              }}
              placeholder="7, 3, 1"
            />
            <p className="text-xs text-gray-500 mt-1">
              Ejemplo: 7, 3, 1 (envía recordatorios 7, 3 y 1 día antes del vencimiento)
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Frecuencia de Verificación
            </label>
            <Select
              value={configuracion.frecuenciaRecordatorio}
              onChange={(e) =>
                setConfiguracion({
                  ...configuracion,
                  frecuenciaRecordatorio: e.target.value as 'diario' | 'semanal',
                })
              }
            >
              <option value="diario">Diario</option>
              <option value="semanal">Semanal</option>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Canal de Comunicación</label>
            <Select
              value={configuracion.canal}
              onChange={(e) =>
                setConfiguracion({
                  ...configuracion,
                  canal: e.target.value as CanalRecordatorio,
                })
              }
            >
              <option value="email">Email</option>
              <option value="sms">SMS</option>
              <option value="whatsapp">WhatsApp</option>
              <option value="todos">Todos</option>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">Incluir Bonos Sin Uso</label>
            <Switch
              checked={configuracion.incluirBonosSinUso}
              onChange={(checked) => setConfiguracion({ ...configuracion, incluirBonosSinUso: checked })}
            />
          </div>

          {configuracion.incluirBonosSinUso && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Días sin uso para recordatorio
              </label>
              <Input
                type="number"
                value={configuracion.diasSinUsoParaRecordatorio}
                onChange={(e) =>
                  setConfiguracion({
                    ...configuracion,
                    diasSinUsoParaRecordatorio: parseInt(e.target.value) || 30,
                  })
                }
                min="1"
              />
            </div>
          )}

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setMostrarConfiguracion(false)}>
              Cancelar
            </Button>
            <Button
              onClick={() => {
                setMostrarConfiguracion(false);
                cargarClientesConRecordatorios();
              }}
            >
              Guardar
            </Button>
          </div>
        </div>
      </Modal>

      {/* Modal de Historial */}
      <Modal
        isOpen={mostrarHistorial}
        onClose={() => setMostrarHistorial(false)}
        title="Historial de Recordatorios"
      >
        <div className="space-y-4">
          {historialRecordatorios.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Clock className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No hay recordatorios enviados aún</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {historialRecordatorios.map((recordatorio) => (
                <div key={recordatorio.id} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-900">{recordatorio.clienteNombre}</span>
                    <Badge variant={recordatorio.estado === 'entregado' ? 'success' : 'info'}>
                      {recordatorio.estado}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">{recordatorio.mensaje.substring(0, 100)}...</p>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>{formatoFecha(recordatorio.fechaEnvio)}</span>
                    <span>Canal: {recordatorio.canal}</span>
                    <span>Motivo: {recordatorio.motivo}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

