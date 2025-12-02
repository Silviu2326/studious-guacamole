import React, { useState, useEffect } from 'react';
import { Modal, Button } from '../../../components/componentsreutilizables';
import { Cita } from '../../agenda-calendario/types';
import { PaquetePrepago } from '../types/paquetes';
import { Factura, ItemFactura } from '../types';
import { paquetesAPI } from '../api/paquetes';
import { facturasAPI } from '../api/facturas';
import { CheckCircle, AlertCircle, Package, FileText } from 'lucide-react';

interface ModalFacturacionAutomaticaProps {
  isOpen: boolean;
  onClose: () => void;
  cita: Cita | null;
  onFacturaGenerada?: (factura: Factura) => void;
  onCancelar?: () => void;
}

export const ModalFacturacionAutomatica: React.FC<ModalFacturacionAutomaticaProps> = ({
  isOpen,
  onClose,
  cita,
  onFacturaGenerada,
  onCancelar,
}) => {
  const [paquetes, setPaquetes] = useState<PaquetePrepago[]>([]);
  const [paqueteSeleccionado, setPaqueteSeleccionado] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [generando, setGenerando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && cita?.clienteId) {
      cargarPaquetes();
    }
  }, [isOpen, cita]);

  const cargarPaquetes = async () => {
    if (!cita?.clienteId) return;
    
    setLoading(true);
    try {
      const paquetesData = await paquetesAPI.obtenerPaquetesCliente(cita.clienteId);
      setPaquetes(paquetesData);
      
      // Si hay un solo paquete disponible, seleccionarlo automáticamente
      if (paquetesData.length === 1) {
        setPaqueteSeleccionado(paquetesData[0].id);
      }
    } catch (error) {
      console.error('Error cargando paquetes:', error);
      setError('Error al cargar los paquetes del cliente');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerarFactura = async () => {
    if (!cita) return;

    setGenerando(true);
    setError(null);

    try {
      let factura: Factura;
      
      // Si hay un paquete seleccionado, descontar sesión y generar factura de $0
      if (paqueteSeleccionado) {
        // Descontar sesión del paquete
        await paquetesAPI.descontarSesion(paqueteSeleccionado);
        
        // Generar factura de $0 (ya pagada con el paquete)
        const items: ItemFactura[] = [
          {
            id: '1',
            descripcion: `${cita.titulo} - ${new Date(cita.fechaInicio).toLocaleDateString('es-ES')}`,
            cantidad: 1,
            precioUnitario: 0,
            subtotal: 0,
            tipo: 'servicio',
          },
        ];

        factura = await facturasAPI.crearFactura({
          fechaEmision: new Date(),
          fechaVencimiento: new Date(),
          cliente: {
            id: cita.clienteId || 'cliente-desconocido',
            nombre: cita.clienteNombre || 'Cliente sin nombre',
            email: '',
          },
          items,
          subtotal: 0,
          descuentos: 0,
          impuestos: 0,
          total: 0,
          tipo: 'servicios',
          estado: 'pagada',
          pagos: [],
          montoPendiente: 0,
          recordatoriosEnviados: 0,
          notas: `Factura generada automáticamente. Sesión descontada del paquete prepago.`,
          usuarioCreacion: 'sistema',
        });
      } else {
        // Generar factura normal con precio de sesión
        // Por ahora usaremos un precio por defecto, pero esto debería venir de la configuración
        const precioSesion = 50000; // Esto debería venir de la configuración o del tipo de sesión
        const items: ItemFactura[] = [
          {
            id: '1',
            descripcion: `${cita.titulo} - ${new Date(cita.fechaInicio).toLocaleDateString('es-ES')}`,
            cantidad: 1,
            precioUnitario: precioSesion,
            subtotal: precioSesion,
            tipo: 'servicio',
          },
        ];

        const subtotal = precioSesion;
        const impuestos = subtotal * 0.19;
        const total = subtotal + impuestos;

        factura = await facturasAPI.crearFactura({
          fechaEmision: new Date(),
          fechaVencimiento: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 días
          cliente: {
            id: cita.clienteId || 'cliente-desconocido',
            nombre: cita.clienteNombre || 'Cliente sin nombre',
            email: '',
          },
          items,
          subtotal,
          descuentos: 0,
          impuestos,
          total,
          tipo: 'servicios',
          estado: 'pendiente',
          pagos: [],
          montoPendiente: total,
          recordatoriosEnviados: 0,
          notas: `Factura generada automáticamente al completar la sesión.`,
          usuarioCreacion: 'sistema',
        });
      }

      if (onFacturaGenerada) {
        onFacturaGenerada(factura);
      }
      
      onClose();
    } catch (error) {
      console.error('Error generando factura:', error);
      setError('Error al generar la factura. Por favor, intenta de nuevo.');
    } finally {
      setGenerando(false);
    }
  };

  const handleCancelar = () => {
    if (onCancelar) {
      onCancelar();
    }
    onClose();
  };

  if (!cita) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleCancelar}
      title="Generar Factura Automática"
      size="md"
      footer={
        <div className="flex justify-end space-x-3">
          <Button variant="secondary" onClick={handleCancelar} disabled={generando}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleGenerarFactura} loading={generando}>
            Generar Factura
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Información de la sesión */}
        <div className="p-4 bg-slate-50 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold text-gray-900">{cita.titulo}</h3>
          </div>
          <p className="text-sm text-gray-600">
            Cliente: {cita.clienteNombre || 'Cliente sin nombre'}
          </p>
          <p className="text-sm text-gray-600">
            Fecha: {new Date(cita.fechaInicio).toLocaleDateString('es-ES', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>

        {/* Paquetes prepago disponibles */}
        {loading ? (
          <div className="text-center py-4 text-gray-500 text-sm">Cargando paquetes...</div>
        ) : paquetes.length > 0 ? (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Package className="w-5 h-5 text-green-600" />
              <h4 className="font-semibold text-gray-900">Paquetes Prepago Disponibles</h4>
            </div>
            <div className="space-y-2">
              {paquetes.map((paquete) => (
                <div
                  key={paquete.id}
                  onClick={() => setPaqueteSeleccionado(paquete.id)}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                    paqueteSeleccionado === paquete.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h5 className="font-semibold text-gray-900">{paquete.nombrePaquete}</h5>
                      <p className="text-sm text-gray-600 mt-1">
                        Sesiones disponibles: {paquete.sesionesDisponibles} / {paquete.sesionesTotales}
                      </p>
                      <p className="text-sm text-gray-600">
                        Precio por sesión: {new Intl.NumberFormat('es-CO', {
                          style: 'currency',
                          currency: 'COP',
                          minimumFractionDigits: 0,
                        }).format(paquete.precioPorSesion)}
                      </p>
                    </div>
                    {paqueteSeleccionado === paquete.id && (
                      <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 ml-2" />
                    )}
                  </div>
                </div>
              ))}
            </div>
            {paqueteSeleccionado && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                  <p className="text-sm text-blue-900">
                    La sesión se descontará automáticamente del paquete seleccionado. La factura se generará con monto $0.
                  </p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-yellow-900">
                  No hay paquetes prepago disponibles
                </p>
                <p className="text-sm text-yellow-700 mt-1">
                  Se generará una factura normal con el precio de la sesión.
                </p>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
              <p className="text-sm text-red-900">{error}</p>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

