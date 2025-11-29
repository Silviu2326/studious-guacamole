import React, { useState, useEffect } from 'react';
import { Card, Table, Badge, Button, Input, Select, Modal } from '../../../components/componentsreutilizables';
import {
  getSuscripciones,
  aplicarDescuento,
  eliminarDescuento,
  verificarDescuentosExpirados,
  getSuscripcionesGrupales,
  aplicarDescuentoSuscripcion,
} from '../api/suscripciones';
import { Suscripcion, AplicarDescuentoRequest, AplicarDescuentoSuscripcionRequest } from '../types';
import { Percent, Tag, X, Plus, AlertCircle, CheckCircle, Calendar } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';

export const DescuentosPersonalizados: React.FC = () => {
  const { user } = useAuth();
  const [suscripciones, setSuscripciones] = useState<Suscripcion[]>([]);
  const [suscripcionesGrupales, setSuscripcionesGrupales] = useState<Suscripcion[]>([]);
  const [loading, setLoading] = useState(true);
  const [suscripcionSeleccionada, setSuscripcionSeleccionada] = useState<Suscripcion | null>(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [tipoAplicacion, setTipoAplicacion] = useState<'cliente' | 'grupo'>('cliente');
  const [tipoDescuento, setTipoDescuento] = useState<'porcentaje' | 'fijo'>('porcentaje');
  const [valorDescuento, setValorDescuento] = useState<string>('');
  const [motivo, setMotivo] = useState<string>('');
  const [fechaInicio, setFechaInicio] = useState<string>(new Date().toISOString().split('T')[0]);
  const [fechaFin, setFechaFin] = useState<string>('');

  useEffect(() => {
    loadSuscripciones();
    loadSuscripcionesGrupales();
    // Verificar descuentos expirados al cargar
    verificarDescuentosExpirados();
  }, []);

  const loadSuscripciones = async () => {
    setLoading(true);
    try {
      const data = await getSuscripciones(user?.role === 'entrenador' ? 'entrenador' : 'gimnasio', user?.id);
      setSuscripciones(data);
    } catch (error) {
      console.error('Error cargando suscripciones:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadSuscripcionesGrupales = async () => {
    try {
      const data = await getSuscripcionesGrupales(user?.id);
      setSuscripcionesGrupales(data);
    } catch (error) {
      console.error('Error cargando suscripciones grupales:', error);
    }
  };

  const handleAplicarDescuento = async () => {
    if (tipoAplicacion === 'cliente' && !suscripcionSeleccionada) {
      alert('Por favor selecciona una suscripción');
      return;
    }

    if (tipoAplicacion === 'grupo' && !suscripcionSeleccionada) {
      alert('Por favor selecciona un grupo');
      return;
    }
    
    const valor = parseFloat(valorDescuento);
    if (isNaN(valor) || valor <= 0) {
      alert('Por favor ingresa un valor válido');
      return;
    }

    if (tipoDescuento === 'porcentaje' && valor > 100) {
      alert('El porcentaje no puede ser mayor a 100%');
      return;
    }

    const precioBase = suscripcionSeleccionada ? (suscripcionSeleccionada.precioOriginal || suscripcionSeleccionada.precio) : 0;
    if (tipoDescuento === 'fijo' && valor > precioBase) {
      alert('El descuento fijo no puede ser mayor al precio original');
      return;
    }

    if (!fechaInicio) {
      alert('Por favor selecciona una fecha de inicio');
      return;
    }

    try {
      if (tipoAplicacion === 'cliente' && suscripcionSeleccionada) {
        // Aplicar descuento a suscripción individual
        const request: AplicarDescuentoRequest = {
          suscripcionId: suscripcionSeleccionada.id,
          tipo: tipoDescuento,
          valor,
          motivo: motivo || undefined,
          fechaFin: fechaFin || undefined,
        };

        await aplicarDescuento(request);
      } else if (tipoAplicacion === 'grupo' && suscripcionSeleccionada && suscripcionSeleccionada.grupoId) {
        // Aplicar descuento a grupo
        const request: AplicarDescuentoSuscripcionRequest = {
          tipo: tipoDescuento,
          valor,
          motivo: motivo || undefined,
          fechaInicio,
          fechaFin: fechaFin || undefined,
          aplicadoA: 'grupo',
          grupoId: suscripcionSeleccionada.grupoId,
          suscripcionId: suscripcionSeleccionada.id,
        };

        await aplicarDescuentoSuscripcion(request);
      }

      await loadSuscripciones();
      await loadSuscripcionesGrupales();
      setMostrarModal(false);
      resetForm();
      alert('Descuento aplicado correctamente');
    } catch (error) {
      console.error('Error aplicando descuento:', error);
      alert(error instanceof Error ? error.message : 'Error al aplicar el descuento');
    }
  };

  const handleEliminarDescuento = async (suscripcion: Suscripcion) => {
    if (!window.confirm(`¿Estás seguro de que quieres eliminar el descuento de ${suscripcion.clienteNombre}?`)) {
      return;
    }

    try {
      await eliminarDescuento({
        suscripcionId: suscripcion.id,
        motivo: 'Eliminado manualmente',
      });
      await loadSuscripciones();
      alert('Descuento eliminado correctamente');
    } catch (error) {
      console.error('Error eliminando descuento:', error);
      alert(error instanceof Error ? error.message : 'Error al eliminar el descuento');
    }
  };

  const resetForm = () => {
    setSuscripcionSeleccionada(null);
    setTipoAplicacion('cliente');
    setTipoDescuento('porcentaje');
    setValorDescuento('');
    setMotivo('');
    setFechaInicio(new Date().toISOString().split('T')[0]);
    setFechaFin('');
  };

  const calcularPrecioFinal = (): number => {
    if (!suscripcionSeleccionada || !valorDescuento) return 0;
    
    const valor = parseFloat(valorDescuento);
    if (isNaN(valor)) return 0;
    
    const precioOriginal = suscripcionSeleccionada.precioOriginal || suscripcionSeleccionada.precio;
    
    if (tipoDescuento === 'porcentaje') {
      return precioOriginal * (1 - valor / 100);
    } else {
      return Math.max(0, precioOriginal - valor);
    }
  };

  const suscripcionesConDescuento = suscripciones.filter(s => s.descuento);
  const suscripcionesSinDescuento = suscripciones.filter(s => !s.descuento);

  const columns = [
    {
      key: 'clienteNombre',
      label: 'Cliente',
      render: (value: string, row: Suscripcion) => (
        <div>
          <div className="font-medium text-gray-900">{value}</div>
          <div className="text-sm text-gray-500">{row.planNombre}</div>
        </div>
      ),
    },
    {
      key: 'precioOriginal',
      label: 'Precio Original',
      render: (value: number | undefined, row: Suscripcion) => {
        const precioOriginal = value || row.precio;
        return (
          <span className="text-base text-gray-600 line-through">
            {precioOriginal.toFixed(2)} €
          </span>
        );
      },
    },
    {
      key: 'descuento',
      label: 'Descuento',
      render: (value: any, row: Suscripcion) => {
        if (!value) return <span className="text-sm text-gray-400">-</span>;
        
        const descuentoTexto = value.tipo === 'porcentaje'
          ? `${value.valor}%`
          : `${value.valor} €`;
        
        return (
          <Badge color="success" className="flex items-center gap-1">
            <Percent className="w-3 h-3" />
            {descuentoTexto}
          </Badge>
        );
      },
    },
    {
      key: 'precio',
      label: 'Precio Final',
      render: (value: number) => (
        <span className="text-base font-semibold text-green-600">
          {value.toFixed(2)} €
        </span>
      ),
    },
    {
      key: 'descuento',
      label: 'Motivo',
      render: (value: any) => (
        value?.motivo ? (
          <span className="text-sm text-gray-600">{value.motivo}</span>
        ) : (
          <span className="text-sm text-gray-400">-</span>
        )
      ),
    },
    {
      key: 'descuento',
      label: 'Válido Hasta',
      render: (value: any) => {
        if (!value?.fechaFin) {
          return <Badge color="info">Permanente</Badge>;
        }
        
        const fechaFin = new Date(value.fechaFin);
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);
        fechaFin.setHours(0, 0, 0, 0);
        
        const expirado = fechaFin < hoy;
        
        return (
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            <span className={`text-sm ${expirado ? 'text-red-600' : 'text-gray-600'}`}>
              {fechaFin.toLocaleDateString('es-ES')}
            </span>
            {expirado && (
              <Badge color="error">Expirado</Badge>
            )}
          </div>
        );
      },
    },
    {
      key: 'actions',
      label: 'Acciones',
      render: (value: any, row: Suscripcion) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleEliminarDescuento(row)}
        >
          <X className="w-4 h-4 mr-2" />
          Eliminar
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Resumen */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-white shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Suscripciones</p>
              <p className="text-2xl font-semibold text-gray-900 mt-1">
                {suscripciones.length}
              </p>
            </div>
            <Tag className="w-8 h-8 text-blue-600" />
          </div>
        </Card>
        
        <Card className="bg-white shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Con Descuento</p>
              <p className="text-2xl font-semibold text-gray-900 mt-1">
                {suscripcionesConDescuento.length}
              </p>
            </div>
            <Percent className="w-8 h-8 text-green-600" />
          </div>
        </Card>
        
        <Card className="bg-white shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Ahorro Total</p>
              <p className="text-2xl font-semibold text-gray-900 mt-1">
                {suscripcionesConDescuento.reduce((sum, s) => {
                  const precioOriginal = s.precioOriginal || s.precio;
                  return sum + (precioOriginal - s.precio);
                }, 0).toFixed(2)} €
              </p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </Card>
      </div>

      {/* Acciones */}
      <Card className="bg-white shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-gray-900">
            Aplicar Descuento
          </h3>
          <Button
            variant="primary"
            onClick={() => setMostrarModal(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Aplicar Descuento
          </Button>
        </div>

        {/* Lista de suscripciones sin descuento */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700 mb-2">
            Suscripciones Sin Descuento
          </h4>
          {suscripcionesSinDescuento.length === 0 ? (
            <p className="text-sm text-gray-500">Todas las suscripciones tienen descuento aplicado</p>
          ) : (
            <div className="space-y-2">
              {suscripcionesSinDescuento.slice(0, 5).map(suscripcion => (
                <div
                  key={suscripcion.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{suscripcion.clienteNombre}</div>
                    <div className="text-sm text-gray-600">{suscripcion.planNombre}</div>
                    <div className="text-sm font-semibold text-gray-900">
                      {suscripcion.precio} €
                    </div>
                  </div>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => {
                      setSuscripcionSeleccionada(suscripcion);
                      setMostrarModal(true);
                    }}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Aplicar Descuento
                  </Button>
                </div>
              ))}
              {suscripcionesSinDescuento.length > 5 && (
                <p className="text-sm text-gray-500 text-center">
                  Y {suscripcionesSinDescuento.length - 5} más...
                </p>
              )}
            </div>
          )}
        </div>
      </Card>

      {/* Tabla de suscripciones con descuento */}
      <Card className="bg-white shadow-sm p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          Suscripciones con Descuento
        </h3>
        <Table
          data={suscripcionesConDescuento}
          columns={columns}
          loading={loading}
          emptyMessage="No hay suscripciones con descuento aplicado"
        />
      </Card>

      {/* Modal para aplicar descuento */}
      {mostrarModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="bg-white p-6 max-w-2xl w-full mx-4">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Aplicar Descuento Personalizado
            </h3>
            
            <div className="space-y-4">
              {/* Selección de tipo de aplicación */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Aplicar Descuento a
                </label>
                <Select
                  value={tipoAplicacion}
                  onChange={(e) => {
                    setTipoAplicacion(e.target.value as 'cliente' | 'grupo');
                    setSuscripcionSeleccionada(null);
                  }}
                >
                  <option value="cliente">Cliente Individual</option>
                  <option value="grupo">Grupo/Familia</option>
                </Select>
              </div>

              {/* Selección de suscripción o grupo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {tipoAplicacion === 'cliente' ? 'Seleccionar Cliente' : 'Seleccionar Grupo'}
                </label>
                <Select
                  value={suscripcionSeleccionada?.id || ''}
                  onChange={(e) => {
                    const id = e.target.value;
                    if (tipoAplicacion === 'cliente') {
                      const suscripcion = suscripciones.find(s => s.id === id);
                      setSuscripcionSeleccionada(suscripcion || null);
                    } else {
                      const grupo = suscripcionesGrupales.find(s => s.id === id);
                      setSuscripcionSeleccionada(grupo || null);
                    }
                  }}
                >
                  <option value="">Selecciona una opción...</option>
                  {tipoAplicacion === 'cliente' ? (
                    suscripciones.filter(s => !s.esGrupal).map(s => (
                      <option key={s.id} value={s.id}>
                        {s.clienteNombre} - {s.planNombre} ({(s.precioOriginal || s.precio).toFixed(2)} €)
                      </option>
                    ))
                  ) : (
                    suscripcionesGrupales.map(s => (
                      <option key={s.id} value={s.id}>
                        {s.planNombre.replace('Suscripción Grupal: ', '')} - {(s.precioOriginal || s.precio).toFixed(2)} €
                      </option>
                    ))
                  )}
                </Select>
              </div>

              {suscripcionSeleccionada && (
                <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                  <div className="font-medium text-gray-900">
                    {tipoAplicacion === 'cliente' ? suscripcionSeleccionada.clienteNombre : suscripcionSeleccionada.planNombre.replace('Suscripción Grupal: ', '')}
                  </div>
                  <div className="text-sm text-gray-600">
                    {tipoAplicacion === 'cliente' ? suscripcionSeleccionada.planNombre : `${suscripcionSeleccionada.miembrosGrupo?.filter(m => m.activo).length || 0} miembro(s)`}
                  </div>
                  <div className="text-lg font-semibold text-gray-900 mt-2">
                    Precio actual: {(suscripcionSeleccionada.precioOriginal || suscripcionSeleccionada.precio).toFixed(2)} €
                  </div>
                </div>
              )}
              
              {/* Fecha de inicio */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha de Inicio
                </label>
                <Input
                  type="date"
                  value={fechaInicio}
                  onChange={(e) => setFechaInicio(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Descuento
                </label>
                <Select
                  value={tipoDescuento}
                  onChange={(e) => {
                    setTipoDescuento(e.target.value as 'porcentaje' | 'fijo');
                    setValorDescuento('');
                  }}
                >
                  <option value="porcentaje">Porcentaje (%)</option>
                  <option value="fijo">Cantidad Fija (€)</option>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Valor del Descuento
                  {tipoDescuento === 'porcentaje' ? ' (%)' : ' (€)'}
                </label>
                <Input
                  type="number"
                  value={valorDescuento}
                  onChange={(e) => setValorDescuento(e.target.value)}
                  placeholder={tipoDescuento === 'porcentaje' ? 'Ej: 10' : 'Ej: 20'}
                  min={0}
                  max={tipoDescuento === 'porcentaje' ? 100 : undefined}
                />
              </div>
              
              {valorDescuento && suscripcionSeleccionada && (
                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="text-sm text-gray-600">Precio final:</div>
                  <div className="text-2xl font-bold text-green-600">
                    {calcularPrecioFinal().toFixed(2)} €
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    Ahorro: {((suscripcionSeleccionada.precioOriginal || suscripcionSeleccionada.precio) - calcularPrecioFinal()).toFixed(2)} €
                  </div>
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Motivo (opcional)
                </label>
                <Input
                  type="text"
                  value={motivo}
                  onChange={(e) => setMotivo(e.target.value)}
                  placeholder="Ej: Cliente clave, Promoción especial, Fidelidad"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha de Expiración (opcional)
                </label>
                <Input
                  type="date"
                  value={fechaFin}
                  onChange={(e) => setFechaFin(e.target.value)}
                  min={fechaInicio}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Si no se especifica, el descuento será permanente hasta que se elimine manualmente
                </p>
              </div>
            </div>
            
            <div className="flex justify-end gap-2 mt-6">
              <Button
                variant="secondary"
                onClick={() => {
                  setMostrarModal(false);
                  resetForm();
                }}
              >
                Cancelar
              </Button>
              <Button
                variant="primary"
                onClick={handleAplicarDescuento}
                disabled={!valorDescuento || !suscripcionSeleccionada || !fechaInicio}
              >
                Aplicar Descuento
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

