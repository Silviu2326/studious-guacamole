import React, { useState, useEffect } from 'react';
import { Suscripcion, SesionIncluida, MiembroGrupo } from '../types';
import { Card, Button, Modal, Input, Badge, Select } from '../../../components/componentsreutilizables';
import { 
  transferirSesiones, 
  configurarTransferenciaSesiones,
  getSuscripcionById,
  obtenerSesionesIncluidas,
  crearSesionIncluida,
  actualizarSesionIncluida,
} from '../api/suscripciones';
import { ArrowRight, Settings, CheckCircle, XCircle, Clock, Users, Calendar } from 'lucide-react';

interface TransferenciaSesionesProps {
  suscripcion: Suscripcion;
  onSuccess?: () => void;
}

export const TransferenciaSesiones: React.FC<TransferenciaSesionesProps> = ({
  suscripcion,
  onSuccess,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalConfigOpen, setModalConfigOpen] = useState(false);
  const [modalTransferenciaCliente, setModalTransferenciaCliente] = useState(false);
  const [cantidadSesiones, setCantidadSesiones] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [tipoTransferencia, setTipoTransferencia] = useState<'periodo' | 'cliente'>('periodo');
  const [periodoOrigen, setPeriodoOrigen] = useState<string>('');
  const [periodoDestino, setPeriodoDestino] = useState<string>('');
  const [clienteDestinoId, setClienteDestinoId] = useState<string>('');
  const [sesionesIncluidas, setSesionesIncluidas] = useState<SesionIncluida[]>([]);
  
  // Estados para configuración
  const [transferenciaAutomatica, setTransferenciaAutomatica] = useState(
    suscripcion.transferenciaSesionesActiva || false
  );
  const [aplicarEnRenovacion, setAplicarEnRenovacion] = useState(
    suscripcion.configuracionTransferencia?.aplicarEnRenovacion || false
  );
  const [maxSesionesTransferibles, setMaxSesionesTransferibles] = useState<string>(
    suscripcion.configuracionTransferencia?.maxSesionesTransferibles?.toString() || ''
  );

  const sesionesDisponibles = suscripcion.sesionesDisponibles || 0;
  const sesionesTransferidas = suscripcion.sesionesTransferidas || 0;
  const historialTransferencias = suscripcion.historialTransferencias || [];
  const miembrosGrupo = suscripcion.miembrosGrupo || [];
  
  // Calcular próximo período
  const fechaVencimiento = new Date(suscripcion.fechaVencimiento);
  const proximoMes = new Date(fechaVencimiento);
  proximoMes.setMonth(proximoMes.getMonth() + 1);
  const periodoDestinoDefault = `${proximoMes.getFullYear()}-${String(proximoMes.getMonth() + 1).padStart(2, '0')}`;
  const periodoActualDefault = `${fechaVencimiento.getFullYear()}-${String(fechaVencimiento.getMonth() + 1).padStart(2, '0')}`;
  
  useEffect(() => {
    loadSesionesIncluidas();
  }, [suscripcion.id]);
  
  const loadSesionesIncluidas = async () => {
    try {
      const sesiones = await obtenerSesionesIncluidas({
        suscripcionId: suscripcion.id,
        incluirCaducadas: false,
      });
      setSesionesIncluidas(sesiones);
      
      // Establecer período origen por defecto
      if (sesiones.length > 0 && !periodoOrigen) {
        const sesionActual = sesiones.find(s => {
          const fechaCad = new Date(s.fechaCaducidad);
          return fechaCad >= new Date();
        });
        if (sesionActual && sesionActual.periodo) {
          setPeriodoOrigen(sesionActual.periodo);
        }
      }
      
      if (!periodoDestino) {
        setPeriodoDestino(periodoDestinoDefault);
      }
    } catch (error) {
      console.error('Error cargando sesiones incluidas:', error);
    }
  };

  const handleTransferirSesiones = async (tipo: 'periodo' | 'cliente' = tipoTransferencia) => {
    if (cantidadSesiones <= 0 || cantidadSesiones > sesionesDisponibles) {
      alert('La cantidad de sesiones debe ser mayor a 0 y no puede exceder las sesiones disponibles');
      return;
    }

    setLoading(true);
    try {
      if (tipo === 'periodo') {
        // Transferencia entre períodos
        const sesionOrigen = sesionesIncluidas.find(s => s.periodo === periodoOrigen);
        if (!sesionOrigen) {
          throw new Error('No se encontró la sesión del período origen');
        }
        
        // Reducir sesiones del período origen
        const nuevasConsumidas = sesionOrigen.consumidas + cantidadSesiones;
        if (nuevasConsumidas > sesionOrigen.totalSesiones) {
          throw new Error('No hay suficientes sesiones disponibles en el período origen');
        }
        
        await actualizarSesionIncluida(sesionOrigen.id, {
          consumidas: nuevasConsumidas,
        });
        
        // Crear o actualizar sesión del período destino
        const sesionDestino = sesionesIncluidas.find(s => s.periodo === periodoDestino);
        if (sesionDestino) {
          await actualizarSesionIncluida(sesionDestino.id, {
            totalSesiones: sesionDestino.totalSesiones + cantidadSesiones,
          });
        } else {
          await crearSesionIncluida({
            suscripcionId: suscripcion.id,
            clienteId: suscripcion.clienteId,
            totalSesiones: cantidadSesiones,
            consumidas: 0,
            fechaCaducidad: new Date(proximoMes.getFullYear(), proximoMes.getMonth() + 1, 0).toISOString(),
            tipoSesion: 'transferida',
            periodo: periodoDestino,
          });
        }
        
        // También llamar a la función original para mantener compatibilidad
        await transferirSesiones({
          suscripcionId: suscripcion.id,
          sesionesATransferir: cantidadSesiones,
          periodoOrigen,
          periodoDestino,
        });
      } else {
        // Transferencia entre clientes (solo para suscripciones grupales)
        if (!suscripcion.esGrupal || miembrosGrupo.length === 0) {
          throw new Error('Esta funcionalidad solo está disponible para suscripciones grupales');
        }
        
        const miembroDestino = miembrosGrupo.find(m => m.clienteId === clienteDestinoId);
        if (!miembroDestino) {
          throw new Error('Cliente destino no encontrado en el grupo');
        }
        
        // Obtener sesiones del cliente origen
        const sesionOrigen = sesionesIncluidas.find(s => s.periodo === periodoOrigen);
        if (!sesionOrigen) {
          throw new Error('No se encontró la sesión del período origen');
        }
        
        // Reducir sesiones del cliente origen
        await actualizarSesionIncluida(sesionOrigen.id, {
          consumidas: sesionOrigen.consumidas + cantidadSesiones,
        });
        
        // Obtener suscripción del cliente destino
        const suscripcionDestino = await getSuscripcionById(miembroDestino.suscripcionId);
        const sesionesDestino = await obtenerSesionesIncluidas({
          suscripcionId: suscripcionDestino.id,
          periodo: periodoDestino,
        });
        
        // Crear o actualizar sesión del cliente destino
        const sesionDestino = sesionesDestino.find(s => s.periodo === periodoDestino);
        if (sesionDestino) {
          await actualizarSesionIncluida(sesionDestino.id, {
            totalSesiones: sesionDestino.totalSesiones + cantidadSesiones,
          });
        } else {
          await crearSesionIncluida({
            suscripcionId: suscripcionDestino.id,
            clienteId: clienteDestinoId,
            totalSesiones: cantidadSesiones,
            consumidas: 0,
            fechaCaducidad: new Date(proximoMes.getFullYear(), proximoMes.getMonth() + 1, 0).toISOString(),
            tipoSesion: 'transferida',
            periodo: periodoDestino,
          });
        }
      }
      
      setModalOpen(false);
      setCantidadSesiones(0);
      await loadSesionesIncluidas();
      onSuccess?.();
    } catch (error: any) {
      console.error('Error transfiriendo sesiones:', error);
      alert(error.message || 'Error al transferir las sesiones');
    } finally {
      setLoading(false);
    }
  };

  const handleGuardarConfiguracion = async () => {
    setLoading(true);
    try {
      await configurarTransferenciaSesiones(suscripcion.id, {
        suscripcionId: suscripcion.id,
        transferenciaAutomatica,
        aplicarEnRenovacion,
        maxSesionesTransferibles: maxSesionesTransferibles ? parseInt(maxSesionesTransferibles) : undefined,
      });
      
      setModalConfigOpen(false);
      onSuccess?.();
    } catch (error: any) {
      console.error('Error guardando configuración:', error);
      alert(error.message || 'Error al guardar la configuración');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Card className="bg-white shadow-sm p-6">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Transferencia de Sesiones No Usadas
              </h3>
              <p className="text-base text-gray-600">
                Transfiere las sesiones no usadas al siguiente mes para dar más flexibilidad a tus clientes
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                onClick={() => setModalConfigOpen(true)}
              >
                <Settings className="w-4 h-4 mr-2" />
                Configurar
              </Button>
              <div className="flex gap-2">
                <Button
                  variant="primary"
                  onClick={() => {
                    setTipoTransferencia('periodo');
                    setCantidadSesiones(sesionesDisponibles);
                    setModalOpen(true);
                  }}
                  disabled={sesionesDisponibles === 0}
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Transferir a Período
                </Button>
                {suscripcion.esGrupal && miembrosGrupo.length > 0 && (
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setTipoTransferencia('cliente');
                      setCantidadSesiones(1);
                      setModalTransferenciaCliente(true);
                    }}
                    disabled={sesionesDisponibles === 0}
                  >
                    <Users className="w-4 h-4 mr-2" />
                    Transferir a Cliente
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Estado actual */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-4 bg-blue-50 border border-blue-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Sesiones Disponibles</p>
                  <p className="text-2xl font-bold text-gray-900">{sesionesDisponibles}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <Clock className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </Card>

            <Card className="p-4 bg-green-50 border border-green-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Sesiones a Transferir</p>
                  <p className="text-2xl font-bold text-gray-900">{sesionesTransferidas}</p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <ArrowRight className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Se aplicarán en {periodoDestino}
              </p>
            </Card>

            <Card className={`p-4 border ${
              transferenciaAutomatica 
                ? 'bg-green-50 border-green-200' 
                : 'bg-gray-50 border-gray-200'
            }`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Transferencia Automática</p>
                  <Badge 
                    variant={transferenciaAutomatica ? 'success' : 'secondary'}
                    className="mt-1"
                  >
                    {transferenciaAutomatica ? 'Activa' : 'Inactiva'}
                  </Badge>
                </div>
                <div className={`p-3 rounded-full ${
                  transferenciaAutomatica ? 'bg-green-100' : 'bg-gray-100'
                }`}>
                  {transferenciaAutomatica ? (
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  ) : (
                    <XCircle className="w-6 h-6 text-gray-600" />
                  )}
                </div>
              </div>
            </Card>
          </div>

          {/* Información */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5" />
              </div>
              <div className="ml-3">
                <h4 className="text-sm font-medium text-blue-900">
                  ¿Cómo funciona la transferencia de sesiones?
                </h4>
                <div className="mt-2 text-sm text-blue-700">
                  <ul className="list-disc list-inside space-y-1">
                    <li>Las sesiones no usadas al final del mes se pueden transferir al siguiente mes</li>
                    <li>Las sesiones transferidas se sumarán a las sesiones del próximo período</li>
                    <li>Puedes configurar la transferencia automática para que se haga al renovar la suscripción</li>
                    <li>Puedes establecer un límite máximo de sesiones transferibles por período</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Historial de transferencias */}
          {historialTransferencias.length > 0 && (
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">
                Historial de Transferencias
              </h4>
              <div className="space-y-3">
                {historialTransferencias.map((transferencia) => (
                  <Card key={transferencia.id} className="p-4 border border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge 
                            variant={transferencia.aplicado ? 'success' : 'warning'}
                          >
                            {transferencia.aplicado ? 'Aplicado' : 'Pendiente'}
                          </Badge>
                          <span className="text-sm text-gray-600">
                            {transferencia.sesionesTransferidas} sesiones
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">
                          De {transferencia.periodoOrigen} a {transferencia.periodoDestino}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(transferencia.fechaTransferencia).toLocaleDateString('es-ES', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">
                          {transferencia.sesionesDisponiblesAntes} → {transferencia.sesionesDisponiblesDespues}
                        </p>
                        <p className="text-xs text-gray-500">Sesiones disponibles</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Modal para transferir sesiones entre períodos */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Transferir Sesiones entre Períodos"
      >
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-900">
              <strong>Sesiones disponibles:</strong> {sesionesDisponibles}
            </p>
          </div>

          <Select
            label="Período Origen"
            value={periodoOrigen}
            onChange={(e) => setPeriodoOrigen(e.target.value)}
            options={[
              ...new Set(sesionesIncluidas.map(s => s.periodo).filter(Boolean))
            ].map(p => ({ value: p!, label: p! }))}
          />

          <Input
            label="Período Destino"
            type="text"
            value={periodoDestino}
            onChange={(e) => setPeriodoDestino(e.target.value)}
            placeholder="YYYY-MM"
            helperText="Formato: YYYY-MM (ej: 2024-11)"
          />

          <Input
            label="Cantidad de sesiones a transferir"
            type="number"
            min={1}
            max={sesionesDisponibles}
            value={cantidadSesiones.toString()}
            onChange={(e) => setCantidadSesiones(parseInt(e.target.value) || 0)}
            helperText={`Máximo: ${sesionesDisponibles} sesiones`}
          />

          {suscripcion.configuracionTransferencia?.maxSesionesTransferibles && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p className="text-sm text-yellow-800">
                <strong>Límite máximo configurado:</strong>{' '}
                {suscripcion.configuracionTransferencia.maxSesionesTransferibles} sesiones
              </p>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-4">
            <Button
              variant="ghost"
              onClick={() => setModalOpen(false)}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              variant="primary"
              onClick={handleTransferirSesiones}
              loading={loading}
              disabled={cantidadSesiones <= 0 || cantidadSesiones > sesionesDisponibles}
            >
              Transferir Sesiones
            </Button>
          </div>
        </div>
      </Modal>

      {/* Modal para configuración */}
      <Modal
        isOpen={modalConfigOpen}
        onClose={() => setModalConfigOpen(false)}
        title="Configurar Transferencia de Sesiones"
      >
        <div className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <label className="text-sm font-medium text-gray-900">
                  Transferencia Automática
                </label>
                <p className="text-xs text-gray-500 mt-1">
                  Transfiere automáticamente las sesiones no usadas al renovar la suscripción
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={transferenciaAutomatica}
                  onChange={(e) => setTransferenciaAutomatica(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <label className="text-sm font-medium text-gray-900">
                  Aplicar en Renovación
                </label>
                <p className="text-xs text-gray-500 mt-1">
                  Las sesiones transferidas se aplicarán automáticamente cuando se renueve la suscripción
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={aplicarEnRenovacion}
                  onChange={(e) => setAplicarEnRenovacion(e.target.checked)}
                  disabled={!transferenciaAutomatica}
                  className="sr-only peer"
                />
                <div className={`w-11 h-6 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all ${
                  !transferenciaAutomatica 
                    ? 'bg-gray-200 opacity-50 cursor-not-allowed' 
                    : 'bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 peer-checked:bg-blue-600'
                }`}></div>
              </label>
            </div>

            <Input
              label="Límite máximo de sesiones transferibles (opcional)"
              type="number"
              min={1}
              value={maxSesionesTransferibles}
              onChange={(e) => setMaxSesionesTransferibles(e.target.value)}
              helperText="Deja vacío para no establecer límite"
              placeholder="Ej: 4"
            />
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-900">
              <strong>Nota:</strong> La transferencia automática transferirá todas las sesiones no usadas al renovar la suscripción. 
              Si estableces un límite máximo, solo se transferirán hasta ese número de sesiones.
            </p>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              variant="ghost"
              onClick={() => setModalConfigOpen(false)}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              variant="primary"
              onClick={handleGuardarConfiguracion}
              loading={loading}
            >
              Guardar Configuración
            </Button>
          </div>
        </div>
      </Modal>

      {/* Modal para transferir sesiones entre clientes */}
      <Modal
        isOpen={modalTransferenciaCliente}
        onClose={() => setModalTransferenciaCliente(false)}
        title="Transferir Sesiones entre Clientes"
      >
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-900">
              <strong>Cliente origen:</strong> {suscripcion.clienteNombre}
            </p>
            <p className="text-sm text-blue-700 mt-1">
              <strong>Sesiones disponibles:</strong> {sesionesDisponibles}
            </p>
          </div>

          <Select
            label="Cliente Destino"
            value={clienteDestinoId}
            onChange={(e) => setClienteDestinoId(e.target.value)}
            options={miembrosGrupo.map(m => ({
              value: m.clienteId,
              label: `${m.clienteNombre} (${m.clienteEmail})`,
            }))}
          />

          <Select
            label="Período Origen"
            value={periodoOrigen}
            onChange={(e) => setPeriodoOrigen(e.target.value)}
            options={[
              ...new Set(sesionesIncluidas.map(s => s.periodo).filter(Boolean))
            ].map(p => ({ value: p!, label: p! }))}
          />

          <Input
            label="Período Destino"
            type="text"
            value={periodoDestino}
            onChange={(e) => setPeriodoDestino(e.target.value)}
            placeholder="YYYY-MM"
            helperText="Formato: YYYY-MM (ej: 2024-11)"
          />

          <Input
            label="Cantidad de sesiones a transferir"
            type="number"
            min={1}
            max={sesionesDisponibles}
            value={cantidadSesiones.toString()}
            onChange={(e) => setCantidadSesiones(parseInt(e.target.value) || 0)}
            helperText={`Máximo: ${sesionesDisponibles} sesiones`}
          />

          <div className="flex justify-end gap-2 pt-4">
            <Button
              variant="ghost"
              onClick={() => setModalTransferenciaCliente(false)}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              variant="primary"
                        onClick={() => handleTransferirSesiones('cliente')}
                        loading={loading}
                        disabled={cantidadSesiones <= 0 || cantidadSesiones > sesionesDisponibles || !clienteDestinoId || !periodoOrigen || !periodoDestino}
            >
              <Users className="w-4 h-4 mr-2" />
              Transferir a Cliente
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

