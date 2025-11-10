import React, { useState, useEffect } from 'react';
import { Card, Button, Input, Modal } from '../../../components/componentsreutilizables';
import { Mail, CheckCircle2, Clock, Loader2, Send, Settings } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { resumenSemanalEmailApi } from '../api';
import { ResumenSemanalEmail } from '../types';

export const ConfiguracionResumenSemanal: React.FC = () => {
  const { user } = useAuth();
  const [config, setConfig] = useState<ResumenSemanalEmail | null>(null);
  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mostrarModalEnvio, setMostrarModalEnvio] = useState(false);

  // Estado del formulario
  const [activo, setActivo] = useState(false);
  const [diaEnvio, setDiaEnvio] = useState<'lunes' | 'martes' | 'miercoles' | 'jueves' | 'viernes' | 'sabado' | 'domingo'>('lunes');
  const [horaEnvio, setHoraEnvio] = useState('09:00');
  const [emailDestinatario, setEmailDestinatario] = useState('');
  const [incluirIngresos, setIncluirIngresos] = useState(true);
  const [incluirPagosPendientes, setIncluirPagosPendientes] = useState(true);
  const [incluirProximasSesiones, setIncluirProximasSesiones] = useState(true);
  const [incluirMetricasRetencion, setIncluirMetricasRetencion] = useState(true);

  useEffect(() => {
    cargarConfiguracion();
  }, [user?.id]);

  const cargarConfiguracion = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      const configActual = await resumenSemanalEmailApi.obtenerConfiguracion(user.id);
      
      if (configActual) {
        setConfig(configActual);
        setActivo(configActual.activo);
        setDiaEnvio(configActual.diaEnvio);
        setHoraEnvio(configActual.horaEnvio);
        setEmailDestinatario(configActual.emailDestinatario);
        setIncluirIngresos(configActual.incluirIngresos);
        setIncluirPagosPendientes(configActual.incluirPagosPendientes);
        setIncluirProximasSesiones(configActual.incluirProximasSesiones);
        setIncluirMetricasRetencion(configActual.incluirMetricasRetencion);
      } else {
        // Configuración por defecto
        setEmailDestinatario(user.email || '');
      }
    } catch (error) {
      console.error('Error cargando configuración:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGuardar = async () => {
    if (!user?.id) return;

    if (!emailDestinatario || !emailDestinatario.includes('@')) {
      alert('Por favor, ingresa un email válido');
      return;
    }

    setGuardando(true);
    try {
      const nuevaConfig: ResumenSemanalEmail = {
        entrenadorId: user.id,
        activo,
        diaEnvio,
        horaEnvio,
        emailDestinatario,
        incluirIngresos,
        incluirPagosPendientes,
        incluirProximasSesiones,
        incluirMetricasRetencion,
        fechaCreacion: config?.fechaCreacion,
      };

      const configGuardada = await resumenSemanalEmailApi.guardarConfiguracion(nuevaConfig);
      setConfig(configGuardada);
      setMostrarModal(false);
      alert('Configuración guardada correctamente');
    } catch (error) {
      console.error('Error guardando configuración:', error);
      alert('Error al guardar la configuración. Por favor, intenta nuevamente.');
    } finally {
      setGuardando(false);
    }
  };

  const handleEnviarPrueba = async () => {
    if (!user?.id || !user?.role) return;

    setEnviando(true);
    try {
      const resultado = await resumenSemanalEmailApi.enviarResumenSemanal(user.id, user.role);
      
      if (resultado.success) {
        alert('Email de prueba enviado correctamente. Revisa tu bandeja de entrada.');
        setMostrarModalEnvio(false);
        // Recargar configuración para actualizar última fecha de envío
        await cargarConfiguracion();
      } else {
        alert(`Error al enviar el email: ${resultado.error || 'Error desconocido'}`);
      }
    } catch (error) {
      console.error('Error enviando email de prueba:', error);
      alert('Error al enviar el email de prueba. Por favor, intenta nuevamente.');
    } finally {
      setEnviando(false);
    }
  };

  if (loading) {
    return (
      <Card className="bg-white shadow-sm">
        <div className="p-6">
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
            <Mail className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Resumen Semanal por Email
            </h2>
            <p className="text-sm text-gray-600">
              Recibe un resumen automático cada lunes con tus métricas clave
            </p>
          </div>
        </div>
        <Button
          variant="primary"
          onClick={() => setMostrarModal(true)}
          leftIcon={<Settings className="w-4 h-4" />}
        >
          Configurar
        </Button>
      </div>

      {/* Estado actual */}
      <Card className="bg-white shadow-sm">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${config?.activo ? 'bg-green-100' : 'bg-gray-100'}`}>
                {config?.activo ? (
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                ) : (
                  <Clock className="w-5 h-5 text-gray-600" />
                )}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {config?.activo ? 'Resumen Semanal Activo' : 'Resumen Semanal Inactivo'}
                </h3>
                <p className="text-sm text-gray-600">
                  {config?.activo 
                    ? `Se envía cada ${config.diaEnvio} a las ${config.horaEnvio} a ${config.emailDestinatario}`
                    : 'Activa el resumen semanal para recibir emails automáticos'
                  }
                </p>
              </div>
            </div>
            {config?.activo && (
              <Button
                variant="secondary"
                onClick={() => setMostrarModalEnvio(true)}
                leftIcon={<Send className="w-4 h-4" />}
              >
                Enviar Prueba
              </Button>
            )}
          </div>

          {config?.activo && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Incluir Ingresos</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {config.incluirIngresos ? 'Sí' : 'No'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Pagos Pendientes</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {config.incluirPagosPendientes ? 'Sí' : 'No'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Próximas Sesiones</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {config.incluirProximasSesiones ? 'Sí' : 'No'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Métricas Retención</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {config.incluirMetricasRetencion ? 'Sí' : 'No'}
                  </p>
                </div>
              </div>
              {config.ultimoEnvio && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-xs text-gray-500">
                    Último envío: {new Date(config.ultimoEnvio).toLocaleDateString('es-ES', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </Card>

      {/* Modal de configuración */}
      <Modal
        isOpen={mostrarModal}
        onClose={() => setMostrarModal(false)}
        title="Configurar Resumen Semanal"
        size="lg"
        footer={
          <div className="flex gap-3">
            <Button
              variant="secondary"
              onClick={() => setMostrarModal(false)}
              disabled={guardando}
            >
              Cancelar
            </Button>
            <Button
              variant="primary"
              onClick={handleGuardar}
              loading={guardando}
              disabled={guardando}
              leftIcon={<CheckCircle2 className="w-4 h-4" />}
            >
              Guardar Configuración
            </Button>
          </div>
        }
      >
        <div className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>Resumen Semanal Automático:</strong> Recibirás un email cada lunes con un resumen de tus ingresos, 
              pagos pendientes, próximas sesiones y métricas de retención. Puedes personalizar qué información incluir.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">
                Activar resumen semanal
              </label>
              <button
                type="button"
                onClick={() => setActivo(!activo)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  activo ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    activo ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <Input
              label="Email Destinatario"
              type="email"
              value={emailDestinatario}
              onChange={(e) => setEmailDestinatario(e.target.value)}
              placeholder="tu@email.com"
              required
            />

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Día de Envío
                </label>
                <select
                  value={diaEnvio}
                  onChange={(e) => setDiaEnvio(e.target.value as any)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="lunes">Lunes</option>
                  <option value="martes">Martes</option>
                  <option value="miercoles">Miércoles</option>
                  <option value="jueves">Jueves</option>
                  <option value="viernes">Viernes</option>
                  <option value="sabado">Sábado</option>
                  <option value="domingo">Domingo</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hora de Envío
                </label>
                <Input
                  type="time"
                  value={horaEnvio}
                  onChange={(e) => setHoraEnvio(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <h4 className="text-sm font-semibold text-gray-900 mb-3">
                Contenido del Email
              </h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm text-gray-700">Incluir Ingresos</label>
                  <button
                    type="button"
                    onClick={() => setIncluirIngresos(!incluirIngresos)}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                      incluirIngresos ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                        incluirIngresos ? 'translate-x-5' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <label className="text-sm text-gray-700">Incluir Pagos Pendientes</label>
                  <button
                    type="button"
                    onClick={() => setIncluirPagosPendientes(!incluirPagosPendientes)}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                      incluirPagosPendientes ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                        incluirPagosPendientes ? 'translate-x-5' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <label className="text-sm text-gray-700">Incluir Próximas Sesiones</label>
                  <button
                    type="button"
                    onClick={() => setIncluirProximasSesiones(!incluirProximasSesiones)}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                      incluirProximasSesiones ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                        incluirProximasSesiones ? 'translate-x-5' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <label className="text-sm text-gray-700">Incluir Métricas de Retención</label>
                  <button
                    type="button"
                    onClick={() => setIncluirMetricasRetencion(!incluirMetricasRetencion)}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                      incluirMetricasRetencion ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                        incluirMetricasRetencion ? 'translate-x-5' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal>

      {/* Modal de envío de prueba */}
      <Modal
        isOpen={mostrarModalEnvio}
        onClose={() => setMostrarModalEnvio(false)}
        title="Enviar Email de Prueba"
        size="md"
        footer={
          <div className="flex gap-3">
            <Button
              variant="secondary"
              onClick={() => setMostrarModalEnvio(false)}
              disabled={enviando}
            >
              Cancelar
            </Button>
            <Button
              variant="primary"
              onClick={handleEnviarPrueba}
              loading={enviando}
              disabled={enviando}
              leftIcon={<Send className="w-4 h-4" />}
            >
              Enviar Prueba
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Se enviará un email de prueba con el resumen semanal actual a:
          </p>
          <p className="text-sm font-semibold text-gray-900">
            {config?.emailDestinatario}
          </p>
          <p className="text-xs text-gray-500">
            El email incluirá todas las secciones que tienes configuradas activas.
          </p>
        </div>
      </Modal>
    </div>
  );
};

