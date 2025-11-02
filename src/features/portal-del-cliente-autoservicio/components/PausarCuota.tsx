import React, { useState, useEffect } from 'react';
import { Card, Button, Input, Modal } from '../../../components/componentsreutilizables';
import { pausarCuotaAPI } from '../api';
import { Pause, Play, Calendar, CheckCircle2, AlertCircle, Info } from 'lucide-react';

export const PausarCuota: React.FC = () => {
  const [estadoPausa, setEstadoPausa] = useState<{
    estaPausada: boolean;
    fechaInicioPausa?: Date;
    fechaFinPausa?: Date;
    motivo?: string;
  } | null>(null);
  
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [mensaje, setMensaje] = useState<{ tipo: 'success' | 'error'; texto: string } | null>(null);
  
  const [datosPausa, setDatosPausa] = useState({
    fechaInicio: '',
    fechaFin: '',
    motivo: ''
  });

  useEffect(() => {
    cargarEstadoPausa();
  }, []);

  const cargarEstadoPausa = async () => {
    try {
      const estado = await pausarCuotaAPI.obtenerEstadoPausa();
      setEstadoPausa(estado);
    } catch (error) {
      console.error('Error al cargar estado de pausa:', error);
    }
  };

  const handlePausarCuota = async () => {
    setCargando(true);
    setMensaje(null);
    
    try {
      const nuevoEstado = await pausarCuotaAPI.pausarCuota({
        fechaInicio: new Date(datosPausa.fechaInicio),
        fechaFin: new Date(datosPausa.fechaFin),
        motivo: datosPausa.motivo || undefined
      });
      
      setEstadoPausa(nuevoEstado);
      setMensaje({ tipo: 'success', texto: 'Cuota pausada exitosamente' });
      setMostrarFormulario(false);
      setDatosPausa({
        fechaInicio: '',
        fechaFin: '',
        motivo: ''
      });
      
      setTimeout(() => setMensaje(null), 5000);
    } catch (error: any) {
      setMensaje({ tipo: 'error', texto: error.message || 'Error al pausar la cuota' });
    } finally {
      setCargando(false);
    }
  };

  const handleReactivarCuota = async () => {
    if (!window.confirm('¿Estás seguro de que deseas reactivar la cuota?')) {
      return;
    }
    
    setCargando(true);
    setMensaje(null);
    
    try {
      await pausarCuotaAPI.reactivarCuota();
      await cargarEstadoPausa();
      setMensaje({ tipo: 'success', texto: 'Cuota reactivada exitosamente' });
      
      setTimeout(() => setMensaje(null), 5000);
    } catch (error: any) {
      setMensaje({ tipo: 'error', texto: error.message || 'Error al reactivar la cuota' });
    } finally {
      setCargando(false);
    }
  };

  const calcularDiasPausa = () => {
    if (!datosPausa.fechaInicio || !datosPausa.fechaFin) return 0;
    const inicio = new Date(datosPausa.fechaInicio);
    const fin = new Date(datosPausa.fechaFin);
    const diff = Math.floor((fin.getTime() - inicio.getTime()) / (1000 * 60 * 60 * 24));
    return diff;
  };

  return (
    <div className="space-y-6">
      {mensaje && (
        <Card className={`p-4 bg-white shadow-sm ${
          mensaje.tipo === 'success' 
            ? 'ring-1 ring-green-200 bg-green-50' 
            : 'ring-1 ring-red-200 bg-red-50'
        }`}>
          <div className="flex items-center gap-2">
            {mensaje.tipo === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-green-600" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-600" />
            )}
            <p className={`text-sm ${
              mensaje.tipo === 'success' ? 'text-green-700' : 'text-red-700'
            }`}>
              {mensaje.texto}
            </p>
          </div>
        </Card>
      )}

      <Card className="bg-white shadow-sm">
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              Pausar Cuota Temporalmente
            </h2>
          </div>

          {estadoPausa?.estaPausada ? (
            <div className="border-2 border-orange-200 rounded-xl p-6 bg-orange-50">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Pause className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Cuota Pausada
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Tu cuota está pausada desde el {estadoPausa.fechaInicioPausa?.toLocaleDateString('es-ES')} 
                    hasta el {estadoPausa.fechaFinPausa?.toLocaleDateString('es-ES')}.
                    {estadoPausa.motivo && ` Motivo: ${estadoPausa.motivo}`}
                  </p>
                  <Button
                    variant="primary"
                    onClick={handleReactivarCuota}
                    loading={cargando}
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Reactivar Cuota
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="border-2 border-gray-200 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Play className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Cuota Activa
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Tu cuota está activa y se cobrará según el plan establecido.
                  </p>
                  <Button
                    variant="secondary"
                    onClick={() => setMostrarFormulario(true)}
                  >
                    <Pause className="w-4 h-4 mr-2" />
                    Pausar Cuota
                  </Button>
                </div>
              </div>
            </div>
          )}

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-gray-700">
                  <strong>Información importante:</strong> La pausa de cuota puede durar hasta 90 días. 
                  Durante este período no se realizarán cobros. La cuota se reactivará automáticamente 
                  al finalizar el período de pausa.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <Modal
        isOpen={mostrarFormulario}
        onClose={() => setMostrarFormulario(false)}
        title="Pausar Cuota Temporalmente"
        size="md"
        footer={
          <div className="flex gap-3">
            <Button
              variant="secondary"
              onClick={() => setMostrarFormulario(false)}
            >
              Cancelar
            </Button>
            <Button
              variant="primary"
              onClick={handlePausarCuota}
              loading={cargando}
              disabled={!datosPausa.fechaInicio || !datosPausa.fechaFin}
            >
              Confirmar Pausa
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Fecha de inicio"
              type="date"
              value={datosPausa.fechaInicio}
              onChange={(e) => setDatosPausa({ ...datosPausa, fechaInicio: e.target.value })}
              leftIcon={<Calendar className="w-5 h-5" />}
            />
            
            <Input
              label="Fecha de fin"
              type="date"
              value={datosPausa.fechaFin}
              onChange={(e) => setDatosPausa({ ...datosPausa, fechaFin: e.target.value })}
              leftIcon={<Calendar className="w-5 h-5" />}
            />
          </div>

          {datosPausa.fechaInicio && datosPausa.fechaFin && calcularDiasPausa() > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm text-gray-700">
                <strong>Duración de la pausa:</strong> {calcularDiasPausa()} días
              </p>
            </div>
          )}

          <Input
            label="Motivo (opcional)"
            value={datosPausa.motivo}
            onChange={(e) => setDatosPausa({ ...datosPausa, motivo: e.target.value })}
            placeholder="Ej: Viaje de trabajo, lesión temporal..."
          />
        </div>
      </Modal>
    </div>
  );
};

