import React, { useState, useEffect, useMemo } from 'react';
import { Card, Button, Badge, Modal, Textarea, Input } from '../../../components/componentsreutilizables';
import { SeguimientoPago, PagoPendiente } from '../types';
import { seguimientoAPI } from '../api/seguimiento';
import { morosidadAPI } from '../api/morosidad';
import { Plus, Calendar, User, Phone, Mail, Briefcase, Scale, Clock, MessageSquare, AlertCircle } from 'lucide-react';

interface SeguimientoPagosProps {
  onRefresh?: () => void;
}

interface ClienteConSeguimientos {
  clienteId: string;
  clienteNombre: string;
  pagoPendiente: PagoPendiente;
  seguimientos: SeguimientoPago[];
  ultimoContacto?: Date;
}

export const SeguimientoPagos: React.FC<SeguimientoPagosProps> = ({ onRefresh }) => {
  const [seguimientos, setSeguimientos] = useState<SeguimientoPago[]>([]);
  const [pagos, setPagos] = useState<PagoPendiente[]>([]);
  const [loading, setLoading] = useState(false);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [pagoSeleccionado, setPagoSeleccionado] = useState<PagoPendiente | null>(null);
  
  const [notaRapida, setNotaRapida] = useState('');

  // Agrupar seguimientos por cliente
  const clientesConSeguimientos = useMemo<ClienteConSeguimientos[]>(() => {
    const agrupados = new Map<string, ClienteConSeguimientos>();

    pagos.forEach(pago => {
      const seguimientosCliente = seguimientos.filter(s => s.pagoPendienteId === pago.id);
      const ultimoContacto = seguimientosCliente
        .filter(s => s.tipo === 'contacto')
        .sort((a, b) => b.fecha.getTime() - a.fecha.getTime())[0]?.fecha;

      agrupados.set(pago.cliente.id, {
        clienteId: pago.cliente.id,
        clienteNombre: pago.cliente.nombre,
        pagoPendiente: pago,
        seguimientos: seguimientosCliente.sort((a, b) => b.fecha.getTime() - a.fecha.getTime()),
        ultimoContacto
      });
    });

    return Array.from(agrupados.values()).sort((a, b) => {
      // Ordenar por último contacto (más antiguos primero) o por días de retraso
      if (a.ultimoContacto && b.ultimoContacto) {
        return a.ultimoContacto.getTime() - b.ultimoContacto.getTime();
      }
      if (a.ultimoContacto) return -1;
      if (b.ultimoContacto) return 1;
      return b.pagoPendiente.diasRetraso - a.pagoPendiente.diasRetraso;
    });
  }, [pagos, seguimientos]);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    setLoading(true);
    try {
      const [seguimientosData, pagosData] = await Promise.all([
        seguimientoAPI.obtenerTodosSeguimientos(),
        morosidadAPI.obtenerPagosPendientes()
      ]);
      setSeguimientos(seguimientosData);
      setPagos(pagosData);
    } catch (error) {
      console.error('Error al cargar datos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAbrirModalRapido = (pago: PagoPendiente) => {
    setPagoSeleccionado(pago);
    setNotaRapida('');
    setMostrarModal(true);
  };

  const handleRegistrarContactoRapido = async () => {
    if (!pagoSeleccionado || !notaRapida.trim()) return;
    
    try {
      await seguimientoAPI.crearSeguimiento({
        pagoPendienteId: pagoSeleccionado.id,
        accion: 'Contacto registrado',
        tipo: 'contacto',
        usuario: 'usuario1', // TODO: obtener del contexto de auth
        notas: notaRapida.trim()
      });
      
      setMostrarModal(false);
      setPagoSeleccionado(null);
      setNotaRapida('');
      cargarDatos();
      onRefresh?.();
    } catch (error) {
      console.error('Error al registrar contacto:', error);
    }
  };

  const obtenerIconoTipo = (tipo: string) => {
    const iconos: Record<string, React.ReactNode> = {
      recordatorio: <Mail className="w-4 h-4" />,
      contacto: <Phone className="w-4 h-4" />,
      negociacion: <Briefcase className="w-4 h-4" />,
      pago_parcial: <Clock className="w-4 h-4" />,
      pago_completo: <Clock className="w-4 h-4" />,
      legal: <Scale className="w-4 h-4" />,
      otro: <MessageSquare className="w-4 h-4" />
    };
    return iconos[tipo] || <MessageSquare className="w-4 h-4" />;
  };

  const obtenerBadgeTipo = (tipo: string) => {
    const tipos: Record<string, { label: string; variant: 'gray' | 'blue' | 'green' | 'yellow' | 'red' }> = {
      recordatorio: { label: 'Recordatorio', variant: 'blue' },
      contacto: { label: 'Contacto', variant: 'blue' },
      negociacion: { label: 'Negociación', variant: 'yellow' },
      pago_parcial: { label: 'Pago Parcial', variant: 'green' },
      pago_completo: { label: 'Pago Completo', variant: 'green' },
      legal: { label: 'Legal', variant: 'red' },
      otro: { label: 'Otro', variant: 'gray' }
    };
    
    const tipoInfo = tipos[tipo] || tipos.otro;
    return (
      <Badge variant={tipoInfo.variant} size="sm">
        {tipoInfo.label}
      </Badge>
    );
  };

  const formatearMoneda = (valor: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(valor);
  };

  const calcularDiasDesdeUltimoContacto = (fecha?: Date): number | null => {
    if (!fecha) return null;
    const hoy = new Date();
    const diffTime = hoy.getTime() - fecha.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const formatearFechaRelativa = (fecha: Date): string => {
    const hoy = new Date();
    const diffTime = hoy.getTime() - fecha.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Hoy';
    if (diffDays === 1) return 'Ayer';
    if (diffDays < 7) return `Hace ${diffDays} días`;
    if (diffDays < 30) return `Hace ${Math.floor(diffDays / 7)} semanas`;
    return fecha.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-500">Cargando seguimientos...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Registro de Contactos
          </h2>
          <p className="text-gray-600">
            Timeline simple de cuándo contactaste a cada cliente sobre su pago
          </p>
        </div>
      </div>

      {clientesConSeguimientos.length === 0 ? (
        <Card className="p-8 text-center">
          <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No hay pagos pendientes para mostrar</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {clientesConSeguimientos.map((cliente) => {
            const diasDesdeUltimoContacto = calcularDiasDesdeUltimoContacto(cliente.ultimoContacto);
            const tieneContacto = cliente.ultimoContacto !== undefined;
            
            return (
              <Card key={cliente.clienteId} className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {cliente.clienteNombre}
                      </h3>
                      <Badge 
                        variant={cliente.pagoPendiente.diasRetraso > 30 ? 'red' : cliente.pagoPendiente.diasRetraso > 15 ? 'yellow' : 'green'} 
                        size="sm"
                      >
                        {cliente.pagoPendiente.diasRetraso} días de retraso
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>Factura: {cliente.pagoPendiente.numeroFactura}</p>
                      <p>Monto pendiente: {formatearMoneda(cliente.pagoPendiente.montoPendiente)}</p>
                      {tieneContacto && cliente.ultimoContacto ? (
                        <div className="flex items-center gap-2 mt-2">
                          <Phone className="w-4 h-4 text-blue-500" />
                          <span className="font-medium text-gray-900">
                            Último contacto: {formatearFechaRelativa(cliente.ultimoContacto)}
                          </span>
                          {diasDesdeUltimoContacto !== null && (
                            <span className="text-gray-500">
                              ({diasDesdeUltimoContacto === 0 ? 'hoy' : `hace ${diasDesdeUltimoContacto} días`})
                            </span>
                          )}
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 mt-2 text-orange-600">
                          <AlertCircle className="w-4 h-4" />
                          <span className="font-medium">Sin contacto registrado</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleAbrirModalRapido(cliente.pagoPendiente)}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Registrar contacto rápido
                  </Button>
                </div>

                {/* Timeline de seguimientos */}
                {cliente.seguimientos.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Historial de contactos</h4>
                    <div className="space-y-3">
                      {cliente.seguimientos.slice(0, 5).map((seguimiento) => (
                        <div key={seguimiento.id} className="flex items-start gap-3">
                          <div className="flex-shrink-0 mt-1">
                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                              {obtenerIconoTipo(seguimiento.tipo)}
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              {obtenerBadgeTipo(seguimiento.tipo)}
                              <span className="text-xs text-gray-500">
                                {formatearFechaRelativa(seguimiento.fecha)}
                              </span>
                            </div>
                            {seguimiento.notas && (
                              <p className="text-sm text-gray-600 line-clamp-2">
                                {seguimiento.notas}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                      {cliente.seguimientos.length > 5 && (
                        <p className="text-xs text-gray-500 text-center pt-2">
                          +{cliente.seguimientos.length - 5} contactos más
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}

      {/* Modal de contacto rápido */}
      <Modal
        isOpen={mostrarModal}
        onClose={() => {
          setMostrarModal(false);
          setPagoSeleccionado(null);
          setNotaRapida('');
        }}
        title="Registrar Contacto Rápido"
        size="md"
        footer={
          <div className="flex gap-3">
            <Button
              variant="secondary"
              onClick={() => {
                setMostrarModal(false);
                setPagoSeleccionado(null);
                setNotaRapida('');
              }}
            >
              Cancelar
            </Button>
            <Button
              variant="primary"
              onClick={handleRegistrarContactoRapido}
              disabled={!notaRapida.trim()}
            >
              <Plus className="w-4 h-4 mr-2" />
              Registrar
            </Button>
          </div>
        }
      >
        {pagoSeleccionado && (
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg ring-1 ring-slate-200">
              <p className="text-sm font-medium text-gray-900 mb-1">Cliente: {pagoSeleccionado.cliente.nombre}</p>
              <p className="text-sm text-gray-600">Factura: {pagoSeleccionado.numeroFactura}</p>
              <p className="text-sm text-gray-600">Monto: {formatearMoneda(pagoSeleccionado.montoPendiente)}</p>
            </div>

            <Textarea
              label="Nota del contacto"
              value={notaRapida}
              onChange={(e) => setNotaRapida(e.target.value)}
              rows={4}
              placeholder="Ej: Llamé al cliente, prometió pagar esta semana. Mencionó problemas de flujo de caja temporales..."
            />
            <p className="text-xs text-gray-500">
              Registra brevemente cómo fue el contacto y cualquier información relevante
            </p>
          </div>
        )}
      </Modal>
    </div>
  );
};

