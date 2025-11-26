import React, { useState, useEffect } from 'react';
import { Modal, Button, Input, Select, SelectOption, Textarea } from '../../../components/componentsreutilizables';
import { Factura, ItemFactura, TipoFactura, TipoDescuento, MotivoDescuento, DescuentoFactura } from '../types';
import { facturasAPI } from '../api/facturas';
import { plantillasAPI } from '../api/plantillas';
import { PlantillaServicio } from '../types/plantillas';
import { Plus, Trash2, Zap, Tag } from 'lucide-react';

interface CreadorFacturaProps {
  onClose: () => void;
  onFacturaCreada: () => void;
}

export const CreadorFactura: React.FC<CreadorFacturaProps> = ({ onClose, onFacturaCreada }) => {
  const [loading, setLoading] = useState(false);
  const [clienteNombre, setClienteNombre] = useState('');
  const [clienteEmail, setClienteEmail] = useState('');
  const [clienteNit, setClienteNit] = useState('');
  const [clienteDireccion, setClienteDireccion] = useState('');
  const [fechaEmision, setFechaEmision] = useState(new Date().toISOString().split('T')[0]);
  const [fechaVencimiento, setFechaVencimiento] = useState(() => {
    const fecha = new Date();
    fecha.setDate(fecha.getDate() + 30);
    return fecha.toISOString().split('T')[0];
  });
  const [tipo, setTipo] = useState<TipoFactura>('servicios');
  const [items, setItems] = useState<ItemFactura[]>([
    {
      id: '1',
      descripcion: '',
      cantidad: 1,
      precioUnitario: 0,
      subtotal: 0,
      tipo: 'servicio'
    }
  ]);
  const [notas, setNotas] = useState('');
  const [notasInternas, setNotasInternas] = useState('');
  const [plantillas, setPlantillas] = useState<PlantillaServicio[]>([]);
  const [mostrarPlantillas, setMostrarPlantillas] = useState(false);
  const [tipoDescuento, setTipoDescuento] = useState<TipoDescuento | ''>('');
  const [valorDescuento, setValorDescuento] = useState('');
  const [motivoDescuento, setMotivoDescuento] = useState<MotivoDescuento>('promocion');
  const [descripcionDescuento, setDescripcionDescuento] = useState('');

  // Reset form when modal closes
  const handleClose = () => {
    setClienteNombre('');
    setClienteEmail('');
    setClienteNit('');
    setClienteDireccion('');
    setNotas('');
    setNotasInternas('');
    setItems([{
      id: '1',
      descripcion: '',
      cantidad: 1,
      precioUnitario: 0,
      subtotal: 0,
      tipo: 'servicio'
    }]);
    onClose();
  };

  const tiposFactura: SelectOption[] = [
    { value: 'servicios', label: 'Servicios' },
    { value: 'productos', label: 'Productos' },
    { value: 'recurrente', label: 'Recurrente' },
    { value: 'paquetes', label: 'Paquetes' },
    { value: 'eventos', label: 'Eventos' },
    { value: 'adicionales', label: 'Adicionales' },
    { value: 'correccion', label: 'Corrección' }
  ];

  useEffect(() => {
    cargarPlantillas();
  }, []);

  const cargarPlantillas = async () => {
    try {
      const plantillasData = await plantillasAPI.obtenerPlantillas();
      setPlantillas(plantillasData);
    } catch (error) {
      console.error('Error cargando plantillas:', error);
    }
  };

  const agregarPlantilla = async (plantilla: PlantillaServicio) => {
    // Incrementar uso de la plantilla
    await plantillasAPI.incrementarUso(plantilla.id);

    // Agregar como nuevo ítem (usar nombre de la plantilla como descripción)
    const nuevoItem: ItemFactura = {
      id: Date.now().toString(),
      descripcion: plantilla.nombre,
      cantidad: 1,
      precioUnitario: plantilla.precio,
      subtotal: plantilla.precio,
      tipo: plantilla.tipo,
    };

    setItems([...items, nuevoItem]);
    setMostrarPlantillas(false);
  };

  const calcularSubtotal = (item: ItemFactura): number => {
    const subtotal = item.cantidad * item.precioUnitario;
    const descuento = item.descuento ? (subtotal * item.descuento) / 100 : 0;
    return subtotal - descuento;
  };

  const calcularDescuento = (subtotal: number): number => {
    if (!tipoDescuento) return 0;

    if (tipoDescuento === 'motivo_predefinido') {
      // Motivos predefinidos con porcentajes
      const porcentajes: Record<MotivoDescuento, number> = {
        referido: 10,
        promocion: 15,
        fidelidad: 20,
        primera_compra: 25,
        volumen: 5,
        otro: 0
      };
      const porcentaje = porcentajes[motivoDescuento] || 0;
      return (subtotal * porcentaje) / 100;
    }

    if (!valorDescuento) return 0;
    const valor = parseFloat(valorDescuento);
    if (isNaN(valor) || valor <= 0) return 0;

    if (tipoDescuento === 'porcentaje') {
      // Porcentaje: máximo 100%
      const porcentaje = Math.min(valor, 100);
      return (subtotal * porcentaje) / 100;
    } else if (tipoDescuento === 'monto_fijo') {
      // Monto fijo: no puede ser mayor al subtotal
      return Math.min(valor, subtotal);
    }

    return 0;
  };

  const calcularTotales = () => {
    const subtotal = items.reduce((sum, item) => sum + calcularSubtotal(item), 0);
    const descuentos = calcularDescuento(subtotal);
    const subtotalConDescuento = subtotal - descuentos;
    const impuestos = subtotalConDescuento * 0.19; // IVA 19% sobre el subtotal con descuento
    const total = subtotalConDescuento + impuestos;
    return { subtotal, descuentos, impuestos, total };
  };

  const actualizarItem = (id: string, campo: keyof ItemFactura, valor: any) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const itemActualizado = { ...item, [campo]: valor };
        if (campo === 'cantidad' || campo === 'precioUnitario' || campo === 'descuento') {
          itemActualizado.subtotal = calcularSubtotal(itemActualizado);
        }
        return itemActualizado;
      }
      return item;
    }));
  };

  const agregarItem = () => {
    setItems([
      ...items,
      {
        id: Date.now().toString(),
        descripcion: '',
        cantidad: 1,
        precioUnitario: 0,
        subtotal: 0,
        tipo: tipo === 'productos' ? 'producto' : 'servicio'
      }
    ]);
  };

  const eliminarItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    
    if (!clienteNombre || !clienteEmail) {
      alert('Debe completar al menos el nombre y email del cliente');
      return;
    }

    if (items.some(item => !item.descripcion || item.precioUnitario <= 0)) {
      alert('Debe completar todos los ítems con descripción y precio válidos');
      return;
    }

    setLoading(true);
    try {
      const { subtotal, descuentos, impuestos, total } = calcularTotales();
      
      // Calcular descuento de información
      const descuentoInfo: DescuentoFactura | undefined = tipoDescuento ? {
        tipo: tipoDescuento as TipoDescuento,
        valor: tipoDescuento !== 'motivo_predefinido' ? parseFloat(valorDescuento) || undefined : undefined,
        motivo: tipoDescuento === 'motivo_predefinido' ? motivoDescuento : undefined,
        descripcion: descripcionDescuento || undefined
      } : undefined;

      const nuevaFactura: Omit<Factura, 'id' | 'numeroFactura' | 'fechaCreacion' | 'fechaActualizacion'> = {
        fechaEmision: new Date(fechaEmision),
        fechaVencimiento: new Date(fechaVencimiento),
        cliente: {
          id: 'cliente-nuevo',
          nombre: clienteNombre,
          email: clienteEmail,
          nit: clienteNit || undefined,
          direccion: clienteDireccion || undefined
        },
        items: items.map(item => ({
          ...item,
          impuesto: item.impuesto || 19
        })),
        subtotal,
        descuentos,
        descuento: descuentoInfo,
        impuestos,
        total,
        tipo,
        estado: 'pendiente',
        pagos: [],
        montoPendiente: total,
        recordatoriosEnviados: 0,
        notas: notas || undefined,
        notasInternas: notasInternas || undefined,
        usuarioCreacion: 'usuario-actual'
      };

      await facturasAPI.crearFactura(nuevaFactura);
      handleClose();
      onFacturaCreada();
    } catch (error) {
      console.error('Error al crear factura:', error);
      alert('Error al crear la factura');
    } finally {
      setLoading(false);
    }
  };

  const { subtotal, descuentos, impuestos, total } = calcularTotales();

  const tiposDescuento: SelectOption[] = [
    { value: '', label: 'Sin descuento' },
    { value: 'porcentaje', label: 'Porcentaje (%)' },
    { value: 'monto_fijo', label: 'Monto fijo' },
    { value: 'motivo_predefinido', label: 'Motivo predefinido' }
  ];

  const motivosDescuento: SelectOption[] = [
    { value: 'referido', label: 'Referido' },
    { value: 'promocion', label: 'Promoción' },
    { value: 'fidelidad', label: 'Fidelidad' },
    { value: 'primera_compra', label: 'Primera compra' },
    { value: 'volumen', label: 'Volumen' },
    { value: 'otro', label: 'Otro' }
  ];

  return (
    <Modal
      isOpen={true}
      onClose={handleClose}
      title="Crear Nueva Factura"
      size="xl"
      footer={
        <div className="flex gap-3">
          <Button variant="secondary" onClick={handleClose}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleSubmit} loading={loading}>
            Crear Factura
          </Button>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Información del Cliente */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-gray-900">
            Información del Cliente
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Nombre del Cliente *"
              value={clienteNombre}
              onChange={(e) => setClienteNombre(e.target.value)}
              required
            />
            <Input
              label="Email *"
              type="email"
              value={clienteEmail}
              onChange={(e) => setClienteEmail(e.target.value)}
              required
            />
            <Input
              label="NIT (Opcional)"
              value={clienteNit}
              onChange={(e) => setClienteNit(e.target.value)}
            />
            <Input
              label="Dirección (Opcional)"
              value={clienteDireccion}
              onChange={(e) => setClienteDireccion(e.target.value)}
            />
          </div>
        </div>

        {/* Información de la Factura */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-gray-900">
            Información de la Factura
          </h3>
          <div className="grid grid-cols-3 gap-4">
            <Input
              label="Fecha Emisión"
              type="date"
              value={fechaEmision}
              onChange={(e) => setFechaEmision(e.target.value)}
              required
            />
            <Input
              label="Fecha Vencimiento"
              type="date"
              value={fechaVencimiento}
              onChange={(e) => setFechaVencimiento(e.target.value)}
              required
            />
            <Select
              label="Tipo de Factura"
              options={tiposFactura}
              value={tipo}
              onChange={(e) => setTipo(e.target.value as TipoFactura)}
            />
          </div>
        </div>

        {/* Ítems */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold text-gray-900">
              Ítems de la Factura
            </h3>
            <div className="flex gap-2">
              <Button 
                type="button" 
                variant="secondary" 
                size="sm" 
                onClick={() => setMostrarPlantillas(!mostrarPlantillas)}
                className="flex items-center gap-2"
              >
                <Zap className="w-4 h-4" />
                Plantillas
              </Button>
              <Button type="button" variant="secondary" size="sm" onClick={agregarItem}>
                <Plus className="w-4 h-4 mr-2" />
                Agregar Ítem
              </Button>
            </div>
          </div>

          {/* Panel de plantillas */}
          {mostrarPlantillas && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-3">Servicios Comunes</h4>
              <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                {plantillas.map((plantilla) => (
                  <button
                    key={plantilla.id}
                    onClick={() => agregarPlantilla(plantilla)}
                    className="p-3 bg-white border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-left"
                  >
                    <div className="font-medium text-sm text-gray-900">{plantilla.nombre}</div>
                    <div className="text-xs text-gray-600 mt-1">{plantilla.descripcion}</div>
                    <div className="text-sm font-semibold text-blue-600 mt-1">
                      {new Intl.NumberFormat('es-CO', {
                        style: 'currency',
                        currency: 'COP',
                        minimumFractionDigits: 0,
                      }).format(plantilla.precio)}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
          
          <div className="space-y-3">
            {items.map((item, index) => (
              <div key={item.id} className="p-4 border border-gray-200 rounded-lg space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Ítem {index + 1}</span>
                  {items.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => eliminarItem(item.id)}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  )}
                </div>
                <div className="grid grid-cols-12 gap-3">
                  <div className="col-span-6">
                    <Input
                      label="Descripción"
                      value={item.descripcion}
                      onChange={(e) => actualizarItem(item.id, 'descripcion', e.target.value)}
                      required
                    />
                  </div>
                  <div className="col-span-2">
                    <Input
                      label="Cantidad"
                      type="number"
                      min="1"
                      value={item.cantidad}
                      onChange={(e) => actualizarItem(item.id, 'cantidad', parseInt(e.target.value) || 1)}
                      required
                    />
                  </div>
                  <div className="col-span-2">
                    <Input
                      label="Precio Unitario"
                      type="number"
                      min="0"
                      value={item.precioUnitario}
                      onChange={(e) => actualizarItem(item.id, 'precioUnitario', parseFloat(e.target.value) || 0)}
                      required
                    />
                  </div>
                  <div className="col-span-2">
                    <Input
                      label="Descuento (%)"
                      type="number"
                      min="0"
                      max="100"
                      value={item.descuento || 0}
                      onChange={(e) => actualizarItem(item.id, 'descuento', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-medium">
                    Subtotal: {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(item.subtotal)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Descuentos */}
        <div className="space-y-4 border-t pt-4">
          <div className="flex items-center gap-2">
            <Tag className="w-5 h-5 text-gray-600" />
            <h3 className="text-xl font-bold text-gray-900">
              Descuentos
            </h3>
          </div>
          <div className="space-y-4">
            <Select
              label="Tipo de Descuento"
              options={tiposDescuento}
              value={tipoDescuento}
              onChange={(e) => {
                setTipoDescuento(e.target.value as TipoDescuento | '');
                setValorDescuento('');
                setDescripcionDescuento('');
              }}
            />
            {tipoDescuento && (
              <div className="grid grid-cols-2 gap-4">
                {tipoDescuento === 'porcentaje' && (
                  <Input
                    label="Porcentaje (%)"
                    type="number"
                    min="0"
                    max="100"
                    value={valorDescuento}
                    onChange={(e) => setValorDescuento(e.target.value)}
                    placeholder="Ej: 15"
                  />
                )}
                {tipoDescuento === 'monto_fijo' && (
                  <Input
                    label="Monto Fijo (COP)"
                    type="number"
                    min="0"
                    value={valorDescuento}
                    onChange={(e) => setValorDescuento(e.target.value)}
                    placeholder="Ej: 50000"
                  />
                )}
                {tipoDescuento === 'motivo_predefinido' && (
                  <>
                    <Select
                      label="Motivo del Descuento"
                      options={motivosDescuento}
                      value={motivoDescuento}
                      onChange={(e) => setMotivoDescuento(e.target.value as MotivoDescuento)}
                    />
                    <Input
                      label="Descripción (Opcional)"
                      value={descripcionDescuento}
                      onChange={(e) => setDescripcionDescuento(e.target.value)}
                      placeholder="Descripción personalizada"
                    />
                  </>
                )}
              </div>
            )}
          </div>
          {tipoDescuento && descuentos > 0 && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-green-800">Descuento aplicado:</span>
                <span className="text-lg font-bold text-green-600">
                  -{new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(descuentos)}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Totales */}
        <div className="border-t pt-4 space-y-2">
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span className="font-medium">
              {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(subtotal)}
            </span>
          </div>
          {descuentos > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Descuento:</span>
              <span className="font-medium">
                -{new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(descuentos)}
              </span>
            </div>
          )}
          <div className="flex justify-between">
            <span>Subtotal con descuento:</span>
            <span className="font-medium">
              {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(subtotal - descuentos)}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Impuestos (19%):</span>
            <span className="font-medium">
              {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(impuestos)}
            </span>
          </div>
          <div className="flex justify-between text-lg font-bold border-t pt-2">
            <span>Total:</span>
            <span>
              {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(total)}
            </span>
          </div>
        </div>

        {/* Notas Públicas */}
        <Textarea
          label="Notas (Opcional - Visibles para el cliente)"
          value={notas}
          onChange={(e) => setNotas(e.target.value)}
          rows={3}
          helperText="Estas notas serán visibles para el cliente en la factura"
        />

        {/* Notas Internas */}
        <div className="border-t pt-4">
          <Textarea
            label="Notas Internas (Opcional - Solo para ti)"
            value={notasInternas}
            onChange={(e) => setNotasInternas(e.target.value)}
            rows={3}
            helperText="Estas notas son privadas y solo visibles para ti. Útiles para recordar acuerdos de pago o situaciones especiales."
            className="border-amber-200 focus:border-amber-400"
          />
          <div className="mt-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-xs text-amber-800">
              <strong>💡 Tip:</strong> Usa las notas internas para recordar detalles sobre acuerdos de pago, situaciones especiales o cualquier información que no deba ser visible para el cliente.
            </p>
          </div>
        </div>
      </form>
    </Modal>
  );
};

