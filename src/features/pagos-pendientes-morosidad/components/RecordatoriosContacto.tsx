/**
 * RecordatoriosContacto.tsx
 * 
 * Componente para visualizar y gestionar el registro de intentos de contacto con clientes morosos.
 * 
 * Este componente puede utilizarse de dos formas:
 * 1. Como componente standalone: muestra todos los contactos registrados de todos los clientes
 * 2. Como panel de detalle: puede abrirse desde MorosidadList.tsx o SeguimientoPagos.tsx
 *    pasando un clienteId específico para mostrar solo los contactos de ese cliente
 * 
 * Funcionalidades:
 * - Visualización del historial de contactos por cliente: fecha, canal, resultado, notas
 * - Registro de nuevos contactos desde la interfaz
 * - Lista cronológica con iconos por tipo de contacto (llamada, email, whatsapp, visita)
 * - Filtrado por cliente cuando se usa como panel de detalle
 * 
 * Uso como panel de detalle:
 * ```tsx
 * // Desde MorosidadList.tsx o SeguimientoPagos.tsx
 * <RecordatoriosContacto 
 *   clienteId="cliente123" 
 *   clienteNombre="Juan Pérez"
 *   onClose={() => setMostrarPanel(false)}
 * />
 * ```
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Card, Button, Badge, Modal, Input, Textarea, Select } from '../../../components/componentsreutilizables';
import { ContactoCobro, TipoContactoCobro, ResultadoContactoCobro, PagoPendiente } from '../types';
import { contactosCobroAPI } from '../api/recordatoriosContacto';
import { morosidadAPI } from '../api/morosidad';
import { 
  Phone, 
  Mail, 
  MessageSquare, 
  MapPin, 
  Plus, 
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
  User
} from 'lucide-react';

interface RecordatoriosContactoProps {
  /**
   * ID del cliente para filtrar contactos (opcional).
   * Si se proporciona, solo se mostrarán los contactos de ese cliente.
   * Si no se proporciona, se mostrarán todos los contactos de todos los clientes.
   */
  clienteId?: string;
  
  /**
   * Nombre del cliente (opcional, solo necesario cuando se usa como panel de detalle).
   * Se mostrará en el encabezado cuando se filtre por cliente.
   */
  clienteNombre?: string;
  
  /**
   * ID del pago pendiente asociado (opcional).
   * Útil cuando se abre desde un contexto específico de pago.
   */
  pagoPendienteId?: string;
  
  /**
   * Callback para cerrar el panel cuando se usa como panel de detalle (opcional).
   */
  onClose?: () => void;
  
  /**
   * Callback que se ejecuta después de registrar un nuevo contacto (opcional).
   */
  onRefresh?: () => void;
}

