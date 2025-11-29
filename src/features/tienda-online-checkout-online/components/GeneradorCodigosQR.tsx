import React, { useState, useEffect } from 'react';
import { Card, Button, Input, Select, Modal, Badge, Table } from '../../../components/componentsreutilizables';
import { CodigoQR, Producto } from '../types';
import {
  crearCodigoQR,
  getCodigosQR,
  actualizarCodigoQR,
  eliminarCodigoQR,
} from '../api/codigosQR';
import { getProductos } from '../api/productos';
import { getEnlacesPagoEntrenador } from '../api/enlacesPago';
import { QrCode, Plus, Download, Trash2, Copy, Check, Eye, EyeOff, ExternalLink, Package, Gift, Link2 } from 'lucide-react';

interface GeneradorCodigosQRProps {
  entrenadorId: string;
  rol: 'entrenador' | 'gimnasio';
}

export const GeneradorCodigosQR: React.FC<GeneradorCodigosQRProps> = ({
  entrenadorId,
  rol,
}) => {
  const [codigosQR, setCodigosQR] = useState<CodigoQR[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [cargando, setCargando] = useState(false);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [codigoSeleccionado, setCodigoSeleccionado] = useState<CodigoQR | null>(null);
  const [copiado, setCopiado] = useState<string | null>(null);

  // Formulario
  const [tipoQR, setTipoQR] = useState<'producto' | 'bono' | 'enlace_pago'>('producto');
  const [servicioSeleccionado, setServicioSeleccionado] = useState<string>('');
  const [bonoSeleccionado, setBonoSeleccionado] = useState<string>('');
  const [enlacePagoSeleccionado, setEnlacePagoSeleccionado] = useState<string>('');
  const [descripcion, setDescripcion] = useState<string>('');
  const [creando, setCreando] = useState(false);
  const [enlacesPago, setEnlacesPago] = useState<any[]>([]);

  useEffect(() => {
    cargarCodigosQR();
    cargarProductos();
    cargarEnlacesPago();
  }, [entrenadorId]);

  const cargarCodigosQR = async () => {
    setCargando(true);
    try {
      const data = await getCodigosQR(entrenadorId);
      setCodigosQR(data);
    } catch (error) {
      console.error('Error cargando códigos QR:', error);
    } finally {
      setCargando(false);
    }
  };

  const cargarProductos = async () => {
    try {
      const data = await getProductos(rol);
      // Todos los productos disponibles
      setProductos(data.filter((p) => p.disponible));
    } catch (error) {
      console.error('Error cargando productos:', error);
    }
  };

  const cargarEnlacesPago = async () => {
    try {
      const data = await getEnlacesPagoEntrenador(entrenadorId);
      setEnlacesPago(data);
    } catch (error) {
      console.error('Error cargando enlaces de pago:', error);
    }
  };

  const handleCrearCodigoQR = async () => {
    let requestData: any = {
      tipo: tipoQR,
      entrenadorId,
      descripcion: descripcion.trim() || undefined,
    };

    if (tipoQR === 'producto' && !servicioSeleccionado) {
      alert('Por favor, selecciona un producto o servicio');
      return;
    }
    if (tipoQR === 'producto') {
      requestData.servicioId = servicioSeleccionado;
    } else if (tipoQR === 'bono') {
      if (!bonoSeleccionado) {
        alert('Por favor, selecciona un bono');
        return;
      }
      requestData.bonoId = bonoSeleccionado;
    } else if (tipoQR === 'enlace_pago') {
      if (!enlacePagoSeleccionado) {
        alert('Por favor, selecciona un enlace de pago');
        return;
      }
      requestData.enlacePagoId = enlacePagoSeleccionado;
    }

    setCreando(true);
    try {
      const nuevoCodigo = await crearCodigoQR(requestData);

      setCodigosQR([nuevoCodigo, ...codigosQR]);
      setMostrarModal(false);
      setServicioSeleccionado('');
      setBonoSeleccionado('');
      setEnlacePagoSeleccionado('');
      setDescripcion('');
      setTipoQR('producto');
    } catch (error: any) {
      alert(error.message || 'Error al crear el código QR');
    } finally {
      setCreando(false);
    }
  };

  const handleEliminar = async (id: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este código QR?')) {
      return;
    }

    try {
      await eliminarCodigoQR(id);
      setCodigosQR(codigosQR.filter((c) => c.id !== id));
    } catch (error) {
      console.error('Error eliminando código QR:', error);
      alert('Error al eliminar el código QR');
    }
  };

  const handleCopiarURL = async (url: string, id: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiado(id);
      setTimeout(() => setCopiado(null), 2000);
    } catch (error) {
      console.error('Error copiando URL:', error);
    }
  };

  const handleDescargarQR = (codigo: CodigoQR) => {
    if (!codigo.imagenQR) return;

    // Crear un enlace temporal para descargar
    const link = document.createElement('a');
    link.href = codigo.imagenQR;
    link.download = `QR-${codigo.servicio.nombre.replace(/\s+/g, '-')}-${codigo.token}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleToggleActivo = async (codigo: CodigoQR) => {
    try {
      const actualizado = await actualizarCodigoQR(codigo.id, {
        activo: !codigo.activo,
      });
      setCodigosQR(codigosQR.map((c) => (c.id === codigo.id ? actualizado : c)));
    } catch (error) {
      console.error('Error actualizando código QR:', error);
    }
  };

  const abrirModalVer = (codigo: CodigoQR) => {
    setCodigoSeleccionado(codigo);
  };

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-white shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Códigos QR para Servicios</h2>
            <p className="text-gray-600 mt-1">
              Genera códigos QR para cada servicio y cobra en persona de forma profesional sin efectivo ni datáfonos
            </p>
          </div>
          <Button variant="primary" onClick={() => setMostrarModal(true)}>
            <Plus size={18} className="mr-2" />
            Generar Código QR
          </Button>
        </div>

        {cargando ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 mt-4">Cargando códigos QR...</p>
          </div>
        ) : codigosQR.length === 0 ? (
          <Card className="p-12 text-center bg-gray-50">
            <QrCode size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay códigos QR generados</h3>
            <p className="text-gray-600 mb-4">
              Genera tu primer código QR para permitir pagos rápidos en persona
            </p>
            <Button variant="primary" onClick={() => setMostrarModal(true)}>
              <Plus size={18} className="mr-2" />
              Generar Primer Código QR
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {codigosQR.map((codigo) => (
              <Card key={codigo.id} className="p-4 bg-white shadow-sm hover:shadow-md transition-shadow">
                <div className="space-y-4">
                  {/* Imagen QR */}
                  <div className="flex justify-center">
                    {codigo.imagenQR ? (
                      <img
                        src={codigo.imagenQR}
                        alt={`QR Code para ${codigo.servicio.nombre}`}
                        className="w-48 h-48 border border-gray-200 rounded-lg"
                      />
                    ) : (
                      <div className="w-48 h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                        <QrCode size={64} className="text-gray-400" />
                      </div>
                    )}
                  </div>

                  {/* Información del servicio */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">{codigo.servicio.nombre}</h3>
                    <p className="text-sm text-gray-600 mb-2">€{codigo.servicio.precio.toFixed(2)}</p>
                    {codigo.descripcion && (
                      <p className="text-xs text-gray-500">{codigo.descripcion}</p>
                    )}
                  </div>

                  {/* Estadísticas */}
                  <div className="flex items-center justify-between text-xs text-gray-600">
                    <span>Usos: {codigo.vecesUsado}</span>
                    <Badge variant={codigo.activo ? 'primary' : 'secondary'}>
                      {codigo.activo ? 'Activo' : 'Inactivo'}
                    </Badge>
                  </div>

                  {/* Acciones */}
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDescargarQR(codigo)}
                      className="flex-1"
                    >
                      <Download size={16} className="mr-1" />
                      Descargar
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopiarURL(codigo.url, codigo.id)}
                      className="flex-1"
                    >
                      {copiado === codigo.id ? (
                        <>
                          <Check size={16} className="mr-1" />
                          Copiado
                        </>
                      ) : (
                        <>
                          <Copy size={16} className="mr-1" />
                          Copiar URL
                        </>
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleToggleActivo(codigo)}
                    >
                      {codigo.activo ? (
                        <EyeOff size={16} />
                      ) : (
                        <Eye size={16} />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => abrirModalVer(codigo)}
                    >
                      <ExternalLink size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEliminar(codigo.id)}
                      className="text-red-500 hover:text-red-600"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </Card>

      {/* Modal para crear código QR */}
      <Modal
        isOpen={mostrarModal}
        onClose={() => {
          setMostrarModal(false);
          setServicioSeleccionado('');
          setDescripcion('');
        }}
        title="Generar Código QR"
        size="md"
        footer={
          <div className="flex gap-3 justify-end">
            <Button
              variant="secondary"
              onClick={() => {
                setMostrarModal(false);
                setServicioSeleccionado('');
                setDescripcion('');
              }}
            >
              Cancelar
            </Button>
            <Button
              variant="primary"
              onClick={handleCrearCodigoQR}
              loading={creando}
              disabled={
                (tipoQR === 'producto' && !servicioSeleccionado) ||
                (tipoQR === 'bono' && !bonoSeleccionado) ||
                (tipoQR === 'enlace_pago' && !enlacePagoSeleccionado)
              }
            >
              Generar Código QR
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <Select
            label="Tipo de Código QR"
            value={tipoQR}
            onChange={(value) => {
              setTipoQR(value as 'producto' | 'bono' | 'enlace_pago');
              setServicioSeleccionado('');
              setBonoSeleccionado('');
              setEnlacePagoSeleccionado('');
            }}
            options={[
              { value: 'producto', label: 'Producto/Servicio' },
              { value: 'bono', label: 'Bono' },
              { value: 'enlace_pago', label: 'Enlace de Pago' },
            ]}
            required
          />

          {tipoQR === 'producto' && (
            <Select
              label="Producto/Servicio"
              value={servicioSeleccionado}
              onChange={(value) => setServicioSeleccionado(value)}
              options={productos.map((p) => ({
                value: p.id,
                label: `${p.nombre} - €${p.precioBase.toFixed(2)}`,
              }))}
              placeholder="Selecciona un producto o servicio"
              required
            />
          )}

          {tipoQR === 'bono' && (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>Nota:</strong> Para generar un código QR de bono, primero debes crear el bono. 
                Esta funcionalidad estará disponible próximamente.
              </p>
              <Input
                label="ID del Bono (temporal)"
                value={bonoSeleccionado}
                onChange={(e) => setBonoSeleccionado(e.target.value)}
                placeholder="Ingresa el ID del bono"
                required
              />
            </div>
          )}

          {tipoQR === 'enlace_pago' && (
            <Select
              label="Enlace de Pago"
              value={enlacePagoSeleccionado}
              onChange={(value) => setEnlacePagoSeleccionado(value)}
              options={enlacesPago.map((e) => ({
                value: e.id,
                label: `${e.producto.nombre} - ${e.descripcion || 'Sin descripción'}`,
              }))}
              placeholder="Selecciona un enlace de pago"
              required
            />
          )}

          <Input
            label="Descripción (opcional)"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            placeholder="Ej: Código QR para sesiones presenciales"
          />

          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800 mb-2">
              <strong>Nota:</strong> El código QR generado permitirá a tus clientes acceder al contenido seleccionado
              escaneando el código con su teléfono. El código se puede descargar e imprimir para uso en persona.
            </p>
            <div className="flex items-center gap-2 text-xs text-blue-700 mt-2">
              {tipoQR === 'producto' && (
                <>
                  <Package size={14} />
                  <span>QR para producto/servicio</span>
                </>
              )}
              {tipoQR === 'bono' && (
                <>
                  <Gift size={14} />
                  <span>QR para bono</span>
                </>
              )}
              {tipoQR === 'enlace_pago' && (
                <>
                  <Link2 size={14} />
                  <span>QR para enlace de pago</span>
                </>
              )}
            </div>
          </div>
        </div>
      </Modal>

      {/* Modal para ver código QR completo */}
      <Modal
        isOpen={!!codigoSeleccionado}
        onClose={() => setCodigoSeleccionado(null)}
        title={`Código QR - ${codigoSeleccionado?.servicio.nombre}`}
        size="lg"
        footer={
          <div className="flex gap-3 justify-end">
            <Button
              variant="secondary"
              onClick={() => setCodigoSeleccionado(null)}
            >
              Cerrar
            </Button>
            {codigoSeleccionado && (
              <>
                <Button
                  variant="primary"
                  onClick={() => handleDescargarQR(codigoSeleccionado)}
                >
                  <Download size={16} className="mr-2" />
                  Descargar QR
                </Button>
                <Button
                  variant="primary"
                  onClick={() => handleCopiarURL(codigoSeleccionado.url, codigoSeleccionado.id)}
                >
                  {copiado === codigoSeleccionado.id ? (
                    <>
                      <Check size={16} className="mr-2" />
                      URL Copiada
                    </>
                  ) : (
                    <>
                      <Copy size={16} className="mr-2" />
                      Copiar URL
                    </>
                  )}
                </Button>
              </>
            )}
          </div>
        }
      >
        {codigoSeleccionado && (
          <div className="space-y-6">
            <div className="flex justify-center">
              {codigoSeleccionado.imagenQR ? (
                <img
                  src={codigoSeleccionado.imagenQR}
                  alt={`QR Code para ${codigoSeleccionado.servicio.nombre}`}
                  className="w-64 h-64 border border-gray-200 rounded-lg"
                />
              ) : (
                <div className="w-64 h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                  <QrCode size={96} className="text-gray-400" />
                </div>
              )}
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-700">Servicio</label>
                <p className="text-base text-gray-900">{codigoSeleccionado.servicio.nombre}</p>
                <p className="text-sm text-gray-600">€{codigoSeleccionado.servicio.precio.toFixed(2)}</p>
              </div>

              {codigoSeleccionado.descripcion && (
                <div>
                  <label className="text-sm font-medium text-gray-700">Descripción</label>
                  <p className="text-base text-gray-900">{codigoSeleccionado.descripcion}</p>
                </div>
              )}

              <div>
                <label className="text-sm font-medium text-gray-700">URL de Pago</label>
                <div className="flex items-center gap-2 mt-1">
                  <code className="flex-1 px-3 py-2 bg-gray-100 rounded text-sm font-mono break-all">
                    {codigoSeleccionado.url}
                  </code>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCopiarURL(codigoSeleccionado.url, codigoSeleccionado.id)}
                  >
                    {copiado === codigoSeleccionado.id ? (
                      <Check size={16} className="text-green-600" />
                    ) : (
                      <Copy size={16} />
                    )}
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Usos</label>
                  <p className="text-base text-gray-900">{codigoSeleccionado.vecesUsado}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Estado</label>
                  <div className="mt-1">
                    <Badge variant={codigoSeleccionado.activo ? 'primary' : 'secondary'}>
                      {codigoSeleccionado.activo ? 'Activo' : 'Inactivo'}
                    </Badge>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Fecha de Creación</label>
                <p className="text-base text-gray-900">
                  {new Date(codigoSeleccionado.fechaCreacion).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

