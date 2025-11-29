/**
 * EstrategiasCobro.tsx
 * 
 * Componente para mostrar estrategias de cobro diferenciadas por nivel de riesgo
 * y permitir registrar acciones de cobro ligadas a una estrategia seleccionada.
 * 
 * Este componente se combina con SeguimientoPagos.tsx para ver la efectividad
 * de las acciones registradas. Las acciones registradas aquí aparecerán en el
 * historial de SeguimientoPagos.tsx, permitiendo un seguimiento completo del
 * proceso de cobro.
 * 
 * Funcionalidades:
 * - Muestra estrategias recomendadas por nivel de riesgo (Bajo, Medio, Alto, Crítico)
 * - Permite registrar acciones de cobro (llamada, email, whatsapp, etc.) ligadas a una estrategia
 * - Visualización tipo panel por columnas o selector de nivel de riesgo
 * - Integración con la API de seguimiento para registrar acciones
 */

import React, { useState } from 'react';
import { Card, Badge, Button, Modal, Input, Textarea, Select } from '../../../components/componentsreutilizables';
import { NivelRiesgo, TipoAccionCobro, ResultadoAccionCobro, AccionCobro } from '../types';
import { accionesCobroAPI } from '../api/seguimiento';
import { Phone, Mail, MessageSquare, MapPin, FileText, AlertTriangle, CheckCircle, Target } from 'lucide-react';

interface EstrategiasCobroProps {
  onRefresh?: () => void;
  clienteId?: string; // Opcional: para filtrar por cliente específico
}

/**
 * Estrategias recomendadas por nivel de riesgo.
 * Estas son estrategias mock definidas en el componente.
 * En producción, estas estrategias podrían venir de una base de datos o configuración.
 */
interface EstrategiaRecomendada {
  id: string;
  nombre: string;
  descripcion: string;
  nivelRiesgo: NivelRiesgo;
  accionesRecomendadas: {
    tipo: TipoAccionCobro;
    descripcion: string;
    orden: number;
  }[];
}

const estrategiasPorNivel: Record<NivelRiesgo, EstrategiaRecomendada[]> = {
  bajo: [
    {
      id: 'estr-bajo-1',
      nombre: 'Recordatorio Amigable',
      descripcion: 'Envío de recordatorios amigables por email o SMS para clientes con bajo riesgo',
      nivelRiesgo: 'bajo',
      accionesRecomendadas: [
        { tipo: 'email', descripcion: 'Enviar email recordatorio amigable', orden: 1 },
        { tipo: 'whatsapp', descripcion: 'Mensaje de WhatsApp con recordatorio', orden: 2 }
      ]
    },
    {
      id: 'estr-bajo-2',
      nombre: 'Seguimiento Pasivo',
      descripcion: 'Monitoreo y seguimiento pasivo con recordatorios automáticos',
      nivelRiesgo: 'bajo',
      accionesRecomendadas: [
        { tipo: 'email', descripcion: 'Email automático de recordatorio', orden: 1 }
      ]
    }
  ],
  medio: [
    {
      id: 'estr-medio-1',
      nombre: 'Contacto Directo',
      descripcion: 'Contacto telefónico directo para establecer comunicación y negociar',
      nivelRiesgo: 'medio',
      accionesRecomendadas: [
        { tipo: 'llamada', descripcion: 'Llamada telefónica al cliente', orden: 1 },
        { tipo: 'email', descripcion: 'Email con tono más firme', orden: 2 },
        { tipo: 'whatsapp', descripcion: 'Mensaje de WhatsApp de seguimiento', orden: 3 }
      ]
    },
    {
      id: 'estr-medio-2',
      nombre: 'Negociación Inicial',
      descripcion: 'Iniciar proceso de negociación para establecer plan de pagos',
      nivelRiesgo: 'medio',
      accionesRecomendadas: [
        { tipo: 'llamada', descripcion: 'Llamada para negociar condiciones', orden: 1 },
        { tipo: 'email', descripcion: 'Envío de propuesta de plan de pagos', orden: 2 }
      ]
    }
  ],
  alto: [
    {
      id: 'estr-alto-1',
      nombre: 'Gestión Intensiva',
      descripcion: 'Gestión intensiva con múltiples puntos de contacto y seguimiento estricto',
      nivelRiesgo: 'alto',
      accionesRecomendadas: [
        { tipo: 'llamada', descripcion: 'Llamada urgente al cliente', orden: 1 },
        { tipo: 'visita', descripcion: 'Visita al domicilio si es necesario', orden: 2 },
        { tipo: 'email', descripcion: 'Email formal con advertencia', orden: 3 },
        { tipo: 'carta', descripcion: 'Carta formal de requerimiento', orden: 4 }
      ]
    },
    {
      id: 'estr-alto-2',
      nombre: 'Plan de Pago Estricto',
      descripcion: 'Establecer plan de pago con condiciones estrictas y seguimiento cercano',
      nivelRiesgo: 'alto',
      accionesRecomendadas: [
        { tipo: 'llamada', descripcion: 'Llamada para negociar plan estricto', orden: 1 },
        { tipo: 'visita', descripcion: 'Reunión presencial si es posible', orden: 2 }
      ]
    }
  ],
  critico: [
    {
      id: 'estr-critico-1',
      nombre: 'Escalado Legal',
      descripcion: 'Derivación a gestión legal o agencia externa de cobro',
      nivelRiesgo: 'critico',
      accionesRecomendadas: [
        { tipo: 'carta', descripcion: 'Notificación formal de mora', orden: 1 },
        { tipo: 'derivacionExterna', descripcion: 'Derivación a agencia externa', orden: 2 },
        { tipo: 'suspensionServicio', descripcion: 'Suspensión de servicios si aplica', orden: 3 }
      ]
    },
    {
      id: 'estr-critico-2',
      nombre: 'Última Oportunidad',
      descripcion: 'Ofrecer última oportunidad antes de escalar a gestión legal',
      nivelRiesgo: 'critico',
      accionesRecomendadas: [
        { tipo: 'llamada', descripcion: 'Llamada final de negociación', orden: 1 },
        { tipo: 'visita', descripcion: 'Visita final al domicilio', orden: 2 },
        { tipo: 'carta', descripcion: 'Carta de última oportunidad', orden: 3 }
      ]
    }
  ]
};

