import React, { useState, useEffect } from 'react';
import { Card, Button, Input, Select, Modal, Badge, Table } from '../../../components/componentsreutilizables';
import { BonoRegaloB2B, CrearBonoRegaloB2BRequest, Producto } from '../types';
import { crearBonoRegaloB2B, getBonosB2B, actualizarEstadoBonoB2B } from '../api/bonosB2B';
import { getProductos } from '../api/productos';
import { Building2, Gift, Plus, Calendar, Mail, Phone, FileText, CheckCircle, XCircle, Clock, Download, Eye, Info } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';

interface GestorBonosRegaloB2BProps {
  entrenadorId?: string;
}

export const GestorBonosRegaloB2B: React.FC<GestorBonosRegaloB2BProps> = ({
  entrenadorId,
}) => {
  const { user } = useAuth();
  const [bonosB2B, setBonosB2B] = useState<BonoRegaloB2B[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [cargando, setCargando] = useState(false);
  const [mostrarModalCrear, setMostrarModalCrear] = useState(false);
  const [bonoSeleccionado, setBonoSeleccionado] = useState<BonoRegaloB2B | null>(null);
  const [mostrarDetalle, setMostrarDetalle] = useState(false);

  const [formulario, setFormulario] = useState<CrearBonoRegaloB2BRequest>({
    empresaNombre: '',
    empresaEmail: '',
    empresaTelefono: '',
    empresaCIF: '',
    productoId: '',
    cantidadBonos: 1,
    valorPorBono: undefined,
    fechaVencimiento: new Date(new Date().setMonth(new Date().getMonth() + 6)),
    personalizacion: {
      mensajePersonalizado: '',
      colorPersonalizado: '#3B82F6',
      descripcionPersonalizada: '',
    },
  });

  const [errores, setErrores] = useState<Record<string, string>>({});
  const [creando, setCreando] = useState(false);

  useEffect(() => {
    cargarDatos();
  }, [entrenadorId]);

  const cargarDatos = async () => {
    setCargando(true);
    try {
      const idEntrenador = entrenadorId || user?.id;
      const [bonos, productosData] = await Promise.all([
        getBonosB2B(idEntrenador || ''),
        getProductos(),
      ]);
      setBonosB2B(bonos);
      setProductos(productosData.filter((p) => p.metadatos?.esBono || p.tipo === 'servicio'));
    } catch (error) {
      console.error('Error cargando datos:', error);
    } finally {
      setCargando(false);
    }
  };

  const handleCrearBono = async () => {
    // Validar formulario
    const nuevosErrores: Record<string, string> = {};

    if (!formulario.empresaNombre.trim()) {
      nuevosErrores.empresaNombre = 'El nombre de la empresa es obligatorio';
    }

    if (!formulario.empresaEmail.trim()) {
      nuevosErrores.empresaEmail = 'El email es obligatorio';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formulario.empresaEmail)) {
      nuevosErrores.empresaEmail = 'Email inválido';
    }

    if (!formulario.productoId) {
      nuevosErrores.productoId = 'Debes seleccionar un producto';
    }

    if (formulario.cantidadBonos < 1) {
      nuevosErrores.cantidadBonos = 'La cantidad debe ser al menos 1';
    }

    if (formulario.fechaVencimiento <= new Date()) {
      nuevosErrores.fechaVencimiento = 'La fecha de vencimiento debe ser futura';
    }

    setErrores(nuevosErrores);

    if (Object.keys(nuevosErrores).length > 0) {
      return;
    }

    setCreando(true);
    try {
      const idEntrenador = entrenadorId || user?.id;
      const nuevoBono = await crearBonoRegaloB2B(formulario, idEntrenador || '');
      setBonosB2B([...bonosB2B, nuevoBono]);
      setMostrarModalCrear(false);
      resetFormulario();
    } catch (error) {
      console.error('Error creando bono B2B:', error);
      setErrores({ general: 'Error al crear el bono. Intenta de nuevo.' });
    } finally {
      setCreando(false);
    }
  };

  const resetFormulario = () => {
    setFormulario({
      empresaNombre: '',
      empresaEmail: '',
      empresaTelefono: '',
      empresaCIF: '',
      productoId: '',
      cantidadBonos: 1,
      valorPorBono: undefined,
      fechaVencimiento: new Date(new Date().setMonth(new Date().getMonth() + 6)),
      personalizacion: {
        mensajePersonalizado: '',
        colorPersonalizado: '#3B82F6',
        descripcionPersonalizada: '',
      },
    });
    setErrores({});
  };

  const getEstadoBadge = (estado: BonoRegaloB2B['estado']) => {
    switch (estado) {
      case 'generado':
        return 'success';
      case 'enviado':
        return 'info';
      case 'utilizado':
        return 'warning';
      case 'vencido':
        return 'error';
      default:
        return 'info';
    }
  };

  const productoSeleccionado = productos.find((p) => p.id === formulario.productoId);

  const columnas = [
    {
      key: 'empresa',
      label: 'Empresa',
      render: (_: any, bono: BonoRegaloB2B) => (
        <div>
          <p className="text-sm font-medium text-gray-900">{bono.empresaNombre}</p>
          <p className="text-xs text-gray-600">{bono.empresaEmail}</p>
        </div>
      ),
    },
    {
      key: 'producto',
      label: 'Producto',
      render: (_: any, bono: BonoRegaloB2B) => (
        <p className="text-sm text-gray-900">{bono.producto.nombre}</p>
      ),
    },
    {
      key: 'cantidad',
      label: 'Cantidad',
      render: (_: any, bono: BonoRegaloB2B) => (
        <p className="text-sm text-gray-900">{bono.cantidadBonos} bonos</p>
      ),
    },
    {
      key: 'valor',
      label: 'Valor Total',
      render: (_: any, bono: BonoRegaloB2B) => (
        <p className="text-sm font-semibold text-gray-900">
          €{(bono.valorPorBono * bono.cantidadBonos).toFixed(2)}
        </p>
      ),
    },
    {
      key: 'estado',
      label: 'Estado',
      render: (_: any, bono: BonoRegaloB2B) => (
        <Badge variant={getEstadoBadge(bono.estado) as any}>
          {bono.estado.charAt(0).toUpperCase() + bono.estado.slice(1)}
        </Badge>
      ),
    },
    {
      key: 'acciones',
      label: 'Acciones',
      render: (_: any, bono: BonoRegaloB2B) => (
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setBonoSeleccionado(bono);
              setMostrarDetalle(true);
            }}
          >
            <Eye size={16} />
          </Button>
        </div>
      ),
      align: 'right' as const,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Bonos Regalo B2B</h2>
          <p className="text-sm text-gray-600 mt-1">
            Crea bonos regalo personalizados para empresas y accede al mercado B2B
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => setMostrarModalCrear(true)}
          className="flex items-center gap-2"
        >
          <Plus size={20} />
          Crear Bono B2B
        </Button>
      </div>

      {/* Tabla de bonos */}
      <Card className="p-0 bg-white shadow-sm">
        <Table
          data={bonosB2B}
          columns={columnas}
          loading={cargando}
          emptyMessage="No hay bonos B2B creados. Crea tu primer bono para empresas."
        />
      </Card>

      {/* Modal crear bono */}
      <Modal
        isOpen={mostrarModalCrear}
        onClose={() => {
          setMostrarModalCrear(false);
          resetFormulario();
        }}
        title="Crear Bono Regalo B2B"
        size="lg"
        footer={
          <div className="flex gap-3 justify-end">
            <Button
              variant="secondary"
              onClick={() => {
                setMostrarModalCrear(false);
                resetFormulario();
              }}
            >
              Cancelar
            </Button>
            <Button variant="primary" onClick={handleCrearBono} loading={creando}>
              Crear Bonos
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          {errores.general && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{errores.general}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Nombre de la Empresa"
              value={formulario.empresaNombre}
              onChange={(e) =>
                setFormulario({ ...formulario, empresaNombre: e.target.value })
              }
              error={errores.empresaNombre}
              required
              icon={<Building2 size={16} />}
            />

            <Input
              label="Email de la Empresa"
              type="email"
              value={formulario.empresaEmail}
              onChange={(e) =>
                setFormulario({ ...formulario, empresaEmail: e.target.value })
              }
              error={errores.empresaEmail}
              required
              icon={<Mail size={16} />}
            />

            <Input
              label="Teléfono (Opcional)"
              type="tel"
              value={formulario.empresaTelefono || ''}
              onChange={(e) =>
                setFormulario({ ...formulario, empresaTelefono: e.target.value })
              }
              icon={<Phone size={16} />}
            />

            <Input
              label="CIF/NIF (Opcional)"
              value={formulario.empresaCIF || ''}
              onChange={(e) =>
                setFormulario({ ...formulario, empresaCIF: e.target.value })
              }
              icon={<FileText size={16} />}
            />
          </div>

          <Select
            label="Producto/Servicio"
            options={productos.map((p) => ({
              value: p.id,
              label: `${p.nombre} - €${p.precio.toFixed(2)}`,
            }))}
            value={formulario.productoId}
            onChange={(e) => {
              const producto = productos.find((p) => p.id === e.target.value);
              setFormulario({
                ...formulario,
                productoId: e.target.value,
                valorPorBono: producto?.precio,
              });
            }}
            error={errores.productoId}
            placeholder="Selecciona un producto"
            required
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Cantidad de Bonos"
              type="number"
              min="1"
              value={formulario.cantidadBonos}
              onChange={(e) =>
                setFormulario({
                  ...formulario,
                  cantidadBonos: parseInt(e.target.value) || 1,
                })
              }
              error={errores.cantidadBonos}
              required
            />

            <Input
              label="Valor por Bono (€)"
              type="number"
              min="0"
              step="0.01"
              value={formulario.valorPorBono || productoSeleccionado?.precio || ''}
              onChange={(e) =>
                setFormulario({
                  ...formulario,
                  valorPorBono: parseFloat(e.target.value) || undefined,
                })
              }
              placeholder={productoSeleccionado?.precio.toString() || '0.00'}
            />
          </div>

          <Input
            label="Fecha de Vencimiento"
            type="date"
            value={formulario.fechaVencimiento.toISOString().split('T')[0]}
            onChange={(e) =>
              setFormulario({
                ...formulario,
                fechaVencimiento: e.target.value ? new Date(e.target.value) : new Date(),
              })
            }
            error={errores.fechaVencimiento}
            required
            icon={<Calendar size={16} />}
          />

          <div className="space-y-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h3 className="font-semibold text-gray-900">Personalización (Opcional)</h3>

            <Input
              label="Mensaje Personalizado"
              value={formulario.personalizacion?.mensajePersonalizado || ''}
              onChange={(e) =>
                setFormulario({
                  ...formulario,
                  personalizacion: {
                    ...formulario.personalizacion,
                    mensajePersonalizado: e.target.value,
                  },
                })
              }
              placeholder="Ej: Feliz Navidad de parte de [Empresa]"
            />

            <Input
              label="Color Personalizado"
              type="color"
              value={formulario.personalizacion?.colorPersonalizado || '#3B82F6'}
              onChange={(e) =>
                setFormulario({
                  ...formulario,
                  personalizacion: {
                    ...formulario.personalizacion,
                    colorPersonalizado: e.target.value,
                  },
                })
              }
            />

            <Input
              label="Descripción Personalizada"
              value={formulario.personalizacion?.descripcionPersonalizada || ''}
              onChange={(e) =>
                setFormulario({
                  ...formulario,
                  personalizacion: {
                    ...formulario.personalizacion,
                    descripcionPersonalizada: e.target.value,
                  },
                })
              }
              placeholder="Descripción adicional para los bonos"
            />
          </div>

          {productoSeleccionado && (
            <Card className="p-4 bg-blue-50 border border-blue-200">
              <div className="flex items-start gap-2">
                <Info size={16} className="text-blue-600 mt-0.5" />
                <div className="text-sm text-gray-700">
                  <p className="font-medium mb-1">Resumen:</p>
                  <ul className="list-disc list-inside space-y-1 text-gray-600">
                    <li>
                      {formulario.cantidadBonos} bono(s) de €
                      {(formulario.valorPorBono || productoSeleccionado.precio).toFixed(2)} cada uno
                    </li>
                    <li>
                      Total: €
                      {(
                        (formulario.valorPorBono || productoSeleccionado.precio) *
                        formulario.cantidadBonos
                      ).toFixed(2)}
                    </li>
                    <li>
                      Vencimiento: {new Intl.DateTimeFormat('es-ES', { day: '2-digit', month: 'long', year: 'numeric' }).format(formulario.fechaVencimiento)}
                    </li>
                  </ul>
                </div>
              </div>
            </Card>
          )}
        </div>
      </Modal>

      {/* Modal detalle bono */}
      <Modal
        isOpen={mostrarDetalle}
        onClose={() => {
          setMostrarDetalle(false);
          setBonoSeleccionado(null);
        }}
        title={`Bono B2B - ${bonoSeleccionado?.empresaNombre}`}
        size="lg"
        footer={
          <div className="flex gap-3 justify-end">
            <Button
              variant="secondary"
              onClick={() => {
                setMostrarDetalle(false);
                setBonoSeleccionado(null);
              }}
            >
              Cerrar
            </Button>
            {bonoSeleccionado?.codigosBonos && (
              <Button
                variant="primary"
                onClick={() => {
                  // Descargar códigos
                  const contenido = bonoSeleccionado.codigosBonos?.join('\n') || '';
                  const blob = new Blob([contenido], { type: 'text/plain' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `bonos-${bonoSeleccionado.empresaNombre}-${bonoSeleccionado.id}.txt`;
                  a.click();
                }}
              >
                <Download size={16} className="mr-2" />
                Descargar Códigos
              </Button>
            )}
          </div>
        }
      >
        {bonoSeleccionado && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-600">Empresa</p>
                <p className="text-sm font-medium text-gray-900">
                  {bonoSeleccionado.empresaNombre}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600">Email</p>
                <p className="text-sm font-medium text-gray-900">
                  {bonoSeleccionado.empresaEmail}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600">Producto</p>
                <p className="text-sm font-medium text-gray-900">
                  {bonoSeleccionado.producto.nombre}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600">Cantidad</p>
                <p className="text-sm font-medium text-gray-900">
                  {bonoSeleccionado.cantidadBonos} bonos
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600">Valor Total</p>
                <p className="text-sm font-semibold text-gray-900">
                  €{(bonoSeleccionado.valorPorBono * bonoSeleccionado.cantidadBonos).toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600">Estado</p>
                <Badge variant={getEstadoBadge(bonoSeleccionado.estado) as any}>
                  {bonoSeleccionado.estado.charAt(0).toUpperCase() + bonoSeleccionado.estado.slice(1)}
                </Badge>
              </div>
            </div>

            {bonoSeleccionado.codigosBonos && bonoSeleccionado.codigosBonos.length > 0 && (
              <div>
                <p className="text-sm font-medium text-gray-900 mb-2">Códigos de Bonos:</p>
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 max-h-60 overflow-y-auto">
                  <div className="space-y-1">
                    {bonoSeleccionado.codigosBonos.map((codigo, index) => (
                      <p key={index} className="text-xs font-mono text-gray-700">
                        {codigo}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

