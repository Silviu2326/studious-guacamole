import React, { useState } from 'react';
import { Suscripcion } from '../types';
import { Card, Button, Modal, Input, Badge } from '../../../components/componentsreutilizables';
import { 
  transferirSesiones, 
  configurarTransferenciaSesiones,
  getSuscripcionById 
} from '../api/suscripciones';
import { ArrowRight, Settings, CheckCircle, XCircle, Clock } from 'lucide-react';

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
  const [cantidadSesiones, setCantidadSesiones] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  
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
  
  // Calcular próximo período
  const fechaVencimiento = new Date(suscripcion.fechaVencimiento);
  const proximoMes = new Date(fechaVencimiento);
  proximoMes.setMonth(proximoMes.getMonth() + 1);
  const periodoDestino = `${proximoMes.getFullYear()}-${String(proximoMes.getMonth() + 1).padStart(2, '0')}`;
  const periodoActual = `${fechaVencimiento.getFullYear()}-${String(fechaVencimiento.getMonth() + 1).padStart(2, '0')}`;

  const handleTransferirSesiones = async () => {
    if (cantidadSesiones <= 0 || cantidadSesiones > sesionesDisponibles) {
      alert('La cantidad de sesiones debe ser mayor a 0 y no puede exceder las sesiones disponibles');
      return;
    }

    setLoading(true);
    try {
      await transferirSesiones({
        suscripcionId: suscripcion.id,
        sesionesATransferir: cantidadSesiones,
      });
      
      setModalOpen(false);
      setCantidadSesiones(0);
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
              <Button
                variant="primary"
                onClick={() => {
                  setCantidadSesiones(sesionesDisponibles);
                  setModalOpen(true);
                }}
                disabled={sesionesDisponibles === 0}
              >
                <ArrowRight className="w-4 h-4 mr-2" />
                Transferir Sesiones
              </Button>
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

      {/* Modal para transferir sesiones */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Transferir Sesiones al Siguiente Mes"
      >
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-900">
              <strong>Sesiones disponibles:</strong> {sesionesDisponibles}
            </p>
            <p className="text-sm text-blue-700 mt-1">
              Período destino: <strong>{periodoDestino}</strong>
            </p>
          </div>

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
    </>
  );
};

