import React, { useState } from 'react';
import { Modal, Button, Input, Select, SelectOption, Textarea } from '../../../components/componentsreutilizables';
import { Factura, ItemFactura, TipoFactura } from '../types';
import { facturasAPI } from '../api/facturas';
import { Plus, Trash2 } from 'lucide-react';

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

  const tiposFactura: SelectOption[] = [
    { value: 'servicios', label: 'Servicios' },
    { value: 'productos', label: 'Productos' },
    { value: 'recurrente', label: 'Recurrente' },
    { value: 'paquetes', label: 'Paquetes' },
    { value: 'eventos', label: 'Eventos' },
    { value: 'adicionales', label: 'Adicionales' },
    { value: 'correccion', label: 'Corrección' }
  ];

  const calcularSubtotal = (item: ItemFactura): number => {
    const subtotal = item.cantidad * item.precioUnitario;
    const descuento = item.descuento ? (subtotal * item.descuento) / 100 : 0;
    return subtotal - descuento;
  };

  const calcularTotales = () => {
    const subtotal = items.reduce((sum, item) => sum + calcularSubtotal(item), 0);
    const impuestos = subtotal * 0.19; // IVA 19%
    const total = subtotal + impuestos;
    return { subtotal, impuestos, total };
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
      const { subtotal, impuestos, total } = calcularTotales();
      const descuentos = items.reduce((sum, item) => {
        const itemSubtotal = item.cantidad * item.precioUnitario;
        return sum + (item.descuento ? (itemSubtotal * item.descuento) / 100 : 0);
      }, 0);

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
        impuestos,
        total,
        tipo,
        estado: 'pendiente',
        pagos: [],
        montoPendiente: total,
        recordatoriosEnviados: 0,
        notas: notas || undefined,
        usuarioCreacion: 'usuario-actual'
      };

      await facturasAPI.crearFactura(nuevaFactura);
      onFacturaCreada();
    } catch (error) {
      console.error('Error al crear factura:', error);
      alert('Error al crear la factura');
    } finally {
      setLoading(false);
    }
  };

  const { subtotal, impuestos, total } = calcularTotales();

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title="Crear Nueva Factura"
      size="xl"
      footer={
        <div className="flex gap-3">
          <Button variant="secondary" onClick={onClose}>
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
            <Button type="button" variant="secondary" size="sm" onClick={agregarItem}>
              <Plus className="w-4 h-4 mr-2" />
              Agregar Ítem
            </Button>
          </div>
          
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

        {/* Totales */}
        <div className="border-t pt-4 space-y-2">
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span className="font-medium">
              {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(subtotal)}
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

        {/* Notas */}
        <Textarea
          label="Notas (Opcional)"
          value={notas}
          onChange={(e) => setNotas(e.target.value)}
          rows={3}
        />
      </form>
    </Modal>
  );
};