export const EstrategiasCobro: React.FC<EstrategiasCobroProps> = ({ onRefresh, clienteId }) => {
  const [nivelSeleccionado, setNivelSeleccionado] = useState<NivelRiesgo>('bajo');
  const [estrategiaSeleccionada, setEstrategiaSeleccionada] = useState<string | null>(null);
  const [mostrarModalAccion, setMostrarModalAccion] = useState(false);
  const [accionEnProceso, setAccionEnProceso] = useState<{
    estrategiaId: string;
    tipoAccion: TipoAccionCobro;
  } | null>(null);
  
  // Formulario de registro de acción
  const [tipoAccion, setTipoAccion] = useState<TipoAccionCobro>('llamada');
  const [resultado, setResultado] = useState<ResultadoAccionCobro>('contactado');
  const [notas, setNotas] = useState('');
  const [clienteIdForm, setClienteIdForm] = useState(clienteId || '');
  const [loading, setLoading] = useState(false);

  const nivelesRiesgo: { value: NivelRiesgo; label: string; color: 'green' | 'yellow' | 'orange' | 'red' }[] = [
    { value: 'bajo', label: 'Bajo', color: 'green' },
    { value: 'medio', label: 'Medio', color: 'yellow' },
    { value: 'alto', label: 'Alto', color: 'orange' },
    { value: 'critico', label: 'Crítico', color: 'red' }
  ];

  const estrategiasActuales = estrategiasPorNivel[nivelSeleccionado];

  const obtenerIconoTipoAccion = (tipo: TipoAccionCobro) => {
    const iconos: Record<TipoAccionCobro, React.ReactNode> = {
      llamada: <Phone className="w-5 h-5" />,
      email: <Mail className="w-5 h-5" />,
      whatsapp: <MessageSquare className="w-5 h-5" />,
      visita: <MapPin className="w-5 h-5" />,
      carta: <FileText className="w-5 h-5" />,
      derivacionExterna: <AlertTriangle className="w-5 h-5" />,
      suspensionServicio: <XCircle className="w-5 h-5" />
    };
    return iconos[tipo] || <MessageSquare className="w-5 h-5" />;
  };

  const obtenerBadgeNivel = (nivel: NivelRiesgo) => {
    const nivelInfo = nivelesRiesgo.find(n => n.value === nivel);
    return (
      <Badge variant={nivelInfo?.color || 'gray'} size="md">
        {nivelInfo?.label || nivel}
      </Badge>
    );
  };

  const obtenerBadgeResultado = (resultado: ResultadoAccionCobro) => {
    const resultados: Record<ResultadoAccionCobro, { label: string; variant: 'gray' | 'blue' | 'green' | 'yellow' | 'red' }> = {
      sinContacto: { label: 'Sin Contacto', variant: 'gray' },
      contactado: { label: 'Contactado', variant: 'blue' },
      compromisoPago: { label: 'Compromiso de Pago', variant: 'yellow' },
      pagoRealizado: { label: 'Pago Realizado', variant: 'green' },
      negativa: { label: 'Negativa', variant: 'red' },
      pendienteRespuesta: { label: 'Pendiente Respuesta', variant: 'yellow' }
    };
    
    const resultadoInfo = resultados[resultado] || resultados.contactado;
    return (
      <Badge variant={resultadoInfo.variant} size="sm">
        {resultadoInfo.label}
      </Badge>
    );
  };

  const handleAbrirModalAccion = (estrategiaId: string, tipoAccion: TipoAccionCobro) => {
    const estrategia = estrategiasActuales.find(e => e.id === estrategiaId);
    if (!estrategia) return;

    setAccionEnProceso({ estrategiaId, tipoAccion });
    setTipoAccion(tipoAccion);
    setResultado('contactado');
    setNotas('');
    setMostrarModalAccion(true);
  };

  const handleRegistrarAccion = async () => {
    if (!clienteIdForm.trim() || !notas.trim() || !accionEnProceso) {
      return;
    }

    setLoading(true);
    try {
      await accionesCobroAPI.registrarAccionCobro({
        clienteId: clienteIdForm.trim(),
        tipoAccion,
        fecha: new Date(),
        resultado,
        notas: notas.trim()
      });

      // Limpiar formulario
      setMostrarModalAccion(false);
      setAccionEnProceso(null);
      setClienteIdForm(clienteId || '');
      setNotas('');
      setTipoAccion('llamada');
      setResultado('contactado');

      // Notificar al componente padre
      onRefresh?.();

      // Mostrar mensaje de éxito (podrías usar un toast aquí)
      alert('Acción de cobro registrada exitosamente');
    } catch (error) {
      console.error('Error al registrar acción de cobro:', error);
      alert('Error al registrar la acción de cobro. Por favor, intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const opcionesTipoAccion: { value: TipoAccionCobro; label: string }[] = [
    { value: 'llamada', label: 'Llamada' },
    { value: 'email', label: 'Email' },
    { value: 'whatsapp', label: 'WhatsApp' },
    { value: 'visita', label: 'Visita' },
    { value: 'carta', label: 'Carta' },
    { value: 'derivacionExterna', label: 'Derivación Externa' },
    { value: 'suspensionServicio', label: 'Suspensión de Servicio' }
  ];

  const opcionesResultado: { value: ResultadoAccionCobro; label: string }[] = [
    { value: 'sinContacto', label: 'Sin Contacto' },
    { value: 'contactado', label: 'Contactado' },
    { value: 'compromisoPago', label: 'Compromiso de Pago' },
    { value: 'pagoRealizado', label: 'Pago Realizado' },
    { value: 'negativa', label: 'Negativa' },
    { value: 'pendienteRespuesta', label: 'Pendiente Respuesta' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Estrategias de Cobro por Nivel de Riesgo
          </h2>
          <p className="text-gray-600">
            Visualiza y aplica estrategias de cobro diferenciadas según el nivel de riesgo del cliente.
            Las acciones registradas aquí se pueden ver en SeguimientoPagos.tsx para evaluar efectividad.
          </p>
        </div>
      </div>

      {/* Selector de Nivel de Riesgo */}
      <div className="flex gap-2">
        {nivelesRiesgo.map((nivel) => (
          <Button
            key={nivel.value}
            variant={nivelSeleccionado === nivel.value ? 'primary' : 'secondary'}
            size="md"
            onClick={() => {
              setNivelSeleccionado(nivel.value);
              setEstrategiaSeleccionada(null);
            }}
            className="flex items-center gap-2"
          >
            {obtenerBadgeNivel(nivel.value)}
            <span>{nivel.label}</span>
          </Button>
        ))}
      </div>

      {/* Panel de Estrategias por Columnas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {estrategiasActuales.map((estrategia) => (
          <Card key={estrategia.id} className="p-6 hover:shadow-lg transition-shadow">
            <div className="space-y-4">
              {/* Header de la estrategia */}
              <div>
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {estrategia.nombre}
                  </h3>
                  {obtenerBadgeNivel(estrategia.nivelRiesgo)}
                </div>
                <p className="text-sm text-gray-600">
                  {estrategia.descripcion}
                </p>
              </div>

              {/* Acciones recomendadas */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  Acciones Recomendadas
                </h4>
                <div className="space-y-2">
                  {estrategia.accionesRecomendadas
                    .sort((a, b) => a.orden - b.orden)
                    .map((accion, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-center gap-3 flex-1">
                          <div className="text-gray-400">
                            {obtenerIconoTipoAccion(accion.tipo)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 capitalize">
                              {accion.tipo.replace(/([A-Z])/g, ' $1').trim()}
                            </p>
                            <p className="text-xs text-gray-600">
                              {accion.descripcion}
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleAbrirModalAccion(estrategia.id, accion.tipo)}
                          title="Registrar esta acción"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Mensaje si no hay estrategias */}
      {estrategiasActuales.length === 0 && (
        <Card className="p-8 text-center">
          <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">
            No hay estrategias configuradas para el nivel de riesgo seleccionado
          </p>
        </Card>
      )}

      {/* Modal para registrar acción */}
      <Modal
        isOpen={mostrarModalAccion}
        onClose={() => {
          setMostrarModalAccion(false);
          setAccionEnProceso(null);
        }}
        title="Registrar Acción de Cobro"
        size="md"
        footer={
          <div className="flex gap-3">
            <Button
              variant="secondary"
              onClick={() => {
                setMostrarModalAccion(false);
                setAccionEnProceso(null);
              }}
            >
              Cancelar
            </Button>
            <Button
              variant="primary"
              onClick={handleRegistrarAccion}
              disabled={!clienteIdForm.trim() || !notas.trim() || loading}
              loading={loading}
            >
              Registrar Acción
            </Button>
          </div>
        }
      >
        {accionEnProceso && (
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg ring-1 ring-blue-200">
              <p className="text-sm font-medium text-blue-900 mb-1">
                Estrategia: {estrategiasActuales.find(e => e.id === accionEnProceso.estrategiaId)?.nombre}
              </p>
              <p className="text-sm text-blue-700">
                Tipo de acción: {tipoAccion.replace(/([A-Z])/g, ' $1').trim()}
              </p>
            </div>

            <Input
              label="ID del Cliente *"
              value={clienteIdForm}
              onChange={(e) => setClienteIdForm(e.target.value)}
              placeholder="Ingresa el ID del cliente"
              disabled={!!clienteId} // Deshabilitado si viene como prop
            />

            <Select
              label="Tipo de Acción"
              options={opcionesTipoAccion}
              value={tipoAccion}
              onChange={(value) => setTipoAccion(value as TipoAccionCobro)}
            />

            <Select
              label="Resultado"
              options={opcionesResultado}
              value={resultado}
              onChange={(value) => setResultado(value as ResultadoAccionCobro)}
            />

            <Textarea
              label="Notas *"
              value={notas}
              onChange={(e) => setNotas(e.target.value)}
              rows={4}
              placeholder="Describe el resultado de la acción, compromisos acordados, próximos pasos, etc."
            />

            <p className="text-xs text-gray-500">
              Esta acción será registrada y podrá visualizarse en SeguimientoPagos.tsx
              para evaluar la efectividad de las estrategias aplicadas.
            </p>
          </div>
        )}
      </Modal>
    </div>
  );
};

