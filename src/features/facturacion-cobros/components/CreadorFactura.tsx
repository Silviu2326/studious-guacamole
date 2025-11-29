/**
 * CreadorFactura - Componente completo para crear y editar facturas
 * 
 * Este componente permite:
 * - Crear nuevas facturas desde cero
 * - Editar facturas existentes
 * - Seleccionar cliente, fechas, plantilla
 * - Agregar líneas de factura (servicios o paquetes)
 * - Calcular totales automáticamente
 * - Guardar factura o guardar y enviar por email
 * 
 * Integración:
 * - Usa crearFactura y actualizarFactura para persistir
 * - Permite aplicar plantilla (logo, textos legales) a nivel visual o de metadatos
 * - Botones "Guardar" y "Guardar y enviar por email" (futuro: recibosEmail.ts)
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Factura, 
  LineaFactura, 
  PlantillaFactura, 
  PaqueteServicio 
} from '../types';
import { 
  crearFactura, 
  actualizarFactura, 
  getFacturaById 
} from '../api/facturas';
import { getPlantillasFactura } from '../api/plantillas';
import { getPaquetesFacturacion } from '../api/paquetes';
import { 
  Card, 
  Button, 
  Input, 
  Select, 
  Textarea, 
  Modal,
  Badge 
} from '../../../components/componentsreutilizables';
import { 
  FileText, 
  Plus, 
  Trash2, 
  Save, 
  Mail, 
  X, 
  Loader2,
  Calendar,
  User,
  Package,
  ShoppingCart,
  Calculator,
  AlertCircle
} from 'lucide-react';

interface CreadorFacturaProps {
  /** ID de factura para edición (opcional, si no se proporciona es modo creación) */
  facturaId?: string;
  /** Callback cuando se guarda exitosamente */
  onSave?: (factura: Factura) => void;
  /** Callback cuando se guarda y envía por email */
  onSaveAndSend?: (factura: Factura) => void;
  /** Callback para cerrar el componente */
  onClose?: () => void;
  /** Si es true, muestra el componente en un modal */
  isModal?: boolean;
  /** Título del modal (solo si isModal es true) */
  modalTitle?: string;
}

// Mock de clientes (en producción vendría de una API)
const MOCK_CLIENTES = [
  { id: 'cliente_001', nombre: 'Juan Pérez', email: 'juan@example.com' },
  { id: 'cliente_002', nombre: 'María García', email: 'maria@example.com' },
  { id: 'cliente_003', nombre: 'Carlos López', email: 'carlos@example.com' },
  { id: 'cliente_004', nombre: 'Ana Martínez', email: 'ana@example.com' },
];

// Mock de servicios (en producción vendría de servicios-tarifas API)
const MOCK_SERVICIOS = [
  { id: 'serv_001', nombre: 'Entrenamiento Personal', precio: 25000 },
  { id: 'serv_002', nombre: 'Consulta Nutricional', precio: 80000 },
  { id: 'serv_003', nombre: 'Plan Nutricional Premium', precio: 150000 },
  { id: 'serv_004', nombre: 'Membresía Mensual', precio: 80000 },
  { id: 'serv_005', nombre: 'Seguimiento Online', precio: 50000 },
];