export const RecordatoriosContacto: React.FC<RecordatoriosContactoProps> = ({ 
  clienteId, 
  clienteNombre,
  pagoPendienteId,
  onClose,
  onRefresh 
}) => {
  const [contactos, setContactos] = useState<ContactoCobro[]>([]);
  const [pagos, setPagos] = useState<PagoPendiente[]>([]);
  const [loading, setLoading] = useState(false);
  const [mostrarModalNuevoContacto, setMostrarModalNuevoContacto] = useState(false);
  
  // Estado para el formulario de nuevo contacto
  const [nuevoContacto, setNuevoContacto] = useState({
    tipoContacto: 'llamada' as TipoContactoCobro,
    fecha: new Date().toISOString().slice(0, 16), // Formato datetime-local
    resultado: 'contactado' as ResultadoContactoCobro,
    notas: '',
    clienteId: clienteId || '',
    pagoPendienteId: pagoPendienteId || ''
  });

  useEffect(() => {
    cargarDatos();
  }, [clienteId, pagoPendienteId]);

  const cargarDatos = async () => {
    setLoading(true);
    try {
      // Cargar contactos
      let contactosData: ContactoCobro[];
      if (clienteId) {
        contactosData = await contactosCobroAPI.getContactosPorCliente(clienteId);
      } else {
        contactosData = await contactosCobroAPI.obtenerTodos();
      }
      setContactos(contactosData);

      // Cargar pagos pendientes si no hay clienteId específico o si necesitamos datos del cliente
      if (!clienteId || !pagoPendienteId) {
        const pagosData = await morosidadAPI.obtenerPagosPendientes();
        setPagos(pagosData);
      }
    } catch (error) {
      console.error('Error al cargar datos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAbrirModalNuevoContacto = () => {
    // Si hay clienteId, pre-seleccionarlo
    if (clienteId) {
      setNuevoContacto(prev => ({
        ...prev,
        clienteId: clienteId,
        pagoPendienteId: pagoPendienteId || prev.pagoPendienteId
      }));
    }
    setMostrarModalNuevoContacto(true);
  };

  const handleRegistrarContacto = async () => {
    if (!nuevoContacto.clienteId || !nuevoContacto.notas.trim()) {
      return;
    }

    try {
      await contactosCobroAPI.registrarContacto({
        clienteId: nuevoContacto.clienteId,
        pagoPendienteId: nuevoContacto.pagoPendienteId || undefined,
        tipoContacto: nuevoContacto.tipoContacto,
        fecha: new Date(nuevoContacto.fecha),
        resultado: nuevoContacto.resultado,
        notas: nuevoContacto.notas.trim(),
        usuario: 'usuario_actual' // TODO: obtener del contexto de auth
      });

      setMostrarModalNuevoContacto(false);
      setNuevoContacto({
        tipoContacto: 'llamada',
        fecha: new Date().toISOString().slice(0, 16),
        resultado: 'contactado',
        notas: '',
        clienteId: clienteId || '',
        pagoPendienteId: pagoPendienteId || ''
      });
      
      cargarDatos();
      onRefresh?.();
    } catch (error) {
      console.error('Error al registrar contacto:', error);
    }
  };

  // Obtener icono según el tipo de contacto
  const obtenerIconoTipoContacto = (tipo: TipoContactoCobro) => {
    const iconos: Record<TipoContactoCobro, React.ReactNode> = {
      llamada: <Phone className="w-5 h-5" />,
      email: <Mail className="w-5 h-5" />,
      whatsapp: <MessageSquare className="w-5 h-5" />,
      visita: <MapPin className="w-5 h-5" />
    };
    return iconos[tipo];
  };

  // Obtener color del icono según el tipo de contacto
  const obtenerColorTipoContacto = (tipo: TipoContactoCobro): string => {
    const colores: Record<TipoContactoCobro, string> = {
      llamada: 'text-blue-500',
      email: 'text-purple-500',
      whatsapp: 'text-green-500',
      visita: 'text-orange-500'
    };
    return colores[tipo];
  };

  // Obtener etiqueta del tipo de contacto
  const obtenerEtiquetaTipoContacto = (tipo: TipoContactoCobro): string => {
    const etiquetas: Record<TipoContactoCobro, string> = {
      llamada: 'Llamada',
      email: 'Email',
      whatsapp: 'WhatsApp',
      visita: 'Visita'
    };
    return etiquetas[tipo];
  };

  // Obtener badge del resultado del contacto
  const obtenerBadgeResultado = (resultado: ResultadoContactoCobro) => {
    const configs: Record<ResultadoContactoCobro, { label: string; variant: 'blue' | 'green' | 'yellow' | 'red' | 'gray' }> = {
      sinContacto: { label: 'Sin Contacto', variant: 'gray' },
      contactado: { label: 'Contactado', variant: 'blue' },
      compromisoPago: { label: 'Compromiso de Pago', variant: 'green' },
      pagoRealizado: { label: 'Pago Realizado', variant: 'green' },
      negativa: { label: 'Negativa', variant: 'red' },
      pendienteRespuesta: { label: 'Pendiente Respuesta', variant: 'yellow' }
    };
    
    const config = configs[resultado];
    return <Badge variant={config.variant} size="sm">{config.label}</Badge>;
  };

  // Formatear fecha de forma relativa
  const formatearFechaRelativa = (fecha: Date): string => {
    const ahora = new Date();
    const diffMs = ahora.getTime() - fecha.getTime();
    const diffDias = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDias === 0) {
      const diffHoras = Math.floor(diffMs / (1000 * 60 * 60));
      if (diffHoras === 0) {
        const diffMinutos = Math.floor(diffMs / (1000 * 60));
        return diffMinutos <= 1 ? 'Hace un momento' : `Hace ${diffMinutos} minutos`;
      }
      return diffHoras === 1 ? 'Hace una hora' : `Hace ${diffHoras} horas`;
    }
    
    if (diffDias === 1) return 'Ayer';
    if (diffDias < 7) return `Hace ${diffDias} días`;
    if (diffDias < 30) return `Hace ${Math.floor(diffDias / 7)} semanas`;
    
    return fecha.toLocaleDateString('es-ES', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Agrupar contactos por cliente si no hay clienteId específico
  const contactosAgrupados = useMemo(() => {
    if (clienteId) {
      // Si hay clienteId, no agrupar, solo mostrar los contactos
      return contactos.map(contacto => ({
        clienteId: contacto.clienteId,
        clienteNombre: clienteNombre || 'Cliente',
        contactos: [contacto]
      }));
    }

    // Agrupar por cliente
    const agrupados = new Map<string, { clienteId: string; clienteNombre: string; contactos: ContactoCobro[] }>();
    
    contactos.forEach(contacto => {
      const pago = pagos.find(p => p.cliente.id === contacto.clienteId);
      const nombreCliente = pago?.cliente.nombre || `Cliente ${contacto.clienteId}`;
      
      if (!agrupados.has(contacto.clienteId)) {
        agrupados.set(contacto.clienteId, {
          clienteId: contacto.clienteId,
          clienteNombre: nombreCliente,
          contactos: []
        });
      }
      
      agrupados.get(contacto.clienteId)!.contactos.push(contacto);
    });

    return Array.from(agrupados.values()).map(grupo => ({
      ...grupo,
      contactos: grupo.contactos.sort((a, b) => b.fecha.getTime() - a.fecha.getTime())
    }));
  }, [contactos, pagos, clienteId, clienteNombre]);

  // Obtener pagos pendientes del cliente para el selector
  const pagosDelCliente = useMemo(() => {
    if (!clienteId) return [];
    return pagos.filter(p => p.cliente.id === clienteId);
  }, [pagos, clienteId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-500">Cargando contactos...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            {clienteId ? `Historial de Contactos - ${clienteNombre || 'Cliente'}` : 'Registro de Contactos'}
          </h2>
          <p className="text-gray-600">
            {clienteId 
              ? 'Historial completo de intentos de contacto con este cliente'
              : 'Registro visual de todos los intentos de contacto con clientes morosos'
            }
          </p>
        </div>
        <div className="flex gap-2">
          {onClose && (
            <Button
              variant="secondary"
              onClick={onClose}
            >
              Cerrar
            </Button>
          )}
          <Button
            variant="primary"
            onClick={handleAbrirModalNuevoContacto}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Registrar Contacto
          </Button>
        </div>
      </div>

      {/* Lista de contactos */}
      {contactosAgrupados.length === 0 ? (
        <Card className="p-8 text-center">
          <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-2">
            {clienteId ? 'No hay contactos registrados para este cliente' : 'No hay contactos registrados'}
          </p>
          <Button
            variant="primary"
            onClick={handleAbrirModalNuevoContacto}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Registrar Primer Contacto
          </Button>
        </Card>
      ) : (
        <div className="space-y-6">
          {contactosAgrupados.map((grupo) => (
            <Card key={grupo.clienteId} className="p-6">
              {!clienteId && (
                <div className="mb-4 pb-4 border-b border-gray-200">
                  <div className="flex items-center gap-2">
                    <User className="w-5 h-5 text-gray-400" />
                    <h3 className="text-lg font-semibold text-gray-900">{grupo.clienteNombre}</h3>
                  </div>
                </div>
              )}

              {/* Timeline de contactos */}
              <div className="space-y-4">
                {grupo.contactos.map((contacto, index) => (
                  <div
                    key={contacto.id}
                    className="flex gap-4 relative"
                  >
                    {/* Línea vertical (excepto en el último) */}
                    {index < grupo.contactos.length - 1 && (
                      <div className="absolute left-5 top-10 bottom-0 w-0.5 bg-gray-200" />
                    )}

                    {/* Icono del tipo de contacto */}
                    <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${obtenerColorTipoContacto(contacto.tipoContacto)} bg-opacity-10`}>
                      {obtenerIconoTipoContacto(contacto.tipoContacto)}
                    </div>

                    {/* Contenido del contacto */}
                    <div className="flex-1 min-w-0 pb-4">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-gray-900">
                              {obtenerEtiquetaTipoContacto(contacto.tipoContacto)}
                            </span>
                            {obtenerBadgeResultado(contacto.resultado)}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                            <Calendar className="w-4 h-4" />
                            <span>{formatearFechaRelativa(contacto.fecha)}</span>
                            <span className="text-gray-300">•</span>
                            <span>{contacto.fecha.toLocaleDateString('es-ES', { 
                              day: 'numeric', 
                              month: 'short', 
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Notas del contacto */}
                      {contacto.notas && (
                        <div className="bg-gray-50 rounded-lg p-3 mt-2">
                          <p className="text-sm text-gray-700 whitespace-pre-wrap">{contacto.notas}</p>
                        </div>
                      )}

                      {/* Usuario que registró el contacto */}
                      {contacto.usuario && (
                        <div className="flex items-center gap-1 mt-2 text-xs text-gray-400">
                          <User className="w-3 h-3" />
                          <span>Registrado por {contacto.usuario}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Modal para registrar nuevo contacto */}
      <Modal
        isOpen={mostrarModalNuevoContacto}
        onClose={() => {
          setMostrarModalNuevoContacto(false);
          setNuevoContacto({
            tipoContacto: 'llamada',
            fecha: new Date().toISOString().slice(0, 16),
            resultado: 'contactado',
            notas: '',
            clienteId: clienteId || '',
            pagoPendienteId: pagoPendienteId || ''
          });
        }}
        title="Registrar Nuevo Contacto"
        size="md"
        footer={
          <div className="flex gap-3">
            <Button
              variant="secondary"
              onClick={() => {
                setMostrarModalNuevoContacto(false);
                setNuevoContacto({
                  tipoContacto: 'llamada',
                  fecha: new Date().toISOString().slice(0, 16),
                  resultado: 'contactado',
                  notas: '',
                  clienteId: clienteId || '',
                  pagoPendienteId: pagoPendienteId || ''
                });
              }}
            >
              Cancelar
            </Button>
            <Button
              variant="primary"
              onClick={handleRegistrarContacto}
              disabled={!nuevoContacto.clienteId || !nuevoContacto.notas.trim()}
            >
              Registrar Contacto
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          {/* Selector de cliente (solo si no hay clienteId) */}
          {!clienteId && (
            <Select
              label="Cliente"
              value={nuevoContacto.clienteId}
              onChange={(e) => {
                const pago = pagos.find(p => p.cliente.id === e.target.value);
                setNuevoContacto(prev => ({
                  ...prev,
                  clienteId: e.target.value,
                  pagoPendienteId: pago?.id || ''
                }));
              }}
              options={[
                { value: '', label: 'Seleccione un cliente' },
                ...pagos
                  .filter(p => p.estado !== 'pagado')
                  .map(pago => ({
                    value: pago.cliente.id,
                    label: `${pago.cliente.nombre} - ${pago.numeroFactura}`
                  }))
              ]}
              required
            />
          )}

          {/* Selector de pago pendiente (opcional) */}
          {clienteId && pagosDelCliente.length > 0 && (
            <Select
              label="Pago Pendiente (opcional)"
              value={nuevoContacto.pagoPendienteId}
              onChange={(e) => setNuevoContacto(prev => ({
                ...prev,
                pagoPendienteId: e.target.value
              }))}
              options={[
                { value: '', label: 'No asociar a un pago específico' },
                ...pagosDelCliente.map(pago => ({
                  value: pago.id,
                  label: `${pago.numeroFactura} - ${pago.montoPendiente.toLocaleString('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 })}`
                }))
              ]}
            />
          )}

          {/* Tipo de contacto */}
          <Select
            label="Tipo de Contacto"
            value={nuevoContacto.tipoContacto}
            onChange={(e) => setNuevoContacto(prev => ({
              ...prev,
              tipoContacto: e.target.value as TipoContactoCobro
            }))}
            options={[
              { value: 'llamada', label: 'Llamada' },
              { value: 'email', label: 'Email' },
              { value: 'whatsapp', label: 'WhatsApp' },
              { value: 'visita', label: 'Visita' }
            ]}
            required
          />

          {/* Fecha y hora */}
          <Input
            label="Fecha y Hora del Contacto"
            type="datetime-local"
            value={nuevoContacto.fecha}
            onChange={(e) => setNuevoContacto(prev => ({
              ...prev,
              fecha: e.target.value
            }))}
            required
          />

          {/* Resultado del contacto */}
          <Select
            label="Resultado del Contacto"
            value={nuevoContacto.resultado}
            onChange={(e) => setNuevoContacto(prev => ({
              ...prev,
              resultado: e.target.value as ResultadoContactoCobro
            }))}
            options={[
              { value: 'sinContacto', label: 'Sin Contacto' },
              { value: 'contactado', label: 'Contactado' },
              { value: 'compromisoPago', label: 'Compromiso de Pago' },
              { value: 'pagoRealizado', label: 'Pago Realizado' },
              { value: 'negativa', label: 'Negativa' },
              { value: 'pendienteRespuesta', label: 'Pendiente Respuesta' }
            ]}
            required
          />

          {/* Notas */}
          <Textarea
            label="Notas del Contacto"
            value={nuevoContacto.notas}
            onChange={(e) => setNuevoContacto(prev => ({
              ...prev,
              notas: e.target.value
            }))}
            rows={4}
            placeholder="Ej: Cliente atendió la llamada. Mencionó que tiene problemas de liquidez pero prometió pagar esta semana..."
            required
          />
        </div>
      </Modal>
    </div>
  );
};
