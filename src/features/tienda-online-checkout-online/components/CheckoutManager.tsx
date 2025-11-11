import React, { useState } from 'react';
import { Card, Button, Input, Select, Modal, Badge } from '../../../components/componentsreutilizables';
import { Carrito, DatosCheckout, MetodoPago, DatosCheckoutGuardados, CarritoItem, CodigoPromocional, DescuentoFidelidad, PlanPagoFraccionado, PagoFraccionadoSeleccionado } from '../types';
import { getMetodosPago, procesarCheckout } from '../api/checkout';
import { getDatosCheckoutGuardados, esClienteRecurrente, guardarDatosCheckout } from '../api/clientesRecurrentes';
import { calcularDescuentoFidelidad } from '../api/fidelidad';
import { aplicarDescuentosACarritoItem } from '../utils/descuentos';
import { validarCodigoPromocional as validarCodigoAPI } from '../api/codigosPromocionales';
import { getPlanesPagoFraccionado, calcularPagoFraccionado, esElegibleParaPagoFraccionado } from '../api/pagoFraccionado';
import { validarCodigoReferido } from '../api/referidos';
import { CheckCircle, AlertCircle, CreditCard, Lock, Tag, Calendar, Repeat, Info, Zap, UserCheck, X, Check, Sparkles, Divide, Users } from 'lucide-react';
import { ReservaSesionCheckout } from './ReservaSesionCheckout';

interface CheckoutManagerProps {
  carritoBase: CarritoItem[];
  onCheckoutExitoso: (ventaId: string, facturaId: string) => void;
  onCancelar: () => void;
  entrenadorId?: string;
  onAplicarCodigoPromocional?: (codigo: string) => Promise<{ exito: boolean; error?: string }>;
  onRemoverCodigoPromocional?: () => void;
}

