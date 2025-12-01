import React, { useState, useEffect } from 'react';
import { Card, Button, Modal, Input, Textarea, Switch } from '../../../components/componentsreutilizables';
import { PoliticaCancelacion } from '../types';
import { getPoliticaCancelacion, guardarPoliticaCancelacion } from '../api/politicasCancelacion';
import { AlertCircle, Save, Info, Clock, DollarSign, AlertTriangle } from 'lucide-react';

interface ConfiguracionPoliticasCancelacionProps {
  entrenadorId: string;
}

export const ConfiguracionPoliticasCancelacion: React.FC<ConfiguracionPoliticasCancelacionProps> = ({
  entrenadorId,
}) => {
  const [politica, setPolitica] = useState<PoliticaCancelacion | null>(null);
  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);

  useEffect(() => {
    const cargarPolitica = async () => {
      setLoading(true);
      try {
        const politicaData = await getPoliticaCancelacion(entrenadorId);
        setPolitica(politicaData);
      } catch (error) {
        console.error('Error cargando política de cancelación:', error);
      } finally {
        setLoading(false);
      }
    };
    cargarPolitica();
  }, [entrenadorId]);

  const handleGuardar = async () => {
    if (!politica) return;

    setGuardando(true);
    try {
      await guardarPoliticaCancelacion(politica);
      setMostrarConfirmacion(true);
      setTimeout(() => setMostrarConfirmacion(false), 3000);
    } catch (error) {
      console.error('Error guardando política de cancelación:', error);
      alert('Error al guardar la política de cancelación. Por favor, inténtalo de nuevo.');
    } finally {
      setGuardando(false);
    }
  };

  const handleChange = (campo: keyof PoliticaCancelacion, valor: any) => {
    if (!politica) return;
    setPolitica({
      ...politica,
      [campo]: valor,
      updatedAt: new Date(),
    });
  };

  if (loading) {
    return (
      <Card className="bg-white shadow-sm">
        <div className="p-6">
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Cargando política de cancelación...</span>
          </div>
        </div>
      </Card>
    );
  }

  if (!politica) {
    return (
      <Card className="bg-white shadow-sm">
        <div className="p-6">
          <p className="text-gray-600">No se pudo cargar la política de cancelación.</p>
        </div>
      </Card>
    );
  }

  return (
    <>
      <Card className="bg-white shadow-sm">
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-gray-900">
                Política de Cancelación
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Establece reglas claras para las cancelaciones y evita cancelaciones de último momento
              </p>
            </div>
            {mostrarConfirmacion && (
              <div className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg">
                <Save className="w-4 h-4" />
                <span className="text-sm font-medium">Política guardada correctamente</span>
              </div>
            )}
          </div>

          {/* Información general */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-blue-900 mb-1">
                  ¿Qué son las políticas de cancelación?
                </p>
                <p className="text-sm text-blue-700">
                  Las políticas de cancelación te permiten establecer reglas claras sobre cuándo y cómo los clientes pueden cancelar sus reservas.
                  Puedes configurar tiempos mínimos de anticipación, multas por cancelaciones de último momento, y penalizaciones en bonos.
                </p>
              </div>
            </div>
          </div>

          {/* Bloque: Activación */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Activación de la Política</h4>
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <label className="text-sm font-medium text-gray-900">
                  Activar política de cancelación
                </label>
                <p className="text-sm text-gray-600 mt-1">
                  Cuando está desactivada, los clientes pueden cancelar sin restricciones
                </p>
              </div>
              <Switch
                checked={politica.activa}
                onChange={(checked) => handleChange('activa', checked)}
              />
            </div>
          </div>

          {politica.activa && (
            <>
              {/* Bloque: Reglas de Cancelación */}
              <div className="space-y-4 pt-4 border-t border-gray-200">
                <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Reglas de Cancelación</h4>

                {/* Horas de anticipación mínimas */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-900 flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Horas de anticipación mínimas
                  </label>
                  <Input
                    type="number"
                    value={politica.horasAnticipacionMinimas}
                    onChange={(e) => handleChange('horasAnticipacionMinimas', parseInt(e.target.value) || 0)}
                    min={0}
                    max={168}
                    placeholder="24"
                  />
                  <p className="text-xs text-gray-500">
                    Tiempo mínimo de anticipación requerido para cancelar sin penalización (en horas).
                    Ejemplo: 24 horas significa que el cliente debe cancelar al menos 24 horas antes de la sesión.
                  </p>
                </div>

                {/* Permitir cancelación de último momento */}
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <label className="text-sm font-medium text-gray-900">
                      Permitir cancelación de último momento
                    </label>
                    <p className="text-sm text-gray-600 mt-1">
                      Si está desactivado, no se permitirán cancelaciones con menos del tiempo mínimo de anticipación
                    </p>
                  </div>
                  <Switch
                    checked={politica.permitirCancelacionUltimoMomento}
                    onChange={(checked) => handleChange('permitirCancelacionUltimoMomento', checked)}
                  />
                </div>

                {politica.permitirCancelacionUltimoMomento && (
                  <>
                    {/* Bloque: Multas y Penalizaciones */}
                    <div className="pt-4 border-t border-gray-200">
                      <h5 className="text-sm font-medium text-gray-900 mb-4">Multas y Penalizaciones</h5>

                      {/* Aplicar multa por cancelación de último momento */}
                      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg mb-4">
                        <div>
                          <label className="text-sm font-medium text-gray-900 flex items-center gap-2">
                            <DollarSign className="w-4 h-4" />
                            Aplicar multa por cancelación de último momento
                          </label>
                          <p className="text-sm text-gray-600 mt-1">
                            Cobrar una multa cuando se cancela con menos del tiempo mínimo de anticipación
                          </p>
                        </div>
                        <Switch
                          checked={politica.aplicarMultaCancelacionUltimoMomento}
                          onChange={(checked) => handleChange('aplicarMultaCancelacionUltimoMomento', checked)}
                        />
                      </div>

                      {politica.aplicarMultaCancelacionUltimoMomento && (
                        <div className="grid grid-cols-2 gap-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg mb-4">
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-900">
                              Porcentaje de multa (%)
                            </label>
                            <Input
                              type="number"
                              value={politica.porcentajeMulta || ''}
                              onChange={(e) => handleChange('porcentajeMulta', e.target.value ? parseInt(e.target.value) : undefined)}
                              min={0}
                              max={100}
                              placeholder="50"
                            />
                            <p className="text-xs text-gray-500">
                              Porcentaje del precio de la sesión a cobrar como multa (ej: 50 = 50%)
                            </p>
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-900">
                              Monto fijo de multa (€)
                            </label>
                            <Input
                              type="number"
                              value={politica.montoMultaFijo || ''}
                              onChange={(e) => handleChange('montoMultaFijo', e.target.value ? parseFloat(e.target.value) : undefined)}
                              min={0}
                              step="0.01"
                              placeholder="10.00"
                            />
                            <p className="text-xs text-gray-500">
                              Monto fijo a cobrar como multa (alternativa al porcentaje). Si ambos están configurados, se usa el porcentaje.
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Aplicar penalización en bono */}
                      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div>
                          <label className="text-sm font-medium text-gray-900 flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4" />
                            Aplicar penalización en bono
                          </label>
                          <p className="text-sm text-gray-600 mt-1">
                            Descontar una sesión del bono del cliente al cancelar de último momento
                          </p>
                        </div>
                        <Switch
                          checked={politica.aplicarPenalizacionBono}
                          onChange={(checked) => handleChange('aplicarPenalizacionBono', checked)}
                        />
                      </div>
                    </div>
                  </>
                )}

              </div>

              {/* Bloque: Notificaciones y Mensajes */}
              <div className="pt-4 border-t border-gray-200">
                <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4">Notificaciones y Mensajes</h4>

                {/* Notificar cliente */}
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg mb-4">
                  <div>
                    <label className="text-sm font-medium text-gray-900">
                      Notificar al cliente
                    </label>
                    <p className="text-sm text-gray-600 mt-1">
                      Enviar notificación al cliente sobre las políticas de cancelación al hacer una reserva
                    </p>
                  </div>
                  <Switch
                    checked={politica.notificarCliente}
                    onChange={(checked) => handleChange('notificarCliente', checked)}
                  />
                </div>

                {/* Mensaje personalizado */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-900">
                    Mensaje personalizado
                  </label>
                  <Textarea
                    value={politica.mensajePersonalizado || ''}
                    onChange={(e) => handleChange('mensajePersonalizado', e.target.value)}
                    placeholder="Por favor, cancela con al menos 24 horas de anticipación para evitar cargos."
                    rows={3}
                  />
                  <p className="text-xs text-gray-500">
                    Mensaje que se mostrará al cliente al intentar cancelar o al hacer una reserva (si la notificación está activada)
                  </p>
                </div>
              </div>
            </>
          )}

          {/* Botón guardar */}
          <div className="flex justify-end pt-4 border-t border-gray-200">
            <Button
              variant="primary"
              onClick={handleGuardar}
              disabled={guardando}
              loading={guardando}
              leftIcon={<Save className="w-4 h-4" />}
            >
              Guardar Política
            </Button>
          </div>
        </div>
      </Card>
    </>
  );
};

