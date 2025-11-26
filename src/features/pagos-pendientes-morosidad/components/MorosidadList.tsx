import React, { useState, useEffect } from 'react';
import { Table, TableColumn, Button, Modal, Textarea, Select, Input } from '../../../components/componentsreutilizables';
import { PagoPendiente, MetodoPago, EnlacePago, PlataformaPago } from '../types';
import { morosidadAPI } from '../api/morosidad';
import { DollarSign, CheckCircle, MessageCircle, Link as LinkIcon, Copy, Check, Pause, Play, AlertCircle, FileText, Calendar, UserCheck, Percent, CreditCard, Filter, X, Shield, ShieldCheck, Download } from 'lucide-react';
import * as XLSX from 'xlsx';

interface MorosidadListProps {
  onRefresh?: () => void;
}

export const MorosidadList: React.FC<MorosidadListProps> = ({ onRefresh }) => {
  const [pagos, setPagos] = useState<PagoPendiente[]>([]);
  const [loading, setLoading] = useState(false);
  const [mostrarModalWhatsApp, setMostrarModalWhatsApp] = useState(false);
  const [clienteSeleccionado, setClienteSeleccionado] = useState<{ nombre: string; telefono?: string; monto: number; diasRetraso: number } | null>(null);
  const [mensajeWhatsApp, setMensajeWhatsApp] = useState('');
  
  // Estados para modal de marcar como pagado
  const [mostrarModalPago, setMostrarModalPago] = useState(false);
  const [pagoSeleccionado, setPagoSeleccionado] = useState<PagoPendiente | null>(null);
  const [metodoPago, setMetodoPago] = useState<MetodoPago>('efectivo');
  const [notaPago, setNotaPago] = useState('');
  const [guardandoPago, setGuardandoPago] = useState(false);
  
  // Estados para modal de enlace de pago
  const [mostrarModalEnlace, setMostrarModalEnlace] = useState(false);
  const [enlacePago, setEnlacePago] = useState<EnlacePago | null>(null);
  const [generandoEnlace, setGenerandoEnlace] = useState(false);
  const [enlaceCopiado, setEnlaceCopiado] = useState(false);
  const [plataformaPago, setPlataformaPago] = useState<PlataformaPago>('wompi');
  
  // Estados para modal de pausar membresía
  const [mostrarModalPausa, setMostrarModalPausa] = useState(false);
  const [pausandoMembresia, setPausandoMembresia] = useState(false);
  const [fechaReactivacion, setFechaReactivacion] = useState('');
  const [motivoPausa, setMotivoPausa] = useState('');
  
  // Estados para modal de notas privadas
  const [mostrarModalNotasPrivadas, setMostrarModalNotasPrivadas] = useState(false);
  const [notasPrivadas, setNotasPrivadas] = useState('');
  const [guardandoNotas, setGuardandoNotas] = useState(false);
  
  // Estados para modal de ajuste de deuda (descuento/condonación)
  const [mostrarModalAjusteDeuda, setMostrarModalAjusteDeuda] = useState(false);
  const [nuevoMonto, setNuevoMonto] = useState('');
  const [motivoAjuste, setMotivoAjuste] = useState('');
  const [guardandoAjuste, setGuardandoAjuste] = useState(false);

  // Estados para filtros
  const [mostrarFiltros, setMostrarFiltros] = useState(false);
  const [filtroVencidosMas15Dias, setFiltroVencidosMas15Dias] = useState(false);
  const [filtroMontoMayorA, setFiltroMontoMayorA] = useState('');
  const [filtroSinContactoReciente, setFiltroSinContactoReciente] = useState(false);
  const [filtroExcluirClientesConfianza, setFiltroExcluirClientesConfianza] = useState(false);

  useEffect(() => {
    cargarPagos();
  }, [filtroVencidosMas15Dias, filtroMontoMayorA, filtroSinContactoReciente, filtroExcluirClientesConfianza]);

  const cargarPagos = async () => {
    setLoading(true);
    try {
      const filtros: any = {};
      
      if (filtroVencidosMas15Dias) {
        filtros.vencidosMasDe15Dias = true;
      }
      
      if (filtroMontoMayorA) {
        const monto = parseFloat(filtroMontoMayorA.replace(/[^\d.-]/g, '').replace(/\./g, '').replace(',', '.'));
        if (!isNaN(monto)) {
          filtros.montoMayorA = monto;
        }
      }
      
      if (filtroSinContactoReciente) {
        filtros.sinContactoReciente = true;
      }
      
      if (filtroExcluirClientesConfianza) {
        filtros.excluirClientesDeConfianza = true;
      }
      
      const datos = await morosidadAPI.obtenerPagosPendientes(Object.keys(filtros).length > 0 ? filtros : undefined);
      setPagos(datos);
    } catch (error) {
      console.error('Error al cargar pagos pendientes:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatearMoneda = (valor: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(valor);
  };

  const obtenerTextoDiasVencidos = (dias: number): string => {
    if (dias === 0) {
      return 'Vence hoy';
    } else if (dias === 1) {
      return 'Vencido hace 1 día';
    } else {
      return `Vencido hace ${dias} días`;
    }
  };

  const obtenerColorDiasVencidos = (dias: number): string => {
    if (dias <= 7) return 'text-yellow-600';
    if (dias <= 30) return 'text-orange-600';
    return 'text-red-600';
  };

  const formatearTelefonoParaWhatsApp = (telefono?: string): string | null => {
    if (!telefono) return null;
    // Remover espacios, guiones, paréntesis y el símbolo +
    const numeroLimpio = telefono.replace(/[\s\-\(\)\+]/g, '');
    // Si empieza con 57 (código de Colombia), mantenerlo, sino agregarlo
    if (numeroLimpio.startsWith('57')) {
      return numeroLimpio;
    }
    // Si empieza con 0, removerlo y agregar 57
    if (numeroLimpio.startsWith('0')) {
      return '57' + numeroLimpio.substring(1);
    }
    // Si tiene 10 dígitos, agregar 57
    if (numeroLimpio.length === 10) {
      return '57' + numeroLimpio;
    }
    return numeroLimpio;
  };

  const generarMensajePorDefecto = (nombre: string, monto: number, dias: number, metodoPagoPreferido?: MetodoPago): string => {
    const montoFormateado = formatearMoneda(monto);
    const textoDias = obtenerTextoDiasVencidos(dias);
    let mensaje = `Hola ${nombre}, te escribo para recordarte que tienes un pago pendiente de ${montoFormateado}. ${textoDias}.`;
    
    if (metodoPagoPreferido) {
      const nombreMetodo = obtenerNombreMetodoPago(metodoPagoPreferido);
      mensaje += ` Puedes realizar el pago mediante ${nombreMetodo}.`;
    }
    
    mensaje += ` ¿Podrías confirmar cuándo podrías realizarlo? Gracias.`;
    return mensaje;
  };

  const handleAbrirWhatsApp = (pago: PagoPendiente) => {
    const telefono = formatearTelefonoParaWhatsApp(pago.cliente.telefono);
    if (!telefono) {
      alert('Este cliente no tiene un número de teléfono registrado.');
      return;
    }

    const mensajePorDefecto = generarMensajePorDefecto(
      pago.cliente.nombre,
      pago.montoPendiente,
      pago.diasRetraso,
      pago.cliente.metodoPagoPreferido
    );

    setClienteSeleccionado({
      nombre: pago.cliente.nombre,
      telefono: pago.cliente.telefono,
      monto: pago.montoPendiente,
      diasRetraso: pago.diasRetraso
    });
    setPagoSeleccionado(pago);
    setMensajeWhatsApp(mensajePorDefecto);
    setMostrarModalWhatsApp(true);
  };

  const handleEnviarWhatsApp = () => {
    if (!clienteSeleccionado) return;
    
    const telefono = formatearTelefonoParaWhatsApp(clienteSeleccionado.telefono);
    if (!telefono) return;

    const mensajeCodificado = encodeURIComponent(mensajeWhatsApp);
    const urlWhatsApp = `https://wa.me/${telefono}?text=${mensajeCodificado}`;
    
    window.open(urlWhatsApp, '_blank');
    setMostrarModalWhatsApp(false);
    setClienteSeleccionado(null);
    setMensajeWhatsApp('');
    setPagoSeleccionado(null);
  };

  const handleAbrirModalPago = (pago: PagoPendiente) => {
    setPagoSeleccionado(pago);
    setMetodoPago('efectivo');
    setNotaPago('');
    setMostrarModalPago(true);
  };

  const handleMarcarPagado = async () => {
    if (!pagoSeleccionado) return;
    
    setGuardandoPago(true);
    try {
      await morosidadAPI.marcarComoPagadoConMetodo(
        pagoSeleccionado.id,
        metodoPago,
        notaPago.trim() || undefined
      );
      setMostrarModalPago(false);
      setPagoSeleccionado(null);
      setNotaPago('');
      cargarPagos();
      onRefresh?.();
    } catch (error) {
      console.error('Error al marcar como pagado:', error);
      alert('Error al marcar el pago como recibido. Por favor, intenta nuevamente.');
    } finally {
      setGuardandoPago(false);
    }
  };

  const handleGenerarEnlacePago = async (pago: PagoPendiente, plataforma?: PlataformaPago) => {
    setGenerandoEnlace(true);
    setPagoSeleccionado(pago);
    const plataformaSeleccionada = plataforma || plataformaPago;
    try {
      const enlace = await morosidadAPI.generarEnlacePago(pago.id, plataformaSeleccionada);
      setEnlacePago(enlace);
      setPlataformaPago(plataformaSeleccionada);
      setMostrarModalEnlace(true);
    } catch (error) {
      console.error('Error al generar enlace de pago:', error);
      alert('Error al generar el enlace de pago. Por favor, intenta nuevamente.');
    } finally {
      setGenerandoEnlace(false);
    }
  };

  const handleCopiarEnlace = async () => {
    if (!enlacePago) return;
    
    try {
      await navigator.clipboard.writeText(enlacePago.url);
      setEnlaceCopiado(true);
      setTimeout(() => setEnlaceCopiado(false), 2000);
    } catch (error) {
      console.error('Error al copiar enlace:', error);
      // Fallback para navegadores que no soportan clipboard API
      const textArea = document.createElement('textarea');
      textArea.value = enlacePago.url;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setEnlaceCopiado(true);
      setTimeout(() => setEnlaceCopiado(false), 2000);
    }
  };

  const handleEnviarEnlaceWhatsApp = () => {
    if (!enlacePago || !pagoSeleccionado) return;
    
    const telefono = formatearTelefonoParaWhatsApp(pagoSeleccionado.cliente.telefono);
    if (!telefono) {
      alert('Este cliente no tiene un número de teléfono registrado.');
      return;
    }

    const montoFormateado = formatearMoneda(enlacePago.monto);
    const mensaje = `Hola ${pagoSeleccionado.cliente.nombre}, puedes realizar el pago de ${montoFormateado} mediante el siguiente enlace:\n\n${enlacePago.url}\n\nGracias.`;
    const mensajeCodificado = encodeURIComponent(mensaje);
    const urlWhatsApp = `https://wa.me/${telefono}?text=${mensajeCodificado}`;
    
    window.open(urlWhatsApp, '_blank');
  };

  const handleAbrirModalPausa = (pago: PagoPendiente) => {
    setPagoSeleccionado(pago);
    // Establecer fecha por defecto: 30 días desde hoy
    const fechaDefault = new Date();
    fechaDefault.setDate(fechaDefault.getDate() + 30);
    setFechaReactivacion(fechaDefault.toISOString().split('T')[0]);
    setMotivoPausa('');
    setMostrarModalPausa(true);
  };

  const handlePausarMembresia = async () => {
    if (!pagoSeleccionado) return;
    
    setPausandoMembresia(true);
    try {
      const fechaReactivacionDate = fechaReactivacion ? new Date(fechaReactivacion) : undefined;
      await morosidadAPI.pausarMembresia(
        pagoSeleccionado.id,
        fechaReactivacionDate,
        motivoPausa.trim() || undefined
      );
      setMostrarModalPausa(false);
      setPagoSeleccionado(null);
      setFechaReactivacion('');
      setMotivoPausa('');
      cargarPagos();
      onRefresh?.();
    } catch (error) {
      console.error('Error al pausar membresía:', error);
      alert('Error al pausar la membresía. Por favor, intenta nuevamente.');
    } finally {
      setPausandoMembresia(false);
    }
  };

  const handleReanudarMembresia = async (pago: PagoPendiente) => {
    if (!confirm(`¿Estás seguro de que deseas reanudar la membresía de ${pago.cliente.nombre}?`)) {
      return;
    }
    
    try {
      await morosidadAPI.reanudarMembresia(pago.id);
      cargarPagos();
      onRefresh?.();
    } catch (error) {
      console.error('Error al reanudar membresía:', error);
      alert('Error al reanudar la membresía. Por favor, intenta nuevamente.');
    }
  };

  const handleAbrirModalNotasPrivadas = (pago: PagoPendiente) => {
    setPagoSeleccionado(pago);
    setNotasPrivadas(pago.notasPrivadas || '');
    setMostrarModalNotasPrivadas(true);
  };

  const handleGuardarNotasPrivadas = async () => {
    if (!pagoSeleccionado) return;
    
    setGuardandoNotas(true);
    try {
      await morosidadAPI.actualizarNotasPrivadas(
        pagoSeleccionado.id,
        notasPrivadas
      );
      setMostrarModalNotasPrivadas(false);
      setPagoSeleccionado(null);
      setNotasPrivadas('');
      cargarPagos();
      onRefresh?.();
    } catch (error) {
      console.error('Error al guardar notas privadas:', error);
      alert('Error al guardar las notas privadas. Por favor, intenta nuevamente.');
    } finally {
      setGuardandoNotas(false);
    }
  };

  const handleAbrirModalAjusteDeuda = (pago: PagoPendiente) => {
    setPagoSeleccionado(pago);
    setNuevoMonto(pago.montoPendiente.toString());
    setMotivoAjuste('');
    setMostrarModalAjusteDeuda(true);
  };

  const handleAjustarDeuda = async () => {
    if (!pagoSeleccionado) return;
    
    const nuevoMontoNum = parseFloat(nuevoMonto.replace(/[^\d.-]/g, '').replace(/\./g, '').replace(',', '.'));
    
    if (isNaN(nuevoMontoNum) || nuevoMontoNum < 0) {
      alert('Por favor, ingresa un monto válido');
      return;
    }
    
    if (nuevoMontoNum > pagoSeleccionado.montoPendiente) {
      alert('El nuevo monto no puede ser mayor al monto pendiente actual');
      return;
    }
    
    if (!motivoAjuste.trim()) {
      alert('Por favor, ingresa el motivo del ajuste');
      return;
    }
    
    setGuardandoAjuste(true);
    try {
      await morosidadAPI.ajustarMontoDeuda(pagoSeleccionado.id, {
        nuevoMonto: nuevoMontoNum,
        motivo: motivoAjuste.trim()
      });
      setMostrarModalAjusteDeuda(false);
      setPagoSeleccionado(null);
      setNuevoMonto('');
      setMotivoAjuste('');
      cargarPagos();
      onRefresh?.();
    } catch (error: any) {
      console.error('Error al ajustar deuda:', error);
      alert(error.message || 'Error al ajustar la deuda. Por favor, intenta nuevamente.');
    } finally {
      setGuardandoAjuste(false);
    }
  };

  const obtenerNombreMetodoPago = (metodo?: MetodoPago): string => {
    const nombres: Record<MetodoPago, string> = {
      efectivo: 'Efectivo',
      transferencia: 'Transferencia',
      tarjeta: 'Tarjeta',
      nequi: 'Nequi',
      daviplata: 'Daviplata',
      pse: 'PSE',
      otro: 'Otro'
    };
    return metodo ? nombres[metodo] : '';
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

  const handleToggleClienteDeConfianza = async (pago: PagoPendiente) => {
    try {
      await morosidadAPI.toggleClienteDeConfianza(pago.id, !pago.clienteDeConfianza);
      cargarPagos();
      onRefresh?.();
    } catch (error) {
      console.error('Error al cambiar estado de cliente de confianza:', error);
      alert('Error al actualizar el estado. Por favor, intenta nuevamente.');
    }
  };

  const limpiarFiltros = () => {
    setFiltroVencidosMas15Dias(false);
    setFiltroMontoMayorA('');
    setFiltroSinContactoReciente(false);
    setFiltroExcluirClientesConfianza(false);
  };

  const tieneFiltrosActivos = filtroVencidosMas15Dias || filtroMontoMayorA || filtroSinContactoReciente || filtroExcluirClientesConfianza;

  const handleExportarExcel = () => {
    try {
      // Preparar datos para exportación
      const datosExportacion = pagos.map(pago => ({
        'Nombre': pago.cliente.nombre,
        'Contacto': pago.cliente.telefono || pago.cliente.email || 'Sin contacto',
        'Email': pago.cliente.email || '',
        'Teléfono': pago.cliente.telefono || '',
        'Factura': pago.numeroFactura,
        'Monto': pago.montoPendiente,
        'Monto Formateado': formatearMoneda(pago.montoPendiente),
        'Fecha Vencimiento': pago.fechaVencimiento.toLocaleDateString('es-ES'),
        'Días de Retraso': pago.diasRetraso,
        'Estado': obtenerTextoDiasVencidos(pago.diasRetraso),
        'Nivel Morosidad': pago.nivelMorosidad,
        'Riesgo': pago.riesgo
      }));

      // Crear workbook y worksheet
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(datosExportacion);

      // Ajustar ancho de columnas
      const columnWidths = [
        { wch: 25 }, // Nombre
        { wch: 20 }, // Contacto
        { wch: 25 }, // Email
        { wch: 15 }, // Teléfono
        { wch: 18 }, // Factura
        { wch: 15 }, // Monto
        { wch: 18 }, // Monto Formateado
        { wch: 18 }, // Fecha Vencimiento
        { wch: 15 }, // Días de Retraso
        { wch: 20 }, // Estado
        { wch: 15 }, // Nivel Morosidad
        { wch: 12 }  // Riesgo
      ];
      ws['!cols'] = columnWidths;

      // Agregar worksheet al workbook
      XLSX.utils.book_append_sheet(wb, ws, 'Pagos Pendientes');

      // Generar nombre de archivo con fecha
      const fecha = new Date().toISOString().split('T')[0];
      const nombreArchivo = `Pagos_Pendientes_${fecha}.xlsx`;

      // Guardar archivo
      XLSX.writeFile(wb, nombreArchivo);
    } catch (error) {
      console.error('Error al exportar a Excel:', error);
      alert('Error al exportar la lista a Excel. Por favor, intenta nuevamente.');
    }
  };

  const columnas: TableColumn<PagoPendiente>[] = [
    {
      key: 'cliente',
      label: 'Cliente',
      render: (_, row) => (
        <div>
          <div className="flex items-center gap-2">
            <div className="font-medium text-gray-900">{row.cliente.nombre}</div>
            {row.clienteDeConfianza && (
              <div className="flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                <ShieldCheck className="w-3 h-3" />
                <span>Cliente de confianza</span>
              </div>
            )}
          </div>
          {/* Método de pago preferido */}
          {row.cliente.metodoPagoPreferido && (
            <div className="mt-1 flex items-center gap-1 text-xs text-blue-600">
              <CreditCard className="w-3 h-3" />
              <span>Pago preferido: {obtenerNombreMetodoPago(row.cliente.metodoPagoPreferido)}</span>
            </div>
          )}
          {/* Último contacto */}
          {row.ultimoContacto && (
            <div className="mt-1 flex items-center gap-1 text-xs text-gray-600">
              <MessageCircle className="w-3 h-3" />
              <span>Último contacto: {formatearFechaRelativa(row.ultimoContacto)}</span>
            </div>
          )}
          {!row.ultimoContacto && (
            <div className="mt-1 flex items-center gap-1 text-xs text-orange-600">
              <AlertCircle className="w-3 h-3" />
              <span>Sin contacto registrado</span>
            </div>
          )}
          {row.membresiaPausada?.pausada && (
            <div className="mt-1 flex items-center gap-1 text-xs text-orange-600">
              <Pause className="w-3 h-3" />
              <span>Membresía pausada</span>
              {row.membresiaPausada.fechaReactivacion && (
                <span className="text-gray-500">
                  • Reactiva: {row.membresiaPausada.fechaReactivacion.toLocaleDateString('es-ES')}
                </span>
              )}
            </div>
          )}
          {/* Información de asistencia */}
          {row.asistencia && (
            <div className="mt-2 space-y-1">
              {row.asistencia.ultimaAsistencia ? (
                <div className="flex items-center gap-1 text-xs text-gray-600">
                  <UserCheck className="w-3 h-3" />
                  <span>Última asistencia: {formatearFechaRelativa(row.asistencia.ultimaAsistencia)}</span>
                </div>
              ) : (
                <div className="flex items-center gap-1 text-xs text-orange-600">
                  <AlertCircle className="w-3 h-3" />
                  <span>Sin asistencia registrada</span>
                </div>
              )}
              <div className="flex items-center gap-1 text-xs text-gray-600">
                <Calendar className="w-3 h-3" />
                <span>Sesiones este mes: {row.asistencia.sesionesEsteMes}</span>
              </div>
            </div>
          )}
        </div>
      )
    },
    {
      key: 'montoPendiente',
      label: 'Monto que debe',
      render: (_, row) => (
        <div className="flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-gray-400" />
          <span className="font-semibold text-gray-900">{formatearMoneda(row.montoPendiente)}</span>
        </div>
      ),
      align: 'right',
      sortable: true
    },
    {
      key: 'diasRetraso',
      label: 'Estado',
      render: (_, row) => (
        <div>
          <span className={`font-medium ${obtenerColorDiasVencidos(row.diasRetraso)}`}>
            {obtenerTextoDiasVencidos(row.diasRetraso)}
          </span>
        </div>
      ),
      sortable: true
    },
    {
      key: 'acciones',
      label: 'Acciones',
      render: (_, row) => (
        <div className="flex gap-2 flex-wrap">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleToggleClienteDeConfianza(row)}
            title={row.clienteDeConfianza ? "Desmarcar como cliente de confianza" : "Marcar como cliente de confianza"}
            leftIcon={row.clienteDeConfianza ? <ShieldCheck className="w-4 h-4 text-green-600" /> : <Shield className="w-4 h-4 text-gray-400" />}
          >
            {row.clienteDeConfianza ? 'Confianza' : 'Confiar'}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleAbrirModalNotasPrivadas(row)}
            title={row.notasPrivadas ? "Ver/editar notas privadas" : "Agregar notas privadas"}
            leftIcon={<FileText className={`w-4 h-4 ${row.notasPrivadas ? 'text-blue-600' : 'text-gray-400'}`} />}
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleAbrirModalAjusteDeuda(row)}
            title="Aplicar descuento o condonar deuda"
            leftIcon={<Percent className="w-4 h-4 text-purple-600" />}
          >
            Ajustar
          </Button>
          {row.membresiaPausada?.pausada ? (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => handleReanudarMembresia(row)}
              title="Reanudar membresía"
              leftIcon={<Play className="w-4 h-4" />}
            >
              Reanudar
            </Button>
          ) : (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => handleAbrirModalPausa(row)}
              title="Pausar membresía para evitar nuevos cobros"
              leftIcon={<Pause className="w-4 h-4" />}
            >
              Pausar
            </Button>
          )}
          <Button
            variant="secondary"
            size="sm"
            onClick={() => handleGenerarEnlacePago(row)}
            title="Generar enlace de pago"
            leftIcon={<LinkIcon className="w-4 h-4" />}
          >
            Enlace
          </Button>
          {row.cliente.telefono && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => handleAbrirWhatsApp(row)}
              title="Enviar recordatorio por WhatsApp"
              leftIcon={<MessageCircle className="w-4 h-4" />}
            >
              WhatsApp
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleAbrirModalPago(row)}
            title="Marcar como pagado"
          >
            <CheckCircle className="w-4 h-4 text-green-600" />
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Clientes que me deben dinero
          </h2>
          <p className="text-gray-600">
            Vista simple de quién te debe dinero y cuánto
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-600">
            Total: <span className="font-semibold text-gray-900">{pagos.length}</span> clientes con deuda
          </div>
          <Button
            variant="primary"
            size="sm"
            onClick={handleExportarExcel}
            leftIcon={<Download className="w-4 h-4" />}
            disabled={pagos.length === 0}
          >
            Exportar a Excel
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setMostrarFiltros(!mostrarFiltros)}
            leftIcon={<Filter className="w-4 h-4" />}
          >
            Filtros
            {tieneFiltrosActivos && (
              <span className="ml-1 px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs">
                {[filtroVencidosMas15Dias, filtroMontoMayorA, filtroSinContactoReciente, filtroExcluirClientesConfianza].filter(Boolean).length}
              </span>
            )}
          </Button>
        </div>
      </div>

      {/* Panel de filtros */}
      {mostrarFiltros && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-900">Filtros de priorización</h3>
            {tieneFiltrosActivos && (
              <Button
                variant="ghost"
                size="sm"
                onClick={limpiarFiltros}
                leftIcon={<X className="w-4 h-4" />}
              >
                Limpiar filtros
              </Button>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filtroVencidosMas15Dias}
                onChange={(e) => setFiltroVencidosMas15Dias(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Vencidos hace más de 15 días</span>
            </label>
            <div>
              <Input
                label="Monto mayor a"
                type="text"
                value={filtroMontoMayorA}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^\d.,]/g, '');
                  setFiltroMontoMayorA(value);
                }}
                placeholder="Ej: 100000"
                className="w-full"
              />
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filtroSinContactoReciente}
                onChange={(e) => setFiltroSinContactoReciente(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Sin contacto reciente (7+ días)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filtroExcluirClientesConfianza}
                onChange={(e) => setFiltroExcluirClientesConfianza(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Excluir clientes de confianza</span>
            </label>
          </div>
        </div>
      )}

      <Table
        data={pagos}
        columns={columnas}
        loading={loading}
        emptyMessage="No hay clientes con deuda pendiente"
      />

      {/* Modal para personalizar mensaje de WhatsApp */}
      <Modal
        isOpen={mostrarModalWhatsApp}
        onClose={() => {
          setMostrarModalWhatsApp(false);
          setClienteSeleccionado(null);
          setMensajeWhatsApp('');
          setPagoSeleccionado(null);
        }}
        title={`Enviar mensaje a ${clienteSeleccionado?.nombre}`}
        size="md"
        footer={
          <div className="flex gap-3">
            <Button
              variant="secondary"
              onClick={() => {
                setMostrarModalWhatsApp(false);
                setClienteSeleccionado(null);
                setMensajeWhatsApp('');
                setPagoSeleccionado(null);
              }}
            >
              Cancelar
            </Button>
            <Button
              variant="primary"
              onClick={handleEnviarWhatsApp}
              disabled={!mensajeWhatsApp.trim()}
            >
              Abrir WhatsApp
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          {pagoSeleccionado?.notasPrivadas && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <FileText className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-xs font-medium text-blue-900 mb-1">Notas privadas:</p>
                  <p className="text-xs text-blue-700 whitespace-pre-wrap">{pagoSeleccionado.notasPrivadas}</p>
                </div>
              </div>
            </div>
          )}
          <p className="text-sm text-gray-600">
            Personaliza el mensaje antes de enviarlo. Se abrirá WhatsApp con este mensaje pre-cargado.
          </p>
          <Textarea
            value={mensajeWhatsApp}
            onChange={(e) => setMensajeWhatsApp(e.target.value)}
            placeholder="Escribe tu mensaje aquí..."
            rows={6}
            maxLength={1000}
            showCount
          />
        </div>
      </Modal>

      {/* Modal para marcar pago como recibido */}
      <Modal
        isOpen={mostrarModalPago}
        onClose={() => {
          setMostrarModalPago(false);
          setPagoSeleccionado(null);
          setNotaPago('');
        }}
        title="Marcar pago como recibido"
        size="md"
        footer={
          <div className="flex gap-3">
            <Button
              variant="secondary"
              onClick={() => {
                setMostrarModalPago(false);
                setPagoSeleccionado(null);
                setNotaPago('');
              }}
              disabled={guardandoPago}
            >
              Cancelar
            </Button>
            <Button
              variant="primary"
              onClick={handleMarcarPagado}
              loading={guardandoPago}
              disabled={guardandoPago}
            >
              Confirmar pago
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          {pagoSeleccionado && (
            <>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Cliente</p>
                <p className="font-semibold text-gray-900">{pagoSeleccionado.cliente.nombre}</p>
                <p className="text-sm text-gray-600 mt-2 mb-1">Monto</p>
                <p className="font-semibold text-gray-900 text-lg">{formatearMoneda(pagoSeleccionado.montoPendiente)}</p>
              </div>

              {pagoSeleccionado.notasPrivadas && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <div className="flex items-start gap-2">
                    <FileText className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-xs font-medium text-blue-900 mb-1">Notas privadas:</p>
                      <p className="text-xs text-blue-700 whitespace-pre-wrap">{pagoSeleccionado.notasPrivadas}</p>
                    </div>
                  </div>
                </div>
              )}

              <Select
                label="Método de pago"
                value={metodoPago}
                onChange={(e) => setMetodoPago(e.target.value as MetodoPago)}
                options={[
                  { value: 'efectivo', label: 'Efectivo' },
                  { value: 'transferencia', label: 'Transferencia bancaria' },
                  { value: 'tarjeta', label: 'Tarjeta de crédito/débito' },
                  { value: 'nequi', label: 'Nequi' },
                  { value: 'daviplata', label: 'Daviplata' },
                  { value: 'pse', label: 'PSE' },
                  { value: 'otro', label: 'Otro' }
                ]}
              />

              <Textarea
                label="Nota (opcional)"
                value={notaPago}
                onChange={(e) => setNotaPago(e.target.value)}
                placeholder="Ej: Pago realizado el día X, referencia Y..."
                rows={3}
                maxLength={500}
                showCount
              />
            </>
          )}
        </div>
      </Modal>

      {/* Modal para enlace de pago */}
      <Modal
        isOpen={mostrarModalEnlace}
        onClose={() => {
          setMostrarModalEnlace(false);
          setEnlacePago(null);
          setEnlaceCopiado(false);
        }}
        title="Enlace de pago generado"
        size="md"
        footer={
          <div className="flex gap-3">
            <Button
              variant="secondary"
              onClick={() => {
                setMostrarModalEnlace(false);
                setEnlacePago(null);
                setEnlaceCopiado(false);
              }}
            >
              Cerrar
            </Button>
            {pagoSeleccionado?.cliente.telefono && (
              <Button
                variant="primary"
                onClick={handleEnviarEnlaceWhatsApp}
                leftIcon={<MessageCircle className="w-4 h-4" />}
              >
                Enviar por WhatsApp
              </Button>
            )}
          </div>
        }
      >
        <div className="space-y-4">
          {enlacePago && (
            <>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Cliente</p>
                <p className="font-semibold text-gray-900">{pagoSeleccionado?.cliente.nombre}</p>
                <p className="text-sm text-gray-600 mt-2 mb-1">Monto</p>
                <p className="font-semibold text-gray-900 text-lg">{formatearMoneda(enlacePago.monto)}</p>
                <p className="text-sm text-gray-600 mt-2 mb-1">Plataforma</p>
                <p className="font-medium text-gray-700 capitalize">{enlacePago.plataforma}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Enlace de pago
                </label>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <Input
                      value={enlacePago.url}
                      readOnly
                      className="bg-gray-50"
                    />
                  </div>
                  <Button
                    variant="secondary"
                    onClick={handleCopiarEnlace}
                    leftIcon={enlaceCopiado ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  >
                    {enlaceCopiado ? 'Copiado' : 'Copiar'}
                  </Button>
                </div>
                {enlaceCopiado && (
                  <p className="text-sm text-green-600 mt-2">✓ Enlace copiado al portapapeles</p>
                )}
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm text-blue-800">
                  <strong>Instrucciones:</strong> Copia este enlace y compártelo con tu cliente. 
                  El cliente podrá realizar el pago de forma segura a través de {enlacePago.plataforma === 'wompi' ? 'Wompi' : 'PayU'}.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Generar nuevo enlace con otra plataforma
                </label>
                <div className="flex gap-2">
                  <Select
                    value={plataformaPago}
                    onChange={(e) => setPlataformaPago(e.target.value as PlataformaPago)}
                    options={[
                      { value: 'wompi', label: 'Wompi' },
                      { value: 'payu', label: 'PayU' }
                    ]}
                    className="flex-1"
                  />
                  <Button
                    variant="primary"
                    onClick={() => {
                      if (pagoSeleccionado) {
                        handleGenerarEnlacePago(pagoSeleccionado, plataformaPago);
                      }
                    }}
                    loading={generandoEnlace}
                    disabled={generandoEnlace}
                    leftIcon={<LinkIcon className="w-4 h-4" />}
                  >
                    Generar
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </Modal>

      {/* Modal para pausar membresía */}
      <Modal
        isOpen={mostrarModalPausa}
        onClose={() => {
          setMostrarModalPausa(false);
          setPagoSeleccionado(null);
          setFechaReactivacion('');
          setMotivoPausa('');
        }}
        title="Pausar membresía"
        size="md"
        footer={
          <div className="flex gap-3">
            <Button
              variant="secondary"
              onClick={() => {
                setMostrarModalPausa(false);
                setPagoSeleccionado(null);
                setFechaReactivacion('');
                setMotivoPausa('');
              }}
              disabled={pausandoMembresia}
            >
              Cancelar
            </Button>
            <Button
              variant="primary"
              onClick={handlePausarMembresia}
              loading={pausandoMembresia}
              disabled={pausandoMembresia}
              leftIcon={<Pause className="w-4 h-4" />}
            >
              Pausar membresía
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          {pagoSeleccionado && (
            <>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-blue-900 mb-1">
                      ¿Por qué pausar la membresía?
                    </p>
                    <p className="text-sm text-blue-700">
                      Al pausar la membresía, se detendrán los nuevos cobros automáticos hasta la fecha de reactivación. 
                      Esto ayuda a evitar que la deuda siga creciendo mientras se resuelve el pago pendiente.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Cliente</p>
                <p className="font-semibold text-gray-900">{pagoSeleccionado.cliente.nombre}</p>
                <p className="text-sm text-gray-600 mt-2 mb-1">Deuda actual</p>
                <p className="font-semibold text-gray-900 text-lg">{formatearMoneda(pagoSeleccionado.montoPendiente)}</p>
              </div>

              <div>
                <Input
                  label="Fecha de reactivación *"
                  type="date"
                  value={fechaReactivacion}
                  onChange={(e) => setFechaReactivacion(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  required
                  helperText="La membresía se reactivará automáticamente en esta fecha"
                />
              </div>

              <Textarea
                label="Motivo de la pausa (opcional)"
                value={motivoPausa}
                onChange={(e) => setMotivoPausa(e.target.value)}
                placeholder="Ej: Cliente solicitó tiempo para pagar la deuda..."
                rows={3}
                maxLength={500}
                showCount
              />
            </>
          )}
        </div>
      </Modal>

      {/* Modal para notas privadas */}
      <Modal
        isOpen={mostrarModalNotasPrivadas}
        onClose={() => {
          setMostrarModalNotasPrivadas(false);
          setPagoSeleccionado(null);
          setNotasPrivadas('');
        }}
        title="Notas Privadas"
        size="md"
        footer={
          <div className="flex gap-3">
            <Button
              variant="secondary"
              onClick={() => {
                setMostrarModalNotasPrivadas(false);
                setPagoSeleccionado(null);
                setNotasPrivadas('');
              }}
              disabled={guardandoNotas}
            >
              Cancelar
            </Button>
            <Button
              variant="primary"
              onClick={handleGuardarNotasPrivadas}
              loading={guardandoNotas}
              disabled={guardandoNotas}
              leftIcon={<FileText className="w-4 h-4" />}
            >
              Guardar notas
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          {pagoSeleccionado && (
            <>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-blue-900 mb-1">
                      Notas privadas
                    </p>
                    <p className="text-sm text-blue-700">
                      Estas notas son privadas y solo visibles para ti. Úsalas para recordar contexto importante sobre la situación financiera o personal del cliente al hacer seguimiento de la deuda.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Cliente</p>
                <p className="font-semibold text-gray-900">{pagoSeleccionado.cliente.nombre}</p>
                <p className="text-sm text-gray-600 mt-2 mb-1">Factura</p>
                <p className="font-medium text-gray-700">{pagoSeleccionado.numeroFactura}</p>
                <p className="text-sm text-gray-600 mt-2 mb-1">Monto pendiente</p>
                <p className="font-semibold text-gray-900">{formatearMoneda(pagoSeleccionado.montoPendiente)}</p>
              </div>

              <Textarea
                label="Notas privadas sobre el cliente"
                value={notasPrivadas}
                onChange={(e) => setNotasPrivadas(e.target.value)}
                placeholder="Ej: Cliente mencionó problemas financieros temporales por cambio de trabajo. Prometió pagar cuando reciba su liquidación en 2 semanas. Prefiere contacto por WhatsApp..."
                rows={6}
                maxLength={2000}
                showCount
              />
              <p className="text-xs text-gray-500">
                Estas notas te ayudarán a recordar contexto importante al contactar al cliente o revisar la deuda.
              </p>
            </>
          )}
        </div>
      </Modal>

      {/* Modal para ajustar deuda (descuento/condonación) */}
      <Modal
        isOpen={mostrarModalAjusteDeuda}
        onClose={() => {
          setMostrarModalAjusteDeuda(false);
          setPagoSeleccionado(null);
          setNuevoMonto('');
          setMotivoAjuste('');
        }}
        title="Ajustar monto de deuda"
        size="md"
        footer={
          <div className="flex gap-3">
            <Button
              variant="secondary"
              onClick={() => {
                setMostrarModalAjusteDeuda(false);
                setPagoSeleccionado(null);
                setNuevoMonto('');
                setMotivoAjuste('');
              }}
              disabled={guardandoAjuste}
            >
              Cancelar
            </Button>
            <Button
              variant="primary"
              onClick={handleAjustarDeuda}
              loading={guardandoAjuste}
              disabled={guardandoAjuste}
              leftIcon={<Percent className="w-4 h-4" />}
            >
              Aplicar ajuste
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          {pagoSeleccionado && (
            <>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-blue-900 mb-1">
                      Ajuste de deuda excepcional
                    </p>
                    <p className="text-sm text-blue-700">
                      Puedes aplicar un descuento o condonar parte de la deuda para casos especiales. 
                      El motivo será registrado en el historial para mantener un registro de todas las acciones.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Cliente</p>
                <p className="font-semibold text-gray-900">{pagoSeleccionado.cliente.nombre}</p>
                <p className="text-sm text-gray-600 mt-2 mb-1">Factura</p>
                <p className="font-medium text-gray-700">{pagoSeleccionado.numeroFactura}</p>
                <p className="text-sm text-gray-600 mt-2 mb-1">Monto pendiente actual</p>
                <p className="font-semibold text-gray-900 text-lg">{formatearMoneda(pagoSeleccionado.montoPendiente)}</p>
                {pagoSeleccionado.ajustesDeuda && pagoSeleccionado.ajustesDeuda.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <p className="text-xs text-gray-600 mb-2">Ajustes anteriores:</p>
                    {pagoSeleccionado.ajustesDeuda.map((ajuste, idx) => (
                      <div key={idx} className="text-xs text-gray-600 mb-1">
                        <span className="font-medium">{ajuste.fechaAjuste.toLocaleDateString('es-ES')}:</span>{' '}
                        {formatearMoneda(ajuste.descuentoAplicado)} ({ajuste.motivo})
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <Input
                  label="Nuevo monto pendiente *"
                  type="text"
                  value={nuevoMonto}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^\d.,]/g, '');
                    setNuevoMonto(value);
                  }}
                  placeholder={formatearMoneda(pagoSeleccionado.montoPendiente)}
                  required
                  helperText={`Ingresa el nuevo monto (máximo ${formatearMoneda(pagoSeleccionado.montoPendiente)}). Usa 0 para condonar toda la deuda.`}
                />
                {nuevoMonto && !isNaN(parseFloat(nuevoMonto.replace(/[^\d.-]/g, '').replace(/\./g, '').replace(',', '.'))) && (
                  <div className="mt-2 p-2 bg-purple-50 rounded text-sm">
                    <p className="text-purple-900">
                      <strong>Descuento a aplicar:</strong>{' '}
                      {formatearMoneda(
                        pagoSeleccionado.montoPendiente - 
                        parseFloat(nuevoMonto.replace(/[^\d.-]/g, '').replace(/\./g, '').replace(',', '.'))
                      )}
                    </p>
                  </div>
                )}
              </div>

              <Textarea
                label="Motivo del ajuste *"
                value={motivoAjuste}
                onChange={(e) => setMotivoAjuste(e.target.value)}
                placeholder="Ej: Cliente con dificultades financieras temporales. Acuerdo especial para mantener la relación..."
                rows={4}
                maxLength={500}
                showCount
                required
                helperText="Explica el motivo del descuento o condonación. Esta información quedará registrada en el historial."
              />
            </>
          )}
        </div>
      </Modal>
    </div>
  );
};