export const CheckoutManager: React.FC<CheckoutManagerProps> = ({
  carritoBase,
  onCheckoutExitoso,
  onCancelar,
  entrenadorId,
  onAplicarCodigoPromocional,
  onRemoverCodigoPromocional,
}) => {
  const [codigoInput, setCodigoInput] = useState('');
  const [aplicandoCodigo, setAplicandoCodigo] = useState(false);
  const [errorCodigo, setErrorCodigo] = useState<string | null>(null);
  const [codigoPromocional, setCodigoPromocional] = useState<CodigoPromocional | null>(null);
  const [descuentoFidelidad, setDescuentoFidelidad] = useState<DescuentoFidelidad | null>(null);
  const [calculandoFidelidad, setCalculandoFidelidad] = useState(false);
  
  // User Story: Programa de Referidos
  const [codigoReferidoInput, setCodigoReferidoInput] = useState('');
  const [aplicandoCodigoReferido, setAplicandoCodigoReferido] = useState(false);
  const [errorCodigoReferido, setErrorCodigoReferido] = useState<string | null>(null);
  const [codigoReferido, setCodigoReferido] = useState<string | null>(null);
  const [descuentoReferido, setDescuentoReferido] = useState<{ tipo: 'porcentual' | 'fijo'; valor: number; referenteNombre?: string } | null>(null);

  const [datos, setDatos] = useState<DatosCheckout>({
    nombre: '',
    email: '',
    telefono: '',
    metodoPago: '',
    terminosAceptados: false,
    fechaVencimientoBonos: undefined,
    aceptaCargoRecurrente: false,
    fechaInicioSuscripcion: undefined,
  });
  const [metodosPago, setMetodosPago] = useState<MetodoPago[]>([]);
  const [procesando, setProcesando] = useState(false);
  const [errores, setErrores] = useState<Record<string, string>>({});
  const [mostrarExito, setMostrarExito] = useState(false);
  const [ventaExito, setVentaExito] = useState<{ ventaId: string; facturaId: string } | null>(null);
  const [mostrarReserva, setMostrarReserva] = useState(false);
  // User Story 1: Estados para checkout rápido
  const [datosGuardados, setDatosGuardados] = useState<DatosCheckoutGuardados | null>(null);
  const [usandoDatosGuardados, setUsandoDatosGuardados] = useState(false);
  const [verificandoCliente, setVerificandoCliente] = useState(false);
  const [modoRapido, setModoRapido] = useState(false);
  
  // User Story: Pago fraccionado en cuotas
  const [planesPagoFraccionado, setPlanesPagoFraccionado] = useState<PlanPagoFraccionado[]>([]);
  const [cargandoPlanes, setCargandoPlanes] = useState(false);
  const [usarPagoFraccionado, setUsarPagoFraccionado] = useState(false);
  
  // Calcular carrito temporal para verificar elegibilidad de pago fraccionado
  const carritoTemp = React.useMemo(() => {
    const itemsConDescuentos = carritoBase.map((item) => aplicarDescuentosACarritoItem(item));
    const subtotal = itemsConDescuentos.reduce((sum, item) => sum + item.subtotal, 0);
    const impuestos = subtotal * 0.21;
    const total = subtotal + impuestos;
    return { items: itemsConDescuentos, subtotal, impuestos, total };
  }, [carritoBase]);
  
  const elegiblePagoFraccionado = esElegibleParaPagoFraccionado(carritoTemp);

  // Calcular carrito con descuentos
  const calcularCarrito = React.useMemo((): Carrito => {
    // Aplicar descuentos a cada item del carrito
    const itemsConDescuentos = carritoBase.map((item) => aplicarDescuentosACarritoItem(item));
    
    // Subtotal después de descuentos por cantidad
    const subtotalConDescuentosCantidad = itemsConDescuentos.reduce((sum, item) => sum + item.subtotal, 0);
    const descuentoTotal = itemsConDescuentos.reduce((sum, item) => sum + (item.descuentoAplicado || 0), 0);
    
    let subtotalFinal = subtotalConDescuentosCantidad;
    let descuentoCodigoPromocional = 0;
    let descuentoFidelidadCalculado = 0;
    let porcentajeDescuentoFidelidad = 0;
    let descuentoReferidoCalculado = 0;

    // Aplicar descuento de fidelidad si existe (se aplica primero)
    if (descuentoFidelidad) {
      porcentajeDescuentoFidelidad = descuentoFidelidad.porcentajeDescuento;
      descuentoFidelidadCalculado = (subtotalConDescuentosCantidad * porcentajeDescuentoFidelidad) / 100;
      subtotalFinal = subtotalConDescuentosCantidad - descuentoFidelidadCalculado;
    }

    // Aplicar descuento de referido si existe (se aplica después del descuento de fidelidad)
    if (descuentoReferido) {
      if (descuentoReferido.tipo === 'porcentual') {
        descuentoReferidoCalculado = (subtotalFinal * descuentoReferido.valor) / 100;
      } else {
        descuentoReferidoCalculado = descuentoReferido.valor;
        if (descuentoReferidoCalculado > subtotalFinal) {
          descuentoReferidoCalculado = subtotalFinal;
        }
      }
      subtotalFinal = subtotalFinal - descuentoReferidoCalculado;
    }

    // Aplicar código promocional si existe (se aplica después del descuento de referido)
    if (codigoPromocional) {
      if (codigoPromocional.tipoDescuento === 'porcentual') {
        descuentoCodigoPromocional = (subtotalFinal * codigoPromocional.valorDescuento) / 100;
      } else {
        descuentoCodigoPromocional = codigoPromocional.valorDescuento;
        if (descuentoCodigoPromocional > subtotalFinal) {
          descuentoCodigoPromocional = subtotalFinal;
        }
      }
      subtotalFinal = subtotalFinal - descuentoCodigoPromocional;
    }

    const impuestos = subtotalFinal * 0.21;
    const total = subtotalFinal + impuestos;

    return {
      items: itemsConDescuentos,
      subtotal: subtotalFinal,
      descuentoTotal,
      descuentoCodigoPromocional: descuentoCodigoPromocional > 0 ? descuentoCodigoPromocional : undefined,
      codigoPromocional: codigoPromocional || undefined,
      descuentoFidelidad: descuentoFidelidadCalculado > 0 ? descuentoFidelidadCalculado : undefined,
      porcentajeDescuentoFidelidad: porcentajeDescuentoFidelidad > 0 ? porcentajeDescuentoFidelidad : undefined,
      descuentoReferido: descuentoReferidoCalculado > 0 ? descuentoReferidoCalculado : undefined,
      codigoReferido: codigoReferido || undefined,
      impuestos,
      total,
    };
  }, [carritoBase, codigoPromocional, descuentoFidelidad, descuentoReferido, codigoReferido]);

  const carrito = calcularCarrito;

  const handleAplicarCodigo = async () => {
    if (!codigoInput.trim()) return;

    setAplicandoCodigo(true);
    setErrorCodigo(null);

    try {
      const validacion = await validarCodigoAPI(codigoInput.trim(), carrito);
      
      if (validacion.valido && validacion.codigo) {
        setCodigoPromocional(validacion.codigo);
        setCodigoInput('');
        if (onAplicarCodigoPromocional) {
          await onAplicarCodigoPromocional(codigoInput.trim());
        }
      } else {
        setErrorCodigo(validacion.error || 'Código inválido');
      }
    } catch (error) {
      setErrorCodigo('Error al aplicar el código promocional');
    } finally {
      setAplicandoCodigo(false);
    }
  };

  // User Story: Programa de Referidos - Aplicar código de referido
  const handleAplicarCodigoReferido = async () => {
    if (!codigoReferidoInput.trim()) return;

    setAplicandoCodigoReferido(true);
    setErrorCodigoReferido(null);

    try {
      // Calcular carrito temporal para validación
      const itemsConDescuentos = carritoBase.map((item) => aplicarDescuentosACarritoItem(item));
      const subtotal = itemsConDescuentos.reduce((sum, item) => sum + item.subtotal, 0);
      const impuestos = subtotal * 0.21;
      const total = subtotal + impuestos;
      const carritoTempValidacion: Carrito = { items: itemsConDescuentos, subtotal, descuentoTotal: 0, impuestos, total };
      
      const validacion = await validarCodigoReferido(codigoReferidoInput.trim().toUpperCase(), carritoTempValidacion);
      
      if (validacion.valido && validacion.codigo && validacion.descuento) {
        setCodigoReferido(validacion.codigo);
        setDescuentoReferido({
          tipo: validacion.descuento.tipo,
          valor: validacion.descuento.valor,
          referenteNombre: validacion.referenteNombre,
        });
        setCodigoReferidoInput('');
      } else {
        setErrorCodigoReferido(validacion.error || 'Código de referido inválido');
      }
    } catch (error) {
      setErrorCodigoReferido('Error al aplicar el código de referido');
    } finally {
      setAplicandoCodigoReferido(false);
    }
  };

  // Verificar si el carrito contiene sesiones o bonos que requieren reserva
  const requiereReserva = carrito.items.some(
    (item) =>
      item.producto.tipo === 'servicio' &&
      (item.producto.metadatos?.sesiones || item.producto.metadatos?.esBono) &&
      entrenadorId
  );

  // Verificar si el carrito contiene bonos que requieren fecha de caducidad
  const contieneBonos = carrito.items.some(
    (item) => item.producto.metadatos?.esBono === true
  );

  // Verificar si el carrito contiene suscripciones
  const contieneSuscripciones = carrito.items.some(
    (item) => item.producto.metadatos?.suscripcion?.esSuscripcion === true
  );

  // Calcular fecha de caducidad por defecto (3 meses desde hoy)
  const fechaVencimientoDefault = () => {
    const fecha = new Date();
    fecha.setMonth(fecha.getMonth() + 3);
    return fecha.toISOString().split('T')[0]; // Formato YYYY-MM-DD
  };

  React.useEffect(() => {
    cargarMetodosPago();
  }, []);

  // Cargar planes de pago fraccionado si es elegible
  React.useEffect(() => {
    const cargarPlanes = async () => {
      if (elegiblePagoFraccionado && carrito.total > 0) {
        setCargandoPlanes(true);
        try {
          const planes = await getPlanesPagoFraccionado(carrito.total);
          setPlanesPagoFraccionado(planes);
        } catch (error) {
          console.error('Error cargando planes de pago fraccionado:', error);
        } finally {
          setCargandoPlanes(false);
        }
      } else {
        setPlanesPagoFraccionado([]);
        setUsarPagoFraccionado(false);
        setDatos({ ...datos, pagoFraccionado: undefined });
      }
    };
    cargarPlanes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [elegiblePagoFraccionado, carrito.total]);

  // User Story 1: Verificar si el email corresponde a un cliente recurrente y calcular descuento de fidelidad
  React.useEffect(() => {
    const verificarClienteRecurrente = async () => {
      if (!datos.email || datos.email.length < 5) {
        setDatosGuardados(null);
        setUsandoDatosGuardados(false);
        setDescuentoFidelidad(null);
        return;
      }

      // Validar formato de email básico
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(datos.email)) {
        return;
      }

      setVerificandoCliente(true);
      setCalculandoFidelidad(true);
      try {
        const [esRecurrente, descuentoFid] = await Promise.all([
          esClienteRecurrente(datos.email),
          calcularDescuentoFidelidad(datos.email),
        ]);

        if (esRecurrente) {
          const datosGuard = await getDatosCheckoutGuardados(datos.email);
          if (datosGuard) {
            setDatosGuardados(datosGuard);
            // Auto-rellenar si no hay datos ingresados
            if (!datos.nombre && !datos.telefono && !datos.metodoPago) {
              setDatos({
                ...datos,
                nombre: datosGuard.nombre,
                telefono: datosGuard.telefono || '',
                metodoPago: datosGuard.metodoPago,
              });
              setUsandoDatosGuardados(true);
            }
          }
        } else {
          setDatosGuardados(null);
          setUsandoDatosGuardados(false);
        }

        // Establecer descuento de fidelidad si existe
        if (descuentoFid) {
          setDescuentoFidelidad(descuentoFid);
        } else {
          setDescuentoFidelidad(null);
        }
      } catch (error) {
        console.error('Error verificando cliente recurrente:', error);
        setDescuentoFidelidad(null);
      } finally {
        setVerificandoCliente(false);
        setCalculandoFidelidad(false);
      }
    };

    // Debounce para evitar demasiadas llamadas
    const timeoutId = setTimeout(verificarClienteRecurrente, 500);
    return () => clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [datos.email]);

  React.useEffect(() => {
    // Establecer fecha de caducidad por defecto si hay bonos
    if (contieneBonos && !datos.fechaVencimientoBonos) {
      const fecha = new Date();
      fecha.setMonth(fecha.getMonth() + 3);
      setDatos((prev) => ({ ...prev, fechaVencimientoBonos: fecha }));
    }
    // Establecer fecha de inicio de suscripción por defecto si hay suscripciones
    if (contieneSuscripciones && !datos.fechaInicioSuscripcion) {
      const fecha = new Date();
      setDatos((prev) => ({ ...prev, fechaInicioSuscripcion: fecha }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contieneBonos, contieneSuscripciones]);

  const cargarMetodosPago = async () => {
    try {
      const metodos = await getMetodosPago();
      setMetodosPago(metodos.filter((m) => m.disponible));
    } catch (error) {
      console.error('Error cargando métodos de pago:', error);
    }
  };

  const validarDatos = (): boolean => {
    const nuevosErrores: Record<string, string> = {};

    if (!datos.nombre.trim()) {
      nuevosErrores.nombre = 'El nombre es obligatorio';
    }

    if (!datos.email.trim()) {
      nuevosErrores.email = 'El email es obligatorio';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(datos.email)) {
      nuevosErrores.email = 'Email inválido';
    }

    if (!datos.telefono.trim()) {
      nuevosErrores.telefono = 'El teléfono es obligatorio';
    }

    if (!datos.metodoPago) {
      nuevosErrores.metodoPago = 'Debes seleccionar un método de pago';
    }

    if (contieneBonos && !datos.fechaVencimientoBonos) {
      nuevosErrores.fechaVencimientoBonos = 'Debes establecer una fecha de caducidad para los bonos';
    }

    if (datos.fechaVencimientoBonos) {
      const fechaVencimiento = new Date(datos.fechaVencimientoBonos);
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);
      fechaVencimiento.setHours(0, 0, 0, 0);
      
      if (fechaVencimiento <= hoy) {
        nuevosErrores.fechaVencimientoBonos = 'La fecha de caducidad debe ser posterior a hoy';
      }
    }

    if (!datos.terminosAceptados) {
      nuevosErrores.terminos = 'Debes aceptar los términos y condiciones';
    }

    if (contieneSuscripciones && !datos.aceptaCargoRecurrente) {
      nuevosErrores.cargoRecurrente = 'Debes aceptar el cargo recurrente automático para suscripciones';
    }

    if (contieneSuscripciones && !datos.fechaInicioSuscripcion) {
      nuevosErrores.fechaInicioSuscripcion = 'Debes establecer una fecha de inicio para la suscripción';
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validarDatos()) {
      return;
    }

    setProcesando(true);
    try {
      // Incluir código de referido en los datos de checkout
      const datosConReferido = {
        ...datos,
        codigoReferido: codigoReferido || undefined,
      };
      
      const resultado = await procesarCheckout({ carrito, datos: datosConReferido });

      if (resultado.exito && resultado.ventaId && resultado.facturaId) {
        // User Story 1: Guardar datos para futuras compras
        if (datos.email && datos.nombre && datos.metodoPago) {
          await guardarDatosCheckout(datos.email, {
            nombre: datos.nombre,
            telefono: datos.telefono,
            metodoPago: datos.metodoPago,
          });
        }

        setVentaExito({
          ventaId: resultado.ventaId,
          facturaId: resultado.facturaId,
        });
        
        // Si requiere reserva, mostrar el componente de reserva en lugar del modal de éxito
        if (requiereReserva) {
          setMostrarReserva(true);
        } else {
          setMostrarExito(true);
        }
      } else {
        setErrores({
          general: resultado.error || 'Error al procesar el pago',
        });
      }
    } catch (error) {
      setErrores({
        general: 'Error al procesar el checkout. Intenta de nuevo.',
      });
    } finally {
      setProcesando(false);
    }
  };

  // User Story 1: Manejar checkout rápido (one-click)
  const handleCheckoutRapido = async () => {
    if (!datosGuardados || !datos.email) {
      return;
    }

    // Validar que el email coincida
    if (datos.email.toLowerCase() !== datosGuardados.clienteEmail.toLowerCase()) {
      setErrores({
        general: 'El email no coincide con el cliente recurrente',
      });
      return;
    }

    // Usar datos guardados
    const datosCompletos: DatosCheckout = {
      ...datos,
      nombre: datosGuardados.nombre,
      telefono: datosGuardados.telefono,
      metodoPago: datosGuardados.metodoPago,
      terminosAceptados: true, // Asumir aceptación para clientes recurrentes
    };

    // Validar datos mínimos
    if (!datosCompletos.nombre || !datosCompletos.email || !datosCompletos.metodoPago) {
      setErrores({
        general: 'Faltan datos necesarios para el checkout rápido',
      });
      return;
    }

    // Validar fechas si hay bonos o suscripciones
    if (contieneBonos && !datosCompletos.fechaVencimientoBonos) {
      const fecha = new Date();
      fecha.setMonth(fecha.getMonth() + 3);
      datosCompletos.fechaVencimientoBonos = fecha;
    }

    if (contieneSuscripciones && !datosCompletos.fechaInicioSuscripcion) {
      datosCompletos.fechaInicioSuscripcion = new Date();
    }

    if (contieneSuscripciones) {
      datosCompletos.aceptaCargoRecurrente = true;
    }

    setProcesando(true);
    setModoRapido(true);
    try {
      // Incluir código de referido en los datos de checkout
      const datosCompletosConReferido = {
        ...datosCompletos,
        codigoReferido: codigoReferido || undefined,
      };
      
      const resultado = await procesarCheckout({ carrito, datos: datosCompletosConReferido });

      if (resultado.exito && resultado.ventaId && resultado.facturaId) {
        setVentaExito({
          ventaId: resultado.ventaId,
          facturaId: resultado.facturaId,
        });
        
        if (requiereReserva) {
          setMostrarReserva(true);
        } else {
          setMostrarExito(true);
        }
      } else {
        setErrores({
          general: resultado.error || 'Error al procesar el pago',
        });
      }
    } catch (error) {
      setErrores({
        general: 'Error al procesar el checkout rápido. Intenta de nuevo.',
      });
    } finally {
      setProcesando(false);
      setModoRapido(false);
    }
  };

  const handleExitoConfirmar = () => {
    if (ventaExito) {
      onCheckoutExitoso(ventaExito.ventaId, ventaExito.facturaId);
    }
    setMostrarExito(false);
  };

  const handleReservaCompletada = () => {
    if (ventaExito) {
      onCheckoutExitoso(ventaExito.ventaId, ventaExito.facturaId);
    }
    setMostrarReserva(false);
  };

  const handleOmitirReserva = () => {
    if (ventaExito) {
      onCheckoutExitoso(ventaExito.ventaId, ventaExito.facturaId);
    }
    setMostrarReserva(false);
  };

  // Si se muestra la reserva, solo mostrar ese componente
  if (mostrarReserva && ventaExito && entrenadorId) {
    return (
      <>
        <Card className="p-6 bg-white shadow-sm mb-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-green-100 rounded-xl ring-1 ring-green-200/70">
                <CheckCircle size={20} className="text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Compra Exitosa
                </h3>
                <p className="text-sm text-gray-600">
                  ID de Venta: {ventaExito.ventaId} | Factura: {ventaExito.facturaId}
                </p>
              </div>
            </div>
          </div>
        </Card>
        <ReservaSesionCheckout
          carritoItems={carrito.items}
          clienteNombre={datos.nombre}
          clienteEmail={datos.email}
          clienteTelefono={datos.telefono}
          entrenadorId={entrenadorId}
          onReservaCompletada={handleReservaCompletada}
          onOmitir={handleOmitirReserva}
        />
      </>
    );
  }

  return (
    <>
      {/* Resumen del Carrito */}
      <Card className="p-6 bg-white shadow-sm mb-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Resumen del Pedido</h3>
          <div className="space-y-3">
            {carrito.items.map((item, index) => {
              const precioUnitario = item.precioBase || item.producto.precio;
              const esSuscripcion = item.producto.metadatos?.suscripcion?.esSuscripcion;
              
              return (
                <div key={index} className="flex justify-between items-start p-3 bg-slate-50 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium text-gray-900">{item.producto.nombre}</p>
                      {esSuscripcion && (
                        <Badge variant="info" className="text-xs">
                          <Repeat size={10} className="mr-1" />
                          Suscripción
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">
                      Cantidad: {item.cantidad} × €{precioUnitario.toFixed(2)}
                    </p>
                    {item.modificadorPrecioOpciones && item.modificadorPrecioOpciones !== 0 && (
                      <p className="text-xs text-blue-600 mt-1">
                        Modificador por opciones: {item.modificadorPrecioOpciones > 0 ? '+' : ''}€{item.modificadorPrecioOpciones.toFixed(2)}
                      </p>
                    )}
                    {item.descuentoAplicado && item.descuentoAplicado > 0 && (
                      <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
                        <Tag size={12} />
                        Descuento aplicado: {item.porcentajeDescuento}% (-€{item.descuentoAplicado.toFixed(2)})
                      </p>
                    )}
                    {esSuscripcion && item.producto.metadatos?.suscripcion && (
                      <p className="text-xs text-gray-500 mt-1">
                        Ciclo: {item.producto.metadatos.suscripcion.cicloFacturacion === 'mensual' ? 'Mensual' : 
                                item.producto.metadatos.suscripcion.cicloFacturacion === 'trimestral' ? 'Trimestral' :
                                item.producto.metadatos.suscripcion.cicloFacturacion === 'semestral' ? 'Semestral' : 'Anual'}
                      </p>
                    )}
                  </div>
                  <p className="font-semibold text-gray-900">€{item.subtotal.toFixed(2)}</p>
                </div>
              );
            })}
          </div>
          <div className="border-t border-slate-200 pt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal</span>
              <span className="text-gray-900">€{carrito.items.reduce((sum, item) => {
                const precioBase = item.precioBase || item.producto.precio;
                return sum + (precioBase * item.cantidad);
              }, 0).toFixed(2)}</span>
            </div>
            {carrito.descuentoTotal && carrito.descuentoTotal > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-green-600 font-medium flex items-center gap-1">
                  <Tag size={12} />
                  Descuentos por cantidad
                </span>
                <span className="text-green-600 font-medium">-€{carrito.descuentoTotal.toFixed(2)}</span>
              </div>
            )}
            {carrito.descuentoFidelidad && carrito.descuentoFidelidad > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-purple-600 font-medium flex items-center gap-1">
                  <Sparkles size={12} />
                  Descuento por fidelidad ({carrito.porcentajeDescuentoFidelidad}%)
                </span>
                <span className="text-purple-600 font-medium">-€{carrito.descuentoFidelidad.toFixed(2)}</span>
              </div>
            )}
            {carrito.descuentoReferido && carrito.descuentoReferido > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-purple-600 font-medium flex items-center gap-1">
                  <Users size={12} />
                  Descuento por referido {carrito.codigoReferido}
                  {descuentoReferido?.referenteNombre && (
                    <span className="text-xs text-gray-500">(de {descuentoReferido.referenteNombre})</span>
                  )}
                </span>
                <span className="text-purple-600 font-medium">-€{carrito.descuentoReferido.toFixed(2)}</span>
              </div>
            )}
            {carrito.descuentoCodigoPromocional && carrito.descuentoCodigoPromocional > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-green-600 font-medium flex items-center gap-1">
                  <Tag size={12} />
                  Código promocional {carrito.codigoPromocional?.codigo}
                </span>
                <span className="text-green-600 font-medium">-€{carrito.descuentoCodigoPromocional.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal con descuentos</span>
              <span className="text-gray-900">€{carrito.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Impuestos (21%)</span>
              <span className="text-gray-900">€{carrito.impuestos.toFixed(2)}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-slate-200">
              <span className="font-semibold text-gray-900">Total</span>
              <span className="text-xl font-bold text-blue-600">€{carrito.total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Código de Referido */}
      <Card className="p-6 bg-white shadow-sm mb-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Users size={18} className="text-purple-600" />
            Código de Referido
          </h3>
          {carrito.codigoReferido ? (
            <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Check size={16} className="text-purple-600" />
                  <div>
                    <p className="text-sm font-medium text-purple-900">
                      Código aplicado: <code className="font-mono">{carrito.codigoReferido}</code>
                    </p>
                    {descuentoReferido?.referenteNombre && (
                      <p className="text-xs text-purple-700">Te refirió: {descuentoReferido.referenteNombre}</p>
                    )}
                    {descuentoReferido && (
                      <p className="text-xs text-purple-700">
                        Descuento: {descuentoReferido.tipo === 'porcentual' ? `${descuentoReferido.valor}%` : `€${descuentoReferido.valor.toFixed(2)}`}
                      </p>
                    )}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setCodigoReferido(null);
                    setDescuentoReferido(null);
                    setErrorCodigoReferido(null);
                  }}
                  className="text-red-500 hover:text-red-600"
                >
                  <X size={16} />
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex gap-2">
                <Input
                  placeholder="Código de referido (ej: JUAN123)"
                  value={codigoReferidoInput}
                  onChange={(e) => {
                    setCodigoReferidoInput(e.target.value.toUpperCase());
                    setErrorCodigoReferido(null);
                  }}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleAplicarCodigoReferido();
                    }
                  }}
                  className="flex-1"
                  error={errorCodigoReferido || undefined}
                />
                <Button
                  variant="secondary"
                  onClick={handleAplicarCodigoReferido}
                  loading={aplicandoCodigoReferido}
                  disabled={!codigoReferidoInput.trim()}
                >
                  Aplicar
                </Button>
              </div>
              {errorCodigoReferido && (
                <div className="flex items-center gap-2 text-sm text-red-600">
                  <AlertCircle size={16} />
                  <span>{errorCodigoReferido}</span>
                </div>
              )}
              <p className="text-xs text-gray-500">
                ¿Tienes un código de referido? Introdúcelo aquí para obtener un descuento. También recibirás una recompensa cuando tus referidos compren.
              </p>
            </div>
          )}
        </div>
      </Card>

      {/* Código Promocional */}
      {(
        <Card className="p-6 bg-white shadow-sm">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Código Promocional</h3>
            {carrito.codigoPromocional ? (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Check size={16} className="text-green-600" />
                    <div>
                      <p className="text-sm font-medium text-green-900">
                        Código aplicado: <code className="font-mono">{carrito.codigoPromocional.codigo}</code>
                      </p>
                      <p className="text-xs text-green-700">{carrito.codigoPromocional.descripcion}</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setCodigoPromocional(null);
                      setErrorCodigo(null);
                      if (onRemoverCodigoPromocional) {
                        onRemoverCodigoPromocional();
                      }
                    }}
                    className="text-red-500 hover:text-red-600"
                  >
                    <X size={16} />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Input
                    placeholder="Código promocional"
                    value={codigoInput}
                    onChange={(e) => {
                      setCodigoInput(e.target.value.toUpperCase());
                      setErrorCodigo(null);
                    }}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleAplicarCodigo();
                      }
                    }}
                    className="flex-1"
                    error={errorCodigo || undefined}
                  />
                  <Button
                    variant="secondary"
                    onClick={handleAplicarCodigo}
                    loading={aplicandoCodigo}
                    disabled={!codigoInput.trim()}
                  >
                    Aplicar
                  </Button>
                </div>
                {errorCodigo && (
                  <div className="flex items-center gap-2 text-sm text-red-600">
                    <AlertCircle size={16} />
                    <span>{errorCodigo}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </Card>
      )}

      <Card className="p-6 bg-white shadow-sm">
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-100 rounded-xl ring-1 ring-blue-200/70">
              <Lock size={20} className="text-blue-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">
              Datos de Facturación
            </h2>
          </div>

          {errores.general && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-200">
              <div className="flex items-center gap-2">
                <AlertCircle size={20} className="text-red-600" />
                <p className="text-sm text-red-600">{errores.general}</p>
              </div>
            </div>
          )}

          {/* User Story 1: Banner de cliente recurrente con descuento de fidelidad */}
          {datosGuardados && datos.email && datos.email.toLowerCase() === datosGuardados.clienteEmail.toLowerCase() && (
            <Card className="p-4 bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 mb-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Sparkles size={20} className="text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">
                      Cliente Recurrente Detectado
                    </h3>
                    <p className="text-sm text-gray-700 mb-2">
                      Hemos encontrado tus datos guardados de compras anteriores ({datosGuardados.numeroCompras} {datosGuardados.numeroCompras === 1 ? 'compra' : 'compras'} previas).
                    </p>
                    {descuentoFidelidad && (
                      <div className="mt-2 p-2 bg-purple-100 rounded-lg border border-purple-200">
                        <p className="text-sm font-semibold text-purple-900 flex items-center gap-1">
                          <Sparkles size={14} />
                          {descuentoFidelidad.descripcion}
                        </p>
                        <p className="text-xs text-purple-700 mt-1">
                          Nivel: {descuentoFidelidad.nivelFidelidad.toUpperCase()} - {descuentoFidelidad.numeroCompras} {descuentoFidelidad.numeroCompras === 1 ? 'compra' : 'compras'} previas
                        </p>
                      </div>
                    )}
                    {usandoDatosGuardados && (
                      <p className="text-xs text-purple-700 flex items-center gap-1 mt-2">
                        <CheckCircle size={12} />
                        Datos cargados automáticamente
                      </p>
                    )}
                  </div>
                </div>
                {!modoRapido && (
                  <Button
                    type="button"
                    variant="primary"
                    onClick={handleCheckoutRapido}
                    disabled={procesando || !datos.email || datos.email.toLowerCase() !== datosGuardados.clienteEmail.toLowerCase()}
                    className="flex items-center gap-2"
                  >
                    <Zap size={16} />
                    Comprar en 1 Clic
                  </Button>
                )}
              </div>
            </Card>
          )}

          {verificandoCliente && datos.email && (
            <div className="mb-4 text-sm text-gray-600 flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              Verificando si eres cliente recurrente...
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Nombre completo"
                value={datos.nombre}
                onChange={(e) => {
                  setDatos({ ...datos, nombre: e.target.value });
                  setUsandoDatosGuardados(false);
                }}
                error={errores.nombre}
                required
                disabled={modoRapido}
              />

              <Input
                label="Email"
                type="email"
                value={datos.email}
                onChange={(e) => {
                  setDatos({ ...datos, email: e.target.value });
                  setUsandoDatosGuardados(false);
                }}
                error={errores.email}
                required
                disabled={modoRapido}
              />

              <Input
                label="Teléfono"
                type="tel"
                value={datos.telefono}
                onChange={(e) => {
                  setDatos({ ...datos, telefono: e.target.value });
                  setUsandoDatosGuardados(false);
                }}
                error={errores.telefono}
                required
                disabled={modoRapido}
              />
            </div>

            <Select
              label="Método de Pago"
              options={metodosPago.map((m) => ({
                value: m.id,
                label: m.nombre,
              }))}
              value={datos.metodoPago}
              onChange={(e) => {
                setDatos({ ...datos, metodoPago: e.target.value });
                setUsandoDatosGuardados(false);
              }}
              error={errores.metodoPago}
              placeholder="Selecciona un método de pago"
              required
              disabled={modoRapido}
            />

            {/* User Story: Pago fraccionado en cuotas */}
            {elegiblePagoFraccionado && (
              <div className="space-y-4 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <Divide size={18} className="text-indigo-600" />
                  <h3 className="font-semibold text-gray-900">Pago Fraccionado en Cuotas</h3>
                </div>
                
                <div className="space-y-2">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={usarPagoFraccionado}
                      onChange={(e) => {
                        const usar = e.target.checked;
                        setUsarPagoFraccionado(usar);
                        if (!usar) {
                          setDatos({ ...datos, pagoFraccionado: undefined });
                        }
                      }}
                      className="mt-1 w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-400"
                    />
                    <div className="flex-1">
                      <span className="text-sm font-medium text-gray-900">
                        Pagar en cuotas
                      </span>
                      <p className="text-xs text-gray-600 mt-1">
                        Divide tu pago en cuotas mensuales para reducir la barrera económica y facilitar la compra de servicios de alto valor.
                      </p>
                    </div>
                  </label>
                </div>

                {usarPagoFraccionado && (
                  <div className="space-y-3">
                    {cargandoPlanes ? (
                      <div className="text-sm text-gray-600 flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600"></div>
                        Cargando planes disponibles...
                      </div>
                    ) : planesPagoFraccionado.length > 0 ? (
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Selecciona un plan de pago
                        </label>
                        <div className="grid grid-cols-1 gap-2">
                          {planesPagoFraccionado.map((plan) => {
                            const pagoCalculado = calcularPagoFraccionado(carrito.total, plan);
                            const montoPorCuota = pagoCalculado.montoPorCuota;
                            const montoTotal = pagoCalculado.montoTotal;
                            
                            return (
                              <label
                                key={plan.id}
                                className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-all ${
                                  datos.pagoFraccionado?.planId === plan.id
                                    ? 'border-indigo-500 bg-indigo-50 ring-2 ring-indigo-200'
                                    : 'border-gray-200 hover:border-indigo-300 hover:bg-indigo-50/50'
                                }`}
                              >
                                <input
                                  type="radio"
                                  name="planPagoFraccionado"
                                  checked={datos.pagoFraccionado?.planId === plan.id}
                                  onChange={() => {
                                    const pagoCalc = calcularPagoFraccionado(carrito.total, plan);
                                    setDatos({ ...datos, pagoFraccionado: pagoCalc });
                                  }}
                                  className="w-4 h-4 text-indigo-600 focus:ring-indigo-400"
                                />
                                <div className="flex-1">
                                  <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-gray-900">
                                      {plan.descripcion}
                                    </span>
                                    <span className="text-sm font-semibold text-indigo-600">
                                      €{montoPorCuota.toFixed(2)}/mes
                                    </span>
                                  </div>
                                  <div className="flex items-center justify-between mt-1">
                                    <span className="text-xs text-gray-600">
                                      {plan.numeroCuotas} cuotas de €{montoPorCuota.toFixed(2)}
                                    </span>
                                    {plan.porcentajeInteres && plan.porcentajeInteres > 0 && (
                                      <span className="text-xs text-orange-600">
                                        Total: €{montoTotal.toFixed(2)} (interés {plan.porcentajeInteres}%)
                                      </span>
                                    )}
                                    {(!plan.porcentajeInteres || plan.porcentajeInteres === 0) && (
                                      <span className="text-xs text-green-600">
                                        Sin intereses
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </label>
                            );
                          })}
                        </div>
                        
                        {datos.pagoFraccionado && (
                          <div className="p-3 bg-white rounded-lg border border-indigo-200">
                            <div className="flex items-start gap-2">
                              <Info size={16} className="text-indigo-600 mt-0.5" />
                              <div className="text-xs text-gray-700">
                                <p className="font-medium mb-1">Resumen del plan seleccionado:</p>
                                <ul className="list-disc list-inside space-y-1 text-gray-600">
                                  <li>
                                    {datos.pagoFraccionado.numeroCuotas} cuotas de €{datos.pagoFraccionado.montoPorCuota.toFixed(2)}
                                  </li>
                                  <li>
                                    Primera cuota: {new Intl.DateTimeFormat('es-ES', { day: '2-digit', month: 'long', year: 'numeric' }).format(datos.pagoFraccionado.fechaPrimeraCuota)}
                                  </li>
                                  {datos.pagoFraccionado.porcentajeInteres && datos.pagoFraccionado.porcentajeInteres > 0 && (
                                    <li>
                                      Total a pagar: €{datos.pagoFraccionado.montoTotal.toFixed(2)} (incluye {datos.pagoFraccionado.porcentajeInteres}% de interés)
                                    </li>
                                  )}
                                  {(!datos.pagoFraccionado.porcentajeInteres || datos.pagoFraccionado.porcentajeInteres === 0) && (
                                    <li>Total: €{datos.pagoFraccionado.montoTotal.toFixed(2)} (sin intereses)</li>
                                  )}
                                </ul>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-600">
                        No hay planes de pago fraccionado disponibles para este monto.
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}

            {contieneBonos && (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  <div className="flex items-center gap-2 mb-1">
                    <Calendar size={16} className="text-gray-400" />
                    Fecha de Caducidad de Bonos
                  </div>
                </label>
                <Input
                  type="date"
                  value={
                    datos.fechaVencimientoBonos
                      ? new Date(datos.fechaVencimientoBonos).toISOString().split('T')[0]
                      : fechaVencimientoDefault()
                  }
                  onChange={(e) => {
                    const fecha = e.target.value ? new Date(e.target.value) : undefined;
                    setDatos({ ...datos, fechaVencimientoBonos: fecha });
                  }}
                  error={errores.fechaVencimientoBonos}
                  required
                />
                <p className="text-xs text-gray-500">
                  Establece la fecha límite para que los clientes utilicen las sesiones de los bonos comprados.
                </p>
              </div>
            )}

            {contieneSuscripciones && (
              <div className="space-y-4 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <Repeat size={18} className="text-blue-600" />
                  <h3 className="font-semibold text-gray-900">Información de Suscripción</h3>
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    <div className="flex items-center gap-2 mb-1">
                      <Calendar size={16} className="text-gray-400" />
                      Fecha de Inicio de Suscripción
                    </div>
                  </label>
                  <Input
                    type="date"
                    value={
                      datos.fechaInicioSuscripcion
                        ? new Date(datos.fechaInicioSuscripcion).toISOString().split('T')[0]
                        : new Date().toISOString().split('T')[0]
                    }
                    onChange={(e) => {
                      const fecha = e.target.value ? new Date(e.target.value) : undefined;
                      setDatos({ ...datos, fechaInicioSuscripcion: fecha });
                    }}
                    error={errores.fechaInicioSuscripcion}
                    required
                  />
                  <p className="text-xs text-gray-500">
                    Fecha en la que comenzará la suscripción y se realizará el primer cargo.
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={datos.aceptaCargoRecurrente || false}
                      onChange={(e) =>
                        setDatos({ ...datos, aceptaCargoRecurrente: e.target.checked })
                      }
                      className="mt-1 w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-400"
                    />
                    <div className="flex-1">
                      <span className="text-sm font-medium text-gray-900">
                        Acepto el cargo automático recurrente
                      </span>
                      <p className="text-xs text-gray-600 mt-1">
                        Autorizo cargos automáticos periódicos según el ciclo de facturación de la suscripción. 
                        Puedo cancelar en cualquier momento.
                      </p>
                    </div>
                  </label>
                  {errores.cargoRecurrente && (
                    <p className="text-xs text-red-600">
                      {errores.cargoRecurrente}
                    </p>
                  )}
                </div>

                <div className="p-3 bg-white rounded-lg border border-blue-200">
                  <div className="flex items-start gap-2">
                    <Info size={16} className="text-blue-600 mt-0.5" />
                    <div className="text-xs text-gray-700">
                      <p className="font-medium mb-1">Información importante:</p>
                      <ul className="list-disc list-inside space-y-1 text-gray-600">
                        <li>El cargo se realizará automáticamente según el ciclo de facturación</li>
                        <li>Recibirás un email antes de cada cargo</li>
                        <li>Puedes cancelar la suscripción en cualquier momento</li>
                        {carrito.items.some(
                          (item) => item.producto.metadatos?.suscripcion?.precioInicial
                        ) && (
                          <li>El primer mes tiene un precio especial</li>
                        )}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {datos.metodoPago && (
              <Card className="p-4 bg-slate-50 ring-1 ring-slate-200">
                <div className="flex items-center gap-2">
                  <CreditCard size={20} className="text-blue-600" />
                  <span className="text-sm text-gray-600">
                    Pago seguro procesado mediante {metodosPago.find((m) => m.id === datos.metodoPago)?.nombre}
                  </span>
                </div>
                {contieneSuscripciones && metodosPago.find((m) => m.id === datos.metodoPago)?.tipo === 'transferencia' && (
                  <p className="text-xs text-red-600 mt-2">
                    ⚠️ Las suscripciones requieren un método de pago que soporte cargos automáticos (tarjeta o PayPal)
                  </p>
                )}
              </Card>
            )}

            <div className="space-y-2">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={datos.terminosAceptados}
                  onChange={(e) =>
                    setDatos({ ...datos, terminosAceptados: e.target.checked })
                  }
                  className="mt-1 w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-400"
                />
                <span className="text-sm text-gray-600">
                  Acepto los términos y condiciones y la política de privacidad
                </span>
              </label>
              {errores.terminos && (
                <p className="text-xs text-red-600">
                  {errores.terminos}
                </p>
              )}
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="secondary"
                onClick={onCancelar}
                disabled={procesando}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="primary"
                loading={procesando}
                fullWidth
              >
                {datos.pagoFraccionado
                  ? `Procesar Pago (€${datos.pagoFraccionado.montoPorCuota.toFixed(2)}/mes x ${datos.pagoFraccionado.numeroCuotas})`
                  : `Procesar Pago (€${carrito.total.toFixed(2)})`}
              </Button>
            </div>
          </form>
        </div>
      </Card>

      <Modal
        isOpen={mostrarExito}
        onClose={handleExitoConfirmar}
        title="Compra Exitosa"
        size="md"
        footer={
          <Button variant="primary" onClick={handleExitoConfirmar}>
            Aceptar
          </Button>
        }
      >
        <div className="space-y-4">
          <div className="flex items-center justify-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle size={40} className="text-green-600" />
            </div>
          </div>
          <div className="text-center space-y-2">
            <p className="text-base font-medium text-gray-900">
              Tu compra se ha procesado correctamente
            </p>
            {ventaExito && (
              <div className="space-y-1 mt-4">
                <p className="text-sm text-gray-600">
                  ID de Venta: <span className="font-mono text-gray-900">{ventaExito.ventaId}</span>
                </p>
                <p className="text-sm text-gray-600">
                  Factura: <span className="font-mono text-gray-900">{ventaExito.facturaId}</span>
                </p>
              </div>
            )}
          </div>
        </div>
      </Modal>
    </>
  );
};