export const CreadorFactura: React.FC<CreadorFacturaProps> = ({
  facturaId,
  onSave,
  onSaveAndSend,
  onClose,
  isModal = false,
  modalTitle
}) => {
  // Estados principales
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Estados del formulario
  const [clienteId, setClienteId] = useState<string>('');
  const [fechaEmision, setFechaEmision] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [fechaVencimiento, setFechaVencimiento] = useState<string>(
    new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [plantillaId, setPlantillaId] = useState<string>('');
  const [moneda, setMoneda] = useState<string>('EUR');
  const [notasInternas, setNotasInternas] = useState<string>('');
  
  // Estados de datos cargados
  const [plantillas, setPlantillas] = useState<PlantillaFactura[]>([]);
  const [paquetes, setPaquetes] = useState<PaqueteServicio[]>([]);
  const [plantillaSeleccionada, setPlantillaSeleccionada] = useState<PlantillaFactura | null>(null);
  
  // Estados de líneas de factura
  const [lineas, setLineas] = useState<LineaFactura[]>([]);
  const [tipoLineaNueva, setTipoLineaNueva] = useState<'servicio' | 'paquete' | 'manual'>('manual');
  const [servicioSeleccionado, setServicioSeleccionado] = useState<string>('');
  const [paqueteSeleccionado, setPaqueteSeleccionado] = useState<string>('');
  
  // Estados de validación
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Cargar datos iniciales
  useEffect(() => {
    loadInitialData();
  }, []);

  // Cargar factura si estamos en modo edición
  useEffect(() => {
    if (facturaId) {
      loadFactura();
    }
  }, [facturaId]);

  // Actualizar plantilla seleccionada cuando cambia plantillaId
  useEffect(() => {
    if (plantillaId && plantillas.length > 0) {
      const plantilla = plantillas.find(p => p.id === plantillaId);
      setPlantillaSeleccionada(plantilla || null);
    } else {
      setPlantillaSeleccionada(null);
    }
  }, [plantillaId, plantillas]);

  /**
   * Carga datos iniciales: plantillas y paquetes
   */
  const loadInitialData = async () => {
    setLoading(true);
    try {
      const [plantillasData, paquetesData] = await Promise.all([
        getPlantillasFactura(),
        getPaquetesFacturacion()
      ]);
      
      setPlantillas(plantillasData);
      setPaquetes(paquetesData.filter(p => p.activo));
      
      // Establecer plantilla por defecto si existe
      const plantillaPorDefecto = plantillasData.find(p => p.esPorDefecto);
      if (plantillaPorDefecto && !facturaId) {
        setPlantillaId(plantillaPorDefecto.id);
      }
    } catch (error) {
      console.error('Error loading initial data:', error);
      setError('Error al cargar datos iniciales');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Carga una factura existente para edición
   */
  const loadFactura = async () => {
    if (!facturaId) return;
    
    setLoading(true);
    try {
      const factura = await getFacturaById(facturaId);
      if (!factura) {
        setError('Factura no encontrada');
        return;
      }

      setClienteId(factura.clienteId);
      setFechaEmision(new Date(factura.fechaEmision).toISOString().split('T')[0]);
      setFechaVencimiento(new Date(factura.fechaVencimiento).toISOString().split('T')[0]);
      setMoneda(factura.moneda);
      setNotasInternas(factura.notasInternas || '');
      setLineas(factura.lineas);
      
      // TODO: Si la factura tiene plantillaId, establecerlo
      // Por ahora, establecer plantilla por defecto
      const plantillaPorDefecto = plantillas.find(p => p.esPorDefecto);
      if (plantillaPorDefecto) {
        setPlantillaId(plantillaPorDefecto.id);
      }
    } catch (error) {
      console.error('Error loading invoice:', error);
      setError('Error al cargar la factura');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Calcula los totales de la factura basándose en las líneas
   */
  const calcularTotales = useMemo(() => {
    const subtotal = lineas.reduce((suma, linea) => {
      const totalLineaSinImpuesto = 
        linea.cantidad * linea.precioUnitario - (linea.descuentoOpcional || 0);
      return suma + totalLineaSinImpuesto;
    }, 0);

    const impuestos = lineas.reduce((suma, linea) => {
      return suma + (linea.impuestoOpcional || 0);
    }, 0);

    const total = subtotal + impuestos;

    return { subtotal, impuestos, total };
  }, [lineas]);

  /**
   * Valida el formulario antes de guardar
   */
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!clienteId) {
      newErrors.clienteId = 'Debes seleccionar un cliente';
    }

    if (!fechaEmision) {
      newErrors.fechaEmision = 'La fecha de emisión es requerida';
    }

    if (!fechaVencimiento) {
      newErrors.fechaVencimiento = 'La fecha de vencimiento es requerida';
    }

    if (fechaEmision && fechaVencimiento) {
      const fechaEm = new Date(fechaEmision);
      const fechaVen = new Date(fechaVencimiento);
      if (fechaVen < fechaEm) {
        newErrors.fechaVencimiento = 'La fecha de vencimiento debe ser posterior a la de emisión';
      }
    }

    if (lineas.length === 0) {
      newErrors.lineas = 'Debes agregar al menos una línea de factura';
    }

    // Validar cada línea
    lineas.forEach((linea, index) => {
      if (!linea.descripcion || linea.descripcion.trim() === '') {
        newErrors[`linea_${index}_descripcion`] = 'La descripción es requerida';
      }
      if (linea.cantidad <= 0) {
        newErrors[`linea_${index}_cantidad`] = 'La cantidad debe ser mayor a 0';
      }
      if (linea.precioUnitario <= 0) {
        newErrors[`linea_${index}_precio`] = 'El precio unitario debe ser mayor a 0';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Agrega una nueva línea de factura desde un servicio
   */
  const handleAgregarServicio = () => {
    if (!servicioSeleccionado) return;

    const servicio = MOCK_SERVICIOS.find(s => s.id === servicioSeleccionado);
    if (!servicio) return;

    const nuevaLinea: LineaFactura = {
      id: `linea_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      descripcion: servicio.nombre,
      servicioIdOpcional: servicio.id,
      cantidad: 1,
      precioUnitario: servicio.precio,
      descuentoOpcional: 0,
      impuestoOpcional: Math.round(servicio.precio * 0.19), // IVA 19% (ajustar según necesidad)
      totalLinea: servicio.precio + Math.round(servicio.precio * 0.19)
    };

    setLineas([...lineas, nuevaLinea]);
    setServicioSeleccionado('');
    setTipoLineaNueva('manual');
  };

  /**
   * Agrega líneas de factura desde un paquete
   */
  const handleAgregarPaquete = () => {
    if (!paqueteSeleccionado) return;

    const paquete = paquetes.find(p => p.id === paqueteSeleccionado);
    if (!paquete) return;

    // Crear una línea por cada servicio incluido en el paquete
    const nuevasLineas: LineaFactura[] = paquete.serviciosIncluidos.map((servicio, index) => {
      // Buscar precio del servicio en MOCK_SERVICIOS o usar precio del paquete dividido
      const servicioMock = MOCK_SERVICIOS.find(s => s.id === servicio.servicioId);
      const precioUnitario = servicioMock?.precio || (paquete.precio / paquete.serviciosIncluidos.length);
      
      const subtotalLinea = precioUnitario * servicio.cantidadSesiones;
      const impuestoLinea = Math.round(subtotalLinea * 0.19);
      const totalLinea = subtotalLinea + impuestoLinea;

      return {
        id: `linea_${Date.now()}_${index}_${Math.random().toString(36).substr(2, 9)}`,
        descripcion: `${servicio.nombreServicio} (${servicio.cantidadSesiones} sesiones)`,
        servicioIdOpcional: servicio.servicioId,
        cantidad: servicio.cantidadSesiones,
        precioUnitario,
        descuentoOpcional: 0,
        impuestoOpcional: impuestoLinea,
        totalLinea
      };
    });

    setLineas([...lineas, ...nuevasLineas]);
    setPaqueteSeleccionado('');
    setTipoLineaNueva('manual');
  };

  /**
   * Agrega una línea manual
   */
  const handleAgregarLineaManual = () => {
    const nuevaLinea: LineaFactura = {
      id: `linea_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      descripcion: '',
      cantidad: 1,
      precioUnitario: 0,
      descuentoOpcional: 0,
      impuestoOpcional: 0,
      totalLinea: 0
    };

    setLineas([...lineas, nuevaLinea]);
  };

  /**
   * Actualiza una línea de factura
   */
  const handleActualizarLinea = (lineaId: string, cambios: Partial<LineaFactura>) => {
    setLineas(lineas.map(linea => {
      if (linea.id === lineaId) {
        const lineaActualizada = { ...linea, ...cambios };
        
        // Recalcular total de la línea
        const subtotalLinea = 
          lineaActualizada.cantidad * lineaActualizada.precioUnitario - 
          (lineaActualizada.descuentoOpcional || 0);
        const impuestoLinea = lineaActualizada.impuestoOpcional || 0;
        lineaActualizada.totalLinea = subtotalLinea + impuestoLinea;
        
        return lineaActualizada;
      }
      return linea;
    }));
  };

  /**
   * Elimina una línea de factura
   */
  const handleEliminarLinea = (lineaId: string) => {
    setLineas(lineas.filter(linea => linea.id !== lineaId));
  };

  /**
   * Guarda la factura (crear o actualizar)
   */
  const handleSave = async (enviarEmail: boolean = false) => {
    if (!validateForm()) {
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const cliente = MOCK_CLIENTES.find(c => c.id === clienteId);
      if (!cliente) {
        throw new Error('Cliente no encontrado');
      }

      const datosFactura = {
        clienteId,
        nombreCliente: cliente.nombre,
        fechaEmision: new Date(fechaEmision),
        fechaVencimiento: new Date(fechaVencimiento),
        lineas: lineas.map(linea => ({
          ...linea,
          // Asegurar que los totales estén calculados correctamente
          totalLinea: (linea.cantidad * linea.precioUnitario - (linea.descuentoOpcional || 0)) + (linea.impuestoOpcional || 0)
        })),
        moneda,
        notasInternas: notasInternas.trim() || undefined,
        origen: 'manual' as const
      };

      let facturaGuardada: Factura;

      if (facturaId) {
        // Modo edición
        facturaGuardada = await actualizarFactura(facturaId, datosFactura);
      } else {
        // Modo creación
        facturaGuardada = await crearFactura(datosFactura);
      }

      if (enviarEmail) {
        // TODO: Integrar con recibosEmail.ts cuando esté disponible
        console.log('Enviar factura por email:', facturaGuardada.id);
        if (onSaveAndSend) {
          onSaveAndSend(facturaGuardada);
        }
      } else {
        if (onSave) {
          onSave(facturaGuardada);
        }
      }

      // Cerrar modal si está en modo modal
      if (isModal && onClose) {
        onClose();
      }
    } catch (error) {
      console.error('Error saving invoice:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error al guardar la factura';
      setError(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  /**
   * Renderiza el contenido del formulario
   */
  const renderFormContent = () => (
    <div className="space-y-6">
      {/* Información básica */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Información Básica
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Select
              label="Cliente *"
              value={clienteId}
              onChange={(e) => {
                setClienteId(e.target.value);
                if (errors.clienteId) {
                  setErrors({ ...errors, clienteId: '' });
                }
              }}
              options={[
                { value: '', label: 'Selecciona un cliente' },
                ...MOCK_CLIENTES.map(c => ({ value: c.id, label: c.nombre }))
              ]}
              error={errors.clienteId}
            />
          </div>

          <div>
            <Select
              label="Plantilla"
              value={plantillaId}
              onChange={(e) => setPlantillaId(e.target.value)}
              options={[
                { value: '', label: 'Sin plantilla' },
                ...plantillas.map(p => ({ value: p.id, label: p.nombre }))
              ]}
            />
            {plantillaSeleccionada && (
              <p className="text-sm text-gray-500 mt-1">
                {plantillaSeleccionada.descripcion}
              </p>
            )}
          </div>

          <div>
            <Input
              label="Fecha de Emisión *"
              type="date"
              value={fechaEmision}
              onChange={(e) => {
                setFechaEmision(e.target.value);
                if (errors.fechaEmision) {
                  setErrors({ ...errors, fechaEmision: '' });
                }
              }}
              error={errors.fechaEmision}
            />
          </div>

          <div>
            <Input
              label="Fecha de Vencimiento *"
              type="date"
              value={fechaVencimiento}
              onChange={(e) => {
                setFechaVencimiento(e.target.value);
                if (errors.fechaVencimiento) {
                  setErrors({ ...errors, fechaVencimiento: '' });
                }
              }}
              error={errors.fechaVencimiento}
            />
          </div>

          <div>
            <Select
              label="Moneda"
              value={moneda}
              onChange={(e) => setMoneda(e.target.value)}
              options={[
                { value: 'EUR', label: 'EUR - Euro' },
                { value: 'USD', label: 'USD - Dólar' },
                { value: 'MXN', label: 'MXN - Peso Mexicano' }
              ]}
            />
          </div>
        </div>

        <div className="mt-4">
          <Textarea
            label="Notas Internas"
            value={notasInternas}
            onChange={(e) => setNotasInternas(e.target.value)}
            placeholder="Notas visibles solo para administradores/entrenadores"
            rows={3}
          />
        </div>
      </Card>

      {/* Líneas de factura */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" />
            Líneas de Factura
          </h3>
          
          {errors.lineas && (
            <Badge variant="red" className="flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.lineas}
            </Badge>
          )}
        </div>

        {/* Agregar nueva línea */}
        <div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex items-center gap-3 mb-3">
            <Select
              value={tipoLineaNueva}
              onChange={(e) => setTipoLineaNueva(e.target.value as 'servicio' | 'paquete' | 'manual')}
              options={[
                { value: 'manual', label: 'Línea Manual' },
                { value: 'servicio', label: 'Desde Servicio' },
                { value: 'paquete', label: 'Desde Paquete' }
              ]}
              className="flex-1"
            />
          </div>

          {tipoLineaNueva === 'servicio' && (
            <div className="flex items-center gap-3">
              <Select
                value={servicioSeleccionado}
                onChange={(e) => setServicioSeleccionado(e.target.value)}
                options={[
                  { value: '', label: 'Selecciona un servicio' },
                  ...MOCK_SERVICIOS.map(s => ({ 
                    value: s.id, 
                    label: `${s.nombre} - ${s.precio.toLocaleString()} ${moneda}` 
                  }))
                ]}
                className="flex-1"
              />
              <Button 
                onClick={handleAgregarServicio}
                disabled={!servicioSeleccionado}
                variant="secondary"
              >
                <Plus className="w-4 h-4 mr-2" />
                Agregar
              </Button>
            </div>
          )}

          {tipoLineaNueva === 'paquete' && (
            <div className="flex items-center gap-3">
              <Select
                value={paqueteSeleccionado}
                onChange={(e) => setPaqueteSeleccionado(e.target.value)}
                options={[
                  { value: '', label: 'Selecciona un paquete' },
                  ...paquetes.map(p => ({ 
                    value: p.id, 
                    label: `${p.nombre} - ${p.precio.toLocaleString()} ${p.moneda}` 
                  }))
                ]}
                className="flex-1"
              />
              <Button 
                onClick={handleAgregarPaquete}
                disabled={!paqueteSeleccionado}
                variant="secondary"
              >
                <Plus className="w-4 h-4 mr-2" />
                Agregar
              </Button>
            </div>
          )}

          {tipoLineaNueva === 'manual' && (
            <Button 
              onClick={handleAgregarLineaManual}
              variant="secondary"
              fullWidth
            >
              <Plus className="w-4 h-4 mr-2" />
              Agregar Línea Manual
            </Button>
          )}
        </div>

        {/* Lista de líneas */}
        <div className="space-y-3">
          {lineas.map((linea, index) => (
            <div key={linea.id} className="p-4 border border-gray-200 rounded-lg">
              <div className="grid grid-cols-12 gap-3 items-start">
                <div className="col-span-12 md:col-span-5">
                  <Input
                    label={`Línea ${index + 1} - Descripción`}
                    value={linea.descripcion}
                    onChange={(e) => handleActualizarLinea(linea.id, { descripcion: e.target.value })}
                    error={errors[`linea_${index}_descripcion`]}
                    placeholder="Descripción del servicio/producto"
                  />
                </div>

                <div className="col-span-4 md:col-span-2">
                  <Input
                    label="Cantidad"
                    type="number"
                    min="0"
                    step="0.01"
                    value={linea.cantidad}
                    onChange={(e) => handleActualizarLinea(linea.id, { 
                      cantidad: parseFloat(e.target.value) || 0 
                    })}
                    error={errors[`linea_${index}_cantidad`]}
                  />
                </div>

                <div className="col-span-4 md:col-span-2">
                  <Input
                    label="Precio Unit."
                    type="number"
                    min="0"
                    step="0.01"
                    value={linea.precioUnitario}
                    onChange={(e) => handleActualizarLinea(linea.id, { 
                      precioUnitario: parseFloat(e.target.value) || 0 
                    })}
                    error={errors[`linea_${index}_precio`]}
                  />
                </div>

                <div className="col-span-4 md:col-span-2">
                  <Input
                    label="Descuento"
                    type="number"
                    min="0"
                    step="0.01"
                    value={linea.descuentoOpcional || 0}
                    onChange={(e) => handleActualizarLinea(linea.id, { 
                      descuentoOpcional: parseFloat(e.target.value) || 0 
                    })}
                  />
                </div>

                <div className="col-span-12 md:col-span-1 flex items-end">
                  <Button
                    variant="ghost"
                    onClick={() => handleEliminarLinea(linea.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="mt-2 text-sm text-gray-600">
                <strong>Total línea:</strong> {linea.totalLinea.toLocaleString()} {moneda}
              </div>
            </div>
          ))}

          {lineas.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <ShoppingCart className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No hay líneas de factura. Agrega una línea para comenzar.</p>
            </div>
          )}
        </div>
      </Card>

      {/* Resumen de totales */}
      {lineas.length > 0 && (
        <Card className="p-6 bg-blue-50 border-blue-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Calculator className="w-5 h-5" />
            Resumen de Totales
          </h3>
          
          <div className="space-y-2">
            <div className="flex justify-between text-gray-700">
              <span>Subtotal:</span>
              <span className="font-medium">{calcularTotales.subtotal.toLocaleString()} {moneda}</span>
            </div>
            <div className="flex justify-between text-gray-700">
              <span>Impuestos:</span>
              <span className="font-medium">{calcularTotales.impuestos.toLocaleString()} {moneda}</span>
            </div>
            <div className="flex justify-between text-xl font-bold text-gray-900 pt-2 border-t border-blue-300">
              <span>Total:</span>
              <span>{calcularTotales.total.toLocaleString()} {moneda}</span>
            </div>
          </div>
        </Card>
      )}

      {/* Mensaje de error */}
      {error && (
        <Card className="p-4 bg-red-50 border-red-200">
          <div className="flex items-center gap-2 text-red-800">
            <AlertCircle className="w-5 h-5" />
            <span>{error}</span>
          </div>
        </Card>
      )}
    </div>
  );

  // Si está en modo modal, renderizar dentro de Modal
  if (isModal) {
    return (
      <Modal
        isOpen={true}
        onClose={onClose || (() => {})}
        title={modalTitle || (facturaId ? 'Editar Factura' : 'Nueva Factura')}
        size="xl"
        footer={
          <div className="flex gap-3 justify-end">
            <Button
              variant="secondary"
              onClick={onClose}
              disabled={saving}
            >
              Cancelar
            </Button>
            <Button
              variant="secondary"
              onClick={() => handleSave(false)}
              loading={saving}
              disabled={loading}
            >
              <Save className="w-4 h-4 mr-2" />
              Guardar
            </Button>
            <Button
              onClick={() => handleSave(true)}
              loading={saving}
              disabled={loading}
            >
              <Mail className="w-4 h-4 mr-2" />
              Guardar y Enviar
            </Button>
          </div>
        }
      >
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : (
          renderFormContent()
        )}
      </Modal>
    );
  }

  // Si no está en modo modal, renderizar directamente
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">
          {facturaId ? 'Editar Factura' : 'Nueva Factura'}
        </h2>
        <div className="flex gap-3">
          {onClose && (
            <Button variant="secondary" onClick={onClose} disabled={saving}>
              Cancelar
            </Button>
          )}
          <Button
            variant="secondary"
            onClick={() => handleSave(false)}
            loading={saving}
            disabled={loading}
          >
            <Save className="w-4 h-4 mr-2" />
            Guardar
          </Button>
          <Button
            onClick={() => handleSave(true)}
            loading={saving}
            disabled={loading}
          >
            <Mail className="w-4 h-4 mr-2" />
            Guardar y Enviar
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      ) : (
        renderFormContent()
      )}
    </div>
  );
};

