import React, { useState, useEffect } from 'react';
import { useAdherencia } from '../hooks/useAdherencia';
import { FiltrosAdherencia, AdherenciaCliente } from '../types';
import { Icon, iconForTendencia } from '../ui/icons';
import { ds } from '../ui/ds';
import { Card, Select, Button, Modal, Textarea } from '../../../components/componentsreutilizables';

interface Props {
  filtros: FiltrosAdherencia;
  onFiltrosChange: (filtros: FiltrosAdherencia) => void;
}

export const CumplimientoCliente: React.FC<Props> = ({ filtros, onFiltrosChange }) => {
  const {
    adherencias,
    obtenerAdherenciaCliente,
    registrarSesionCompletada,
    registrarSesionIncumplida,
    loading
  } = useAdherencia();

  const [clienteSeleccionado, setClienteSeleccionado] = useState<string>('');
  const [mostrarModal, setMostrarModal] = useState(false);
  const [sesionActual, setSesionActual] = useState<string>('');
  const [accion, setAccion] = useState<'completar' | 'incumplir'>('completar');
  const [notas, setNotas] = useState('');
  const [motivo, setMotivo] = useState('');

  // Datos simulados de clientes - en producción vendría de una API
  const clientes = [
    { id: '1', nombre: 'Juan Pérez', email: 'juan@email.com' },
    { id: '2', nombre: 'María García', email: 'maria@email.com' },
    { id: '3', nombre: 'Carlos López', email: 'carlos@email.com' },
    { id: '4', nombre: 'Ana Martínez', email: 'ana@email.com' }
  ];

  // Datos simulados de sesiones - en producción vendría de una API
  const sesiones = [
    {
      id: 'ses1',
      clienteId: '1',
      fecha: '2024-01-15',
      ejercicios: ['Sentadillas', 'Press de banca', 'Peso muerto'],
      completada: false,
      programada: true
    },
    {
      id: 'ses2',
      clienteId: '1',
      fecha: '2024-01-17',
      ejercicios: ['Cardio', 'Abdominales', 'Flexiones'],
      completada: true,
      programada: true
    },
    {
      id: 'ses3',
      clienteId: '2',
      fecha: '2024-01-16',
      ejercicios: ['Yoga', 'Estiramientos', 'Meditación'],
      completada: false,
      programada: true
    }
  ];

  useEffect(() => {
    if (clienteSeleccionado) {
      obtenerAdherenciaCliente(clienteSeleccionado);
    }
  }, [clienteSeleccionado, obtenerAdherenciaCliente]);

  const handleRegistrarSesion = async () => {
    if (!sesionActual) return;

    try {
      if (accion === 'completar') {
        await registrarSesionCompletada(sesionActual, notas);
      } else {
        await registrarSesionIncumplida(sesionActual, motivo);
      }
      
      setMostrarModal(false);
      setNotas('');
      setMotivo('');
      setSesionActual('');
      
      // Recargar adherencia del cliente
      if (clienteSeleccionado) {
        obtenerAdherenciaCliente(clienteSeleccionado);
      }
    } catch (error) {
      console.error('Error al registrar sesión:', error);
    }
  };

  const abrirModal = (sesionId: string, tipoAccion: 'completar' | 'incumplir') => {
    setSesionActual(sesionId);
    setAccion(tipoAccion);
    setMostrarModal(true);
  };

  const adherenciaCliente = adherencias.find(a => a.clienteId === clienteSeleccionado);
  const sesionesCliente = sesiones.filter(s => s.clienteId === clienteSeleccionado);

  const getColorAdherencia = (porcentaje: number) => {
    if (porcentaje >= 80) return `${ds.color.success} ${ds.color.successBg} ${ds.color.successBgDark}`;
    if (porcentaje >= 60) return `${ds.color.warning} ${ds.color.warningBg} ${ds.color.warningBgDark}`;
    return `${ds.color.error} ${ds.color.errorBg} ${ds.color.errorBgDark}`;
  };

  const getIconoTendencia = (tendencia: string) => iconForTendencia(tendencia);

  return (
    <div className="space-y-6">
      {/* Selector de Cliente */}
      <Card className="p-4 bg-white shadow-sm">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Seleccionar Cliente</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Select
            label="Cliente"
            value={clienteSeleccionado}
            onChange={setClienteSeleccionado}
            options={[
              { value: '', label: 'Seleccionar cliente...' },
              ...clientes.map(cliente => ({
                value: cliente.id,
                label: cliente.nombre
              }))
            ]}
          />
        </div>
      </Card>

      {/* Información del Cliente Seleccionado */}
      {clienteSeleccionado && adherenciaCliente && (
        <Card className="p-4 bg-white shadow-sm">
          <h3 className="text-xl font-bold text-gray-900 mb-6">
            Adherencia de {clientes.find(c => c.id === clienteSeleccionado)?.nombre}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className={`${ds.color.infoBg} ${ds.color.infoBgDark} rounded-2xl p-6 ${ds.animation.normal} hover:scale-105`}>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-[#3B82F6] dark:bg-[#60A5FA] rounded-xl flex items-center justify-center mr-4">
                  <Icon name="chart" className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className={`${ds.typography.bodySmall} font-semibold ${ds.color.info}`}>Adherencia</p>
                  <p className={`${ds.typography.h2} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                    {adherenciaCliente.porcentajeAdherencia.toFixed(1)}%
                  </p>
                </div>
              </div>
            </div>

            <div className={`${ds.color.successBg} ${ds.color.successBgDark} rounded-2xl p-6 ${ds.animation.normal} hover:scale-105`}>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-[#10B981] dark:bg-[#34D399] rounded-xl flex items-center justify-center mr-4">
                  <Icon name="check" className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className={`${ds.typography.bodySmall} font-semibold ${ds.color.success}`}>Completadas</p>
                  <p className={`${ds.typography.h2} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                    {adherenciaCliente.sesionesCompletadas}/{adherenciaCliente.sesionesTotales}
                  </p>
                </div>
              </div>
            </div>

            <div className={`bg-gradient-to-br from-[#8B5CF6] to-[#A855F7] dark:from-[#6D28D9] dark:to-[#7C3AED] rounded-2xl p-6 ${ds.animation.normal} hover:scale-105`}>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mr-4">
                  {getIconoTendencia(adherenciaCliente.tendencia)}
                </div>
                <div>
                  <p className={`${ds.typography.bodySmall} font-semibold text-white/90`}>Tendencia</p>
                  <p className={`${ds.typography.h2} text-white capitalize`}>
                    {adherenciaCliente.tendencia}
                  </p>
                </div>
              </div>
            </div>

            <div className={`${ds.color.surface2} ${ds.color.surface2Dark} rounded-2xl p-6 ${ds.animation.normal} hover:scale-105`}>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-[#64748B] dark:bg-[#94A3B8] rounded-xl flex items-center justify-center mr-4">
                  <Icon name="clock" className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className={`${ds.typography.bodySmall} font-semibold ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>Última Sesión</p>
                  <p className={`${ds.typography.h2} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                    {adherenciaCliente.ultimaSesion 
                      ? new Date(adherenciaCliente.ultimaSesion).toLocaleDateString('es-ES')
                      : 'N/A'
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Alerta de Baja Adherencia */}
          {adherenciaCliente.alertaActiva && (
            <div className={`${ds.color.errorBg} ${ds.color.errorBgDark} border border-[#FECACA] dark:border-[#991B1B] rounded-2xl p-6 mb-6 shadow-lg`}>
              <div className="flex items-start">
                <div className="w-10 h-10 bg-[#EF4444] dark:bg-[#F87171] rounded-xl flex items-center justify-center mr-4 flex-shrink-0">
                  <Icon name="warning" className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className={`${ds.typography.h3} font-semibold ${ds.color.error} mb-2`}>Alerta de Baja Adherencia</h4>
                  <p className={`${ds.typography.body} text-[#991B1B] dark:text-[#FECACA]`}>
                    Este cliente tiene una adherencia por debajo del umbral recomendado. 
                    Considera contactarlo para revisar su programa de entrenamiento.
                  </p>
                </div>
              </div>
            </div>
          )}
        </Card>
      )}

      {/* Lista de Sesiones */}
      {clienteSeleccionado && (
        <Card className="p-4 bg-white shadow-sm">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Sesiones de Entrenamiento</h3>
          
          {sesionesCliente.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-gradient-to-br from-[#64748B] to-[#94A3B8] rounded-full flex items-center justify-center mx-auto mb-6">
                <Icon name="clock" className="w-8 h-8 text-white" />
              </div>
              <p className={`${ds.typography.bodyLarge} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
                No hay sesiones programadas para este cliente.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {sesionesCliente.map((sesion) => (
                <div
                  key={sesion.id}
                  className={`border rounded-2xl p-6 ${ds.animation.normal} hover:scale-[1.02] ${
                    sesion.completada 
                      ? 'border-[#10B981] bg-gradient-to-r from-[#D1FAE5] to-[#A7F3D0] dark:from-[#064E3B] dark:to-[#065F46]' 
                      : 'border-[#E2E8F0] dark:border-[#334155] bg-white dark:bg-[#1E1E2E]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                          sesion.completada 
                            ? 'bg-[#10B981] dark:bg-[#34D399]' 
                            : 'bg-[#64748B] dark:bg-[#94A3B8]'
                        }`}>
                          {sesion.completada 
                            ? <Icon name="check" className="w-6 h-6 text-white" /> 
                            : <Icon name="clock" className="w-6 h-6 text-white" />}
                        </div>
                        <div>
                          <p className={`${ds.typography.h3} font-semibold ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                            Sesión del {new Date(sesion.fecha).toLocaleDateString('es-ES')}
                          </p>
                          <p className={`${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
                            Ejercicios: {sesion.ejercicios.join(', ')}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    {!sesion.completada && (
                      <div className="flex space-x-3">
                        <Button
                          variant="primary"
                          onClick={() => abrirModal(sesion.id, 'completar')}
                        >
                          <Icon name="check" className="w-5 h-5 mr-2" />
                          Completar
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={() => abrirModal(sesion.id, 'incumplir')}
                        >
                          <Icon name="warning" className="w-5 h-5 mr-2" />
                          No Cumplida
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}

      {/* Modal para Registrar Sesión */}
      <Modal
        isOpen={mostrarModal}
        onClose={() => setMostrarModal(false)}
        title={accion === 'completar' ? 'Marcar Sesión como Completada' : 'Marcar Sesión como No Cumplida'}
      >
        {accion === 'completar' ? (
          <div className="space-y-4">
            <Textarea
              label="Notas (opcional)"
              value={notas}
              onChange={(e) => setNotas(e.target.value)}
              rows={3}
              placeholder="Observaciones sobre la sesión..."
            />
          </div>
        ) : (
          <div className="space-y-4">
            <Select
              label="Motivo del incumplimiento"
              value={motivo}
              onChange={setMotivo}
              options={[
                { value: '', label: 'Seleccionar motivo...' },
                { value: 'enfermedad', label: 'Enfermedad' },
                { value: 'trabajo', label: 'Compromisos laborales' },
                { value: 'personal', label: 'Motivos personales' },
                { value: 'lesion', label: 'Lesión' },
                { value: 'otro', label: 'Otro' }
              ]}
            />
          </div>
        )}
        
        <div className="flex justify-end space-x-4 mt-8">
          <Button
            variant="secondary"
            onClick={() => setMostrarModal(false)}
          >
            Cancelar
          </Button>
          <Button
            variant={accion === 'completar' ? 'primary' : 'destructive'}
            onClick={handleRegistrarSesion}
            disabled={accion === 'incumplir' && !motivo}
          >
            {accion === 'completar' ? 'Marcar Completada' : 'Marcar No Cumplida'}
          </Button>
        </div>
      </Modal>
    </div>
  );
};